import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { assignments } from "../data/assignments";
import { executeQuery, getHint } from "../services/api";
import "./AssignmentAttempt.scss";

// Hook to get responsive editor height based on viewport width
const useEditorHeight = () => {
  const [height, setHeight] = useState("200px");

  useEffect(() => {
    const updateHeight = () => {
      const w = window.innerWidth;
      if (w >= 1024) setHeight("300px");
      else if (w >= 641) setHeight("260px");
      else if (w >= 320) setHeight("220px");
      else setHeight("180px");
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return height;
};

const AssignmentAttempt = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const assignment = assignments.find((a) => a.id === parseInt(id));

  const [sqlQuery, setSqlQuery] = useState("");
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [currentHintIndex, setCurrentHintIndex] = useState(-1);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionTime, setExecutionTime] = useState(null);
  const [hintLoading, setHintLoading] = useState(false);
  const [dataTab, setDataTab] = useState("schema"); // "schema" | "rows"
  const editorHeight = useEditorHeight();

  // Navigate between assignments
  const currentIndex = assignments.findIndex((a) => a.id === parseInt(id));
  const prevAssignment = currentIndex > 0 ? assignments[currentIndex - 1] : null;
  const nextAssignment =
    currentIndex < assignments.length - 1 ? assignments[currentIndex + 1] : null;

  if (!assignment) {
    return (
      <div className="assignment-attempt">
        <div className="assignment-attempt__not-found">
          <h2>Assignment not found</h2>
          <p>The assignment you are looking for does not exist.</p>
          <button
            className="assignment-attempt__back"
            onClick={() => navigate("/")}
          >
            &larr; Back to Assignments
          </button>
        </div>
      </div>
    );
  }

  const getDifficultyClass = (difficulty) => {
    return `assignment-attempt__difficulty--${difficulty.toLowerCase()}`;
  };

  const handleExecuteQuery = async () => {
    if (!sqlQuery.trim()) {
      setError("Please enter a SQL query before executing.");
      return;
    }

    setIsExecuting(true);
    setError(null);
    setResults(null);

    try {
      const data = await executeQuery(sqlQuery);
      setResults(data.rows || []);
      setExecutionTime(data.executionTime || null);
      setError(null);
    } catch (err) {
      // Fallback: if backend is unreachable, run a local simulation
      if (err.message === "Failed to fetch") {
        const startTime = performance.now();
        setTimeout(() => {
          const elapsed = (performance.now() - startTime).toFixed(0);
          setExecutionTime(elapsed);
          setResults(assignment.sampleData.rows);
          setIsExecuting(false);
        }, 300);
        return;
      }
      setError(err.message || "Query execution failed.");
      setResults(null);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleGetHint = async () => {
    if (currentHintIndex >= assignment.hints.length - 1) return;
    setHintLoading(true);

    try {
      const data = await getHint(assignment.id, sqlQuery, currentHintIndex + 1);
      // If the LLM returned a hint, add it dynamically
      if (data.hint) {
        assignment.hints[currentHintIndex + 1] = data.hint;
      }
      setCurrentHintIndex((prev) => prev + 1);
    } catch {
      // Fallback to local hint if backend unavailable
      setCurrentHintIndex((prev) => prev + 1);
    } finally {
      setHintLoading(false);
    }
  };

  const handleClearQuery = () => {
    setSqlQuery("");
    setResults(null);
    setError(null);
    setExecutionTime(null);
  };

  const handleKeyDown = (e) => {
    // Ctrl/Cmd + Enter to execute
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleExecuteQuery();
    }
  };

  return (
    <div className="assignment-attempt" onKeyDown={handleKeyDown}>
      {/* Top Navigation */}
      <div className="assignment-attempt__top-bar">
        <button
          className="assignment-attempt__back"
          onClick={() => navigate("/")}
        >
          &larr; All Assignments
        </button>
        <div className="assignment-attempt__pagination">
          {prevAssignment && (
            <button
              className="assignment-attempt__page-btn"
              onClick={() => navigate(`/assignment/${prevAssignment.id}`)}
              title={prevAssignment.title}
            >
              &larr; Prev
            </button>
          )}
          <span className="assignment-attempt__page-indicator">
            {currentIndex + 1} / {assignments.length}
          </span>
          {nextAssignment && (
            <button
              className="assignment-attempt__page-btn"
              onClick={() => navigate(`/assignment/${nextAssignment.id}`)}
              title={nextAssignment.title}
            >
              Next &rarr;
            </button>
          )}
        </div>
      </div>

      {/* Header */}
      <div className="assignment-attempt__header">
        <div className="assignment-attempt__title-row">
          <div className="assignment-attempt__title-group">
            <span className="assignment-attempt__id">#{assignment.id}</span>
            <h1 className="assignment-attempt__title">{assignment.title}</h1>
          </div>
          <div className="assignment-attempt__badges">
            <span
              className={`assignment-attempt__difficulty ${getDifficultyClass(
                assignment.difficulty,
              )}`}
            >
              {assignment.difficulty}
            </span>
            {assignment.category && (
              <span className="assignment-attempt__category">
                {assignment.category}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="assignment-attempt__layout">
        {/* Left Column: Problem + Data */}
        <div className="assignment-attempt__left-col">
          {/* Problem Panel */}
          <div className="assignment-attempt__section">
            <h2 className="assignment-attempt__section-title">
              <span className="assignment-attempt__section-icon">&#128196;</span>
              Problem Statement
            </h2>
            <p className="assignment-attempt__problem">
              {assignment.problemStatement}
            </p>

            <h3 className="assignment-attempt__subsection-title">
              Requirements
            </h3>
            <ul className="assignment-attempt__requirements">
              {assignment.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>

          {/* Sample Data Panel with Tabs */}
          <div className="assignment-attempt__section">
            <h2 className="assignment-attempt__section-title">
              <span className="assignment-attempt__section-icon">&#128202;</span>
              Sample Data
            </h2>

            <div className="assignment-attempt__table-info">
              <span className="assignment-attempt__table-label">Table:</span>
              <code className="assignment-attempt__table-name">
                {assignment.sampleData.tableName}
              </code>
            </div>

            <div className="assignment-attempt__data-tabs">
              <button
                className={`assignment-attempt__data-tab ${
                  dataTab === "schema"
                    ? "assignment-attempt__data-tab--active"
                    : ""
                }`}
                onClick={() => setDataTab("schema")}
              >
                Schema ({assignment.sampleData.schema.length} cols)
              </button>
              <button
                className={`assignment-attempt__data-tab ${
                  dataTab === "rows"
                    ? "assignment-attempt__data-tab--active"
                    : ""
                }`}
                onClick={() => setDataTab("rows")}
              >
                Sample Rows ({assignment.sampleData.rows.length})
              </button>
            </div>

            {dataTab === "schema" ? (
              <div className="assignment-attempt__schema">
                <table className="schema-table">
                  <thead>
                    <tr>
                      <th>Column Name</th>
                      <th>Data Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignment.sampleData.schema.map((col, index) => (
                      <tr key={index}>
                        <td>
                          <code>{col.name}</code>
                        </td>
                        <td>{col.type}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="assignment-attempt__sample-data">
                <table className="data-table">
                  <thead>
                    <tr>
                      {assignment.sampleData.schema.map((col, index) => (
                        <th key={index}>{col.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {assignment.sampleData.rows.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {assignment.sampleData.schema.map((col, colIndex) => (
                          <td key={colIndex}>
                            {row[col.name] === null ? (
                              <span className="data-table__null">NULL</span>
                            ) : (
                              String(row[col.name])
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Editor + Results + Hints */}
        <div className="assignment-attempt__right-col">
          {/* SQL Editor */}
          <div className="assignment-attempt__section assignment-attempt__editor-section">
            <div className="assignment-attempt__editor-header">
              <h2 className="assignment-attempt__section-title">
                <span className="assignment-attempt__section-icon">&#128187;</span>
                SQL Editor
              </h2>
              <span className="assignment-attempt__shortcut">
                Ctrl+Enter to run
              </span>
            </div>
            <div className="assignment-attempt__editor">
              <Editor
                height={editorHeight}
                defaultLanguage="sql"
                value={sqlQuery}
                onChange={(value) => setSqlQuery(value || "")}
                theme="vs-light"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: "on",
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  wordWrap: "on",
                  placeholder: "Write your SQL query here...",
                }}
              />
            </div>
            <div className="assignment-attempt__actions">
              <button
                className="assignment-attempt__execute-btn"
                onClick={handleExecuteQuery}
                disabled={isExecuting || !sqlQuery.trim()}
              >
                {isExecuting ? (
                  <>
                    <span className="assignment-attempt__spinner" />
                    Executing...
                  </>
                ) : (
                  <>&#9654; Execute Query</>
                )}
              </button>
              <button
                className="assignment-attempt__hint-btn"
                onClick={handleGetHint}
                disabled={
                  hintLoading ||
                  currentHintIndex >= assignment.hints.length - 1
                }
              >
                {hintLoading ? (
                  <>
                    <span className="assignment-attempt__spinner" />
                    Thinking...
                  </>
                ) : (
                  <>&#128161; Get Hint</>
                )}
              </button>
              {sqlQuery && (
                <button
                  className="assignment-attempt__clear-btn"
                  onClick={handleClearQuery}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Results Panel */}
          {(results || error) && (
            <div className="assignment-attempt__section assignment-attempt__results-section">
              <div className="assignment-attempt__results-header">
                <h2 className="assignment-attempt__section-title">
                  <span className="assignment-attempt__section-icon">&#128200;</span>
                  Results
                </h2>
                {executionTime && (
                  <span className="assignment-attempt__execution-time">
                    {executionTime}ms
                  </span>
                )}
              </div>
              {error ? (
                <div className="assignment-attempt__error">
                  <span className="assignment-attempt__error-icon">&#9888;</span>
                  {error}
                </div>
              ) : results && results.length > 0 ? (
                <>
                  <div className="assignment-attempt__results-meta">
                    {results.length} row{results.length !== 1 ? "s" : ""}{" "}
                    returned
                  </div>
                  <div className="assignment-attempt__results">
                    <table className="data-table">
                      <thead>
                        <tr>
                          {Object.keys(results[0]).map((key, index) => (
                            <th key={index}>{key}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {results.map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            {Object.values(row).map((value, colIndex) => (
                              <td key={colIndex}>
                                {value === null ? (
                                  <span className="data-table__null">NULL</span>
                                ) : (
                                  String(value)
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <div className="assignment-attempt__empty">
                  Query executed successfully &mdash; no results returned.
                </div>
              )}
            </div>
          )}

          {/* Hints Panel */}
          {currentHintIndex >= 0 && (
            <div className="assignment-attempt__section assignment-attempt__hint-section">
              <h2 className="assignment-attempt__section-title">
                <span className="assignment-attempt__section-icon">&#128161;</span>
                Hints
                <span className="assignment-attempt__hint-progress">
                  {currentHintIndex + 1} / {assignment.hints.length}
                </span>
              </h2>
              <div className="assignment-attempt__hints-list">
                {assignment.hints
                  .slice(0, currentHintIndex + 1)
                  .map((hint, index) => (
                    <div key={index} className="assignment-attempt__hint">
                      <span className="assignment-attempt__hint-number">
                        {index + 1}
                      </span>
                      <p>{hint}</p>
                    </div>
                  ))}
              </div>
              {currentHintIndex < assignment.hints.length - 1 && (
                <p className="assignment-attempt__hint-more">
                  Need more help? Click &ldquo;Get Hint&rdquo; again for
                  another clue.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignmentAttempt;
