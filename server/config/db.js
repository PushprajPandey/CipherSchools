const mongoose = require("mongoose");
const { Pool } = require("pg");

// ── MongoDB Connection ────────────────────────────────────────
const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

// ── PostgreSQL Connection Pool ────────────────────────────────
const pgPool = new Pool({
  connectionString: process.env.POSTGRES_URI,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pgPool.on("error", (err) => {
  console.error("PostgreSQL pool error:", err.message);
});

const connectPostgres = async () => {
  try {
    const client = await pgPool.connect();
    console.log("PostgreSQL connected successfully");
    client.release();
  } catch (err) {
    console.error("PostgreSQL connection error:", err.message);
    process.exit(1);
  }
};

module.exports = { connectMongoDB, pgPool, connectPostgres };
