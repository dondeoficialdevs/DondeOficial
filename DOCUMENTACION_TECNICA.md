# Documentación Técnica - DirectorioComercial

Documentación técnica detallada para desarrolladores sobre la implementación, estructura y funcionamiento del sistema.

## Tabla de Contenidos

1. [Arquitectura del Backend](#arquitectura-del-backend)
2. [Arquitectura del Frontend](#arquitectura-del-frontend)
3. [Esquema de Base de Datos](#esquema-de-base-de-datos)
4. [Sistema de Autenticación](#sistema-de-autenticación)
5. [API REST - Documentación de Endpoints](#api-rest---documentación-de-endpoints)
6. [Gestión de Imágenes con Cloudinary](#gestión-de-imágenes-con-cloudinary)
7. [Progressive Web App (PWA)](#progressive-web-app-pwa)
8. [Variables de Entorno](#variables-de-entorno)
9. [Seguridad](#seguridad)
10. [Flujos de Datos](#flujos-de-datos)
11. [Guía de Escalabilidad](#guía-de-escalabilidad)

## Arquitectura del Backend

### Estructura de Directorios

```
backend/
├── config/
│   ├── database.js          # Pool de conexiones PostgreSQL con SSL
│   └── cloudinary.js        # Configuración Cloudinary y Multer
├── database/
│   └── init.sql             # Script de inicialización completo
├── middleware/
│   ├── auth.js              # Middleware JWT authentication
│   └── validation.js        # Validación con esquemas Joi
├── models/
│   ├── Business.js          # Modelo de negocios con relaciones
│   ├── BusinessImage.js     # Modelo de imágenes
│   ├── Category.js          # Modelo de categorías
│   ├── Lead.js              # Modelo de leads
│   ├── NewsletterSubscriber.js
│   ├── Review.js            # Modelo de reseñas
│   └── User.js              # Modelo de usuarios y refresh tokens
├── routes/
│   ├── auth.js              # Rutas de autenticación
│   ├── businesses.js        # CRUD de negocios
│   ├── categories.js        # Gestión de categorías
│   ├── leads.js             # Formulario de contacto
│   ├── newsletter.js        # Newsletter
│   └── reviews.js           # Reseñas
├── utils/
│   └── generateToken.js     # Utilidades de tokens
└── server.js                # Punto de entrada Express
```

### Configuración del Servidor

**Archivo**: `backend/server.js`

- **Puerto**: Configurado mediante `process.env.PORT` (default: 5000)
- **CORS**: Configuración flexible según entorno (desarrollo/producción)
- **Middleware**: `express.json()` para parsing de JSON
- **Escucha**: `0.0.0.0` (necesario para Render en producción)
- **Health Check**: Endpoint `/api/health` para verificación de estado

### Pool de Conexiones PostgreSQL

**Archivo**: `backend/config/database.js`

```javascript
// Configuración del pool
- Máximo 20 conexiones simultáneas
- Timeout de conexión: 10 segundos
- Idle timeout: 30 segundos
- SSL habilitado automáticamente en producción o para Render
```

### Modelos de Datos

#### Business Model

**Archivo**: `backend/models/Business.js`

**Métodos principales**:
- `findAll(params)` - Lista negocios con filtros (search, category, location, status)
- `findById(id)` - Obtiene negocio por ID con imágenes y reseñas
- `create(businessData)` - Crea nuevo negocio
- `update(id, businessData)` - Actualiza negocio existente
- `delete(id)` - Elimina negocio (CASCADE a imágenes y reseñas)

**Relaciones**:
- Pertenece a una Category (opcional)
- Tiene múltiples BusinessImage
- Tiene múltiples Review
- Calcula promedio de calificaciones dinámicamente

#### User Model

**Archivo**: `backend/models/User.js`

**Métodos principales**:
- `findByEmail(email)` - Busca usuario por email
- `create(userData)` - Crea nuevo usuario (hash de password automático)
- `verifyPassword(plain, hash)` - Verifica contraseña con bcrypt
- `saveRefreshToken(userId, token, expiresAt)` - Guarda refresh token
- `findRefreshToken(token)` - Busca refresh token
- `deleteRefreshToken(token)` - Elimina refresh token
- `deleteAllRefreshTokens(userId)` - Elimina todos los tokens del usuario
- `changePassword(userId, newPassword)` - Cambia contraseña

## Arquitectura del Frontend

### Estructura de Directorios

```
frontend/src/
├── app/                      # App Router (Next.js 15)
│   ├── layout.tsx            # Layout raíz
│   ├── page.tsx              # Página de inicio
│   ├── admin/                # Panel de administración
│   │   ├── layout.tsx        # Layout protegido con auth
│   │   ├── login/            # Login admin
│   │   ├── businesses/       # Gestión de negocios
│   │   ├── categories/       # Gestión de categorías
│   │   ├── leads/            # Gestión de leads
│   │   ├── newsletter/       # Suscriptores
│   │   └── verification/     # Verificación de negocios
│   ├── businesses/[id]/      # Detalle de negocio
│   ├── add-listing/          # Agregar negocio público
│   ├── listings/             # Listado completo
│   ├── category/[name]/      # Negocios por categoría
│   ├── contact/              # Formulario de contacto
│   └── favorites/            # Favoritos del usuario
├── components/               # Componentes React reutilizables
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── BusinessList.tsx
│   ├── BusinessDetailModal.tsx
│   ├── ReviewsSection.tsx
│   ├── PWAInstaller.tsx
│   └── ...
├── hooks/                    # Custom React Hooks
│   ├── useFavorites.ts       # Hook para favoritos
│   └── useServiceWorkerUpdate.ts
├── lib/
│   └── api.ts                # Cliente API con Axios
└── types/
    └── index.ts              # Tipos TypeScript
```

### App Router de Next.js

Next.js 15 utiliza App Router con las siguientes características:

- **Server Components por defecto**: Mejor rendimiento y SEO
- **Client Components**: Marcados con `'use client'` para interactividad
- **Rutas dinámicas**: `[id]` y `[name]` para páginas dinámicas
- **Layouts anidados**: Para compartir UI entre rutas

### Cliente API

**Archivo**: `frontend/src/lib/api.ts`

**Características**:
- Interceptores de Axios para manejo automático de tokens
- Refresh token automático en caso de expiración
- Manejo centralizado de errores
- TypeScript para type safety

**APIs disponibles**:
- `businessApi` - CRUD de negocios
- `categoryApi` - Gestión de categorías
- `reviewApi` - Reseñas y calificaciones
- `leadsApi` - Formulario de contacto
- `newsletterApi` - Newsletter
- `authApi` - Autenticación

## Esquema de Base de Datos

### Tablas Principales

#### users
```sql
id SERIAL PRIMARY KEY
email VARCHAR(100) UNIQUE NOT NULL
password VARCHAR(255) NOT NULL  -- Hash bcrypt
full_name VARCHAR(200) NOT NULL
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

#### refresh_tokens
```sql
id SERIAL PRIMARY KEY
user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
token TEXT UNIQUE NOT NULL
expires_at TIMESTAMP NOT NULL
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

-- Índices
idx_refresh_tokens_user_id ON user_id
idx_refresh_tokens_token ON token
```

#### categories
```sql
id SERIAL PRIMARY KEY
name VARCHAR(100) UNIQUE NOT NULL
description TEXT
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

#### businesses
```sql
id SERIAL PRIMARY KEY
name VARCHAR(200) UNIQUE NOT NULL
description TEXT NOT NULL
address TEXT
phone VARCHAR(20)
email VARCHAR(100) UNIQUE
website VARCHAR(200)
category_id INTEGER REFERENCES categories(id)
opening_hours TEXT
latitude DECIMAL(10, 8)
longitude DECIMAL(11, 8)
status VARCHAR(20) DEFAULT 'pending'  -- pending, approved, rejected
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

-- Índices
idx_businesses_category ON category_id
idx_businesses_name ON name
idx_businesses_location ON (latitude, longitude)
```

#### business_images
```sql
id SERIAL PRIMARY KEY
business_id INTEGER REFERENCES businesses(id) ON DELETE CASCADE
image_url TEXT NOT NULL
cloudinary_public_id TEXT NOT NULL
is_primary BOOLEAN DEFAULT FALSE
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

-- Índices
idx_business_images_business_id ON business_id
```

#### reviews
```sql
id SERIAL PRIMARY KEY
business_id INTEGER REFERENCES businesses(id) ON DELETE CASCADE
rating INTEGER CHECK (rating >= 1 AND rating <= 5)
comment TEXT
user_name VARCHAR(200)
user_email VARCHAR(100)
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

-- Índices
idx_reviews_business_id ON business_id
idx_reviews_created_at ON created_at DESC
```

#### leads
```sql
id SERIAL PRIMARY KEY
full_name VARCHAR(200) NOT NULL
email VARCHAR(100) NOT NULL
subject VARCHAR(200)
message TEXT
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

-- Constraint
UNIQUE(email, full_name)
```

#### newsletter_subscribers
```sql
id SERIAL PRIMARY KEY
email VARCHAR(100) UNIQUE NOT NULL
subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

### Relaciones entre Tablas

```
users (1) ────< (N) refresh_tokens
categories (1) ────< (N) businesses
businesses (1) ────< (N) business_images
businesses (1) ────< (N) reviews
```

## Sistema de Autenticación

### Arquitectura JWT

El sistema utiliza **dos tipos de tokens**:

1. **Access Token**
   - Duración: 15 minutos
   - Contenido: `id`, `email`, `full_name`
   - Uso: En cada petición a endpoints protegidos
   - Header: `Authorization: Bearer <access_token>`

2. **Refresh Token**
   - Duración: 7 días
   - Almacenado: Base de datos + sessionStorage (frontend)
   - Uso: Para obtener nuevos access tokens cuando expira

### Flujo de Autenticación

```
1. Usuario envía credenciales → POST /api/auth/login
2. Backend verifica credenciales
3. Backend genera access token (15 min) y refresh token (7 días)
4. Backend guarda refresh token en BD
5. Frontend almacena ambos tokens en sessionStorage
6. En cada petición: Frontend envía access token en header Authorization
7. Si access token expira:
   - Frontend detecta error 401
   - Frontend envía refresh token → POST /api/auth/refresh
   - Backend verifica refresh token y genera nuevo access token
   - Frontend actualiza access token y reintenta petición original
```

### Middleware de Autenticación

**Archivo**: `backend/middleware/auth.js`

```javascript
authenticateToken(req, res, next)
// Verifica token JWT del header Authorization
// Extrae información del usuario y la adjunta a req.user
// Retorna 401 si no hay token, 403 si token inválido
```

### Rutas Protegidas

Rutas que requieren autenticación:
- `PUT /api/businesses/:id` - Actualizar negocio
- `DELETE /api/businesses/:id` - Eliminar negocio
- `POST /api/categories` - Crear categoría
- `GET /api/auth/verify` - Verificar token
- `POST /api/auth/change-password` - Cambiar contraseña
- Todas las rutas de administración en el frontend

## API REST - Documentación de Endpoints

### Formato de Respuesta Estándar

**Éxito**:
```json
{
  "success": true,
  "data": { ... },
  "message": "Operación exitosa",
  "count": 10  // Opcional, para listas
}
```

**Error**:
```json
{
  "success": false,
  "message": "Mensaje de error descriptivo",
  "error": "Detalles técnicos del error"
}
```

### Endpoints de Negocios

#### GET /api/businesses

Lista negocios con filtros opcionales.

**Query Parameters**:
- `search` (string): Búsqueda por nombre o descripción
- `category` (string): Filtrar por nombre de categoría
- `location` (string): Filtrar por dirección
- `limit` (number): Límite de resultados (default: 20)
- `offset` (number): Offset para paginación

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Asadero Moscovita",
      "description": "...",
      "category_name": "Restaurante",
      "images": [...],
      "total_reviews": 5,
      "average_rating": 4.5
    }
  ],
  "count": 1
}
```

#### GET /api/businesses/:id

Obtiene un negocio por ID.

#### POST /api/businesses

Crea un nuevo negocio (público, requiere verificación).

**Body** (multipart/form-data):
- Campos del negocio (name, description, etc.)
- `images` (File[]): Archivos de imagen

#### PUT /api/businesses/:id

Actualiza un negocio existente (requiere autenticación).

#### DELETE /api/businesses/:id

Elimina un negocio (requiere autenticación).

### Endpoints de Autenticación

#### POST /api/auth/login

Inicia sesión.

**Body**:
```json
{
  "email": "admin@dondeoficial.com",
  "password": "password"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "accessToken": "...",
    "refreshToken": "...",
    "user": {
      "id": 1,
      "email": "admin@dondeoficial.com",
      "full_name": "Karen Zarate"
    }
  }
}
```

#### POST /api/auth/refresh

Refresca el access token.

**Body**:
```json
{
  "refreshToken": "..."
}
```

#### POST /api/auth/logout

Cierra sesión (invalida refresh token).

#### GET /api/auth/verify

Verifica si el token actual es válido (requiere autenticación).

## Gestión de Imágenes con Cloudinary

### Configuración

**Archivo**: `backend/config/cloudinary.js`

- **Carpeta**: `dondeoficial/businesses/`
- **Formatos permitidos**: JPG, JPEG, PNG
- **Tamaño máximo**: 5 MB por imagen
- **Transformaciones automáticas**:
  - Ancho máximo: 1200px
  - Alto máximo: 800px
  - Crop: limit (mantiene aspecto)
  - Quality: auto

### Flujo de Subida

```
1. Frontend envía FormData con imágenes → POST /api/businesses/:id/images
2. Multer procesa archivos con CloudinaryStorage
3. Cloudinary sube imágenes y retorna URLs
4. Backend guarda URLs y public_ids en tabla business_images
5. Frontend recibe URLs y las muestra
```

### Estructura en Base de Datos

Cada imagen se almacena con:
- `image_url`: URL completa de Cloudinary
- `cloudinary_public_id`: ID para eliminación
- `is_primary`: Indica si es imagen principal

## Progressive Web App (PWA)

### Configuración

**Service Worker**: `frontend/public/sw.js`
- Cacheo de recursos estáticos
- Funcionalidad offline básica
- Actualización automática

**Manifest**: `frontend/public/manifest.json`
- Nombre de la aplicación
- Iconos (192x192, 512x512)
- Tema y colores
- Display mode: standalone

### Componente PWAInstaller

Detecta plataforma y muestra:
- Botón de instalación nativo (Android/Chrome)
- Instrucciones manuales (iOS)

## Variables de Entorno

### Backend (.env)

```env
# Servidor
PORT=5000
NODE_ENV=development

# Base de Datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=dondeoficial
DB_USER=postgres
DB_PASSWORD=password

# JWT
JWT_SECRET=tu_secret_jwt_muy_seguro_minimo_32_caracteres

# Cloudinary
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Frontend URL (para CORS)
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Importante**: Variables que comienzan con `NEXT_PUBLIC_` son expuestas al cliente.

## Seguridad

### Implementaciones de Seguridad

1. **Autenticación JWT**
   - Tokens firmados con secret seguro
   - Expiración corta para access tokens
   - Refresh tokens almacenados en BD para invalidación

2. **Hash de Contraseñas**
   - bcrypt con salt rounds (12 por defecto)
   - Nunca se almacenan en texto plano

3. **Validación de Inputs**
   - Joi schemas en backend
   - TypeScript types en frontend
   - Prevención de SQL injection mediante parámetros preparados

4. **CORS**
   - Configurado para permitir solo frontend autorizado
   - Credentials habilitados para cookies/tokens

5. **HTTPS**
   - Requerido en producción
   - SSL habilitado para PostgreSQL en producción

6. **Rate Limiting**
   - Implementar en producción (no incluido actualmente)

7. **Sanitización**
   - Validación de tipos de archivo para imágenes
   - Límites de tamaño de archivos

## Flujos de Datos

### Flujo de Búsqueda de Negocios

```
Usuario escribe búsqueda
  ↓
Frontend: businessApi.getAll({ search, category })
  ↓
Axios: GET /api/businesses?search=...
  ↓
Backend: routes/businesses.js → Business.findAll(params)
  ↓
Modelo: Query SQL con filtros ILIKE
  ↓
PostgreSQL: Retorna resultados
  ↓
Backend: Formatea respuesta JSON
  ↓
Frontend: Actualiza UI con resultados
```

### Flujo de Creación de Negocio

```
Usuario completa formulario
  ↓
Frontend: Validación TypeScript
  ↓
Frontend: businessApi.create(businessData, images)
  ↓
Axios: POST /api/businesses (FormData)
  ↓
Backend: Middleware de validación (Joi)
  ↓
Backend: Multer procesa imágenes → Cloudinary
  ↓
Backend: Business.create() → INSERT en PostgreSQL
  ↓
Backend: BusinessImage.createMultiple() → INSERT imágenes
  ↓
Backend: Retorna negocio creado
  ↓
Frontend: Muestra mensaje de éxito
```

### Flujo de Autenticación y Petición Protegida

```
Usuario inicia sesión
  ↓
POST /api/auth/login
  ↓
Backend verifica credenciales
  ↓
Backend genera tokens y guarda refresh token
  ↓
Frontend almacena tokens en sessionStorage
  ↓
Usuario hace petición protegida
  ↓
Frontend: Axios agrega token automáticamente (interceptor)
  ↓
Backend: authenticateToken middleware verifica token
  ↓
Si token válido: Continúa con ruta
Si token expirado: Frontend usa refresh token
```

## Guía de Escalabilidad

### Base de Datos

1. **Índices Adicionales**
   - Crear índices según patrones de consulta reales
   - Monitorear consultas lentas con EXPLAIN ANALYZE

2. **Particionamiento**
   - Considerar particionamiento de `business_images` por fecha
   - Particionamiento de `reviews` si crecen significativamente

3. **Optimización de Consultas**
   - Utilizar JOINs eficientes
   - Evitar N+1 queries
   - Implementar paginación en todas las listas

4. **Replicación**
   - Implementar réplicas de lectura para consultas públicas
   - Master-replica para escritura separada de lectura

### Backend

1. **Caché**
   - Implementar Redis para:
     - Listas de categorías (cambian poco)
     - Negocios destacados
     - Resultados de búsqueda populares
   - TTL apropiado según tipo de dato

2. **Rate Limiting**
   - Implementar rate limiting por IP
   - Límites diferentes para endpoints públicos y protegidos

3. **Balanceo de Carga**
   - Múltiples instancias de backend
   - Load balancer (nginx o Render load balancer)
   - Session storage en Redis (si se migra a cookies)

4. **Optimización de Imágenes**
   - Utilizar Cloudinary transformations en URLs
   - Implementar lazy loading en frontend
   - Considerar WebP format automático

### Frontend

1. **Server-Side Rendering (SSR)**
   - Mantener SSR para páginas públicas (SEO)
   - Implementar ISR (Incremental Static Regeneration) para listados

2. **Optimización de Assets**
   - Next.js Image component con optimización automática
   - Code splitting automático con Next.js
   - Lazy loading de componentes pesados

3. **Caché**
   - Service Worker para recursos estáticos
   - SWR para caché de datos de API
   - Implementar stale-while-revalidate

4. **Monitoreo**
   - Integrar herramientas de monitoreo (Sentry)
   - Trackear métricas de rendimiento (Core Web Vitals)
   - Implementar analytics de uso

### Monitoreo y Logs

1. **Logging Estructurado**
   - Implementar logger estructurado (Winston, Pino)
   - Logs centralizados (ELK Stack, CloudWatch)
   - Niveles de log apropiados (error, warn, info, debug)

2. **Alertas**
   - Configurar alertas para errores críticos
   - Alertas de rendimiento (tiempo de respuesta)
   - Alertas de uso de recursos (CPU, memoria)

3. **Health Checks**
   - Endpoint `/api/health` mejorado con checks de BD
   - Monitoreo externo (UptimeRobot, Pingdom)

---

**Versión del documento**: 1.0  
**Última actualización**: Diciembre 2024

