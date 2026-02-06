# Arquitectura y Escalabilidad - DondeOficial

Este documento detalla la estructura técnica del proyecto y las pautas para su expansión futura, diseñado tanto para desarrolladores humanos como para editores de IA.

## Stack Tecnológico
- **Frontend**: Next.js 15 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS 4.0
- **Base de Datos & Auth**: Supabase
- **Almacenamiento**: Supabase Storage
- **Iconos**: Lucide React

## Estructura de Carpetas
```text
src/
├── app/              # Rutas y páginas (App Router)
│   ├── admin/        # Panel de administración protegido
│   ├── api/          # Endpoints internos (si hay)
│   └── layout.tsx    # Layout raíz y metadatos dinámicos
├── components/       # Componentes React reutilizables
│   ├── admin/        # Componentes específicos de administración
│   └── ui/           # (Opcional) Componentes básicos de interfaz
├── context/          # Contextos de React (Ajustes, Auth)
├── hooks/            # Hooks personalizados (useSettings, etc)
├── lib/              # Configuraciones de bibliotecas (api.ts, supabase.ts)
├── types/            # Definiciones de interfaces TypeScript
└── utils/            # Funciones de utilidad
```

## Patrones de Diseño & Implementación

### 1. Gestión de Ajustes Globales
Cualquier configuración que deba ser administrable (colores, logos, nombres) debe seguir este flujo:
1.  Agregar campo en tabla `site_settings` de Supabase.
2.  Actualizar la interfaz `SiteSettings` en `src/types/index.ts`.
3.  Actualizar `settingsApi` en `src/lib/api.ts`.
4.  Consumir mediante el hook `useSettings()` o el contexto.

### 2. Escalabilidad de Datos
Para agregar nuevos módulos (ej. "Eventos" o "Blog"):
- **Base de Datos**: Crear la tabla en Supabase siguiendo el esquema relacional existente (ej. linked con `businesses`).
- **API Layer**: Agregar un nuevo objeto exportado en `src/lib/api.ts` (ej. `eventsApi`) para mantener la consistencia.
- **Tipado**: Definir interfaces claras en `src/types`.

### 3. Rendimiento & Estética
- **Imágenes**: Se ha implementado una política de "Cero Gradients" sobre imágenes para mantener una estética limpia y profesional.
- **Carga**: Utilizar `dynamic` de Next.js para componentes pesados o que usen APIs del navegador (ej. Mapas).

## Guía para Editores IA (MCP)
- **Principios de Estilo**: No usar degradados oscuros sobre imágenes (`from-black/X`).
- **Nomenclatura**: Usar PascalCase para componentes y camelCase para funciones/variables.
- **Supabase**: Siempre verificar si una columna existe en la tabla antes de implementar una actualización masiva.
- **Metadatos**: La generación de metadatos es dinámica en `layout.tsx` a través de `settingsApi.getSettings()`.
