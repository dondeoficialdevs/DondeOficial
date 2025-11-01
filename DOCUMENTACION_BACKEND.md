# Documentación Técnica Backend - DondeOficial

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

## Endpoints Requeridos

### Base de Datos

**Modelo: Business**

```typescript
interface Business {
  id: number;
  name: string;
  description: string;
  category_id?: number;
  category_name?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  latitude?: number;
  longitude?: number;
  opening_hours?: string;
  created_at: string;
  updated_at: string;
}
```

**Modelo: Category**

```typescript
interface Category {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}
```

### Endpoints de Negocios

#### `GET /api/businesses`

Obtener lista de negocios con filtros opcionales.

**Query Parameters:**

- `search` (string, opcional): Búsqueda por nombre o descripción
- `category` (string, opcional): Filtro por nombre de categoría
- `location` (string, opcional): Búsqueda por dirección
- `limit` (number, opcional, default: 20): Límite de resultados por página
- `offset` (number, opcional, default: 0): Número de registros a omitir (para paginación)

**Nota sobre paginación:**

- Si `limit=20` y `offset=0`: primera página (registros 1-20)
- Si `limit=20` y `offset=20`: segunda página (registros 21-40)
- Si `limit=20` y `offset=40`: tercera página (registros 41-60)

**Ejemplo de Request:**

```
GET /api/businesses?search=restaurante&limit=10&offset=0
```

**Ejemplo de Response (200 OK):**

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

- 500: Error del servidor

---

#### `GET /api/businesses/:id`

Obtener detalles de un negocio específico.

**Ejemplo de Request:**

```
GET /api/businesses/1
```

**Ejemplo de Response (200 OK):**

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

- 404: Negocio no encontrado
- 500: Error del servidor

---

#### `POST /api/businesses` 🔒

Crear un nuevo negocio. **Requiere autenticación.**

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Ejemplo de Request:**

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

**Validaciones Requeridas:**

- `name`: Requerido, string NO vacío (trim aplicado)
- `category_id`: Requerido, number, debe existir en tabla categories
- `description`: Requerido, string, mínimo 20 caracteres después de trim
- `address`: Opcional, string
- `phone`: Opcional, string
- `email`: Opcional, si se envía debe ser formato email válido (regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`)
- `website`: Opcional, si se envía debe comenzar con http:// o https:// (regex: `/^https?:\/\/.+/`)
- `latitude`: Opcional, number
- `longitude`: Opcional, number
- `opening_hours`: Opcional, string

**Ejemplo de Response (201 Created):**

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

- 400: Datos inválidos o faltantes
- 404: Categoría no encontrada
- 409: Negocio con email ya registrado
- 500: Error del servidor

---

#### `PUT /api/businesses/:id` 🔒

Actualizar un negocio existente. **Requiere autenticación.**

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Ejemplo de Request:**

```json
{
  "phone": "+1 555 999 8888",
  "opening_hours": "Lunes a Domingo: 9AM-11PM"
}
```

**Ejemplo de Response (200 OK):**

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

- 400: Datos inválidos
- 404: Negocio no encontrado
- 500: Error del servidor

---

#### DELETE /api/businesses/:id

Eliminar un negocio.

**Ejemplo de Response (200 OK):**

```json
{
  "success": true,
  "message": "Business deleted successfully"
}
```

**Errores:**

- 404: Negocio no encontrado
- 500: Error del servidor

---

### 📁 Categorías (Categories)

#### `GET /api/categories`

Obtener todas las categorías disponibles.

**Ejemplo de Request:**

```
GET /api/categories
```

**Ejemplo de Response (200 OK):**

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
    },
    {
      "id": 3,
      "name": "Hotels",
      "description": "Hoteles y alojamientos",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    },
    {
      "id": 4,
      "name": "Shopping",
      "description": "Tiendas y centros comerciales",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    },
    {
      "id": 5,
      "name": "Entertainment",
      "description": "Entretenimiento y recreación",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    },
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

- 500: Error del servidor

---

#### `GET /api/leads/:id` 🔒

**Ejemplo de Request:**

```
Authorization: Bearer <token>
```

**Ejemplo de Response (200 OK):**

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

- 404: Categoría no encontrada
- 500: Error del servidor

---

## Seguridad

### Validación de Datos

- Todos los inputs deben ser validados antes de procesarse
- Usar librería Joi o Zod para esquemas de validación
- Sanitizar strings para prevenir inyección SQL
- Validar tipos de datos (number vs string)

### Autenticación

- Implementar JWT para endpoints protegidos (editar/eliminar negocios)
- Tokens expiran en 24 horas
- Refresh token para renovación automática
- Passwords hasheados con bcrypt (cost: 10)

### Seguridad en Base de Datos

- Usar prepared statements para prevenir SQL injection
- Escapar caracteres especiales
- Limitar longitud de inputs
- Validar email y URL con expresiones regulares

### Headers de Seguridad

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
Content-Security-Policy: default-src 'self'
```

## Base de Datos - Estructura SQL

### Tabla: businesses

```sql
CREATE TABLE businesses (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  address VARCHAR(200),
  phone VARCHAR(20),
  email VARCHAR(100),
  website VARCHAR(255),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  opening_hours TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_businesses_category ON businesses(category_id);
CREATE INDEX idx_businesses_search ON businesses USING gin(to_tsvector('spanish', name || ' ' || description));
CREATE INDEX idx_businesses_location ON businesses(latitude, longitude);
```

### Tabla: categories

```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_categories_name ON categories(name);
```

### Datos Iniciales para Categories

```sql
INSERT INTO categories (name, description) VALUES
('Restaurant', 'Restaurantes y establecimientos de comida'),
('Museums', 'Museos y centros culturales'),
('Hotels', 'Hoteles y alojamientos'),
('Shopping', 'Tiendas y centros comerciales'),
('Entertainment', 'Entretenimiento y recreación'),
('Fitness Zone', 'Gimnasios y centros de fitness');
```

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

### Códigos HTTP Estándar

- 200: Solicitud exitosa
- 201: Recurso creado exitosamente
- 400: Solicitud inválida (datos faltantes o incorrectos)
- 401: No autorizado (JWT inválido o expirado)
- 403: Prohibido (sin permisos)
- 404: Recurso no encontrado
- 409: Conflicto (recurso duplicado)
- 422: Datos no procesables (validación)
- 500: Error interno del servidor
- 503: Servicio no disponible

## Configuración de CORS

```javascript
const corsOptions = {
  origin: [
    "https://dondeoficial.com",
    "https://www.dondeoficial.com",
    "https://dondeoficial.netlify.app",
    "http://localhost:3000",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
```

## Variables de Entorno Requeridas

```env
NODE_ENV=production
PORT=4000
DATABASE_URL=postgresql://user:password@localhost:5432/dondeoficial
JWT_SECRET=tu_secret_key_muy_segura_aqui
JWT_EXPIRATION=24h
CORS_ORIGIN=https://dondeoficial.com
```

## Performance y Optimización

### Caché

- Implementar caché en memoria (Redis) para búsquedas frecuentes
- Cache de categorías (nunca cambian)
- Cache de negocios verificados por 5 minutos

### Paginación

- Default: 20 resultados por página
- Máximo: 100 resultados por página
- Ordenar por relevancia en búsquedas

### Base de Datos

- Índices en columnas de búsqueda
- Índices en foreign keys
- Full-text search para name y description
- Connection pooling (mínimo 5 conexiones)

## Testing

### Cobertura Mínima

- 80% de cobertura en lógica de negocio
- Tests unitarios para controladores
- Tests de integración para endpoints
- Validación de errores y casos edge

### Casos de Prueba Críticos

1. Crear negocio con datos completos
2. Crear negocio con datos mínimos requeridos
3. Búsqueda por nombre
4. Búsqueda por categoría
5. Búsqueda por ubicación
6. Validación de email duplicado
7. Validación de coordenadas inválidas
8. Manejo de categoría inexistente
9. Actualización parcial de negocio
10. Eliminación de negocio

## Logging

### Niveles de Log

- ERROR: Errores críticos del sistema
- WARN: Advertencias y casos no esperados
- INFO: Operaciones importantes (crear, actualizar, eliminar)
- DEBUG: Información detallada para desarrollo

### Información a Loggear

- Timestamp de todas las peticiones
- Método HTTP y endpoint
- IP del cliente
- Tiempo de respuesta
- Errores con stack trace
- Operaciones de base de datos exitosas

## Notas Finales

- El backend debe ser RESTful
- Todas las respuestas en formato JSON
- Usar UTC para timestamps
- Implementar rate limiting (100 requests por minuto por IP)
- Documentación con Swagger/OpenAPI recomendada
- Versionar API: /api/v1/businesses para futuras versiones
- Backup diario de base de datos
- Monitoreo de salud: endpoint GET /api/health
