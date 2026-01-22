# Guía de Configuración de Supabase para DirectorioComercial

Has migrado con éxito la lógica del frontend para usar Supabase. Sigue estos pasos para completar la configuración:

## 1. Crear un proyecto en Supabase
1. Ve a [Supabase Dashboard](https://supabase.com/dashboard).
2. Crea un nuevo proyecto llamado `DirectorioComercial`.

## 2. Configurar la Base de Datos
1. En el Dashboard de Supabase, ve a la sección **SQL Editor**.
2. Crea una nueva consulta ("New Query").
3. Utiliza la estructura de tablas que ya has configurado en Supabase.
4. Asegúrate de que las 8 tablas estén presentes y funcionales.

## 3. Configurar la Autenticación
1. En Supabase, ve a **Authentication** > **Providers**.
2. Asegúrate de que "Email" esté habilitado.
3. Deshabilita "Confirm Email" si quieres permitir el acceso inmediato (opcional).
4. Crea un usuario admin manualmente en **Authentication** > **Users** con el email `admin@dondeoficial.com` para que coincida con tus permisos previos.

## 4. Configurar Variables de Entorno
Copia las credenciales de tu proyecto desde **Project Settings** > **API**:

Actualiza tu archivo `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anon_de_supabase
```

## 5. Permisos (RLS - opcional pero recomendado)
Por defecto, Supabase bloquea el acceso a las tablas mediante Row Level Security (RLS). Para que el frontend pueda leer los datos, tienes dos opciones:

### Opción A: Deshabilitar RLS (Solo para desarrollo rápido)
Ejecuta esto en el SQL Editor para cada tabla:
```sql
ALTER TABLE businesses DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE business_images DISABLE ROW LEVEL SECURITY;
ALTER TABLE reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE leads DISABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers DISABLE ROW LEVEL SECURITY;
```

### Opción B: Crear Políticas (Recomendado para producción)
Crea políticas que permitan lectura pública y escritura solo para admins.

## 6. Siguientes Pasos
Una vez configurado, puedes dejar de usar el servidor de Node/Express en Render ya que el Frontend se comunica directamente con Supabase. 
