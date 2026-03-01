/**
 * api.js — Centralised API client for CipherSQL Studio.
 *
 * Every function targets the Express backend.  If the backend is
 * unreachable the caller can decide how to fall back (e.g. use
 * local assignment data for listing, show an error for query
 * execution).
 */

const BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

/* ── helpers ─────────────────────────────────────────────── */
async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const body = await res.json();

  if (!res.ok) {
    const err = new Error(body.error || body.message || "Request failed");
    err.status = res.status;
    throw err;
  }

  return body;
}

/* ── Assignments ─────────────────────────────────────────── */

/** Fetch all assignments (with optional difficulty / category filters). */
export async function fetchAssignments({ difficulty, category } = {}) {
  const params = new URLSearchParams();
  if (difficulty && difficulty !== "All") params.set("difficulty", difficulty);
  if (category) params.set("category", category);

  const qs = params.toString();
  return request(`/assignments${qs ? `?${qs}` : ""}`);
}

/** Fetch a single assignment by its MongoDB _id or numeric id. */
export async function fetchAssignment(id) {
  return request(`/assignments/${id}`);
}

/* ── Query execution ─────────────────────────────────────── */

/**
 * Execute a SQL query against the PostgreSQL sandbox.
 * Returns { rows, fields, executionTime } on success.
 */
export async function executeQuery(sql) {
  return request("/query/execute", {
    method: "POST",
    body: JSON.stringify({ sql }),
  });
}

/* ── Hints (LLM) ─────────────────────────────────────────── */

/**
 * Request a progressive hint from the LLM.
 * @param {string} assignmentId  – Mongo _id of the assignment
 * @param {string} userQuery     – student's current SQL attempt
 * @param {number} hintIndex     – 0-based progressive index
 * Returns { hint, hintIndex, remaining }
 */
export async function getHint(assignmentId, userQuery, hintIndex) {
  return request("/hint", {
    method: "POST",
    body: JSON.stringify({ assignmentId, userQuery, hintIndex }),
  });
}
