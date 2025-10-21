# 🚀 Guía de Configuración y Ejecución

## ⚠️ Pasos Críticos Antes de Ejecutar

### 1. Configurar Base de Datos PostgreSQL

```bash
# Instalar PostgreSQL si no lo tienes
# Windows: Descargar desde postgresql.org
# Linux/Mac: sudo apt install postgresql / brew install postgresql

# Crear base de datos
createdb dondeoficial

# Ejecutar script de inicialización (CON DATOS ACTUALIZADOS)
psql -d dondeoficial -f backend/database/init.sql
```

**IMPORTANTE**: El script ahora incluye datos de ejemplo que coinciden exactamente con el sitio original de fioxen.vercel.app

### 2. Configurar Variables de Entorno

**Backend** - Crear archivo `.env` en `/backend`:
```bash
cd backend
cp config.env.example .env
# Editar .env con tus credenciales reales
```

**Frontend** - Crear archivo `.env.local` en `/frontend`:
```bash
cd frontend
echo NEXT_PUBLIC_API_URL=http://localhost:5000/api > .env.local
```

### 3. Instalar Dependencias

```bash
# Backend
cd backend
npm install

# Frontend  
cd ../frontend
npm install
```

### 4. Ejecutar el Proyecto

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Debería mostrar: `Server running on port 5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Debería mostrar: `Local: http://localhost:3000`

### 5. Verificar que Funciona

1. Abrir http://localhost:3000
2. Deberías ver la página principal con categorías
3. Probar el buscador
4. Hacer clic en una categoría

## 🔧 Solución de Problemas

### Error de Base de Datos
- Verificar que PostgreSQL esté corriendo
- Verificar credenciales en `.env`
- Verificar que la base de datos existe

### Error de CORS
- Verificar que backend corre en puerto 5000
- Verificar que frontend corre en puerto 3000

### Error 404 en API
- Verificar que las rutas estén correctas en `server.js`
- Verificar que las tablas se crearon con `init.sql`

## 📁 Estructura Final Esperada

```
DondeOficial/
├── backend/
│   ├── .env                    # Variables de entorno (crear)
│   ├── server.js
│   ├── package.json
│   ├── config/
│   ├── models/
│   ├── routes/
│   └── database/
├── frontend/
│   ├── .env.local             # Variables de entorno (crear)
│   ├── src/
│   ├── package.json
│   └── next.config.ts
└── README.md
```

¡Todo listo para ejecutar! 🎉
