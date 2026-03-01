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

// GET /api/assignments - Fetch all assignments (listing page)
router.get("/", async (req, res) => {
  try {
    const { difficulty, category } = req.query;
    const filter = {};

    if (difficulty && difficulty !== "All") {
      filter.difficulty = difficulty;
    }
    if (category) {
      filter.category = { $regex: category, $options: "i" };
    }

    const assignments = await Assignment.find(filter)
      .select("title difficulty category description")
      .sort({ createdAt: 1 });

    res.json({ success: true, data: assignments });
  } catch (err) {
    console.error("Error fetching assignments:", err.message);
    res.status(500).json({ success: false, error: "Failed to fetch assignments" });
  }
});

// GET /api/assignments/:id - Fetch single assignment details
router.get("/:id", async (req, res) => {
  try {
    const assignment = await findAssignment(req.params.id);

    if (!assignment) {
      return res.status(404).json({ success: false, error: "Assignment not found" });
    }

    res.json({ success: true, data: assignment });
  } catch (err) {
    console.error("Error fetching assignment:", err.message);
    res.status(500).json({ success: false, error: "Failed to fetch assignment" });
  }
});

module.exports = router;
