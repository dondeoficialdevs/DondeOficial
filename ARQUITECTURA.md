# Documentación de Arquitectura - DondeOficial

## Tabla de Contenidos

1. [Visión General](#visión-general)
2. [Arquitectura General](#arquitectura-general)
3. [Backend](#backend)
4. [Frontend](#frontend)
5. [Base de Datos](#base-de-datos)
6. [Flujo de Datos](#flujo-de-datos)
7. [Despliegue](#despliegue)
8. [Variables de Entorno](#variables-de-entorno)
9. [Seguridad](#seguridad)
10. [PWA (Progressive Web App)](#pwa-progressive-web-app)

---

## Visión General

**DondeOficial** es una aplicación web de directorio comercial que permite a los usuarios buscar, explorar y gestionar negocios locales. El proyecto está construido con una arquitectura de **separación de frontend y backend**, siguiendo el patrón **REST API**.

### Stack Tecnológico Principal

- **Frontend**: Next.js 15.5.6 + React 19 + TypeScript + Tailwind CSS 4
- **Backend**: Node.js + Express.js + PostgreSQL
- **Despliegue**: Netlify (Frontend) + Render (Backend y Base de Datos)
- **PWA**: Service Workers + Web App Manifest

---

## Arquitectura General

### Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTE                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Frontend (Next.js - Netlify)                  │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │  │
│  │  │   Páginas    │  │ Componentes  │  │   API Lib   │ │  │
│  │  │  (App Router)│  │   (React)    │  │  (Axios)    │ │  │
│  │  └──────────────┘  └──────────────┘  └─────────────┘ │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (Render)                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         API REST (Express.js)                        │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │  │
│  │  │   Rutas      │  │  Middleware   │  │   Modelos   │ │  │
│  │  │  (Routes)    │  │  (Auth/Val)   │  │  (Business) │ │  │
│  │  └──────────────┘  └──────────────┘  └─────────────┘ │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ SSL/TLS
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              BASE DE DATOS (PostgreSQL - Render)             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │Businesses│  │Categories│  │  Leads   │  │Newsletter│   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Patrón de Arquitectura

El proyecto sigue una **arquitectura de tres capas (3-Tier Architecture)**:

1. **Capa de Presentación**: Frontend (Next.js)
2. **Capa de Lógica de Negocio**: Backend API (Express.js)
3. **Capa de Datos**: PostgreSQL

---

## Backend

### Estructura de Directorios

```
backend/
├── config/
│   └── database.js          # Configuración de conexión PostgreSQL
├── database/
│   └── init.sql             # Script de inicialización de BD
├── middleware/
│   ├── auth.js              # Middleware de autenticación JWT
│   └── validation.js        # Middleware de validación con Joi
├── models/
│   ├── Business.js          # Modelo de negocios
│   ├── Category.js           # Modelo de categorías
│   ├── Lead.js              # Modelo de leads (contacto)
│   └── NewsletterSubscriber.js # Modelo de suscriptores
├── routes/
│   ├── auth.js              # Rutas de autenticación
│   ├── businesses.js        # Rutas CRUD de negocios
│   ├── categories.js        # Rutas de categorías
│   ├── leads.js             # Rutas de formulario de contacto
│   └── newsletter.js        # Rutas de newsletter
├── utils/                   # Utilidades
├── server.js                # Punto de entrada principal
└── package.json
```

### Tecnologías Backend

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Node.js | Latest | Runtime de JavaScript |
| Express.js | 4.18.2 | Framework web |
| PostgreSQL | 17 | Base de datos relacional |
| pg | 8.11.3 | Cliente PostgreSQL para Node.js |
| jsonwebtoken | 9.0.2 | Autenticación JWT |
| joi | 18.0.1 | Validación de esquemas |
| cors | 2.8.5 | Configuración CORS |
| dotenv | 16.1.1 | Variables de entorno |

### Configuración del Servidor

**Archivo**: `backend/server.js`

```javascript
// Configuración principal
- Puerto: process.env.PORT || 5000
- CORS: Configurado para producción y desarrollo
- Middleware: express.json() para parsing de JSON
- Escucha en: 0.0.0.0 (necesario para Render)
```

### Modelos de Datos

#### 1. Business (Negocios)
- **Archivo**: `backend/models/Business.js`
- **Métodos**:
  - `findAll(params)` - Listar con filtros (búsqueda, categoría, ubicación)
  - `findById(id)` - Obtener por ID
  - `create(businessData)` - Crear nuevo negocio
  - `update(id, businessData)` - Actualizar negocio
  - `delete(id)` - Eliminar negocio

#### 2. Category (Categorías)
- **Archivo**: `backend/models/Category.js`
- **Métodos**:
  - `findAll()` - Listar todas las categorías
  - `findById(id)` - Obtener por ID
  - `create(categoryData)` - Crear nueva categoría

#### 3. Lead (Leads/Contacto)
- **Archivo**: `backend/models/Lead.js`
- **Métodos**:
  - `create(leadData)` - Crear nuevo lead desde formulario de contacto

#### 4. NewsletterSubscriber (Suscriptores)
- **Archivo**: `backend/models/NewsletterSubscriber.js`
- **Métodos**:
  - `create(email)` - Suscribir email al newsletter

### Rutas API

#### Endpoints de Negocios
```
GET    /api/businesses          # Listar negocios (con filtros)
GET    /api/businesses/:id      # Obtener negocio por ID
POST   /api/businesses          # Crear negocio (público)
PUT    /api/businesses/:id      # Actualizar negocio (requiere auth)
DELETE /api/businesses/:id      # Eliminar negocio (requiere auth)
```

#### Endpoints de Categorías
```
GET    /api/categories           # Listar todas las categorías
GET    /api/categories/:id       # Obtener categoría por ID
POST   /api/categories           # Crear categoría (requiere auth)
```

#### Endpoints de Leads
```
POST   /api/leads                # Crear lead (formulario de contacto)
```

#### Endpoints de Newsletter
```
POST   /api/newsletter/subscribe # Suscribirse al newsletter
```

#### Endpoints de Autenticación
```
POST   /api/auth/register        # Registrar usuario
POST   /api/auth/login           # Iniciar sesión
```

### Middleware

#### 1. Autenticación (`middleware/auth.js`)
- Verifica tokens JWT
- Protege rutas que requieren autenticación
- Extrae información del usuario del token

#### 2. Validación (`middleware/validation.js`)
- Valida datos de entrada usando esquemas Joi
- Retorna errores 400 si la validación falla

### Configuración de Base de Datos

**Archivo**: `backend/config/database.js`

```javascript
// Pool de conexiones PostgreSQL
- SSL habilitado en producción (Render requiere SSL)
- Configuración mediante variables de entorno
- Manejo de eventos de conexión y errores
```

---

## Frontend

### Estructura de Directorios

```
frontend/
├── public/
│   ├── manifest.json          # Manifest PWA
│   ├── sw.js                  # Service Worker
│   └── icon-*.png             # Iconos PWA
├── src/
│   ├── app/                   # App Router (Next.js 15)
│   │   ├── layout.tsx         # Layout principal
│   │   ├── page.tsx           # Página de inicio
│   │   ├── listings/
│   │   │   └── page.tsx       # Página de listados
│   │   ├── businesses/
│   │   │   └── [id]/
│   │   │       └── page.tsx   # Detalle de negocio
│   │   ├── add-listing/
│   │   │   └── page.tsx       # Agregar negocio
│   │   └── contact/
│   │       └── page.tsx       # Formulario de contacto
│   ├── components/            # Componentes React
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── HeroSection.tsx
│   │   ├── SearchBar.tsx
│   │   ├── BusinessList.tsx
│   │   ├── CategorySection.tsx
│   │   ├── NewsletterSection.tsx
│   │   ├── PWAInstaller.tsx
│   │   └── ...
│   ├── lib/
│   │   └── api.ts             # Cliente API (Axios)
│   ├── types/
│   │   └── index.ts           # Tipos TypeScript
│   └── multimedia/            # Assets multimedia
│       ├── imagenes/
│       └── iconos/
└── package.json
```

### Tecnologías Frontend

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Next.js | 15.5.6 | Framework React con SSR/SSG |
| React | 19.1.0 | Biblioteca UI |
| TypeScript | 5.x | Tipado estático |
| Tailwind CSS | 4.x | Framework CSS utility-first |
| Axios | 1.12.2 | Cliente HTTP |
| SWR | 2.3.6 | Data fetching y caching |

### Arquitectura Frontend

#### App Router (Next.js 15)
- **Rutas basadas en archivos**: Cada carpeta en `app/` es una ruta
- **Server Components por defecto**: Componentes renderizados en el servidor
- **Client Components**: Marcados con `'use client'` cuando necesitan interactividad

#### Componentes Principales

1. **Header.tsx**
   - Navegación principal
   - Menú responsive
   - Links: Inicio, Directorio, Contacto

2. **Footer.tsx**
   - Información del sitio
   - Formulario de newsletter integrado
   - Enlaces adicionales

3. **HeroSection.tsx**
   - Sección principal de la página de inicio
   - Call-to-action

4. **SearchBar.tsx**
   - Búsqueda de negocios
   - Filtros por categoría y ubicación

5. **BusinessList.tsx**
   - Listado de negocios
   - Cards con información resumida

6. **PWAInstaller.tsx**
   - Botón de instalación PWA
   - Detección de plataforma (iOS/Android)
   - Instrucciones de instalación

### Cliente API

**Archivo**: `frontend/src/lib/api.ts`

```typescript
// Configuración
- Base URL: process.env.NEXT_PUBLIC_API_URL
- Interceptor de errores para manejo consistente
- Tipos TypeScript para todas las respuestas

// APIs disponibles
- businessApi: CRUD de negocios
- categoryApi: Gestión de categorías
- leadsApi: Formulario de contacto
- newsletterApi: Suscripción al newsletter
```

### Páginas

1. **`/` (page.tsx)**
   - Página de inicio
   - Hero section, categorías destacadas, negocios destacados

2. **`/listings` (listings/page.tsx)**
   - Listado completo de negocios
   - Filtros y búsqueda

3. **`/businesses/[id]` (businesses/[id]/page.tsx)**
   - Detalle individual de negocio
   - Información completa

4. **`/add-listing` (add-listing/page.tsx)**
   - Formulario para agregar nuevo negocio
   - Validación en frontend y backend

5. **`/contact` (contact/page.tsx)**
   - Formulario de contacto
   - Integrado con API de leads

---

## Base de Datos

### Esquema de Base de Datos

#### Tabla: `categories`
```sql
- id (SERIAL PRIMARY KEY)
- name (VARCHAR(100) UNIQUE)
- description (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### Tabla: `businesses`
```sql
- id (SERIAL PRIMARY KEY)
- name (VARCHAR(200) UNIQUE)
- description (TEXT)
- address (TEXT)
- phone (VARCHAR(20))
- email (VARCHAR(100) UNIQUE)
- website (VARCHAR(200))
- category_id (INTEGER REFERENCES categories)
- opening_hours (TEXT)
- latitude (DECIMAL(10, 8))
- longitude (DECIMAL(11, 8))
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

**Índices**:
- `idx_businesses_category` en `category_id`
- `idx_businesses_name` en `name`
- `idx_businesses_location` en `(latitude, longitude)`

#### Tabla: `leads`
```sql
- id (SERIAL PRIMARY KEY)
- full_name (VARCHAR(200))
- email (VARCHAR(100))
- subject (VARCHAR(200))
- message (TEXT)
- created_at (TIMESTAMP)
- UNIQUE(email, full_name)
```

#### Tabla: `newsletter_subscribers`
```sql
- id (SERIAL PRIMARY KEY)
- email (VARCHAR(100) UNIQUE)
- subscribed_at (TIMESTAMP)
```

### Relaciones

```
categories (1) ────< (N) businesses
```

- Un negocio pertenece a una categoría (opcional)
- Una categoría puede tener múltiples negocios

### Inicialización

**Archivo**: `backend/database/init.sql`

El script de inicialización:
1. Crea todas las tablas
2. Crea índices para optimización
3. Inserta datos de ejemplo (categorías y negocios)

**Ejecución**:
```bash
psql -d dbdondeoficial -f database/init.sql
```

---

## Flujo de Datos

### Flujo de Búsqueda de Negocios

```
1. Usuario escribe en SearchBar
   ↓
2. Componente actualiza estado local
   ↓
3. businessApi.getAll({ search, category, location })
   ↓
4. Axios → GET /api/businesses?search=...&category=...
   ↓
5. Backend: routes/businesses.js → Business.findAll(params)
   ↓
6. Modelo ejecuta query SQL con filtros
   ↓
7. PostgreSQL retorna resultados
   ↓
8. Backend envía JSON response
   ↓
9. Frontend actualiza BusinessList con resultados
```

### Flujo de Creación de Negocio

```
1. Usuario completa formulario en /add-listing
   ↓
2. Validación en frontend (TypeScript types)
   ↓
3. businessApi.create(businessData)
   ↓
4. Axios → POST /api/businesses
   ↓
5. Backend: middleware/validation.js (Joi schema)
   ↓
6. Backend: routes/businesses.js → Business.create(data)
   ↓
7. Modelo ejecuta INSERT en PostgreSQL
   ↓
8. Backend retorna negocio creado
   ↓
9. Frontend muestra mensaje de éxito
```

### Flujo de Formulario de Contacto

```
1. Usuario completa formulario en /contact
   ↓
2. leadsApi.create({ full_name, email, subject, message })
   ↓
3. Axios → POST /api/leads
   ↓
4. Backend: middleware/validation.js
   ↓
5. Backend: routes/leads.js → Lead.create(data)
   ↓
6. INSERT en tabla leads
   ↓
7. Respuesta de éxito al frontend
```

---

## Despliegue

### Arquitectura de Despliegue

```
┌─────────────────┐
│   Netlify       │
│   (Frontend)    │
│   HTTPS         │
└────────┬────────┘
         │
         │ API Calls
         ▼
┌─────────────────┐
│   Render        │
│   (Backend API) │
│   HTTPS         │
└────────┬────────┘
         │
         │ SSL/TLS
         ▼
┌─────────────────┐
│   Render        │
│   (PostgreSQL)  │
└─────────────────┘
```

### Frontend (Netlify)

- **Plataforma**: Netlify
- **Build Command**: `npm run build`
- **Publish Directory**: `.next`
- **Variables de Entorno**:
  - `NEXT_PUBLIC_API_URL`: URL del backend en Render
  - `NEXT_PUBLIC_SITE_URL`: URL del frontend en Netlify

### Backend (Render)

- **Plataforma**: Render
- **Tipo**: Web Service
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Puerto**: Asignado automáticamente por Render
- **Escucha en**: `0.0.0.0` (todas las interfaces)

### Base de Datos (Render)

- **Plataforma**: Render PostgreSQL
- **Versión**: PostgreSQL 17
- **SSL**: Requerido (configurado en `database.js`)
- **Conexión**: Internal Database URL (para servicios en Render)
- **Conexión Externa**: External Database URL (para DBeaver u otros clientes)

---

## Variables de Entorno

### Backend (.env)

```env
# Puerto (no configurar manualmente en Render)
PORT=5000

# Base de Datos
DB_HOST=dpg-xxxxx-a.oregon-postgres.render.com
DB_PORT=5432
DB_NAME=dbdondeoficial
DB_USER=dbdondeoficial_user
DB_PASSWORD=xxxxx

# Entorno
NODE_ENV=production

# Frontend URL (para CORS)
FRONTEND_URL=https://tu-sitio.netlify.app

# JWT
JWT_SECRET=tu_jwt_secret_muy_seguro
```

### Frontend (.env.local)

```env
# API Backend
NEXT_PUBLIC_API_URL=https://dondeoficial.onrender.com/api

# Site URL
NEXT_PUBLIC_SITE_URL=https://tu-sitio.netlify.app
```

---

## Seguridad

### Implementaciones de Seguridad

1. **CORS**
   - Configurado en backend para permitir solo el frontend
   - Credentials habilitados

2. **Autenticación JWT**
   - Tokens firmados con JWT_SECRET
   - Middleware de autenticación protege rutas sensibles

3. **Validación de Datos**
   - Joi schemas en backend
   - TypeScript types en frontend
   - Prevención de SQL injection mediante parámetros preparados

4. **SSL/TLS**
   - Conexiones HTTPS en producción
   - SSL requerido para PostgreSQL en Render

5. **Variables de Entorno**
   - Credenciales nunca en código
   - `.env` en `.gitignore`

---

## PWA (Progressive Web App)

### Características PWA

1. **Service Worker** (`public/sw.js`)
   - Cacheo de recursos estáticos
   - Funcionalidad offline básica

2. **Web App Manifest** (`public/manifest.json`)
   - Nombre, iconos, tema
   - Configuración para instalación

3. **PWA Installer Component** (`components/PWAInstaller.tsx`)
   - Detección automática de plataforma (iOS/Android)
   - Botón de instalación
   - Instrucciones para iOS

### Instalación

- **Android**: Prompt nativo del navegador
- **iOS**: Instrucciones manuales (compartir → agregar a pantalla de inicio)

### Iconos

- Ubicación: `public/icon-*.png`
- Tamaños: 192x192, 512x512
- Formato: PNG

---

## Resumen de Tecnologías

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Base de Datos**: PostgreSQL 17
- **ORM/Query**: pg (PostgreSQL client)
- **Autenticación**: JWT (jsonwebtoken)
- **Validación**: Joi
- **CORS**: cors

### Frontend
- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS 4
- **HTTP Client**: Axios
- **Data Fetching**: SWR
- **PWA**: Service Workers + Manifest

### DevOps
- **Frontend Hosting**: Netlify
- **Backend Hosting**: Render
- **Database Hosting**: Render PostgreSQL
- **Version Control**: Git
- **CI/CD**: Automático (Git push → deploy)

---

## Diagrama de Componentes Frontend

```
┌─────────────────────────────────────────┐
│           Root Layout                   │
│  ┌───────────────────────────────────┐  │
│  │         Header                    │  │
│  │  - Navigation                     │  │
│  │  - Logo                           │  │
│  └───────────────────────────────────┘  │
│                                          │
│  ┌───────────────────────────────────┐  │
│  │         Page Content              │  │
│  │  ┌──────────┐  ┌──────────────┐  │  │
│  │  │  Hero    │  │  SearchBar   │  │  │
│  │  └──────────┘  └──────────────┘  │  │
│  │  ┌──────────┐  ┌──────────────┐  │  │
│  │  │Category  │  │ BusinessList │  │  │
│  │  │ Section  │  │              │  │  │
│  │  └──────────┘  └──────────────┘  │  │
│  └───────────────────────────────────┘  │
│                                          │
│  ┌───────────────────────────────────┐  │
│  │         Footer                    │  │
│  │  - Newsletter Form                │  │
│  │  - Links                          │  │
│  └───────────────────────────────────┘  │
│                                          │
│  ┌───────────────────────────────────┐  │
│  │      PWA Installer (Fixed)        │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

---

## Notas Adicionales

### Estructura de Respuestas API

Todas las respuestas API siguen este formato:

```json
{
  "success": true,
  "data": { ... },
  "message": "Operación exitosa"
}
```

### Manejo de Errores

- **Backend**: Middleware de errores centralizado
- **Frontend**: Interceptor de Axios para manejo consistente
- **Tipos**: TypeScript para type safety

### Optimizaciones

- **Índices de BD**: En campos de búsqueda frecuente
- **Caching**: SWR para data fetching en frontend
- **Lazy Loading**: Componentes y rutas en Next.js
- **Service Worker**: Cacheo de recursos estáticos

---

## Próximos Pasos Sugeridos

1. **Testing**: Agregar tests unitarios y de integración
2. **Monitoreo**: Integrar herramientas de monitoreo (Sentry, LogRocket)
3. **Analytics**: Google Analytics o similar
4. **Optimización de Imágenes**: Next.js Image component
5. **Internacionalización**: i18n para múltiples idiomas
6. **Mapas**: Integración con Google Maps o Mapbox
7. **Notificaciones Push**: Para PWA
8. **Búsqueda Avanzada**: Elasticsearch o Algolia

---

**Última actualización**: Diciembre 2024
**Versión del documento**: 1.0

