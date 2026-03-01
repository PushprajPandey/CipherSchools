/**
 * SQL Query Validator
 * Validates and sanitizes user SQL queries before execution.
 * Blocks destructive operations to protect the sandbox environment.
 */

// Disallowed SQL commands that could damage the database
const BLOCKED_KEYWORDS = [
  "DROP DATABASE",
  "DROP SCHEMA",
  "DROP ROLE",
  "DROP USER",
  "CREATE DATABASE",
  "CREATE ROLE",
  "CREATE USER",
  "ALTER ROLE",
  "ALTER USER",
  "GRANT",
  "REVOKE",
  "COPY",
  "\\\\copy",
  "pg_dump",
  "pg_restore",
  "LOAD",
  "EXECUTE",
  "PREPARE",
  "DEALLOCATE",
];

// Commands that modify data but are allowed in sandbox (rolled back via transaction)
const ALLOWED_WRITE_OPS = ["INSERT", "UPDATE", "DELETE", "CREATE TABLE", "ALTER TABLE", "DROP TABLE", "TRUNCATE"];

/**
 * Validate a SQL query for safety
 * @param {string} query - The raw SQL query string
 * @returns {{ valid: boolean, error?: string }}
 */
function validateQuery(query) {
  if (!query || typeof query !== "string") {
    return { valid: false, error: "Query must be a non-empty string." };
  }

  const trimmed = query.trim();

  if (trimmed.length === 0) {
    return { valid: false, error: "Query cannot be empty." };
  }

  if (trimmed.length > 5000) {
    return { valid: false, error: "Query is too long. Maximum 5000 characters allowed." };
  }

  // Normalize for checking (uppercase, collapse whitespace)
  const normalized = trimmed.toUpperCase().replace(/\s+/g, " ");

  // Check for blocked keywords
  for (const keyword of BLOCKED_KEYWORDS) {
    if (normalized.includes(keyword.toUpperCase())) {
      return {
        valid: false,
        error: `The operation "${keyword}" is not allowed in this sandbox environment.`,
      };
    }
  }

  // Block multiple statements (prevent SQL injection via semicolons)
  // Allow only one statement at a time
  const statementCount = trimmed
    .replace(/'[^']*'/g, "") // Remove string literals
    .replace(/"[^"]*"/g, "") // Remove quoted identifiers
    .split(";")
    .filter((s) => s.trim().length > 0).length;

  if (statementCount > 1) {
    return {
      valid: false,
      error: "Only one SQL statement is allowed at a time.",
    };
  }

  return { valid: true };
}

module.exports = { validateQuery };
