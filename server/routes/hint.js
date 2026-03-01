const express = require("express");
const mongoose = require("mongoose");
const Assignment = require("../models/Assignment");

const router = express.Router();

/**
 * Find an assignment by MongoDB ObjectId or by numeric index (1-based).
 */
async function findAssignment(id) {
  // Check for numeric id first (frontend sends 1-based numbers)
  const index = Number(id);
  if (Number.isInteger(index) && index > 0) {
    return Assignment.findOne().sort({ createdAt: 1 }).skip(index - 1);
  }
  // Otherwise treat as MongoDB ObjectId
  if (mongoose.Types.ObjectId.isValid(id) && String(id).length === 24) {
    return Assignment.findById(id);
  }
  return null;
}

/**
 * POST /api/hint
 * Generate an intelligent hint using an LLM API (Google Gemini).
 * The prompt is carefully engineered to provide guidance, NOT solutions.
 */
router.post("/", async (req, res) => {
  const { assignmentId, userQuery, hintIndex } = req.body;

  if (!assignmentId) {
    return res.status(400).json({ success: false, error: "Assignment ID is required." });
  }

  try {
    const assignment = await findAssignment(assignmentId);
    if (!assignment) {
      return res.status(404).json({ success: false, error: "Assignment not found." });
    }

    // Build a prompt that gives guidance but NOT the solution
    const prompt = buildHintPrompt(assignment, userQuery, hintIndex || 0);

    // Call the LLM API
    const hintText = await callLLM(prompt);

    res.json({
      success: true,
      data: {
        hint: hintText,
        hintIndex: hintIndex || 0,
      },
    });
  } catch (err) {
    console.error("Hint generation error:", err.message);

    // Fallback: return a pre-stored hint if LLM fails
    try {
      const assignment = await findAssignment(assignmentId);
      const idx = Math.min(hintIndex || 0, (assignment?.hints?.length || 1) - 1);
      const fallbackHint = assignment?.hints?.[idx] || "Try breaking the problem into smaller parts.";

      res.json({
        success: true,
        data: {
          hint: fallbackHint,
          hintIndex: idx,
          fallback: true,
        },
      });
    } catch {
      res.status(500).json({ success: false, error: "Failed to generate hint." });
    }
  }
});

/**
 * Build a carefully engineered prompt that instructs the LLM
 * to provide helpful guidance without revealing the full solution.
 */
function buildHintPrompt(assignment, userQuery, hintIndex) {
  const tableInfo = assignment.sampleTables
    .map((t) => {
      const cols = t.columns.map((c) => `${c.columnName} (${c.dataType})`).join(", ");
      return `Table: ${t.tableName} — Columns: ${cols}`;
    })
    .join("\n");

  // Progressive hinting: later hints are more specific
  let hintLevel;
  if (hintIndex === 0) {
    hintLevel = "Give a very general conceptual hint about what SQL concept or clause to use. Do NOT mention any specific column names or table names.";
  } else if (hintIndex === 1) {
    hintLevel = "Give a slightly more specific hint mentioning the SQL clause structure needed, but do NOT write any actual SQL code.";
  } else {
    hintLevel = "Give a specific structural hint about how to arrange the query. You may mention relevant column names but do NOT provide the complete query.";
  }

  return `You are a SQL teaching assistant for a learning platform called CipherSQLStudio.

A student is working on this assignment:
Title: ${assignment.title}
Difficulty: ${assignment.difficulty}
Category: ${assignment.category}
Question: ${assignment.question}

Available tables:
${tableInfo}

${userQuery ? `The student's current query attempt:\n${userQuery}\n` : "The student has not written any query yet."}

RULES (STRICTLY FOLLOW):
1. NEVER provide the complete SQL solution
2. NEVER write a working query that answers the question
3. ${hintLevel}
4. Keep your hint concise (2-3 sentences maximum)
5. Be encouraging and educational
6. If the student's query has a specific error, hint at what's wrong without fixing it

Provide your hint now:`;
}

/**
 * Call Google Gemini API to generate a hint.
 * Falls back gracefully if the API key is missing or call fails.
 */
async function callLLM(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 200,
        topP: 0.9,
      },
    }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${errBody}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("No text in Gemini response");
  }

  return text.trim();
}

module.exports = router;
