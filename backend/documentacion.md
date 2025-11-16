`DOCUMENTACION_API_BACKEND.md`

# Documentación Técnica Backend - DondeOficial

**Versión:** 3.0.0
**Última actualización:** Noviembre 15, 2025
**Estado:** Producción

---

## Tabla de Contenidos

- [Introducción](#introducci%C3%B3n)
- [Requisitos del Sistema](#requisitos-del-sistema)
- [Arquitectura del Proyecto](#arquitectura-del-proyecto)
- [Base de Datos](#base-de-datos)
- [Sistema de Autenticación](#sistema-de-autenticaci%C3%B3n)
- [Configuración de Cloudinary](#configuraci%C3%B3n-de-cloudinary)
- [Endpoints de la API](#endpoints-de-la-api)
- [Seguridad y Autorización](#seguridad-y-autorizaci%C3%B3n)
- [Validación de Datos](#validaci%C3%B3n-de-datos)
- [Manejo de Errores](#manejo-de-errores)
- [Variables de Entorno](#variables-de-entorno)
- [Instalación y Configuración](#instalaci%C3%B3n-y-configuraci%C3%B3n)
- [Testing y Desarrollo](#testing-y-desarrollo)

---

## Introducción

DondeOficial es una API REST para gestionar un directorio de negocios con soporte para múltiples imágenes, sistema de contacto (leads), suscripción a newsletter y autenticación JWT con refresh tokens.

### Características Principales

- ✅ CRUD completo de negocios con categorías
- ✅ Carga de múltiples imágenes por negocio en Cloudinary
- ✅ Sistema de leads (formulario de contacto)
- ✅ Newsletter con gestión de suscriptores
- ✅ Autenticación JWT con access y refresh tokens
- ✅ Endpoints públicos y protegidos
- ✅ Validación robusta con Joi
- ✅ Búsqueda, filtrado y paginación

---

## Requisitos del Sistema

### Tecnologías Implementadas

| Tecnología       | Versión | Propósito                        |
| :--------------- | :------ | :------------------------------- |
| **Node.js**      | 20+     | Runtime de JavaScript            |
| **Express.js**   | 4.x     | Framework web                    |
| **PostgreSQL**   | 15+     | Base de datos relacional         |
| **bcrypt**       | 5.x     | Hashing de contraseñas           |
| **jsonwebtoken** | 9.x     | Generación y verificación de JWT |
| **Joi**          | 17.x    | Validación de esquemas           |
| **Multer**       | 1.4.x   | Manejo de archivos multipart     |
| **Cloudinary**   | 1.x     | Almacenamiento de imágenes       |
| **pg**           | 8.x     | Cliente de PostgreSQL            |
| **cors**         | 2.x     | Cross-Origin Resource Sharing    |
| **dotenv**       | 16.x    | Variables de entorno             |

### Dependencias del Proyecto

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.11.0",
    "bcrypt": "^5.1.0",
    "jsonwebtoken": "^9.0.0",
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
│   ├── database.js         # Pool de conexiones PostgreSQL
│   └── cloudinary.js       # Configuración Cloudinary + Multer
├── middleware/
│   ├── auth.js             # Middleware de autenticación JWT
│   └── validation.js       # Middleware de validación Joi
├── models/
│   ├── Business.js         # Modelo de negocios
│   ├── BusinessImage.js    # Modelo de imágenes de negocios
│   ├── Category.js         # Modelo de categorías
│   ├── Lead.js             # Modelo de leads
│   ├── NewsletterSubscriber.js  # Modelo de suscriptores
│   └── User.js             # Modelo de usuarios y autenticación
├── routes/
│   ├── auth.js             # Rutas de autenticación (login, logout, refresh)
│   ├── businesses.js       # Rutas de negocios e imágenes
│   ├── categories.js       # Rutas de categorías
│   ├── leads.js            # Rutas de leads
│   └── newsletter.js       # Rutas de newsletter
├── .env                    # Variables de entorno (NO subir a Git)
├── .env.example            # Plantilla de variables de entorno
├── server.js               # Punto de entrada de la aplicación
├── package.json
└── README.md
```

### Patrones de Diseño

- **MVC (Model-View-Controller)**: Separación clara de responsabilidades
- **Middleware Chain**: Autenticación y validación modular
- **Repository Pattern**: Modelos con métodos estáticos
- **Error Handling Middleware**: Manejo centralizado de errores

---

## Base de Datos

### Diagrama de Relaciones (ERD)

```
┌─────────────────┐         ┌─────────────────┐         ┌──────────────────┐
│   categories    │         │   businesses    │         │ business_images  │
├─────────────────┤         ├─────────────────┤         ├──────────────────┤
│ id (PK)         │◄────────│ category_id (FK)│         │ id (PK)          │
│ name (UNIQUE)   │         │ id (PK)         │◄────────│ business_id (FK) │
│ description     │         │ name (UNIQUE)   │         │ image_url        │
│ created_at      │         │ email (UNIQUE)  │         │ cloudinary_id    │
│ updated_at      │         │ description     │         │ is_primary       │
└─────────────────┘         │ address         │         │ created_at       │
                            │ phone           │         └──────────────────┘
                            │ website         │
                            │ opening_hours   │         ┌──────────────────┐
                            │ latitude        │         │      users       │
                            │ longitude       │         ├──────────────────┤
                            │ created_at      │         │ id (PK)          │
                            │ updated_at      │         │ email (UNIQUE)   │
                            └─────────────────┘         │ password         │
                                                        │ full_name        │
┌──────────────────────────┐                            │ created_at       │
│         leads            │                            └──────────────────┘
├──────────────────────────┤                                    │
│ id (PK)                  │                                    │
│ full_name                │                                    ▼
│ email                    │                           ┌──────────────────┐
│ subject                  │                           │ refresh_tokens   │
│ message                  │                           ├──────────────────┤
│ created_at               │                           │ id (PK)          │
│ UNIQUE(email, full_name) │                           │ user_id (FK)     │
└──────────────────────────┘                           │ token (UNIQUE)   │
                                                        │ expires_at       │
┌──────────────────────────┐                           │ created_at       │
│  newsletter_subscribers  │                           └──────────────────┘
├──────────────────────────┤
│ id (PK)                  │
│ email (UNIQUE)           │
│ subscribed_at            │
└──────────────────────────┘
```

### Tablas de la Base de Datos

#### 1. `categories` - Categorías de Negocios

```sql
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Índices:**

- Primary key en `id`
- Unique constraint en `name`

---

#### 2. `businesses` - Negocios

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

**Restricciones:**

- `name` y `email` deben ser únicos
- `name` y `description` son obligatorios
- `category_id` debe existir en `categories`

---

#### 3. `business_images` - Imágenes de Negocios

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

**Descripción:**

- `business_id`: Relación con el negocio (ON DELETE CASCADE)
- `image_url`: URL completa de Cloudinary
- `cloudinary_public_id`: ID para eliminar de Cloudinary
- `is_primary`: Marca la imagen principal (primera subida)

---

#### 4. `leads` - Formulario de Contacto

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

**Restricciones:**

- Todos los campos son obligatorios
- Máximo 200 caracteres por campo
- No se permiten duplicados de `email` + `full_name`

---

#### 5. `newsletter_subscribers` - Suscriptores

```sql
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Restricciones:**

- `email` debe ser único
- Formato de email válido (validado en backend)

---

#### 6. `users` - Usuarios Autenticados ✨ NUEVA

```sql
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(200) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Descripción:**

- `password`: Hash bcrypt (nunca se almacena en texto plano)
- `email`: Único, usado para login
- `full_name`: Nombre completo del usuario

---

#### 7. `refresh_tokens` - Tokens de Actualización ✨ NUEVA

```sql
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token ON refresh_tokens(token);
```

**Descripción:**

- Almacena refresh tokens válidos
- Permite invalidar sesiones específicas
- Expiración de 7 días por defecto

---

## Sistema de Autenticación

### Arquitectura JWT

El sistema utiliza **dos tipos de tokens**:

1. **Access Token** (15 minutos de expiración)
   - Se envía en cada petición a endpoints protegidos
   - Contiene: `id`, `email`, `full_name`
   - Header: `Authorization: Bearer <access_token>`
2. **Refresh Token** (7 días de expiración)
   - Se almacena en `sessionStorage` del frontend
   - Se usa para obtener nuevos access tokens
   - Se almacena en la base de datos

### Flujo de Autenticación

```
┌─────────┐                 ┌─────────┐                 ┌──────────┐
│ Cliente │                 │   API   │                 │    BD    │
└────┬────┘                 └────┬────┘                 └────┬─────┘
     │                           │                           │
     │ POST /api/auth/login      │                           │
     ├──────────────────────────>│                           │
     │ {email, password}         │                           │
     │                           │ Verificar credenciales    │
     │                           ├──────────────────────────>│
     │                           │                           │
     │                           │<──────────────────────────┤
     │                           │ Usuario encontrado        │
     │                           │                           │
     │                           │ Generar tokens            │
     │                           │                           │
     │                           │ Guardar refresh token     │
     │                           ├──────────────────────────>│
     │                           │                           │
     │<──────────────────────────┤                           │
     │ {accessToken, refreshToken}                           │
     │                           │                           │
     │ Petición protegida        │                           │
     │ Authorization: Bearer AT  │                           │
     ├──────────────────────────>│                           │
     │                           │ Verificar access token    │
     │                           │                           │
     │<──────────────────────────┤                           │
     │ Respuesta exitosa         │                           │
     │                           │                           │
```

### Endpoints de Autenticación

#### 🔐 `POST /api/auth/login` - Iniciar Sesión

**Request:**

```json
{
  "email": "admin@dondeoficial.com",
  "password": "admin123*"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "admin@dondeoficial.com",
      "full_name": "Karen Zarate"
    }
  },
  "message": "Login successful"
}
```

**Errores:**

- `400`: Datos de validación inválidos
- `401`: Credenciales incorrectas
- `500`: Error del servidor

---

#### 🔄 `POST /api/auth/refresh` - Refrescar Access Token

**Request:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Token refreshed successfully"
}
```

**Errores:**

- `403`: Refresh token inválido o expirado
- `500`: Error del servidor

---

#### 🚪 `POST /api/auth/logout` - Cerrar Sesión

**Request:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

#### 🔑 `POST /api/auth/change-password` - Cambiar Contraseña (Protegido)

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request:**

```json
{
  "currentPassword": "admin123*",
  "newPassword": "newSecurePassword123"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Password changed successfully. Please login again."
}
```

**Nota:** Al cambiar la contraseña, se eliminan todos los refresh tokens del usuario (cierra todas las sesiones).

---

#### ✅ `GET /api/auth/verify` - Verificar Token (Protegido)

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "admin@dondeoficial.com",
    "full_name": "Karen zarate"
  },
  "message": "Token is valid"
}
```

---

## Configuración de Cloudinary

### ¿Qué es Cloudinary?

Cloudinary es un servicio CDN (Content Delivery Network) para almacenar, optimizar y entregar imágenes y videos.

**Ventajas:**

- ✅ 25 GB gratis de almacenamiento
- ✅ CDN global (entrega rápida)
- ✅ Optimización automática
- ✅ Transformaciones on-the-fly
- ✅ URLs directas para frontend

### Archivo de Configuración

**`config/cloudinary.js`:**

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
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Solo se permiten imágenes"), false);
    }
  },
});

module.exports = { cloudinary, upload };
```

**Características:**

- **Carpeta:** `dondeoficial/businesses`
- **Formatos:** JPG, JPEG, PNG
- **Tamaño máximo:** 5 MB por imagen
- **Optimización:** Calidad automática
- **Redimensionamiento:** Máximo 1200x800px

---

## Endpoints de la API

### Tabla Resumen

| Endpoint                                      | Método | Autenticación | Descripción         |
| :-------------------------------------------- | :----- | :------------ | :------------------ |
| **Autenticación**                             |        |               |                     |
| `/api/auth/login`                             | POST   | Público       | Iniciar sesión      |
| `/api/auth/refresh`                           | POST   | Público       | Refrescar token     |
| `/api/auth/logout`                            | POST   | Público       | Cerrar sesión       |
| `/api/auth/change-password`                   | POST   | 🔒 Protegido  | Cambiar contraseña  |
| `/api/auth/verify`                            | GET    | 🔒 Protegido  | Verificar token     |
| **Negocios**                                  |        |               |                     |
| `/api/businesses`                             | GET    | Público       | Listar negocios     |
| `/api/businesses/:id`                         | GET    | Público       | Ver negocio         |
| `/api/businesses`                             | POST   | Público       | Crear negocio       |
| `/api/businesses/:id`                         | PUT    | 🔒 Protegido  | Actualizar negocio  |
| `/api/businesses/:id`                         | DELETE | 🔒 Protegido  | Eliminar negocio    |
| `/api/businesses/:id/images`                  | POST   | Público       | Agregar imágenes    |
| `/api/businesses/:businessId/images/:imageId` | DELETE | 🔒 Protegido  | Eliminar imagen     |
| **Categorías**                                |        |               |                     |
| `/api/categories`                             | GET    | Público       | Listar categorías   |
| `/api/categories/:id`                         | GET    | Público       | Ver categoría       |
| `/api/categories`                             | POST   | Público       | Crear categoría     |
| **Leads**                                     |        |               |                     |
| `/api/leads`                                  | POST   | Público       | Crear lead          |
| `/api/leads`                                  | GET    | 🔒 Protegido  | Listar leads        |
| `/api/leads/:id`                              | GET    | 🔒 Protegido  | Ver lead            |
| **Newsletter**                                |        |               |                     |
| `/api/newsletter/subscribe`                   | POST   | Público       | Suscribirse         |
| `/api/newsletter/subscribers`                 | GET    | 🔒 Protegido  | Listar suscriptores |
| `/api/newsletter/subscribers/:id`             | DELETE | 🔒 Protegido  | Eliminar suscriptor |
| **Health Check**                              |        |               |                     |
| `/api/health`                                 | GET    | Público       | Estado del API      |

---

### Documentación Detallada de Endpoints

#### 🏢 Negocios

##### `GET /api/businesses` - Listar Negocios (Público)

Obtiene la lista de negocios con filtros, búsqueda y paginación.

**Query Parameters:**

| Parámetro  | Tipo   | Requerido        | Descripción                      | Ejemplo                |
| :--------- | :----- | :--------------- | :------------------------------- | :--------------------- |
| `search`   | string | No               | Búsqueda en nombre y descripción | `?search=restaurant`   |
| `category` | string | No               | Filtro por nombre de categoría   | `?category=Restaurant` |
| `location` | string | No               | Búsqueda por dirección           | `?location=California` |
| `limit`    | number | No (default: 20) | Resultados por página            | `?limit=10`            |
| `offset`   | number | No (default: 0)  | Registros a omitir               | `?offset=20`           |

**Ejemplo de Request:**

```
GET /api/businesses?search=food&category=Restaurant&limit=5&offset=0
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Food Corner",
      "description": "Popular restaurant serving delicious meals",
      "address": "California, USA",
      "phone": "+1 234 567 8900",
      "email": "info@foodcorner.com",
      "website": "https://foodcorner.com",
      "category_id": 1,
      "category_name": "Restaurant",
      "opening_hours": "9AM - 10PM",
      "latitude": 34.0522,
      "longitude": -118.2437,
      "created_at": "2025-01-15T10:30:00Z",
      "updated_at": "2025-01-15T10:30:00Z",
      "images": [
        {
          "id": 1,
          "image_url": "https://res.cloudinary.com/.../image1.jpg",
          "is_primary": true
        },
        {
          "id": 2,
          "image_url": "https://res.cloudinary.com/.../image2.jpg",
          "is_primary": false
        }
      ]
    }
  ],
  "count": 1
}
```

---

##### `POST /api/businesses` - Crear Negocio con Imágenes (Público)

Crea un nuevo negocio y sube múltiples imágenes en una sola petición.

**Content-Type:** `multipart/form-data`

**Campos del Formulario:**

| Campo           | Tipo   | Requerido | Validación            | Descripción           |
| :-------------- | :----- | :-------- | :-------------------- | :-------------------- |
| `name`          | text   | ✅        | Max 200 caracteres    | Nombre del negocio    |
| `description`   | text   | ✅        | -                     | Descripción completa  |
| `category_id`   | number | ❌        | Debe existir en BD    | ID de categoría       |
| `address`       | text   | ❌        | -                     | Dirección física      |
| `phone`         | text   | ❌        | Max 20 caracteres     | Teléfono              |
| `email`         | text   | ❌        | Email válido, max 100 | Email de contacto     |
| `website`       | text   | ❌        | URL válida, max 200   | Sitio web             |
| `opening_hours` | text   | ❌        | -                     | Horarios de atención  |
| `latitude`      | number | ❌        | -90 a 90              | Coordenada geográfica |
| `longitude`     | number | ❌        | -180 a 180            | Coordenada geográfica |
| `images`        | file[] | ❌        | JPG/PNG, max 5MB c/u  | Hasta 10 imágenes     |

**Ejemplo en Postman:**

1. Método: `POST`
2. URL: `http://localhost:5000/api/businesses`
3. Body: **form-data**
4. Agregar campos texto y archivos

**Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "id": 10,
    "name": "Nuevo Restaurante",
    "description": "Descripción del restaurante",
    "images": [
      {
        "id": 15,
        "image_url": "https://res.cloudinary.com/.../img1.jpg",
        "is_primary": true
      }
    ]
  },
  "message": "Business created successfully"
}
```

**Errores:**

- `400`: Validación fallida
- `409`: Nombre o email duplicado
- `500`: Error del servidor

---

##### `PUT /api/businesses/:id` - Actualizar Negocio (🔒 Protegido)

Actualiza los datos de un negocio existente. **Requiere autenticación JWT.**

**Headers:**

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "phone": "+1 555 999 8888",
  "opening_hours": "Lunes a Domingo: 8AM - 11PM"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Food Corner",
    "phone": "+1 555 999 8888",
    "opening_hours": "Lunes a Domingo: 8AM - 11PM",
    "updated_at": "2025-11-15T18:00:00Z"
  },
  "message": "Business updated successfully"
}
```

**Errores:**

- `401`: Token no proporcionado
- `403`: Token inválido o expirado
- `404`: Negocio no encontrado
- `409`: Email o nombre duplicado
- `500`: Error del servidor

---

##### `DELETE /api/businesses/:id` - Eliminar Negocio (🔒 Protegido)

Elimina un negocio y todas sus imágenes (de Cloudinary y BD). **Requiere autenticación JWT.**

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Business deleted successfully"
}
```

---

##### `DELETE /api/businesses/:businessId/images/:imageId` - Eliminar Imagen (🔒 Protegido)

Elimina una imagen específica de un negocio. **Requiere autenticación JWT.**

**Headers:**

```
Authorization: Bearer <access_token>
```

**Ejemplo:**

```
DELETE /api/businesses/10/images/15
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Image deleted successfully"
}
```

---

#### 📝 Leads (Formulario de Contacto)

##### `POST /api/leads` - Crear Lead (Público)

Crea un nuevo lead desde el formulario de contacto del sitio web.

**Request:**

```json
{
  "full_name": "Juan Pérez",
  "email": "juan.perez@email.com",
  "subject": "Consulta sobre servicios",
  "message": "Me gustaría obtener más información"
}
```

**Validaciones:**

- Todos los campos son obligatorios
- Máximo 200 caracteres por campo
- Email debe ser válido
- No se permite duplicar `email` + `full_name`

**Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "id": 5,
    "full_name": "Juan Pérez",
    "email": "juan.perez@email.com",
    "subject": "Consulta sobre servicios",
    "message": "Me gustaría obtener más información",
    "created_at": "2025-11-15T15:00:00Z"
  },
  "message": "Lead created successfully"
}
```

---

##### `GET /api/leads` - Listar Leads (🔒 Protegido)

Obtiene la lista de todos los leads. **Requiere autenticación JWT.**

**Headers:**

```
Authorization: Bearer <access_token>
```

**Query Parameters:**

- `limit` (default: 20)
- `offset` (default: 0)

**Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "full_name": "María García",
      "email": "maria@email.com",
      "subject": "Información",
      "message": "Necesito más detalles",
      "created_at": "2025-11-10T10:00:00Z"
    }
  ],
  "count": 1
}
```

---

#### 📧 Newsletter

##### `POST /api/newsletter/subscribe` - Suscribirse (Público)

Suscribe un email al newsletter.

**Request:**

```json
{
  "email": "nuevo@email.com"
}
```

**Validaciones:**

- Email requerido y válido
- No se permiten duplicados

**Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "id": 10,
    "email": "nuevo@email.com",
    "subscribed_at": "2025-11-15T16:00:00Z"
  },
  "message": "Successfully subscribed to newsletter"
}
```

---

##### `GET /api/newsletter/subscribers` - Listar Suscriptores (🔒 Protegido)

Obtiene la lista de suscriptores. **Requiere autenticación JWT.**

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "email": "suscriptor@email.com",
      "subscribed_at": "2025-11-10T12:00:00Z"
    }
  ],
  "count": 1
}
```

---

##### `DELETE /api/newsletter/subscribers/:id` - Eliminar Suscriptor (🔒 Protegido)

Elimina un suscriptor. **Requiere autenticación JWT.**

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Subscriber deleted successfully"
}
```

---

## Seguridad y Autorización

### Reglas de Acceso

| Tipo de Endpoint       | Autenticación | Descripción                                                        |
| :--------------------- | :------------ | :----------------------------------------------------------------- |
| **GET públicos**       | No            | Todos los GET excepto `/api/leads` y `/api/newsletter/subscribers` |
| **POST públicos**      | No            | Todos los POST excepto `/api/auth/change-password`                 |
| **PUT, PATCH, DELETE** | Sí (JWT)      | Todos requieren token válido                                       |
| **GET protegidos**     | Sí (JWT)      | Solo `/api/leads`, `/api/newsletter/subscribers`                   |

### Headers de Seguridad

```javascript
// CORS Configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
```

### Protección contra Ataques

- ✅ **SQL Injection**: Prepared statements con `pg`
- ✅ **XSS**: Validación y sanitización con Joi
- ✅ **CSRF**: Tokens JWT stateless
- ✅ **Brute Force**: Tokens con expiración corta
- ✅ **Password Security**: Bcrypt con salt rounds 10

---

## Validación de Datos

### Esquemas de Validación con Joi

#### Login Schema

```javascript
{
  email: string email válido, requerido
  password: string mínimo 6 caracteres, requerido
}
```

#### Business Schema

```javascript
{
  name: string max 200, requerido
  description: string, requerido
  address: string, opcional
  phone: string max 20, opcional
  email: string email válido max 100, opcional
  website: string URI válida max 200, opcional
  category_id: número entero, opcional
  opening_hours: string, opcional
  latitude: número -90 a 90, opcional
  longitude: número -180 a 180, opcional
}
```

#### Lead Schema

```javascript
{
  full_name: string max 200, requerido
  email: string email válido max 200, requerido
  subject: string max 200, requerido
  message: string max 200, requerido
}
```

#### Newsletter Schema

```javascript
{
  email: string email válido max 200, requerido
}
```

#### Change Password Schema

```javascript
{
  currentPassword: string, requerido
  newPassword: string mínimo 6 caracteres, requerido
}
```

---

## Manejo de Errores

### Estructura de Respuesta de Error

```json
{
  "success": false,
  "message": "Descripción del error",
  "error": "Detalles técnicos (solo en desarrollo)",
  "errors": [
    {
      "field": "email",
      "message": "Email must be a valid email address"
    }
  ]
}
```

### Códigos HTTP

| Código | Nombre                | Uso                           |
| :----- | :-------------------- | :---------------------------- |
| 200    | OK                    | Solicitud exitosa             |
| 201    | Created               | Recurso creado exitosamente   |
| 400    | Bad Request           | Datos de validación inválidos |
| 401    | Unauthorized          | Token no proporcionado        |
| 403    | Forbidden             | Token inválido o expirado     |
| 404    | Not Found             | Recurso no encontrado         |
| 409    | Conflict              | Recurso duplicado             |
| 500    | Internal Server Error | Error del servidor            |

---

## Variables de Entorno

### Archivo `.env` (Ejemplo Completo)

```env
# =================================
# SERVER CONFIGURATION
# =================================
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# =================================
# DATABASE CONFIGURATION
# =================================
DB_HOST=localhost
DB_PORT=5432
DB_NAME=dondeoficial
DB_USER=postgres
DB_PASSWORD=your_secure_password_here

# =================================
# JWT CONFIGURATION
# =================================
JWT_SECRET=356d746ba35a68bbd5fd2274b87cc679c9203bbc7155aef3c31de0aaa55d686cc4722b2aca063877915da68601229a5328a4e684ce59c15bc20c7b8306a4b7c8
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# =================================
# CLOUDINARY CONFIGURATION
# =================================
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Variables Requeridas

| Variable                | Descripción                   | Ejemplo                            |
| :---------------------- | :---------------------------- | :--------------------------------- |
| `PORT`                  | Puerto del servidor           | `5000`                             |
| `NODE_ENV`              | Entorno de ejecución          | `development` / `production`       |
| `FRONTEND_URL`          | URL del frontend (CORS)       | `http://localhost:3000`            |
| `DB_HOST`               | Host de PostgreSQL            | `localhost`                        |
| `DB_PORT`               | Puerto de PostgreSQL          | `5432`                             |
| `DB_NAME`               | Nombre de la base de datos    | `dondeoficial`                     |
| `DB_USER`               | Usuario de PostgreSQL         | `postgres`                         |
| `DB_PASSWORD`           | Contraseña de PostgreSQL      | `tu_password`                      |
| `JWT_SECRET`            | Clave secreta para JWT        | Cadena aleatoria de 64+ caracteres |
| `CLOUDINARY_CLOUD_NAME` | Nombre de cloud en Cloudinary | De tu dashboard                    |
| `CLOUDINARY_API_KEY`    | API key de Cloudinary         | De tu dashboard                    |
| `CLOUDINARY_API_SECRET` | API secret de Cloudinary      | De tu dashboard                    |

---

## Instalación y Configuración

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/dondeoficial-backend.git
cd dondeoficial-backend
```

### Paso 2: Instalar Dependencias

```bash
npm install
```

### Paso 3: Configurar Variables de Entorno

```bash
cp .env.example .env
# Editar .env con tus credenciales
```

### Paso 4: Crear Base de Datos

```bash
# Conectarse a PostgreSQL
psql -U postgres

# Crear base de datos
CREATE DATABASE dondeoficial;

# Salir
\q
```

### Paso 5: Ejecutar Script SQL

```bash
psql -U postgres -d dondeoficial -f database/init.sql
```

### Paso 6: Generar Hash del Usuario Admin

```bash
node scripts/generateHash.js
# Copiar el hash generado
# Actualizar el script SQL con el hash
```

### Paso 7: Iniciar el Servidor

```bash
# Desarrollo
npm run dev

# Producción
npm start
```

### Paso 8: Verificar que Funciona

```bash
curl http://localhost:5000/api/health
```

Deberías ver:

```json
{
  "message": "API is running",
  "status": "OK"
}
```

---

## Testing y Desarrollo

### Probar con Postman

#### 1. Login y Obtener Token

```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@dondeoficial.com",
  "password": "admin123*"
}
```

Copiar el `accessToken` de la respuesta.

#### 2. Usar Token en Endpoints Protegidos

```
GET http://localhost:5000/api/leads
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### 3. Crear Negocio con Imágenes

```
POST http://localhost:5000/api/businesses
Content-Type: multipart/form-data

Form Data:
- name: "Mi Restaurante"
- description: "Descripción completa"
- category_id: 1
- images: [seleccionar archivos]
```

### Integración con React (Frontend)

```javascript
// services/auth.js
const API_URL = "http://localhost:5000/api";

export const login = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (data.success) {
    sessionStorage.setItem("accessToken", data.data.accessToken);
    sessionStorage.setItem("refreshToken", data.data.refreshToken);
    sessionStorage.setItem("user", JSON.stringify(data.data.user));
  }

  return data;
};

export const fetchWithAuth = async (url, options = {}) => {
  const token = sessionStorage.getItem("accessToken");

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  return fetch(url, { ...options, headers });
};
```

---

## Changelog

### Versión 3.0.0 (Noviembre 15, 2025)

**Nuevas Funcionalidades:**

- ✅ Sistema completo de autenticación JWT
- ✅ Access tokens (15 min) y refresh tokens (7 días)
- ✅ Tabla `users` para autenticación
- ✅ Tabla `refresh_tokens` para gestión de sesiones
- ✅ Endpoint para cambiar contraseña
- ✅ Endpoint para cerrar sesión (invalidar refresh token)
- ✅ Protección de endpoints sensibles con JWT
- ✅ Middleware de autenticación reutilizable

**Endpoints Protegidos:**

- PUT/DELETE de businesses
- DELETE de imágenes
- GET de leads
- GET/DELETE de newsletter subscribers
- POST change-password
- GET verify

**Mejoras de Seguridad:**

- ✅ Passwords hasheados con bcrypt (salt rounds 10)
- ✅ Tokens con expiración
- ✅ Invalidación de tokens al cambiar contraseña
- ✅ Refresh tokens almacenados en BD

### Versión 2.0.0 (Noviembre 8, 2025)

**Nuevas Funcionalidades:**

- ✅ Carga de múltiples imágenes con Cloudinary
- ✅ Tabla `business_images`
- ✅ Endpoints para gestión de imágenes
- ✅ Validación de formatos y tamaños
- ✅ Optimización automática de imágenes

### Versión 1.0.0 (Inicial)

**Funcionalidades Base:**

- ✅ CRUD de businesses
- ✅ CRUD de categories
- ✅ Sistema de leads
- ✅ Newsletter
- ✅ Búsqueda y filtrado
- ✅ Paginación

---

## Soporte y Contacto

**Repositorio:** [GitHub - DondeOficial](https://github.com/dondeoficialdevs/DondeOficial)

**Equipo de Desarrollo:**

- Backend Lead: [Eixon De La Torres]

**Stack Tecnológico:**

- Backend: Node.js + Express + PostgreSQL
- Frontend: React + Tailwind CSS
- Cloud: Render (Backend) + Netlify (Frontend)
- Storage: Cloudinary

---

**© 2025 DondeOficial - Todos los derechos reservados**
