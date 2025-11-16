const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const {
  validate,
  loginSchema,
  changePasswordSchema,
  refreshTokenSchema,
} = require("../middleware/validation");
const { authenticateToken } = require("../middleware/auth");

// Generar access token
function generateAccessToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, full_name: user.full_name },
    process.env.JWT_SECRET,
    { expiresIn: "15m" } // 15 minutos
  );
}

// Generar refresh token
function generateRefreshToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" } // 7 días
  );
}

// POST /api/auth/login - Login
router.post("/login", validate(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.validatedData;

    // Buscar usuario
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Verificar password
    const isValidPassword = await User.verifyPassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generar tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Guardar refresh token en BD
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 días
    await User.saveRefreshToken(user.id, refreshToken, expiresAt);

    res.json({
      success: true,
      data: {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
        },
      },
      message: "Login successful",
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

// POST /api/auth/refresh - Refrescar access token
router.post("/refresh", validate(refreshTokenSchema), async (req, res) => {
  try {
    const { refreshToken } = req.validatedData;

    // Verificar que el refresh token exista en BD
    const tokenData = await User.findRefreshToken(refreshToken);
    if (!tokenData) {
      return res.status(403).json({
        success: false,
        message: "Invalid or expired refresh token",
      });
    }

    // Verificar el token JWT
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: "Invalid or expired refresh token",
        });
      }

      // Generar nuevo access token
      const newAccessToken = generateAccessToken({
        id: user.id,
        email: tokenData.email,
        full_name: tokenData.full_name,
      });

      res.json({
        success: true,
        data: {
          accessToken: newAccessToken,
        },
        message: "Token refreshed successfully",
      });
    });
  } catch (error) {
    console.error("Error refreshing token:", error);
    res.status(500).json({
      success: false,
      message: "Error refreshing token",
      error: error.message,
    });
  }
});

// POST /api/auth/logout - Cerrar sesión
router.post("/logout", validate(refreshTokenSchema), async (req, res) => {
  try {
    const { refreshToken } = req.validatedData;

    // Eliminar refresh token de BD
    await User.deleteRefreshToken(refreshToken);

    res.json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Error in logout:", error);
    res.status(500).json({
      success: false,
      message: "Error during logout",
      error: error.message,
    });
  }
});

// POST /api/auth/change-password - Cambiar contraseña (requiere autenticación)
router.post(
  "/change-password",
  authenticateToken,
  validate(changePasswordSchema),
  async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.validatedData;
      const userId = req.user.id;

      // Verificar usuario
      const user = await User.findByEmail(req.user.email);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Verificar contraseña actual
      const isValidPassword = await User.verifyPassword(
        currentPassword,
        user.password
      );
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: "Current password is incorrect",
        });
      }

      // Cambiar contraseña
      await User.changePassword(userId, newPassword);

      // Eliminar todos los refresh tokens (cerrar todas las sesiones)
      await User.deleteAllRefreshTokens(userId);

      res.json({
        success: true,
        message: "Password changed successfully. Please login again.",
      });
    } catch (error) {
      console.error("Error changing password:", error);
      res.status(500).json({
        success: false,
        message: "Error changing password",
        error: error.message,
      });
    }
  }
);

// GET /api/auth/verify - Verificar token actual (requiere autenticación)
router.get("/verify", authenticateToken, async (req, res) => {
  res.json({
    success: true,
    data: {
      id: req.user.id,
      email: req.user.email,
      full_name: req.user.full_name,
    },
    message: "Token is valid",
  });
});

module.exports = router;
