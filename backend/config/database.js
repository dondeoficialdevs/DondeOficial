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
  // Configuración de timeout y reintentos
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  max: 20,
});

// Probar conexión a la base de datos
pool.on("connect", () => {
  console.log("✓ Connected to PostgreSQL database");
});

pool.on("error", (err) => {
  console.error("✗ Database connection error:", err.message);
  console.error("Error code:", err.code);
  console.error("Error details:", {
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
  });
});

// Función para verificar la conexión
async function testConnection() {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("✓ Database connection test successful");
    console.log("  Current time:", result.rows[0].now);
    return true;
  } catch (error) {
    console.error("✗ Database connection test failed:");
    console.error("  Error:", error.message);
    console.error("  Code:", error.code);
    if (error.code === "ECONNREFUSED") {
      console.error("  → El servidor de base de datos no está disponible");
    } else if (error.code === "28P01") {
      console.error("  → Error de autenticación. Verifica usuario y contraseña");
    } else if (error.code === "3D000") {
      console.error("  → La base de datos no existe");
    }
    return false;
  }
}

// Exportar la función de prueba
module.exports = pool;
module.exports.testConnection = testConnection;
