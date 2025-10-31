const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateTestToken = () => {
  // Datos de prueba del usuario
  const payload = {
    id: 1,
    email: "admin@dondeoficial.com",
    role: "admin",
  };

  // Generar token
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "24h",
  });

  console.log("\n=== Token JWT de Prueba ===");
  console.log(token);
  console.log("\n=== Usar en Header Authorization ===");
  console.log(`Bearer ${token}`);
  console.log("\n=== Token expira en ===");
  console.log(process.env.JWT_EXPIRES_IN || "24h");

  return token;
};

// Ejecutar si se llama directamente
if (require.main === module) {
  generateTestToken();
}

module.exports = generateTestToken;
