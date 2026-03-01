import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import AssignmentList from "./components/AssignmentList";
import AssignmentAttempt from "./components/AssignmentAttempt";
import "./components/ErrorBoundary.scss";
import "./styles/App.scss";

function App() {
  return (
    <ErrorBoundary>
      <Router>
      <div className="app">
        <header className="app__header">
          <nav className="app__nav">
            <Link to="/" className="app__logo">
              <span className="app__logo-icon">&#9000;</span>
              CipherSQL<span className="app__logo-accent">Studio</span>
            </Link>
            <div className="app__nav-links">
              <Link to="/" className="app__nav-link">Assignments</Link>
            </div>
          </nav>
        </header>

        <main className="app__main">
          <Routes>
            <Route path="/" element={<AssignmentList />} />
            <Route path="/assignment/:id" element={<AssignmentAttempt />} />
          </Routes>
        </main>

        <footer className="app__footer">
          <div className="app__footer-content">
            <p className="app__footer-text">
              CipherSQLStudio &mdash; Learn SQL by doing
            </p>
            <p className="app__footer-meta">
              Practice SQL queries in a safe sandbox environment
            </p>
          </div>
        </footer>
      </div>
    </Router>
    </ErrorBoundary>
  );
}

export default App;
