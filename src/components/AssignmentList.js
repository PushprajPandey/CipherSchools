import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { assignments } from "../data/assignments";
import "./AssignmentList.scss";

const DIFFICULTY_OPTIONS = ["All", "Easy", "Medium", "Hard"];

const AssignmentList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeDifficulty, setActiveDifficulty] = useState("All");

  const difficultyCount = useMemo(() => {
    return {
      All: assignments.length,
      Easy: assignments.filter((a) => a.difficulty === "Easy").length,
      Medium: assignments.filter((a) => a.difficulty === "Medium").length,
      Hard: assignments.filter((a) => a.difficulty === "Hard").length,
    };
  }, []);

  const filteredAssignments = useMemo(() => {
    return assignments.filter((a) => {
      const matchesDifficulty =
        activeDifficulty === "All" || a.difficulty === activeDifficulty;
      const matchesSearch =
        !searchTerm ||
        a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (a.category && a.category.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesDifficulty && matchesSearch;
    });
  }, [activeDifficulty, searchTerm]);

  const getDifficultyClass = (difficulty) => {
    return `assignment-card__difficulty--${difficulty.toLowerCase()}`;
  };

  return (
    <div className="assignment-list">
      <div className="assignment-list__container">
        {/* Hero Section */}
        <div className="assignment-list__hero">
          <h1 className="assignment-list__title">SQL Assignments</h1>
          <p className="assignment-list__subtitle">
            Master SQL step by step &mdash; pick an assignment and start writing
            queries
          </p>

          {/* Stats */}
          <div className="assignment-list__stats">
            <div className="assignment-list__stat">
              <span className="assignment-list__stat-number">
                {assignments.length}
              </span>
              <span className="assignment-list__stat-label">Total</span>
            </div>
            <div className="assignment-list__stat assignment-list__stat--easy">
              <span className="assignment-list__stat-number">
                {difficultyCount.Easy}
              </span>
              <span className="assignment-list__stat-label">Easy</span>
            </div>
            <div className="assignment-list__stat assignment-list__stat--medium">
              <span className="assignment-list__stat-number">
                {difficultyCount.Medium}
              </span>
              <span className="assignment-list__stat-label">Medium</span>
            </div>
            <div className="assignment-list__stat assignment-list__stat--hard">
              <span className="assignment-list__stat-number">
                {difficultyCount.Hard}
              </span>
              <span className="assignment-list__stat-label">Hard</span>
            </div>
          </div>
        </div>

        {/* Toolbar: Search + Filter */}
        <div className="assignment-list__toolbar">
          <div className="assignment-list__search">
            <span className="assignment-list__search-icon">&#128269;</span>
            <input
              type="text"
              className="assignment-list__search-input"
              placeholder="Search assignments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="assignment-list__search-clear"
                onClick={() => setSearchTerm("")}
                aria-label="Clear search"
              >
                &times;
              </button>
            )}
          </div>

          <div className="assignment-list__filters">
            {DIFFICULTY_OPTIONS.map((diff) => (
              <button
                key={diff}
                className={`assignment-list__filter-btn ${
                  activeDifficulty === diff
                    ? "assignment-list__filter-btn--active"
                    : ""
                } ${
                  diff !== "All"
                    ? `assignment-list__filter-btn--${diff.toLowerCase()}`
                    : ""
                }`}
                onClick={() => setActiveDifficulty(diff)}
              >
                {diff}
                <span className="assignment-list__filter-count">
                  {difficultyCount[diff]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Assignment Grid */}
        {filteredAssignments.length === 0 ? (
          <div className="assignment-list__empty">
            <p className="assignment-list__empty-text">
              No assignments match your search.
            </p>
            <button
              className="assignment-list__empty-reset"
              onClick={() => {
                setSearchTerm("");
                setActiveDifficulty("All");
              }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="assignment-list__grid">
            {filteredAssignments.map((assignment, index) => (
              <div
                key={assignment.id}
                className="assignment-card"
                onClick={() => navigate(`/assignment/${assignment.id}`)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    navigate(`/assignment/${assignment.id}`);
                  }
                }}
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <div className="assignment-card__number">
                  #{assignment.id}
                </div>
                <div className="assignment-card__header">
                  <h2 className="assignment-card__title">{assignment.title}</h2>
                  <span
                    className={`assignment-card__difficulty ${getDifficultyClass(
                      assignment.difficulty,
                    )}`}
                  >
                    {assignment.difficulty}
                  </span>
                </div>
                <p className="assignment-card__description">
                  {assignment.description}
                </p>
                <div className="assignment-card__footer">
                  {assignment.category && (
                    <span className="assignment-card__category">
                      {assignment.category}
                    </span>
                  )}
                  <span className="assignment-card__cta">
                    Solve &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentList;
