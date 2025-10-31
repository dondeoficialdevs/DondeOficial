# Documentación Técnica Backend - DondeOficial

## Tabla de Contenidos

- [Requisitos del Sistema](#requisitos-del-sistema)
- [Arquitectura del Proyecto](#arquitectura-del-proyecto)
- [Base de Datos](#base-de-datos)
- [Autenticación y Seguridad](#autenticación-y-seguridad)
- [Endpoints de la API](#endpoints-de-la-api)
- [Validación de Datos](#validación-de-datos)
- [Manejo de Errores](#manejo-de-errores)
- [Variables de Entorno](#variables-de-entorno)
- [Testing y Desarrollo](#testing-y-desarrollo)

---

## Requisitos del Sistema

### Tecnologías Implementadas

- **Node.js** versión 20 o superior
- **Express.js** 4.x como framework web
- **PostgreSQL** 15 o superior como base de datos relacional
- **JavaScript** (ES6+) - No TypeScript en esta versión
- **jsonwebtoken** para autenticación JWT
- **Joi** para validación de esquemas
- **pg** (node-postgres) para conexión a PostgreSQL
- **dotenv** para manejo de variables de entorno
- **CORS** habilitado para comunicación con frontend

### Dependencias del Proyecto

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.11.0",
    "jsonwebtoken": "^9.0.0",
    "joi": "^17.9.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3"
  }
}
```

---

## Arquitectura del Proyecto

### Estructura de Carpetas

```
backend/
├── config/
│   └── database.js         # Configuración del pool de PostgreSQL
├── middleware/
│   ├── auth.js             # Middleware de autenticación JWT
│   └── validation.js       # Middleware de validación con Joi
├── models/
│   ├── Business.js         # Modelo de negocios
│   ├── Category.js         # Modelo de categorías
│   ├── Lead.js             # Modelo de leads (formulario de contacto)
│   └── NewsletterSubscriber.js  # Modelo de suscriptores
├── routes/
│   ├── auth.js             # Rutas de autenticación
│   ├── businesses.js       # Rutas de negocios
│   ├── categories.js       # Rutas de categorías
│   ├── leads.js            # Rutas de leads
│   └── newsletter.js       # Rutas de newsletter
├── .env                    # Variables de entorno
├── .env.example            # Ejemplo de variables de entorno
├── server.js               # Punto de entrada de la aplicación
└── package.json
```

### Patrones de Diseño Utilizados

- **MVC (Model-View-Controller)**: Separación de lógica de negocio, rutas y modelos
- **Middleware Chain**: Para autenticación y validación
- **Repository Pattern**: Modelos con métodos estáticos para acceso a datos
- **Error Handling Middleware**: Manejo centralizado de errores

---

## Base de Datos

### Diagrama de Relaciones

```
┌─────────────────┐         ┌─────────────────┐
│   categories    │         │   businesses    │
├─────────────────┤         ├─────────────────┤
│ id (PK)         │◄───────│ category_id (FK)│
│ name (UNIQUE)   │         │ id (PK)         │
│ description     │         │ name (UNIQUE)   │
│ created_at      │         │ email (UNIQUE)  │
│ updated_at      │         │ description     │
└─────────────────┘         │ address         │
                            │ phone           │
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

**Restricciones:**

- `name` debe ser único
- `name` no puede ser nulo

**Datos iniciales:**

```sql
INSERT INTO categories (name, description) VALUES
('Restaurant', 'Popular restaurants in your area'),
('Museums', 'Museums and cultural attractions'),
('Game Field', 'Sports and gaming venues'),
('Job & Feed', 'Professional services and agencies'),
('Party Center', 'Event and party venues'),
('Fitness Zone', 'Gyms and fitness centers')
ON CONFLICT (name) DO NOTHING;
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

**Restricciones:**

- `name` debe ser único
- `email` debe ser único (si se proporciona)
- `category_id` debe existir en la tabla `categories`
- `name` y `description` no pueden ser nulos

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

**Restricciones:**

- La combinación de `email` + `full_name` debe ser única
- Todos los campos son obligatorios
- Longitud máxima: 200 caracteres para todos los campos

**Propósito:** Almacenar las consultas enviadas desde el formulario de contacto del sitio web.

---

### Tabla: `newsletter_subscribers`

```sql
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Restricciones:**

- `email` debe ser único
- No se permiten duplicados

**Propósito:** Almacenar los emails de usuarios suscritos al boletín de noticias.

---

## Autenticación y Seguridad

### Sistema de Autenticación JWT

#### Generación de Token

**Endpoint:** `POST /api/auth/login`

**Payload del Token:**

```javascript
{
  id: 1,
  email: "admin@dondeoficial.com",
  role: "admin"
}
```

**Configuración:**

- **Algoritmo:** HS256
- **Expiración:** 24 horas (configurable)
- **Secret:** Almacenado en variable de entorno `JWT_SECRET`

#### Uso del Token

Los endpoints protegidos requieren el header:

```
Authorization: Bearer <token>
```

#### Endpoints por Tipo de Acceso

| Tipo de Acceso | Métodos HTTP             | Descripción                          |
| -------------- | ------------------------ | ------------------------------------ |
| **Público**    | GET                      | Todos los endpoints GET son públicos |
| **Protegido**  | POST, PUT, PATCH, DELETE | Requieren autenticación JWT          |

### Validación de Datos con Joi

Todos los datos de entrada son validados antes de procesarse:

**Validaciones implementadas:**

- Formato de email válido
- Longitud máxima de campos
- Tipos de datos correctos
- Campos requeridos vs opcionales
- URLs válidas
- Coordenadas geográficas válidas

### Prevención de Duplicados

**Businesses:**

- No se permite duplicar `name`
- No se permite duplicar `email`
- Error 409 (Conflict) si ya existe

**Categories:**

- No se permite duplicar `name`
- Error 409 (Conflict) si ya existe

**Leads:**

- No se permite la misma combinación de `email` + `full_name`
- Error 409 (Conflict) si ya existe

**Newsletter Subscribers:**

- No se permite duplicar `email`
- Error 409 (Conflict) si ya existe

---

## Endpoints de la API

### Resumen de Endpoints

| Endpoint                          | Método | Público | Descripción               |
| --------------------------------- | ------ | ------- | ------------------------- |
| `/api/auth/login`                 | POST   | ✅      | Generar token JWT         |
| `/api/auth/verify`                | GET    | ❌      | Verificar token           |
| `/api/businesses`                 | GET    | ✅      | Listar negocios           |
| `/api/businesses/:id`             | GET    | ✅      | Ver negocio específico    |
| `/api/businesses`                 | POST   | ❌      | Crear negocio             |
| `/api/businesses/:id`             | PUT    | ❌      | Actualizar negocio        |
| `/api/businesses/:id`             | DELETE | ❌      | Eliminar negocio          |
| `/api/categories`                 | GET    | ✅      | Listar categorías         |
| `/api/categories/:id`             | GET    | ✅      | Ver categoría específica  |
| `/api/categories`                 | POST   | ❌      | Crear categoría           |
| `/api/leads`                      | POST   | ✅      | Crear lead (formulario)   |
| `/api/leads`                      | GET    | ❌      | Listar leads              |
| `/api/leads/:id`                  | GET    | ❌      | Ver lead específico       |
| `/api/newsletter/subscribe`       | POST   | ✅      | Suscribirse al newsletter |
| `/api/newsletter/subscribers`     | GET    | ❌      | Listar suscriptores       |
| `/api/newsletter/subscribers/:id` | DELETE | ❌      | Eliminar suscriptor       |

---

## Documentación Detallada de Endpoints

### 🔐 Autenticación

#### `POST /api/auth/login`

Genera un token JWT para acceder a endpoints protegidos.

**Request:**

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@dondeoficial.com",
  "password": "admin123"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "admin@dondeoficial.com",
      "role": "admin"
    }
  },
  "message": "Login successful"
}
```

**Errores:**

- `401 Unauthorized`: Credenciales inválidas
- `500 Internal Server Error`: Error del servidor

---

#### `GET /api/auth/verify`

Verifica si un token JWT es válido.

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "admin@dondeoficial.com",
    "role": "admin",
    "iat": 1698614400,
    "exp": 1698700800
  },
  "message": "Token is valid"
}
```

**Errores:**

- `401 Unauthorized`: Token no proporcionado
- `403 Forbidden`: Token inválido o expirado

---

### 🏢 Negocios (Businesses)

#### `GET /api/businesses`

Obtener lista de negocios con filtros opcionales.

**Query Parameters:**

- `search` (string, opcional): Búsqueda por nombre o descripción
- `category` (string, opcional): Filtro por nombre de categoría
- `location` (string, opcional): Búsqueda por dirección
- `limit` (number, opcional, default: 20): Resultados por página
- `offset` (number, opcional, default: 0): Número de registros a omitir

**Ejemplo:**

```http
GET /api/businesses?search=restaurant&category=Restaurant&limit=10&offset=0
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Food Corner",
      "description": "Popular restaurant in california serving delicious meals",
      "address": "California, USA",
      "phone": "+98 (265) 3652 - 05",
      "email": "info@foodcorner.com",
      "website": "https://foodcorner.com",
      "category_id": 1,
      "category_name": "Restaurant",
      "opening_hours": "Open",
      "latitude": null,
      "longitude": null,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ],
  "count": 1
}
```

**Errores:**

- `500 Internal Server Error`: Error del servidor

---

#### `GET /api/businesses/:id`

Obtener detalles de un negocio específico.

**Ejemplo:**

```http
GET /api/businesses/1
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Food Corner",
    "description": "Popular restaurant in california serving delicious meals and great ambiance",
    "address": "California, USA",
    "phone": "+98 (265) 3652 - 05",
    "email": "info@foodcorner.com",
    "website": "https://foodcorner.com",
    "category_id": 1,
    "category_name": "Restaurant",
    "opening_hours": "Open",
    "latitude": null,
    "longitude": null,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

**Errores:**

- `404 Not Found`: Negocio no encontrado
- `500 Internal Server Error`: Error del servidor

---

#### `POST /api/businesses` 🔒

Crear un nuevo negocio. **Requiere autenticación.**

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "Nuevo Restaurante",
  "description": "Un excelente restaurante con comida italiana auténtica y ambiente acogedor",
  "address": "Calle Principal 123",
  "phone": "+1 555 123 4567",
  "email": "contacto@nuevorestaurante.com",
  "website": "https://nuevorestaurante.com",
  "category_id": 1,
  "opening_hours": "Lunes a Viernes: 10AM-10PM",
  "latitude": 19.4326,
  "longitude": -99.1332
}
```

**Validaciones:**

- `name`: Requerido, máximo 200 caracteres
- `description`: Requerido
- `email`: Opcional, debe ser email válido, máximo 100 caracteres
- `website`: Opcional, debe ser URL válida (http/https)
- `phone`: Opcional, máximo 20 caracteres
- `category_id`: Opcional, debe existir en `categories`
- `latitude`: Opcional, entre -90 y 90
- `longitude`: Opcional, entre -180 y 180

**Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "id": 10,
    "name": "Nuevo Restaurante",
    "description": "Un excelente restaurante con comida italiana auténtica",
    "address": "Calle Principal 123",
    "phone": "+1 555 123 4567",
    "email": "contacto@nuevorestaurante.com",
    "website": "https://nuevorestaurante.com",
    "category_id": 1,
    "opening_hours": "Lunes a Viernes: 10AM-10PM",
    "latitude": 19.4326,
    "longitude": -99.1332,
    "created_at": "2024-01-25T08:00:00Z",
    "updated_at": "2024-01-25T08:00:00Z"
  },
  "message": "Business created successfully"
}
```

**Errores:**

- `400 Bad Request`: Datos de validación inválidos
- `401 Unauthorized`: Token no proporcionado o inválido
- `409 Conflict`: Negocio con ese nombre o email ya existe
- `500 Internal Server Error`: Error del servidor

---

#### `PUT /api/businesses/:id` 🔒

Actualizar un negocio existente. **Requiere autenticación.**

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body (actualización parcial):**

```json
{
  "phone": "+1 555 999 8888",
  "opening_hours": "Lunes a Domingo: 9AM-11PM"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Food Corner",
    "description": "Popular restaurant in california...",
    "phone": "+1 555 999 8888",
    "opening_hours": "Lunes a Domingo: 9AM-11PM",
    "updated_at": "2024-01-26T14:30:00Z"
  },
  "message": "Business updated successfully"
}
```

**Errores:**

- `400 Bad Request`: Datos inválidos
- `401 Unauthorized`: Token no proporcionado o inválido
- `404 Not Found`: Negocio no encontrado
- `409 Conflict`: Email o nombre duplicado
- `500 Internal Server Error`: Error del servidor

---

#### `DELETE /api/businesses/:id` 🔒

Eliminar un negocio. **Requiere autenticación.**

**Headers:**

```
Authorization: Bearer <token>
```

**Ejemplo:**

```http
DELETE /api/businesses/10
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Business deleted successfully"
}
```

**Errores:**

- `401 Unauthorized`: Token no proporcionado o inválido
- `404 Not Found`: Negocio no encontrado
- `500 Internal Server Error`: Error del servidor

---

### 📁 Categorías (Categories)

#### `GET /api/categories`

Obtener todas las categorías disponibles.

**Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Restaurant",
      "description": "Popular restaurants in your area",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    },
    {
      "id": 2,
      "name": "Museums",
      "description": "Museums and cultural attractions",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ],
  "count": 2
}
```

**Errores:**

- `500 Internal Server Error`: Error del servidor

---

#### `GET /api/categories/:id`

Obtener una categoría específica.

**Ejemplo:**

```http
GET /api/categories/1
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Restaurant",
    "description": "Popular restaurants in your area",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

**Errores:**

- `404 Not Found`: Categoría no encontrada
- `500 Internal Server Error`: Error del servidor

---

#### `POST /api/categories` 🔒

Crear una nueva categoría. **Requiere autenticación.**

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "Cafeterías",
  "description": "Cafeterías y coffee shops"
}
```

**Validaciones:**

- `name`: Requerido, máximo 100 caracteres, único
- `description`: Opcional

**Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "id": 7,
    "name": "Cafeterías",
    "description": "Cafeterías y coffee shops",
    "created_at": "2024-01-25T10:00:00Z",
    "updated_at": "2024-01-25T10:00:00Z"
  },
  "message": "Category created successfully"
}
```

**Errores:**

- `400 Bad Request`: Datos de validación inválidos
- `401 Unauthorized`: Token no proporcionado o inválido
- `409 Conflict`: Categoría con ese nombre ya existe
- `500 Internal Server Error`: Error del servidor

---

### 📝 Leads (Formulario de Contacto)

#### `POST /api/leads`

Crear un nuevo lead desde el formulario de contacto. **Endpoint público.**

**Request Body:**

```json
{
  "full_name": "Juan Pérez",
  "email": "juan.perez@email.com",
  "subject": "Consulta sobre servicios",
  "message": "Me gustaría obtener más información sobre sus servicios"
}
```

**Validaciones:**

- `full_name`: Requerido, máximo 200 caracteres
- `email`: Requerido, formato email válido, máximo 200 caracteres
- `subject`: Requerido, máximo 200 caracteres
- `message`: Requerido, máximo 200 caracteres
- No se permite duplicar la combinación `email` + `full_name`

**Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "full_name": "Juan Pérez",
    "email": "juan.perez@email.com",
    "subject": "Consulta sobre servicios",
    "message": "Me gustaría obtener más información sobre sus servicios",
    "created_at": "2024-01-25T15:30:00Z"
  },
  "message": "Lead created successfully"
}
```

**Errores:**

- `400 Bad Request`: Datos de validación inválidos
- `409 Conflict`: Lead con ese email y nombre ya existe
- `500 Internal Server Error`: Error del servidor

---

#### `GET /api/leads` 🔒

Listar todos los leads. **Requiere autenticación.**

**Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

- `limit` (number, opcional, default: 20): Resultados por página
- `offset` (number, opcional, default: 0): Registros a omitir

**Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "full_name": "Juan Pérez",
      "email": "juan.perez@email.com",
      "subject": "Consulta sobre servicios",
      "message": "Me gustaría obtener más información",
      "created_at": "2024-01-25T15:30:00Z"
    }
  ],
  "count": 1
}
```

**Errores:**

- `401 Unauthorized`: Token no proporcionado o inválido
- `500 Internal Server Error`: Error del servidor

---

#### `GET /api/leads/:id` 🔒

Obtener un lead específico. **Requiere autenticación.**

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "full_name": "Juan Pérez",
    "email": "juan.perez@email.com",
    "subject": "Consulta sobre servicios",
    "message": "Me gustaría obtener más información sobre sus servicios",
    "created_at": "2024-01-25T15:30:00Z"
  }
}
```

**Errores:**

- `401 Unauthorized`: Token no proporcionado o inválido
- `404 Not Found`: Lead no encontrado
- `500 Internal Server Error`: Error del servidor

---

### 📧 Newsletter

#### `POST /api/newsletter/subscribe`

Suscribirse al newsletter. **Endpoint público.**

**Request Body:**

```json
{
  "email": "nuevo.suscriptor@email.com"
}
```

**Validaciones:**

- `email`: Requerido, formato email válido, máximo 200 caracteres
- No se permiten emails duplicados

**Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "nuevo.suscriptor@email.com",
    "subscribed_at": "2024-01-25T16:00:00Z"
  },
  "message": "Successfully subscribed to newsletter"
}
```

**Errores:**

- `400 Bad Request`: Email inválido
- `409 Conflict`: Email ya está suscrito
- `500 Internal Server Error`: Error del servidor

---

#### `GET /api/newsletter/subscribers` 🔒

Listar todos los suscriptores. **Requiere autenticación.**

**Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

- `limit` (number, opcional, default: 20): Resultados por página
- `offset` (number, opcional, default: 0): Registros a omitir

**Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "email": "suscriptor@email.com",
      "subscribed_at": "2024-01-25T16:00:00Z"
    }
  ],
  "count": 1
}
```

**Errores:**

- `401 Unauthorized`: Token no proporcionado o inválido
- `500 Internal Server Error`: Error del servidor

---

#### `DELETE /api/newsletter/subscribers/:id` 🔒

Eliminar un suscriptor. **Requiere autenticación.**

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Subscriber deleted successfully"
}
```

**Errores:**

- `401 Unauthorized`: Token no proporcionado o inválido
- `404 Not Found`: Suscriptor no encontrado
- `500 Internal Server Error`: Error del servidor

---

## Validación de Datos

### Esquemas de Validación con Joi

#### Business Schema

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

#### Category Schema

```javascript
{
  name: string, max 100 caracteres, requerido
  description: string, opcional
}
```

#### Lead Schema

```javascript
{
  full_name: string, max 200 caracteres, requerido
  email: string email válido, max 200 caracteres, requerido
  subject: string, max 200 caracteres, requerido
  message: string, max 200 caracteres, requerido
}
```

#### Newsletter Schema

```javascript
{
  email: string email válido, max 200 caracteres, requerido
}
```

---

## Manejo de Errores

### Estructura de Respuesta de Error

```json
{
  "success": false,
  "message": "Descripción del error",
  "error": "Detalles técnicos del error (solo en desarrollo)"
}
```

### Ejemplo de Error de Validación (400)

```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Email must be a valid email address"
    },
    {
      "field": "full_name",
      "message": "Full name is required"
    }
  ]
}
```

### Códigos HTTP Utilizados

| Código | Descripción           | Uso                                  |
| ------ | --------------------- | ------------------------------------ |
| 200    | OK                    | Solicitud exitosa                    |
| 201    | Created               | Recurso creado exitosamente          |
| 400    | Bad Request           | Datos inválidos o validación fallida |
| 401    | Unauthorized          | Token no proporcionado               |
| 403    | Forbidden             | Token inválido o expirado            |
| 404    | Not Found             | Recurso no encontrado                |
| 409    | Conflict              | Recurso duplicado                    |
| 500    | Internal Server Error | Error del servidor                   |

---

## Variables de Entorno

### Archivo `.env`

```env
# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=dondeoficial
DB_USER=postgres
DB_PASSWORD=your_password_here

# JWT Configuration
JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRES_IN=24h
```

### Variables Requeridas

| Variable         | Descripción                    | Ejemplo                      |
| ---------------- | ------------------------------ | ---------------------------- |
| `PORT`           | Puerto del servidor            | `5000`                       |
| `NODE_ENV`       | Entorno de ejecución           | `development` o `production` |
| `FRONTEND_URL`   | URL del frontend para CORS     | `http://localhost:3000`      |
| `DB_HOST`        | Host de PostgreSQL             | `localhost`                  |
| `DB_PORT`        | Puerto de PostgreSQL           | `5432`                       |
| `DB_NAME`        | Nombre de la base de datos     | `postgres`                   |
| `DB_USER`        | Usuario de PostgreSQL          | `postgres`                   |
| `DB_PASSWORD`    | Contraseña de PostgreSQL       | `password123`                |
| `JWT_SECRET`     | Clave secreta para JWT         | `mi_clave_secreta`           |
| `JWT_EXPIRES_IN` | Tiempo de expiración del token | `24h`, `7d`, `30d`           |

---

## Testing y Desarrollo

### Credenciales de Desarrollo

Para probar endpoints protegidos en desarrollo:

```json
{
  "email": "admin@dondeoficial.com",
  "password": "admin123"
}
```

### Generar Token de Prueba

Ejecutar el script:

```bash
node utils/generateToken.js
```

### Probar con cURL

**Login:**

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@dondeoficial.com","password":"admin123"}'
```

**Crear negocio (protegido):**

```bash
curl -X POST http://localhost:5000/api/businesses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Test Business",
    "description": "Test description",
    "category_id": 1
  }'
```

### Configuración de CORS

```javascript
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? process.env.FRONTEND_URL
      : ["http://localhost:3000", "http://127.0.0.1:3000"],
  credentials: true,
};
```

---

## Inicialización del Proyecto

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Base de Datos

Ejecutar el script SQL de inicialización en PostgreSQL:

```bash
psql -U postgres -d dondeoficial -f database/init.sql
```

### 3. Configurar Variables de Entorno

Copiar `.env.example` a `.env` y configurar valores:

```bash
cp .env.example .env
```

### 4. Iniciar el Servidor

```bash
node server.js
```

O con nodemon para desarrollo:

```bash
npm install -g nodemon
nodemon server.js
```

### 5. Verificar que la API está funcionando

```bash
curl http://localhost:5000/api/health
```

Respuesta esperada:

```json
{
  "message": "API is running",
  "status": "OK"
}
```

---

## Mejores Prácticas Implementadas

### Seguridad

- ✅ Autenticación JWT para endpoints sensibles
- ✅ Validación de datos con Joi
- ✅ Prepared statements para prevenir SQL injection
- ✅ CORS configurado correctamente
- ✅ Variables de entorno para datos sensibles

### Base de Datos

- ✅ Índices en columnas de búsqueda
- ✅ Foreign keys con constraints
- ✅ Campos UNIQUE para prevenir duplicados
- ✅ Timestamps automáticos
- ✅ Connection pooling

### API Design

- ✅ RESTful endpoints
- ✅ Respuestas JSON consistentes
- ✅ Códigos HTTP apropiados
- ✅ Manejo de errores centralizado
- ✅ Paginación en listados

### Código

- ✅ Separación de responsabilidades (MVC)
- ✅ Middleware reutilizable
- ✅ Modelos con métodos estáticos
- ✅ Validación antes de procesamiento
- ✅ Logging de errores

---

## Próximos Pasos Recomendados

POR DEFINIR

---

## Soporte y Contacto

Para preguntas o problemas, contactar al equipo de desarrollo de DondeOficial.

**Repositorio:** [GitHub - DondeOficial](https://github.com/dondeoficialdevs/DondeOficial)

---

**Última actualización:** Octubre 31, 2025  
**Versión de la API:** 1.0.0
