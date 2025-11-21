# DirectorioComercial - Sistema de Directorio Comercial

Aplicación web full-stack para gestión de directorio comercial con funcionalidades de búsqueda, categorización, reseñas y administración.

## Tabla de Contenidos

1. [Descripción del Proyecto](#descripción-del-proyecto)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Requisitos Previos](#requisitos-previos)
5. [Instalación y Configuración](#instalación-y-configuración)
6. [Ejecución en Desarrollo](#ejecución-en-desarrollo)
7. [Arquitectura del Sistema](#arquitectura-del-sistema)
8. [Documentación Técnica](#documentación-técnica)
9. [Despliegue](#despliegue)
10. [Escalabilidad](#escalabilidad)

## Descripción del Proyecto

Sistema de directorio comercial que permite a los usuarios buscar, explorar y gestionar negocios locales. Incluye funcionalidades de:

- Búsqueda y filtrado de negocios por categoría y ubicación
- Sistema de reseñas y calificaciones
- Panel de administración con autenticación JWT
- Gestión de leads y suscriptores de newsletter
- Subida y almacenamiento de imágenes mediante Cloudinary
- Aplicación Web Progresiva (PWA) con soporte offline

## Stack Tecnológico

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 4.18.2
- **Base de Datos**: PostgreSQL 17
- **ORM/Cliente**: pg (node-postgres) 8.11.3
- **Autenticación**: JWT (jsonwebtoken 9.0.2)
- **Validación**: Joi 18.0.1
- **Almacenamiento**: Cloudinary para imágenes
- **Seguridad**: bcrypt 6.0.0 para hash de contraseñas

### Frontend
- **Framework**: Next.js 15.5.6 (App Router)
- **UI Library**: React 19.1.0
- **Lenguaje**: TypeScript 5.x
- **Estilos**: Tailwind CSS 4.x
- **HTTP Client**: Axios 1.12.2
- **Data Fetching**: SWR 2.3.6
- **Mapas**: React Leaflet 5.0.0

### DevOps
- **Frontend Hosting**: Netlify
- **Backend Hosting**: Render
- **Base de Datos**: Render PostgreSQL
- **Control de Versiones**: Git

## Estructura del Proyecto

```
DirectorioComercial/
├── backend/                    # API REST Backend
│   ├── config/                 # Configuraciones
│   │   ├── database.js        # Pool de conexiones PostgreSQL
│   │   └── cloudinary.js      # Configuración Cloudinary
│   ├── database/               # Scripts SQL
│   │   └── init.sql           # Inicialización de BD
│   ├── middleware/             # Middlewares Express
│   │   ├── auth.js            # Autenticación JWT
│   │   └── validation.js      # Validación con Joi
│   ├── models/                 # Modelos de datos
│   │   ├── Business.js
│   │   ├── Category.js
│   │   ├── Lead.js
│   │   ├── NewsletterSubscriber.js
│   │   ├── Review.js
│   │   ├── User.js
│   │   └── BusinessImage.js
│   ├── routes/                 # Rutas de la API
│   │   ├── auth.js
│   │   ├── businesses.js
│   │   ├── categories.js
│   │   ├── leads.js
│   │   ├── newsletter.js
│   │   └── reviews.js
│   ├── utils/                  # Utilidades
│   ├── server.js              # Punto de entrada
│   └── package.json
├── frontend/                   # Aplicación Next.js
│   ├── public/                 # Archivos estáticos
│   │   ├── manifest.json      # PWA Manifest
│   │   └── sw.js              # Service Worker
│   ├── src/
│   │   ├── app/               # App Router (Next.js 15)
│   │   │   ├── admin/         # Panel de administración
│   │   │   ├── businesses/    # Páginas de negocios
│   │   │   ├── add-listing/   # Agregar negocio
│   │   │   └── contact/       # Contacto
│   │   ├── components/        # Componentes React
│   │   ├── hooks/             # Custom hooks
│   │   ├── lib/               # Utilidades
│   │   │   └── api.ts         # Cliente API
│   │   ├── types/             # Tipos TypeScript
│   │   └── multimedia/        # Assets multimedia
│   └── package.json
├── ARQUITECTURA.md            # Documentación de arquitectura
├── DOCUMENTACION_TECNICA.md   # Documentación técnica detallada
└── README.md                  # Este archivo
```

## Requisitos Previos

- **Node.js**: Versión 20 o superior
- **PostgreSQL**: Versión 15 o superior
- **npm**: Versión 9 o superior
- **Git**: Para clonar el repositorio

### Servicios Externos Requeridos

- **Cloudinary**: Cuenta para almacenamiento de imágenes (nivel gratuito suficiente)
- **Render** (producción): Para hosting de backend y base de datos
- **Netlify** (producción): Para hosting de frontend

## Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone <repository-url>
cd DirectorioComercial
```

### 2. Configurar Base de Datos

```bash
# Crear base de datos PostgreSQL
createdb dondeoficial

# Ejecutar script de inicialización
psql -d dondeoficial -f backend/database/init.sql
```

El script `init.sql` crea todas las tablas necesarias, índices y datos de ejemplo.

### 3. Configurar Backend

```bash
cd backend

# Instalar dependencias
npm install

# Copiar archivo de ejemplo de variables de entorno
cp config.env.example .env

# Editar .env con tus credenciales
```

**Variables de entorno requeridas para backend** (`.env`):

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=dondeoficial
DB_USER=tu_usuario_postgres
DB_PASSWORD=tu_password_postgres
NODE_ENV=development

# JWT
JWT_SECRET=tu_secret_jwt_muy_seguro_minimo_32_caracteres

# Cloudinary
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Frontend URL (para CORS)
FRONTEND_URL=http://localhost:3000
```

### 4. Configurar Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Crear archivo de variables de entorno
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local
echo "NEXT_PUBLIC_SITE_URL=http://localhost:3000" >> .env.local
```

**Variables de entorno requeridas para frontend** (`.env.local`):

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Ejecución en Desarrollo

### Iniciar Backend

```bash
cd backend
npm run dev
```

El servidor backend estará disponible en `http://localhost:5000`. La API estará en `http://localhost:5000/api`.

### Iniciar Frontend

```bash
cd frontend
npm run dev
```

La aplicación frontend estará disponible en `http://localhost:3000`.

### Verificación

1. Abrir `http://localhost:3000` en el navegador
2. Verificar que la página principal carga correctamente
3. Probar la búsqueda de negocios
4. Navegar a diferentes páginas

## Arquitectura del Sistema

El sistema sigue una arquitectura de tres capas (3-Tier Architecture):

```
┌─────────────────────────────────────┐
│   Capa de Presentación              │
│   Next.js Frontend (Netlify)        │
└──────────────┬──────────────────────┘
               │ HTTPS
               ▼
┌─────────────────────────────────────┐
│   Capa de Lógica de Negocio         │
│   Express.js API (Render)           │
└──────────────┬──────────────────────┘
               │ SSL/TLS
               ▼
┌─────────────────────────────────────┐
│   Capa de Datos                     │
│   PostgreSQL (Render)               │
└─────────────────────────────────────┘
```

### Patrón de Diseño

- **Backend**: Patrón MVC (Model-View-Controller) adaptado a API REST
- **Frontend**: Arquitectura basada en componentes con App Router de Next.js
- **Comunicación**: RESTful API con JSON

## Documentación Técnica

Para información técnica detallada, consultar:

- **[ARQUITECTURA.md](ARQUITECTURA.md)**: Arquitectura completa del sistema
- **[DOCUMENTACION_TECNICA.md](DOCUMENTACION_TECNICA.md)**: Documentación técnica detallada

### Endpoints Principales de la API

#### Negocios
- `GET /api/businesses` - Listar negocios con filtros
- `GET /api/businesses/:id` - Obtener negocio por ID
- `POST /api/businesses` - Crear negocio
- `PUT /api/businesses/:id` - Actualizar negocio (requiere autenticación)
- `DELETE /api/businesses/:id` - Eliminar negocio (requiere autenticación)

#### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/refresh` - Refrescar token de acceso
- `POST /api/auth/logout` - Cerrar sesión
- `GET /api/auth/verify` - Verificar token (requiere autenticación)

#### Categorías
- `GET /api/categories` - Listar categorías
- `POST /api/categories` - Crear categoría (requiere autenticación)

#### Reseñas
- `GET /api/reviews/business/:businessId` - Obtener reseñas de un negocio
- `POST /api/reviews` - Crear reseña

#### Leads y Newsletter
- `POST /api/leads` - Crear lead (formulario de contacto)
- `POST /api/newsletter/subscribe` - Suscribirse al newsletter

## Despliegue

### Backend en Render

1. Conectar repositorio Git a Render
2. Crear nuevo Web Service
3. Configurar:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Agregar variables de entorno en Render Dashboard
5. Configurar base de datos PostgreSQL en Render
6. Actualizar variables de entorno con credenciales de BD

### Frontend en Netlify

1. Conectar repositorio Git a Netlify
2. Configurar:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
3. Agregar variables de entorno:
   - `NEXT_PUBLIC_API_URL`: URL del backend en Render
   - `NEXT_PUBLIC_SITE_URL`: URL del frontend en Netlify

### Base de Datos en Render

1. Crear servicio PostgreSQL en Render
2. Obtener Internal Database URL para el backend
3. Ejecutar script `init.sql` manualmente o mediante migración

## Escalabilidad

### Consideraciones para Escalar

1. **Base de Datos**
   - Implementar índices adicionales según patrones de consulta
   - Considerar particionamiento de tablas grandes
   - Implementar replicación para lectura

2. **Backend**
   - Implementar balanceo de carga con múltiples instancias
   - Utilizar caché Redis para consultas frecuentes
   - Implementar rate limiting
   - Considerar CDN para assets estáticos

3. **Frontend**
   - Implementar SSR/SSG estratégicamente
   - Optimizar imágenes con Next.js Image component
   - Implementar lazy loading de componentes
   - Utilizar Service Worker para caché offline

4. **Monitoreo y Logs**
   - Integrar herramientas de monitoreo (Sentry, LogRocket)
   - Implementar logging estructurado
   - Configurar alertas para errores críticos

5. **Seguridad**
   - Implementar rate limiting por IP
   - Configurar HTTPS en todos los servicios
   - Implementar sanitización de inputs
   - Revisar regularmente dependencias por vulnerabilidades

### Mejoras Futuras Sugeridas

- Implementar búsqueda full-text con PostgreSQL o Elasticsearch
- Agregar sistema de notificaciones push para PWA
- Implementar internacionalización (i18n)
- Agregar integración con mapas (Google Maps, Mapbox)
- Implementar sistema de favoritos con persistencia
- Agregar analytics y métricas de uso
- Implementar tests automatizados (unitarios e integración)

## Contribución

Este proyecto está diseñado para ser escalable y mantenible. Al contribuir:

1. Seguir las convenciones de código establecidas
2. Documentar nuevos endpoints y funcionalidades
3. Actualizar esta documentación cuando sea necesario
4. Realizar pruebas antes de commit

## Licencia

Proyecto propietario - Todos los derechos reservados

---

**Versión del documento**: 1.0  
**Última actualización**: Diciembre 2024
