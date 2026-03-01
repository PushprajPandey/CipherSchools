require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { connectMongoDB, connectPostgres } = require("./config/db");

// Import routes
const assignmentRoutes = require("./routes/assignments");
const queryRoutes = require("./routes/query");
const hintRoutes = require("./routes/hint");

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((s) => s.trim())
  : ["http://localhost:3000"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }
      callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.json({ limit: "10kb" }));

// ── Request logging (lightweight) ────────────────────────────
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (res.statusCode >= 400) {
      console.error(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
    }
  });
  next();
});

// ── Routes ───────────────────────────────────────────────────
app.use("/api/assignments", assignmentRoutes);
app.use("/api/query", queryRoutes);
app.use("/api/hint", hintRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── 404 handler ──────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
    path: req.originalUrl,
  });
});

// ── Global error handler (catches all unhandled errors) ──────
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack || err.message || err);

  const statusCode = err.statusCode || err.status || 500;
  const isProduction = process.env.NODE_ENV === "production";

  res.status(statusCode).json({
    success: false,
    error: statusCode === 500 && isProduction
      ? "Internal server error. Please try again later."
      : err.message || "Internal server error",
    ...(isProduction ? {} : { stack: err.stack }),
  });
});

// ── Catch unhandled promise rejections & uncaught exceptions ─
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

// ── Start Server ─────────────────────────────────────────────
const startServer = async () => {
  try {
    await connectMongoDB();
    await connectPostgres();

    app.listen(PORT, () => {
      console.log(`CipherSQLStudio API running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
};

startServer();

// Export for Vercel serverless
module.exports = app;
