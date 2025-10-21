# DondeOficial - Backend

API REST para DondeOficial construido con Node.js, Express y PostgreSQL.

## Configuración

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
```bash
cp config.env.example .env
```

Editar `.env` con tus credenciales de base de datos:
```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=dondeoficial
DB_USER=postgres
DB_PASSWORD=tu_password
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

3. Configurar PostgreSQL:
```bash
createdb dondeoficial
psql -d dondeoficial -f database/init.sql
```

## Ejecutar

```bash
# Desarrollo
npm run dev

# Producción
npm start
```

## API Endpoints

### Negocios
- `GET /api/businesses` - Listar negocios (con filtros)
- `GET /api/businesses/:id` - Obtener negocio por ID
- `POST /api/businesses` - Crear nuevo negocio
- `PUT /api/businesses/:id` - Actualizar negocio
- `DELETE /api/businesses/:id` - Eliminar negocio

### Categorías
- `GET /api/categories` - Listar categorías
- `GET /api/categories/:id` - Obtener categoría por ID
- `POST /api/categories` - Crear nueva categoría

### Health Check
- `GET /api/health` - Estado de la API

## Deploy en Render

1. Conectar repositorio a Render
2. Configurar variables de entorno en Render
3. Usar PostgreSQL de Render para la base de datos
