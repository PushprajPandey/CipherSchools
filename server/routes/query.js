const express = require("express");
const { pgPool } = require("../config/db");
const { validateQuery } = require("../utils/queryValidator");

const router = express.Router();

// POST /api/query/execute - Execute a SQL query in the sandbox
router.post("/execute", async (req, res) => {
  const { query } = req.body;

  if (!query || !query.trim()) {
    return res.status(400).json({
      success: false,
      error: "Please provide a SQL query to execute.",
    });
  }

  // Validate & sanitize the query
  const validation = validateQuery(query);
  if (!validation.valid) {
    return res.status(400).json({
      success: false,
      error: validation.error,
    });
  }

  let client;
  const startTime = Date.now();

  try {
    client = await pgPool.connect();
  } catch (connErr) {
    console.error("PostgreSQL connection error:", connErr.message);
    return res.status(500).json({
      success: false,
      error: "Database connection failed. Please try again later.",
    });
  }

  try {
    // Create an isolated schema for this execution using a transaction
    // This ensures user queries cannot affect other users or base data
    const schemaName = `sandbox_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    await client.query("BEGIN");
    await client.query(`CREATE SCHEMA ${schemaName}`);
    await client.query(`SET search_path TO ${schemaName}, public`);

    // Execute the user's query
    const result = await client.query(query);
    const executionTime = Date.now() - startTime;

    // Roll back the transaction so no changes persist
    await client.query("ROLLBACK");

    // Format the response
    if (result.rows) {
      res.json({
        success: true,
        data: {
          rows: result.rows,
          rowCount: result.rowCount,
          fields: result.fields
            ? result.fields.map((f) => ({ name: f.name, dataType: f.dataTypeID }))
            : [],
          executionTime,
        },
      });
    } else {
      res.json({
        success: true,
        data: {
          rows: [],
          rowCount: 0,
          fields: [],
          executionTime,
          message: "Query executed successfully.",
        },
      });
    }
  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});
    const executionTime = Date.now() - startTime;

    // Distinguish between SQL syntax errors and server errors
    const isSqlError = err.code && err.code.length === 5; // PostgreSQL error codes are 5 chars
    const statusCode = isSqlError ? 400 : 500;

    res.status(statusCode).json({
      success: false,
      error: isSqlError ? err.message : "Query execution failed. Please try again.",
      executionTime,
    });
  } finally {
    if (client) client.release();
  }
});

module.exports = router;
