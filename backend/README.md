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
JWT_SECRET=tu_secret_key_segura_aqui
```

**Importante:** `JWT_SECRET` debe ser una cadena aleatoria y segura. Puedes generarla con:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

3. Configurar PostgreSQL:
```bash
# Crear la base de datos
createdb dondeoficial

# O si usas psql directamente:
psql -U postgres -c "CREATE DATABASE dondeoficial;"

# Ejecutar el script de inicialización
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

### Configuración del Servicio Web

1. **Conectar repositorio:**
   - Ir a [Render Dashboard](https://dashboard.render.com)
   - Conectar tu repositorio de GitHub

2. **Configurar el servicio:**
   - **Name:** `dondeoficial-backend`
   - **Environment:** `Node`
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
   - **Root Directory:** `backend` (opcional, si tu estructura lo requiere)

### Variables de Entorno en Render

Configurar las siguientes variables de entorno en Render:

```
PORT=5000
DB_HOST=<tu_host_de_postgresql>
DB_PORT=5432
DB_NAME=<tu_nombre_de_base_de_datos>
DB_USER=<tu_usuario>
DB_PASSWORD=<tu_password>
NODE_ENV=production
FRONTEND_URL=https://tu-frontend.netlify.app
JWT_SECRET=<genera_una_clave_segura>
```

### Configuración de PostgreSQL en Render

1. **Crear base de datos PostgreSQL:**
   - En Render Dashboard, crear un nuevo servicio PostgreSQL
   - Copiar las credenciales de conexión (Host, Database, User, Password, Port)

2. **Inicializar la base de datos:**
   - Conectar a la base de datos usando un cliente (pgAdmin, DBeaver, DBeaver Cloud, etc.)
   - Ejecutar el script `database/init.sql` completo
   - Verificar que las tablas `categories`, `businesses`, `leads` y `newsletter_subscribers` se hayan creado correctamente

### Pasos de Despliegue en Render

1. **Crear servicio PostgreSQL:**
   - En Render Dashboard → New → PostgreSQL
   - Configurar nombre y región
   - Guardar las credenciales

2. **Crear servicio Web:**
   - En Render Dashboard → New → Web Service
   - Conectar repositorio de GitHub
   - Configurar:
     - **Name:** `dondeoficial-backend`
     - **Environment:** `Node`
     - **Build Command:** `cd backend && npm install`
     - **Start Command:** `cd backend && npm start`
     - **Root Directory:** `backend` (opcional)

3. **Configurar variables de entorno:**
   - En la sección "Environment" del servicio Web
   - Agregar todas las variables mencionadas arriba
   - Usar las credenciales del servicio PostgreSQL creado

4. **Verificar despliegue:**
   - Esperar a que el build termine exitosamente
   - Verificar que el servicio esté "Live"
   - Probar el endpoint: `https://tu-servicio.onrender.com/api/health`

### Notas Importantes

- Render proporciona una URL gratuita con el formato: `https://dondeoficial-backend.onrender.com`
- El servicio puede tardar unos minutos en iniciar si está en "sleep mode"
- Asegúrate de que `FRONTEND_URL` apunte a tu frontend desplegado en Netlify
