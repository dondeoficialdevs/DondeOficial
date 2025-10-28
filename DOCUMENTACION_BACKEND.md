# Documentación Técnica Backend - DondeOficial

## Requisitos del Sistema

### Tecnologías Requeridas
- Node.js versión 20 o superior
- Express.js 4.x como framework web
- PostgreSQL 15 o superior como base de datos relacional
- TypeScript 5.x para type safety
- jsonwebtoken para autenticación JWT
- bcrypt para hashing de contraseñas
- Joi o Zod para validación de esquemas
- Axios o node-fetch para integraciones externas
- CORS habilitado para comunicación con frontend

### Arquitectura Recomendada
```
backend/
├── src/
│   ├── controllers/    # Lógica de negocio
│   ├── routes/         # Definición de endpoints
│   ├── models/         # Modelos de base de datos
│   ├── middleware/     # Autenticación, validación, errores
│   ├── utils/          # Utilidades y helpers
│   ├── config/         # Configuración de DB, JWT, etc
│   └── types/          # Definiciones TypeScript
├── tests/              # Tests unitarios e integración
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

#### GET /api/businesses
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
      "name": "Restaurante El Buen Sabor",
      "description": "Comida mexicana auténtica en el corazón de la ciudad",
      "category_id": 3,
      "category_name": "Restaurant",
      "address": "Av. Principal 123, Ciudad",
      "phone": "+52 1234567890",
      "email": "contacto@elbuensabor.com",
      "website": "https://elbuensabor.com",
      "latitude": 19.4326,
      "longitude": -99.1332,
      "opening_hours": "Lun-Vie: 10AM-10PM\nSáb: 10AM-11PM\nDom: 12PM-8PM",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-20T14:45:00Z"
    }
  ],
  "count": 1
}
```

**Errores:**
- 500: Error del servidor

---

#### GET /api/businesses/:id
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
    "name": "Restaurante El Buen Sabor",
    "description": "Comida mexicana auténtica en el corazón de la ciudad. Contamos con servicio de comedor, terraza y entrega a domicilio.",
    "category_id": 3,
    "category_name": "Restaurant",
    "address": "Av. Principal 123, Ciudad, CP 12345",
    "phone": "+52 1234567890",
    "email": "contacto@elbuensabor.com",
    "website": "https://elbuensabor.com",
    "latitude": 19.4326,
    "longitude": -99.1332,
    "opening_hours": "Lun-Vie: 10AM-10PM\nSáb: 10AM-11PM\nDom: 12PM-8PM",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-20T14:45:00Z"
  }
}
```

**Errores:**
- 404: Negocio no encontrado
- 500: Error del servidor

---

#### POST /api/businesses
Crear un nuevo negocio.

**Headers:**
```
Content-Type: application/json
```

**Ejemplo de Request:**
```json
{
  "name": "Gym Fitness Pro",
  "description": "Gimnasio con equipos de última generación y entrenadores certificados. Áreas de cardio, pesas y clases grupales.",
  "category_id": 6,
  "address": "Av. Deportes 456",
  "phone": "+52 9876543210",
  "email": "info@gymfitnesspro.com",
  "website": "https://gymfitnesspro.com",
  "latitude": 19.4326,
  "longitude": -99.1332,
  "opening_hours": "Lun-Dom: 6AM-10PM"
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
    "id": 25,
    "name": "Gym Fitness Pro",
    "description": "Gimnasio con equipos de última generación y entrenadores certificados. Áreas de cardio, pesas y clases grupales.",
    "category_id": 6,
    "category_name": "Fitness Zone",
    "address": "Av. Deportes 456",
    "phone": "+52 9876543210",
    "email": "info@gymfitnesspro.com",
    "website": "https://gymfitnesspro.com",
    "latitude": 19.4326,
    "longitude": -99.1332,
    "opening_hours": "Lun-Dom: 6AM-10PM",
    "created_at": "2024-01-25T08:00:00Z",
    "updated_at": "2024-01-25T08:00:00Z"
  },
  "message": "Negocio creado exitosamente"
}
```

**Errores:**
- 400: Datos inválidos o faltantes
- 404: Categoría no encontrada
- 409: Negocio con email ya registrado
- 500: Error del servidor

---

#### PUT /api/businesses/:id
Actualizar un negocio existente. Solo los campos enviados serán actualizados.

**Headers:**
```
Content-Type: application/json
```

**Ejemplo de Request:**
```json
{
  "phone": "+52 9876543211",
  "opening_hours": "Lun-Dom: 5AM-11PM"
}
```

**Ejemplo de Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 25,
    "name": "Gym Fitness Pro",
    "description": "Gimnasio con equipos de última generación...",
    "category_id": 6,
    "category_name": "Fitness Zone",
    "address": "Av. Deportes 456",
    "phone": "+52 9876543211",
    "email": "info@gymfitnesspro.com",
    "website": "https://gymfitnesspro.com",
    "latitude": 19.4326,
    "longitude": -99.1332,
    "opening_hours": "Lun-Dom: 5AM-11PM",
    "created_at": "2024-01-25T08:00:00Z",
    "updated_at": "2024-01-25T10:30:00Z"
  },
  "message": "Negocio actualizado exitosamente"
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
  "data": null,
  "message": "Negocio eliminado correctamente"
}
```

**Errores:**
- 404: Negocio no encontrado
- 500: Error del servidor

---

### Endpoints de Categorías

#### GET /api/categories
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
      "description": "Restaurantes y establecimientos de comida",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    },
    {
      "id": 2,
      "name": "Museums",
      "description": "Museos y centros culturales",
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
      "id": 6,
      "name": "Fitness Zone",
      "description": "Gimnasios y centros de fitness",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

**Errores:**
- 500: Error del servidor

---

#### GET /api/categories/:id
Obtener una categoría específica.

**Ejemplo de Request:**
```
GET /api/categories/1
```

**Ejemplo de Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Restaurant",
    "description": "Restaurantes y establecimientos de comida",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
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
  "data": null,
  "message": "Mensaje descriptivo del error"
}
```

**Ejemplo de Error de Validación (400):**
```json
{
  "success": false,
  "data": null,
  "message": "Datos inválidos",
  "errors": {
    "name": "El nombre es requerido",
    "description": "La descripción debe tener al menos 20 caracteres",
    "email": "El email no es válido"
  }
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
// Permitir dominio de producción y desarrollo
const corsOptions = {
  origin: [
    'https://dondeoficial.com',
    'https://www.dondeoficial.com',
    'https://dondeoficial.netlify.app',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
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

