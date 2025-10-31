const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

// POST /api/auth/login - Login temporal para desarrollo
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // ADVERTENCIA: Esto es solo para desarrollo
    // En producción deberías verificar contra la base de datos con bcrypt
    if (email === "admin@dondeoficial.com" && password === "admin123") {
      const payload = {
        id: 1,
        email: email,
        role: "admin",
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "24h",
      });

      return res.json({
        success: true,
        data: {
          token,
          user: {
            id: 1,
            email: email,
            role: "admin",
          },
        },
        message: "Login successful",
      });
    }

    res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({
      success: false,
      message: "Error during login",
      error: error.message,
    });
  }
});

// GET /api/auth/verify - Verificar token actual
router.get("/verify", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: "Invalid or expired token",
        });
      }

      res.json({
        success: true,
        data: decoded,
        message: "Token is valid",
      });
    });
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(500).json({
      success: false,
      message: "Error verifying token",
      error: error.message,
    });
  }
});

module.exports = router;
