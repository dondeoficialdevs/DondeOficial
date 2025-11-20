const express = require("express");
const cors = require("cors");
require("dotenv").config();

console.log("=== Iniciando servidor ===");
console.log(
  "JWT_SECRET está configurado:",
  process.env.JWT_SECRET ? "SÍ ✓" : "NO ✗"
);
console.log("DB_NAME:", process.env.DB_NAME || "NO CONFIGURADO");
console.log("DB_HOST:", process.env.DB_HOST || "NO CONFIGURADO");
console.log("NODE_ENV:", process.env.NODE_ENV || "development");

const app = express();
const PORT = process.env.PORT || 5000;

// Importar pool y función de prueba
const { testConnection } = require("./config/database");

// Middleware CORS - Configuración flexible
const corsOptions = {
  origin: function (origin, callback) {
    // En desarrollo, permitir localhost y cualquier origen
    if (process.env.NODE_ENV !== "production") {
      const allowedOrigins = ["http://localhost:3000", "http://127.0.0.1:3000"];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        // En desarrollo, también permitir otros orígenes para facilitar pruebas
        console.log(
          `⚠️  CORS: Permitiendo origen no estándar en desarrollo: ${origin}`
        );
        callback(null, true);
      }
    } else {
      // En producción, usar FRONTEND_URL o permitir cualquier origen si no está configurado
      const allowedOrigin = process.env.FRONTEND_URL;
      if (!allowedOrigin || origin === allowedOrigin || !origin) {
        callback(null, true);
      } else {
        console.warn(
          `⚠️  CORS: Origin ${origin} not in allowed list. Expected: ${allowedOrigin}`
        );
        // En producción, ser más estricto pero aún permitir si no hay origin (peticiones directas)
        callback(null, true);
      }
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

// Rutas
const businessesRouter = require("./routes/businesses");
const categoriesRouter = require("./routes/categories");
const leadsRouter = require("./routes/leads");
const newsletterRouter = require("./routes/newsletter");
const authRouter = require("./routes/auth");
const reviewsRouter = require("./routes/reviews");

app.use("/api/businesses", businessesRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/leads", leadsRouter);
app.use("/api/newsletter", newsletterRouter);
app.use("/api/auth", authRouter);
app.use("/api/reviews", reviewsRouter);

// Endpoint de verificación de salud
app.get("/api/health", (req, res) => {
  res.json({ message: "API is running", status: "OK" });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Iniciar servidor y verificar conexión a BD
async function startServer() {
  // Verificar conexión a la base de datos antes de iniciar
  console.log("\n=== Verificando conexión a base de datos ===");
  const dbConnected = await testConnection();

  if (!dbConnected) {
    console.error("\n⚠️  ADVERTENCIA: No se pudo conectar a la base de datos");
    console.error(
      "   El servidor se iniciará pero las peticiones a la BD fallarán"
    );
    console.error(
      "   Verifica tu archivo .env y las credenciales de la base de datos\n"
    );
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log("\n=== Servidor iniciado ===");
    console.log(`✓ Server running on port ${PORT}`);
    console.log(`✓ API disponible en http://localhost:${PORT}/api`);
    console.log(`✓ Health check: http://localhost:${PORT}/api/health`);
    if (process.env.NODE_ENV === "production") {
      console.log(`✓ Frontend URL: ${process.env.FRONTEND_URL}`);
    }
    console.log("========================\n");
  });
}

startServer().catch((error) => {
  console.error("Error al iniciar el servidor:", error);
  process.exit(1);
});
