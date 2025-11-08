const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Configurar Cloudinary con tus credenciales
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configurar el storage de Multer para Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "dondeoficial/businesses", // Carpeta en Cloudinary
    allowed_formats: ["jpg", "jpeg"], // Solo JPG y PNG
    transformation: [
      { width: 1200, height: 800, crop: "limit" }, // Redimensionar si es muy grande
      { quality: "auto" }, // Optimización automática
    ],
  },
});

// Configurar Multer con validaciones
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB máximo
  },
  fileFilter: (req, file, cb) => {
    // Validar que sea imagen
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Solo se permiten archivos de imagen"), false);
    }
  },
});

module.exports = { cloudinary, upload };
