const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Función para subir una imagen
async function uploadImage(imagePath, publicId) {
  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: 'dondeoficial/promotional',
      public_id: publicId,
      resource_type: 'image',
      overwrite: true, // Sobrescribir si ya existe
    });
    
    console.log(`✅ Imagen subida exitosamente:`);
    console.log(`   URL: ${result.secure_url}`);
    console.log(`   Public ID: ${result.public_id}`);
    return result;
  } catch (error) {
    console.error(`❌ Error subiendo ${imagePath}:`, error.message);
    throw error;
  }
}

// Función principal
async function main() {
  console.log('🚀 Iniciando subida de imágenes promocionales a Cloudinary...\n');
  
  // Ruta de las imágenes locales (ajusta según tu estructura)
  const imagesDir = path.join(__dirname, '../../frontend/public/images/action-cards');
  
  const imagesToUpload = [
    {
      localPath: path.join(imagesDir, 'Fondo-turismo.jpg'),
      publicId: 'Fondo-turismo',
    },
    {
      localPath: path.join(imagesDir, 'fondo-whatsapp.avif'),
      publicId: 'fondo-whatsapp',
    },
  ];
  
  const results = [];
  
  for (const image of imagesToUpload) {
    // Verificar que el archivo existe
    if (!fs.existsSync(image.localPath)) {
      console.log(`⚠️  Archivo no encontrado: ${image.localPath}`);
      console.log(`   Saltando esta imagen...\n`);
      continue;
    }
    
    try {
      const result = await uploadImage(image.localPath, image.publicId);
      results.push({
        name: image.publicId,
        url: result.secure_url,
        publicId: result.public_id,
      });
      console.log(''); // Línea en blanco
    } catch (error) {
      console.log(''); // Línea en blanco
    }
  }
  
  if (results.length > 0) {
    console.log('\n📋 Resumen de URLs:');
    console.log('='.repeat(60));
    results.forEach((img) => {
      console.log(`\n${img.name}:`);
      console.log(`  ${img.url}`);
    });
    console.log('\n' + '='.repeat(60));
    console.log('\n✅ Proceso completado!');
  } else {
    console.log('\n⚠️  No se subieron imágenes.');
  }
}

// Ejecutar
main().catch((error) => {
  console.error('❌ Error fatal:', error);
  process.exit(1);
});



