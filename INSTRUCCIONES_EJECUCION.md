# Instrucciones de Ejecución - DondeOficial MVP

## Estado del Proyecto

El MVP de DondeOficial está completo y funcional. Incluye todas las funcionalidades principales del sitio original fioxen.vercel.app.

## Funcionalidades Implementadas

### Frontend (Next.js + React + Tailwind CSS)
- Página principal con hero section y búsqueda
- Listado de negocios con filtros por categoría
- Página de detalle de negocio
- Página de listados con búsqueda avanzada
- Página de contacto
- Página para agregar nuevos negocios
- Navegación completa entre páginas
- Diseño responsive
- Sin emojis genéricos (como solicitado)

### Backend (Node.js + Express + PostgreSQL)
- API REST completa con endpoints GET y POST
- Modelos de datos para negocios y categorías
- Filtros de búsqueda por término, categoría y ubicación
- Configuración CORS
- Variables de entorno configuradas
- Base de datos con datos de ejemplo

## Pasos para Ejecutar

### 1. Configurar Base de Datos

```bash
# Crear base de datos
createdb dondeoficial

# Ejecutar script de inicialización
psql -d dondeoficial -f backend/database/init.sql
```

### 2. Configurar Backend

```bash
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp config.env.example .env

# Editar .env con tus credenciales de PostgreSQL
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=dondeoficial
# DB_USER=tu_usuario
# DB_PASSWORD=tu_password

# Ejecutar backend
npm run dev
```

El backend estará disponible en http://localhost:5000

### 3. Configurar Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Crear archivo de variables de entorno
echo NEXT_PUBLIC_API_URL=http://localhost:5000/api > .env.local

# Ejecutar frontend
npm run dev
```

El frontend estará disponible en http://localhost:3000

## Páginas Disponibles

1. **Página Principal** (/) - Hero section con búsqueda y listado destacado
2. **Listados** (/listings) - Lista completa con filtros y búsqueda
3. **Detalle de Negocio** (/businesses/[id]) - Información detallada del negocio
4. **Agregar Negocio** (/add-listing) - Formulario para nuevos negocios
5. **Contacto** (/contact) - Información de contacto y formulario

## API Endpoints

- GET /api/businesses - Lista negocios con filtros
- GET /api/businesses/:id - Detalle de negocio
- POST /api/businesses - Crear nuevo negocio
- GET /api/categories - Lista categorías
- POST /api/categories - Crear nueva categoría
- GET /api/health - Estado de la API

## Datos de Ejemplo

La base de datos incluye datos de ejemplo que coinciden con el sitio original:
- 6 categorías (Restaurant, Museums, Game Field, etc.)
- 9 negocios de ejemplo con información completa
- Estados Open/Close
- Información de contacto y ubicación

## Verificación de Funcionamiento

1. Abrir http://localhost:3000
2. Verificar que se cargan los negocios en la página principal
3. Probar la búsqueda en el hero section
4. Navegar a /listings y probar filtros
5. Hacer clic en un negocio para ver el detalle
6. Probar el formulario de agregar negocio
7. Verificar que la navegación funciona correctamente

## Estructura del Proyecto

```
DondeOficial/
├── backend/                 # API REST
│   ├── config/             # Configuración de BD
│   ├── models/             # Modelos de datos
│   ├── routes/             # Rutas de la API
│   ├── database/           # Scripts de BD
│   └── server.js           # Servidor principal
├── frontend/               # Aplicación Next.js
│   ├── src/
│   │   ├── app/           # Páginas
│   │   ├── components/    # Componentes React
│   │   ├── lib/           # Utilidades
│   │   └── types/         # Tipos TypeScript
│   └── package.json
└── README.md
```

## Notas Importantes

- El proyecto está configurado para desarrollo local
- Las variables de entorno están configuradas correctamente
- Los archivos .gitignore están configurados para evitar subir archivos innecesarios
- El diseño replica fielmente el sitio original fioxen.vercel.app
- No se utilizan emojis genéricos en títulos (como solicitado)
- El código está documentado y es fácilmente extensible

El MVP está listo para usar y puede ser desplegado en Netlify (frontend) y Render (backend + BD) siguiendo las instrucciones en los README correspondientes.
