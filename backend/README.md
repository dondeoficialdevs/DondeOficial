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

### Paso 1: Crear Base de Datos PostgreSQL

1. Ir a [Render Dashboard](https://dashboard.render.com)
2. Click en **"New +"** → **"PostgreSQL"**
3. Configurar:
   - **Name:** `dondeoficial-db` (o el nombre que prefieras)
   - **Database:** `dondeoficial` (se crea automáticamente)
   - **User:** Se genera automáticamente
   - **Region:** Elegir la más cercana
   - **PostgreSQL Version:** La más reciente
   - **Plan:** Free (o el plan que prefieras)
4. Click en **"Create Database"**
5. **IMPORTANTE:** Copiar y guardar estas credenciales:
   - **Internal Database URL** (para conectar desde el mismo proyecto)
   - **External Database URL** (para conectar desde fuera)
   - O copiar individualmente:
     - **Host:** `dpg-xxxxx-a.oregon-postgres.render.com`
     - **Port:** `5432`
     - **Database:** `dondeoficial`
     - **User:** `dondeoficial_user`
     - **Password:** `xxxxx` (generada automáticamente)

### Paso 2: Inicializar la Base de Datos

1. Conectar a la base de datos usando un cliente:
   - **Opción 1:** [DBeaver Cloud](https://dbeaver.io/cloud/) (gratis)
   - **Opción 2:** pgAdmin
   - **Opción 3:** VS Code con extensión PostgreSQL
   - **Opción 4:** psql desde terminal

2. Usar las credenciales copiadas del Paso 1

3. Ejecutar el script completo `backend/database/init.sql`:
   ```sql
   -- Copiar y pegar todo el contenido de database/init.sql
   ```

4. Verificar que se crearon las tablas:
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```
   Debe mostrar: `categories`, `businesses`, `leads`, `newsletter_subscribers`

### Paso 3: Crear Servicio Web

1. En Render Dashboard → **"New +"** → **"Web Service"**
2. Conectar tu repositorio de GitHub
3. Seleccionar el repositorio `DondeOficial` (o el nombre de tu repo)
4. Configurar el servicio con estos valores EXACTOS:

   **Configuración del Servicio:**
   ```
   Name: dondeoficial-backend
   Environment: Node
   Region: <misma región que la base de datos>
   Branch: main
   Root Directory: backend
   Build Command: npm install
   Start Command: npm start
   Plan: Free (o el plan que prefieras)
   ```

   ⚠️ **IMPORTANTE - Verificar cada campo:**
   - **Root Directory:** Debe ser exactamente `backend` (sin `/`, sin espacios, sin comillas)
   - **Build Command:** Debe ser exactamente `npm install` (sin `cd backend`, sin rutas adicionales)
   - **Start Command:** Debe ser exactamente `npm start` (NO `node index.js`, NO `node server.js`, NO `cd backend && npm start`)

### Checklist de Verificación Pre-Deploy

Antes de desplegar, verifica que en Render tengas configurado:

- [ ] **Root Directory:** `backend` (sin espacios, sin `/`)
- [ ] **Build Command:** `npm install` (sin `cd backend`)
- [ ] **Start Command:** `npm start` (NO `node index.js` o `node server.js`)
- [ ] Todas las variables de entorno están configuradas (ver Paso 4)
- [ ] El repositorio tiene el archivo `backend/server.js`
- [ ] El repositorio tiene el archivo `backend/package.json` con `"main": "server.js"`

⚠️ **NOTA CRÍTICA:** 
Si ves el error `No se puede encontrar el módulo '/opt/render/project/src/backend/index.js'`:

1. **Verificar Root Directory:**
   - Ir a Settings → Build & Deploy
   - Verificar que "Root Directory" sea exactamente `backend` (sin `/`, sin espacios)
   - Si está vacío o tiene otro valor, cambiarlo a `backend`
   - Guardar los cambios

2. **Verificar Start Command:**
   - Ir a Settings → Build & Deploy
   - Verificar que "Start Command" sea exactamente `npm start`
   - Si dice `node index.js` o cualquier otra cosa, cambiarlo a `npm start`
   - Guardar los cambios

3. **Hacer Manual Deploy:**
   - Ir a la pestaña "Manual Deploy"
   - Click en "Deploy latest commit"
   - Esperar a que termine el build

### Paso 4: Configurar Variables de Entorno

En la sección **"Environment"** del servicio Web, agregar estas variables:

#### Variables OBLIGATORIAS:

```bash
# Puerto del servidor (Render lo asigna automáticamente, pero puedes dejarlo)
PORT=5000

# Credenciales de PostgreSQL
# Si Render te proporciona una URL de conexión como:
# postgresql://user:password@host/database
# Extrae las credenciales así:
DB_HOST=dpg-d4520oq4d50c73et6t40-a.oregon-postgres.render.com
DB_PORT=5432
DB_NAME=dbdondeoficial
DB_USER=dbdondeoficial_user
DB_PASSWORD=TT8oNR6OOr1T2Nb7LMUmlY9qtuHMP243

# Ambiente
NODE_ENV=production

# URL del frontend (actualizar con tu URL real de Netlify)
FRONTEND_URL=https://tu-frontend.netlify.app

# Secret para JWT (generar una clave segura)
JWT_SECRET=356d746ba35a68bbd5fd2274b87cc679c9203bbc7155aef3c31de0aaa55d686cc4722b2aca063877915da68601229a5328a4e684ce59c15bc20c7b8306a4b7c8
```

#### Cómo extraer credenciales de la URL de PostgreSQL:

Si Render te proporciona una URL de conexión como:
```
postgresql://dbdondeoficial_user:TT8oNR6OOr1T2Nb7LMUmlY9qtuHMP243@dpg-d4520oq4d50c73et6t40-a.oregon-postgres.render.com/dbdondeoficial
```

El formato es: `postgresql://USER:PASSWORD@HOST/DATABASE`

Extrae las credenciales así:
- **DB_USER:** `dbdondeoficial_user` (después de `postgresql://`)
- **DB_PASSWORD:** `TT8oNR6OOr1T2Nb7LMUmlY9qtuHMP243` (después de `:` y antes de `@`)
- **DB_HOST:** `dpg-d4520oq4d50c73et6t40-a.oregon-postgres.render.com` (después de `@`)
- **DB_NAME:** `dbdondeoficial` (después de `/`)
- **DB_PORT:** `5432` (puerto por defecto de PostgreSQL)

#### Generar JWT_SECRET:

Ejecutar en tu terminal local:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copiar el resultado y pegarlo como valor de `JWT_SECRET`.

#### Ejemplo de Variables Configuradas (con tus credenciales):

```bash
PORT=5000
DB_HOST=dpg-d4520oq4d50c73et6t40-a.oregon-postgres.render.com
DB_PORT=5432
DB_NAME=dbdondeoficial
DB_USER=dbdondeoficial_user
DB_PASSWORD=TT8oNR6OOr1T2Nb7LMUmlY9qtuHMP243
NODE_ENV=production
FRONTEND_URL=https://dondeoficial.netlify.app
JWT_SECRET=356d746ba35a68bbd5fd2274b87cc679c9203bbc7155aef3c31de0aaa55d686cc4722b2aca063877915da68601229a5328a4e684ce59c15bc20c7b8306a4b7c8
```

### Paso 5: Desplegar y Verificar

1. Click en **"Create Web Service"**
2. Esperar a que el build termine (puede tardar 2-5 minutos)
3. Verificar que el estado sea **"Live"** (verde)
4. Probar el endpoint de salud:
   ```
   https://dondeoficial.onrender.com/api/health
   ```
   Debe responder: `{"message":"API is running","status":"OK"}`

✅ **URL de Producción:** `https://dondeoficial.onrender.com`

### Paso 6: Verificar Conexión a Base de Datos

1. Revisar los logs del servicio Web en Render
2. Buscar el mensaje: `"Connected to PostgreSQL database"`
3. Si hay errores de conexión, verificar que las variables de entorno estén correctas

### Troubleshooting

#### Error: "Cannot connect to database"
- Verificar que todas las variables `DB_*` estén correctas
- Verificar que la base de datos esté activa en Render
- Verificar que el firewall permita conexiones desde el servicio Web

#### Error: "JWT_SECRET is not defined"
- Verificar que `JWT_SECRET` esté configurada en las variables de entorno
- Regenerar el servicio Web después de agregar la variable

#### El servicio tarda mucho en responder
- El plan gratuito de Render pone los servicios en "sleep mode" después de inactividad
- La primera petición puede tardar 30-60 segundos en "despertar"

#### Error: "No se puede encontrar el módulo '/opt/render/project/src/backend/index.js'"
**Causa:** Render está buscando `index.js` en lugar de `server.js`

**Solución:**
1. Ir a la configuración del servicio Web en Render
2. Verificar que **Root Directory** esté configurado exactamente como `backend` (sin `/` al final, sin espacios)
3. Verificar que **Start Command** sea exactamente `npm start` (no `node index.js`, no `node server.js`, no `cd backend && npm start`)
4. Guardar los cambios y hacer un nuevo deploy

**Configuración correcta:**
```
Root Directory: backend
Build Command: npm install
Start Command: npm start
```

#### Error en Build Command
- Verificar que `Root Directory` esté configurado como `backend`
- Verificar que `Build Command` sea `npm install` (sin `cd backend`)

### URLs y Endpoints

Una vez desplegado, tu API estará disponible en:
- **Base URL:** `https://dondeoficial.onrender.com`
- **Health Check:** `https://dondeoficial.onrender.com/api/health`
- **API Businesses:** `https://dondeoficial.onrender.com/api/businesses`
- **API Categories:** `https://dondeoficial.onrender.com/api/categories`
- **API Auth:** `https://dondeoficial.onrender.com/api/auth`
- **API Leads:** `https://dondeoficial.onrender.com/api/leads`
- **API Newsletter:** `https://dondeoficial.onrender.com/api/newsletter`

### Notas Importantes

⚠️ **IMPORTANTE:**
- El servicio gratuito de Render entra en "sleep mode" después de 15 minutos de inactividad
- La primera petición después del sleep puede tardar 30-60 segundos
- Para producción, considera un plan pago que mantenga el servicio siempre activo
- Actualiza `FRONTEND_URL` con la URL real de tu frontend desplegado en Netlify
- Guarda las credenciales de la base de datos en un lugar seguro
- `JWT_SECRET` debe ser única y no compartirse públicamente
