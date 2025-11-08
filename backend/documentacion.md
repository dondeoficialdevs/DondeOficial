`DOCUMENTACION_API_BACKEND.md`:

# Documentación Técnica Backend - DondeOficial

## Tabla de Contenidos

- [Requisitos del Sistema](#requisitos-del-sistema)
- [Arquitectura del Proyecto](#arquitectura-del-proyecto)
- [Base de Datos](#base-de-datos)
- [Configuración de Cloudinary](#configuraci%C3%B3n-de-cloudinary)
- [Endpoints de la API](#endpoints-de-la-api)
- [Carga de Imágenes](#carga-de-im%C3%A1genes)
- [Validación de Datos](#validaci%C3%B3n-de-datos)
- [Manejo de Errores](#manejo-de-errores)
- [Variables de Entorno](#variables-de-entorno)
- [Testing y Desarrollo](#testing-y-desarrollo)

---

## Requisitos del Sistema

### Tecnologías Implementadas

- **Node.js** versión 20 o superior
- **Express.js** 4.x como framework web
- **PostgreSQL** 15 o superior como base de datos relacional
- **JavaScript** (ES6+)
- **Joi** para validación de esquemas
- **pg** (node-postgres) para conexión a PostgreSQL
- **Multer** para manejo de archivos multipart/form-data
- **Cloudinary** para almacenamiento de imágenes en la nube
- **dotenv** para manejo de variables de entorno
- **CORS** habilitado para comunicación con frontend

### Dependencias del Proyecto

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.11.0",
    "joi": "^17.9.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "multer": "^1.4.5-lts.1",
    "cloudinary": "^1.41.0",
    "multer-storage-cloudinary": "^4.0.0"
  }
}
```

---

## Arquitectura del Proyecto

### Estructura de Carpetas

```
backend/
├── config/
│   ├── database.js         # Configuración del pool de PostgreSQL
│   └── cloudinary.js       # Configuración de Cloudinary y Multer
├── middleware/
│   └── validation.js       # Middleware de validación con Joi
├── models/
│   ├── Business.js         # Modelo de negocios
│   ├── BusinessImage.js    # Modelo de imágenes de negocios
│   ├── Category.js         # Modelo de categorías
│   ├── Lead.js             # Modelo de leads
│   └── NewsletterSubscriber.js  # Modelo de suscriptores
├── routes/
│   ├── businesses.js       # Rutas de negocios e imágenes
│   ├── categories.js       # Rutas de categorías
│   ├── leads.js            # Rutas de leads
│   └── newsletter.js       # Rutas de newsletter
├── .env                    # Variables de entorno
├── config.env.example      # Ejemplo de variables de entorno
├── server.js               # Punto de entrada de la aplicación
└── package.json
```

---

## Base de Datos

### Diagrama de Relaciones

```
┌─────────────────┐         ┌─────────────────┐         ┌──────────────────┐
│   categories    │         │   businesses    │         │ business_images  │
├─────────────────┤         ├─────────────────┤         ├──────────────────┤
│ id (PK)         │◄───────│ category_id (FK)│         │ id (PK)          │
│ name (UNIQUE)   │         │ id (PK)         │◄───────│ business_id (FK) │
│ description     │         │ name (UNIQUE)   │         │ image_url        │
│ created_at      │         │ email (UNIQUE)  │         │ cloudinary_id    │
│ updated_at      │         │ description     │         │ is_primary       │
└─────────────────┘         │ address         │         │ created_at       │
                            │ phone           │         └──────────────────┘
                            │ website         │
                            │ opening_hours   │
                            │ latitude        │
                            │ longitude       │
                            │ created_at      │
                            │ updated_at      │
                            └─────────────────┘

┌──────────────────────────┐
│         leads            │
├──────────────────────────┤
│ id (PK)                  │
│ full_name                │
│ email                    │
│ subject                  │
│ message                  │
│ created_at               │
│ UNIQUE(email, full_name) │
└──────────────────────────┘

┌──────────────────────────┐
│  newsletter_subscribers  │
├──────────────────────────┤
│ id (PK)                  │
│ email (UNIQUE)           │
│ subscribed_at            │
└──────────────────────────┘
```

### Tabla: `categories`

```sql
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### Tabla: `businesses`

```sql
CREATE TABLE IF NOT EXISTS businesses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(100),
    website VARCHAR(200),
    category_id INTEGER REFERENCES categories(id),
    opening_hours TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_business_name UNIQUE (name),
    CONSTRAINT unique_business_email UNIQUE (email)
);

CREATE INDEX IF NOT EXISTS idx_businesses_category ON businesses(category_id);
CREATE INDEX IF NOT EXISTS idx_businesses_name ON businesses(name);
CREATE INDEX IF NOT EXISTS idx_businesses_location ON businesses(latitude, longitude);
```

---

### Tabla: `business_images` ✨ NUEVA

```sql
CREATE TABLE IF NOT EXISTS business_images (
    id SERIAL PRIMARY KEY,
    business_id INTEGER NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    cloudinary_public_id TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_business_images_business_id ON business_images(business_id);
```

**Descripción de los campos:**

- `id`: Identificador único de la imagen
- `business_id`: Relación con el negocio (ON DELETE CASCADE elimina imágenes si se elimina el negocio)
- `image_url`: URL completa de la imagen en Cloudinary
- `cloudinary_public_id`: ID público de Cloudinary (necesario para eliminar la imagen)
- `is_primary`: Indica si es la imagen principal del negocio (la primera subida)
- `created_at`: Fecha de creación

---

### Tabla: `leads`

```sql
CREATE TABLE IF NOT EXISTS leads (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(200) NOT NULL,
    email VARCHAR(100) NOT NULL,
    subject VARCHAR(200),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_lead_email_fullname UNIQUE (email, full_name)
);
```

---

### Tabla: `newsletter_subscribers`

```sql
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Configuración de Cloudinary

### ¿Qué es Cloudinary?

Cloudinary es un servicio de almacenamiento en la nube para imágenes y videos que ofrece:

- Almacenamiento gratuito hasta 25 GB
- CDN global para entrega rápida
- Optimización automática de imágenes
- Transformaciones on-the-fly
- URLs directas para uso en frontend

### Configuración

**Archivo: `config/cloudinary.js`**

```javascript
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "dondeoficial/businesses",
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [
      { width: 1200, height: 800, crop: "limit" },
      { quality: "auto" },
    ],
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB máximo
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Solo se permiten archivos de imagen"), false);
    }
  },
});

module.exports = { cloudinary, upload };
```

**Características:**

- Carpeta organizada: `dondeoficial/businesses`
- Formatos: JPG, JPEG, PNG
- Tamaño máximo: 5 MB
- Optimización automática de calidad
- Redimensionamiento a máximo 1200x800px

---

## Endpoints de la API

### Resumen de Endpoints

| Endpoint                                      | Método | Descripción                  | Body Type             |
| :-------------------------------------------- | :----- | :--------------------------- | :-------------------- |
| `/api/businesses`                             | GET    | Listar negocios con imágenes | -                     |
| `/api/businesses/:id`                         | GET    | Ver negocio con imágenes     | -                     |
| `/api/businesses`                             | POST   | Crear negocio con imágenes   | `multipart/form-data` |
| `/api/businesses/:id`                         | PUT    | Actualizar datos del negocio | `application/json`    |
| `/api/businesses/:id`                         | DELETE | Eliminar negocio e imágenes  | -                     |
| `/api/businesses/:id/images`                  | POST   | Agregar imágenes a negocio   | `multipart/form-data` |
| `/api/businesses/:businessId/images/:imageId` | DELETE | Eliminar imagen específica   | -                     |
| `/api/categories`                             | GET    | Listar categorías            | -                     |
| `/api/categories/:id`                         | GET    | Ver categoría específica     | -                     |
| `/api/categories`                             | POST   | Crear categoría              | `application/json`    |
| `/api/leads`                                  | POST   | Crear lead                   | `application/json`    |
| `/api/leads`                                  | GET    | Listar leads                 | -                     |
| `/api/leads/:id`                              | GET    | Ver lead específico          | -                     |
| `/api/newsletter/subscribe`                   | POST   | Suscribirse                  | `application/json`    |
| `/api/newsletter/subscribers`                 | GET    | Listar suscriptores          | -                     |
| `/api/newsletter/subscribers/:id`             | DELETE | Eliminar suscriptor          | -                     |
| `/api/health`                                 | GET    | Estado del API               | -                     |

**Nota:** Todos los endpoints son públicos. No requieren autenticación.

---

## Carga de Imágenes

### 🖼️ `POST /api/businesses` - Crear negocio con imágenes

Crea un nuevo negocio y sube múltiples imágenes en una sola petición.

**Content-Type:** `multipart/form-data`

**Campos del formulario:**

| Campo           | Tipo    | Requerido | Descripción                              |
| :-------------- | :------ | :-------- | :--------------------------------------- |
| `name`          | text    | ✅        | Nombre del negocio                       |
| `description`   | text    | ✅        | Descripción                              |
| `category_id`   | text    | ❌        | ID de categoría                          |
| `address`       | text    | ❌        | Dirección                                |
| `phone`         | text    | ❌        | Teléfono                                 |
| `email`         | text    | ❌        | Email                                    |
| `website`       | text    | ❌        | Sitio web                                |
| `opening_hours` | text    | ❌        | Horarios                                 |
| `latitude`      | text    | ❌        | Latitud                                  |
| `longitude`     | text    | ❌        | Longitud                                 |
| `images`        | file(s) | ❌        | Hasta 10 imágenes (JPG/PNG, máx 5MB c/u) |

**Ejemplo en Postman:**

1. Método: `POST`
2. URL: `http://localhost:5000/api/businesses`
3. Body: Seleccionar **form-data**
4. Agregar campos de texto y archivos (tipo File para `images`)

**Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "id": 10,
    "name": "Mi Restaurante",
    "description": "Descripción del restaurante",
    "address": "Calle 123",
    "phone": "555-1234",
    "email": "contacto@restaurante.com",
    "website": "https://restaurante.com",
    "category_id": 1,
    "category_name": "Restaurant",
    "opening_hours": "9AM - 10PM",
    "latitude": null,
    "longitude": null,
    "created_at": "2025-11-08T15:30:00Z",
    "updated_at": "2025-11-08T15:30:00Z",
    "images": [
      {
        "id": 1,
        "image_url": "https://res.cloudinary.com/dnehxgvc1/image/upload/v1234567890/dondeoficial/businesses/abc123.jpg",
        "is_primary": true
      },
      {
        "id": 2,
        "image_url": "https://res.cloudinary.com/dnehxgvc1/image/upload/v1234567890/dondeoficial/businesses/def456.jpg",
        "is_primary": false
      }
    ]
  },
  "message": "Business created successfully"
}
```

**Errores:**

- `400 Bad Request`: Validación fallida
- `409 Conflict`: Nombre o email duplicado
- `500 Internal Server Error`: Error del servidor

---

### 📷 `POST /api/businesses/:id/images` - Agregar imágenes a negocio existente

Agrega más imágenes a un negocio que ya existe.

**Content-Type:** `multipart/form-data`

**Parámetros:**

- `id` (URL): ID del negocio

**Campo del formulario:**

- `images` (file): Hasta 10 imágenes

**Ejemplo:**

```
POST /api/businesses/10/images
```

**Body (form-data):**

- `images`: [archivo1.jpg, archivo2.jpg, ...]

**Response (201 Created):**

```json
{
  "success": true,
  "data": [
    {
      "id": 3,
      "business_id": 10,
      "image_url": "https://res.cloudinary.com/.../image1.jpg",
      "cloudinary_public_id": "dondeoficial/businesses/xyz789",
      "is_primary": false,
      "created_at": "2025-11-08T16:00:00Z"
    }
  ],
  "message": "Images added successfully"
}
```

---

### 🗑️ `DELETE /api/businesses/:businessId/images/:imageId` - Eliminar imagen específica

Elimina una imagen tanto de Cloudinary como de la base de datos.

**Parámetros:**

- `businessId` (URL): ID del negocio
- `imageId` (URL): ID de la imagen a eliminar

**Ejemplo:**

```
DELETE /api/businesses/10/images/3
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Image deleted successfully"
}
```

---

## Validación de Datos

### Esquema de Validación para Business

```javascript
{
  name: string, max 200 caracteres, requerido
  description: string, requerido
  address: string, opcional
  phone: string, max 20 caracteres, opcional
  email: string email válido, max 100 caracteres, opcional
  website: string URI válida, max 200 caracteres, opcional
  category_id: número entero, opcional
  opening_hours: string, opcional
  latitude: número entre -90 y 90, opcional
  longitude: número entre -180 y 180, opcional
}
```

### Validaciones de Imágenes

- **Formatos permitidos:** JPG, JPEG, PNG
- **Tamaño máximo:** 5 MB por imagen
- **Cantidad máxima:** 10 imágenes por petición
- **Dimensiones:** Se redimensiona automáticamente a máximo 1200x800px
- **Optimización:** Cloudinary optimiza automáticamente la calidad

---

## Manejo de Errores

### Estructura de Respuesta de Error

```json
{
  "success": false,
  "message": "Descripción del error",
  "error": "Detalles técnicos (solo en desarrollo)"
}
```

### Códigos HTTP

| Código | Descripción           |
| :----- | :-------------------- |
| 200    | Solicitud exitosa     |
| 201    | Recurso creado        |
| 400    | Datos inválidos       |
| 404    | Recurso no encontrado |
| 409    | Conflicto (duplicado) |
| 500    | Error del servidor    |

---

## Variables de Entorno

### Archivo `.env`

```env
# Server
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://tu-frontend.com

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=dondeoficial
DB_USER=postgres
DB_PASSWORD=tu_password

# Cloudinary
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

### Obtener Credenciales de Cloudinary

1. Regístrate en [cloudinary.com](https://cloudinary.com)
2. Ve a tu Dashboard
3. Copia: Cloud Name, API Key, API Secret

---

## Testing y Desarrollo

### Probar con Postman

#### Crear negocio con imágenes:

1. Método: `POST`
2. URL: `http://localhost:5000/api/businesses`
3. Body: **form-data** (no JSON)
4. Campos:
   - `name`: "Mi Restaurante"
   - `description`: "Descripción..."
   - `category_id`: 1
   - `images`: Seleccionar tipo **File** y elegir múltiples imágenes

---

## Script SQL Completo

```sql
-- Database initialization script for DondeOficial MVP

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create businesses table
CREATE TABLE IF NOT EXISTS businesses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(100),
    website VARCHAR(200),
    category_id INTEGER REFERENCES categories(id),
    opening_hours TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_business_name UNIQUE (name),
    CONSTRAINT unique_business_email UNIQUE (email)
);

-- Create business_images table
CREATE TABLE IF NOT EXISTS business_images (
    id SERIAL PRIMARY KEY,
    business_id INTEGER NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    cloudinary_public_id TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(200) NOT NULL,
    email VARCHAR(100) NOT NULL,
    subject VARCHAR(200),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_lead_email_fullname UNIQUE (email, full_name)
);

-- Create newsletter_subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_businesses_category ON businesses(category_id);
CREATE INDEX IF NOT EXISTS idx_businesses_name ON businesses(name);
CREATE INDEX IF NOT EXISTS idx_businesses_location ON businesses(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_business_images_business_id ON business_images(business_id);

-- Insert sample data
INSERT INTO categories (name, description)
VALUES
    ('Restaurant', 'Popular restaurants in your area'),
    ('Museums', 'Museums and cultural attractions'),
    ('Game Field', 'Sports and gaming venues'),
    ('Job & Feed', 'Professional services and agencies'),
    ('Party Center', 'Event and party venues'),
    ('Fitness Zone', 'Gyms and fitness centers')
ON CONFLICT (name) DO NOTHING;
```

---

**Última actualización:** Noviembre 8, 2025
**Versión:** 2.0.0
**Cambios principales:**

- Añadida funcionalidad de carga de múltiples imágenes
- Integración con Cloudinary
- Nueva tabla `business_images`
- Endpoints para gestión de imágenes

---

Puedes copiar todo este contenido y guardarlo como un archivo `.md` (Markdown) en tu proyecto. Este documento incluye toda la información actualizada sobre tu API con la funcionalidad de carga de imágenes mediante Cloudinary.
<span style="display:none">[^1][^10][^2][^3][^4][^5][^6][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: https://translate.google.com/translate?u=https%3A%2F%2Fcloudinary.com%2Fdocumentation%2Fnode_integration\&hl=es\&sl=en\&tl=es\&client=srp
[^2]: https://translate.google.com/translate?u=https%3A%2F%2Fdev.to%2Fgrayman646%2Fupload-images-with-nodejs-and-express-to-the-cloud-using-cloudinary-26e4\&hl=es\&sl=en\&tl=es\&client=srp
[^3]: https://translate.google.com/translate?u=https%3A%2F%2Fmedium.com%2F%401nourahalmanea%2Fusing-cloudinary-for-image-storage-with-node-js-and-express-6db2df41fb7e\&hl=es\&sl=en\&tl=es\&client=srp
[^4]: https://translate.google.com/translate?u=https%3A%2F%2Fmasteringbackend.com%2Fposts%2Fhow-to-upload-images-and-videos-to-cloudinary-using-node-js\&hl=es\&sl=en\&tl=es\&client=srp
[^5]: https://docs.astro.build/es/guides/media/cloudinary/
[^6]: https://jhonachata.dev/subir-archivos-a-cloudinary-con-express-y-nodejs/
[^7]: https://www.youtube.com/watch?v=VWM-HYe0hmw
[^8]: https://www.youtube.com/watch?v=jP2DNQyOE90
[^9]: https://es.stackoverflow.com/questions/462702/intentar-subir-imagen-en-el-producto-con-cloudinary-y-nodejs
[^10]: https://translate.google.com/translate?u=https%3A%2F%2Fdevcenter.heroku.com%2Farticles%2Fcloudinary\&hl=es\&sl=en\&tl=es\&client=srp
