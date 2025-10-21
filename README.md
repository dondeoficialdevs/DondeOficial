# DondeOficial MVP

Clon del MVP del sitio de directorio comercial con funcionalidades básicas de búsqueda, categorías y listado de negocios.

## Tecnologías

- **Frontend**: React + Next.js + Tailwind CSS
- **Backend**: Node.js + Express
- **Base de datos**: PostgreSQL

## Estructura del proyecto

```
├── frontend/          # Aplicación Next.js
├── backend/           # API REST con Express
└── README.md
```

## Configuración rápida

### Backend
```bash
cd backend
npm install
cp config.env.example .env
# Editar .env con tus credenciales de DB
createdb dondeoficial
psql -d dondeoficial -f database/init.sql
npm run dev
```

### Frontend
```bash
cd frontend
npm install
# Crear .env.local con NEXT_PUBLIC_API_URL=http://localhost:5000/api
npm run dev
```

## Funcionalidades implementadas

- ✅ Página principal con buscador y categorías
- ✅ Listado de negocios con filtros (búsqueda, categoría, ubicación)
- ✅ Página de detalle por negocio
- ✅ API REST con endpoints GET y POST
- ✅ CORS configurado
- ✅ Variables de entorno configuradas

## API Endpoints

### Negocios
- `GET /api/businesses` - Listar con filtros
- `GET /api/businesses/:id` - Detalle
- `POST /api/businesses` - Crear
- `PUT /api/businesses/:id` - Actualizar

### Categorías
- `GET /api/categories` - Listar
- `POST /api/categories` - Crear

## Deploy

- **Frontend**: Netlify
- **Backend**: Render
- **Base de datos**: PostgreSQL (Render)

El código está listo para deploy y es fácilmente extensible para agregar más funcionalidades.
