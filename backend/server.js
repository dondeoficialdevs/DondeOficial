const express = require("express");
const cors = require("cors");
require("dotenv").config();

console.log(
  "JWT_SECRET está configurado:",
  process.env.JWT_SECRET ? "SÍ ✓" : "NO ✗"
);
console.log("DB_NAME:", process.env.DB_NAME);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL
        : ["http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
  })
);
app.use(express.json());

// Rutas
const businessesRouter = require("./routes/businesses");
const categoriesRouter = require("./routes/categories");
const leadsRouter = require("./routes/leads");
const newsletterRouter = require("./routes/newsletter");
const authRouter = require("./routes/auth"); // ← AGREGAR ESTA LÍNEA

app.use("/api/businesses", businessesRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/leads", leadsRouter);
app.use("/api/newsletter", newsletterRouter);
app.use("/api/auth", authRouter); // ← AGREGAR ESTA LÍNEA

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
