const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || "postgres",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "admin123",
  // Configuración SSL para Render PostgreSQL
  ssl: process.env.NODE_ENV === "production" ? {
    rejectUnauthorized: false
  } : false,
});

// Probar conexión a la base de datos
pool.on("connect", () => {
  console.log("Connected to PostgreSQL database");
});

pool.on("error", (err) => {
  console.error("Database connection error:", err);
});

module.exports = pool;
