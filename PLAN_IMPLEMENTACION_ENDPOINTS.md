# Plan de Implementación - Endpoints Backend

## Resumen Ejecutivo

Este documento detalla el estado actual de la integración entre el frontend y el backend, identificando los endpoints que están implementados pero no utilizados, y proponiendo un plan de implementación.

## Estado Actual de Endpoints

### Endpoints Completamente Implementados y Utilizados

| Endpoint | Método | Estado API | Estado Frontend | Uso Actual |
|----------|--------|------------|-----------------|------------|
| `/api/businesses` | GET | ✅ | ✅ | Listar negocios (usado en múltiples páginas) |
| `/api/businesses/:id` | GET | ✅ | ✅ | Ver detalle de negocio (usado en `businesses/[id]/page.tsx`) |
| `/api/businesses` | POST | ✅ | ✅ | Crear negocio (usado en `add-listing/page.tsx`) |
| `/api/categories` | GET | ✅ | ✅ | Listar categorías (usado en múltiples páginas) |
| `/api/leads` | POST | ✅ | ✅ | Crear lead (usado en `contact/page.tsx`) |
| `/api/newsletter/subscribe` | POST | ✅ | ✅ | Suscribirse (usado en `NewsletterSection.tsx`) |

### Endpoints Implementados pero NO Utilizados

| Endpoint | Método | Estado API | Estado Frontend | Acción Requerida |
|----------|--------|------------|-----------------|------------------|
| `/api/businesses/:id` | PUT | ✅ | ✅ (api.ts) | ❌ No usado | Crear página/componente para editar negocios |
| `/api/businesses/:id` | DELETE | ✅ | ✅ (api.ts) | ❌ No usado | Agregar funcionalidad de eliminación |
| `/api/businesses/:id/images` | POST | ✅ | ✅ (api.ts) | ❌ No usado | Agregar funcionalidad para subir más imágenes |
| `/api/businesses/:businessId/images/:imageId` | DELETE | ✅ | ✅ (api.ts) | ❌ No usado | Agregar funcionalidad para eliminar imágenes |
| `/api/categories/:id` | GET | ✅ | ✅ (api.ts) | ❌ No usado | Opcional - puede ser útil para páginas de categoría |
| `/api/categories` | POST | ✅ | ✅ (api.ts) | ❌ No usado | Crear panel admin para gestionar categorías |
| `/api/leads` | GET | ✅ | ✅ (api.ts) | ❌ No usado | Crear panel admin para ver leads |
| `/api/leads/:id` | GET | ✅ | ✅ (api.ts) | ❌ No usado | Crear panel admin para ver detalle de lead |
| `/api/newsletter/subscribers` | GET | ✅ | ✅ (api.ts) | ❌ No usado | Crear panel admin para ver suscriptores |
| `/api/newsletter/subscribers/:id` | DELETE | ✅ | ✅ (api.ts) | ❌ No usado | Crear panel admin para eliminar suscriptores |
| `/api/health` | GET | ✅ | ✅ (api.ts) | ❌ No usado | Implementar health check en componente de estado |

## Plan de Implementación

### Fase 1: Gestión de Negocios (Prioridad Alta)

#### 1.1 Editar Negocio Existente
**Endpoint:** `PUT /api/businesses/:id`

**Implementación:**
- Crear página `frontend/src/app/businesses/[id]/edit/page.tsx`
- Reutilizar formulario de `add-listing/page.tsx` pero pre-cargado con datos existentes
- Agregar botón "Editar" en la página de detalle del negocio (`businesses/[id]/page.tsx`)
- Validar que solo se actualicen campos modificados

**Archivos a modificar:**
- `frontend/src/app/businesses/[id]/page.tsx` - Agregar botón de edición
- `frontend/src/app/businesses/[id]/edit/page.tsx` - Nueva página (crear)

#### 1.2 Eliminar Negocio
**Endpoint:** `DELETE /api/businesses/:id`

**Implementación:**
- Agregar botón "Eliminar" en la página de detalle del negocio
- Implementar confirmación antes de eliminar
- Redirigir a `/listings` después de eliminar exitosamente
- Mostrar mensaje de éxito/error

**Archivos a modificar:**
- `frontend/src/app/businesses/[id]/page.tsx` - Agregar funcionalidad de eliminación

#### 1.3 Agregar Imágenes a Negocio Existente
**Endpoint:** `POST /api/businesses/:id/images`

**Implementación:**
- Agregar sección en la página de detalle del negocio para subir más imágenes
- Reutilizar componente de carga de imágenes de `add-listing/page.tsx`
- Actualizar la galería después de subir nuevas imágenes

**Archivos a modificar:**
- `frontend/src/app/businesses/[id]/page.tsx` - Agregar sección de carga de imágenes

#### 1.4 Eliminar Imagen Específica
**Endpoint:** `DELETE /api/businesses/:businessId/images/:imageId`

**Implementación:**
- Agregar botón de eliminar en cada imagen de la galería
- Implementar confirmación antes de eliminar
- Actualizar la galería después de eliminar
- Si se elimina la imagen principal, marcar la siguiente como principal (si existe)

**Archivos a modificar:**
- `frontend/src/app/businesses/[id]/page.tsx` - Agregar funcionalidad de eliminación de imágenes

### Fase 2: Panel de Administración (Prioridad Media)

#### 2.1 Panel de Leads
**Endpoints:** `GET /api/leads`, `GET /api/leads/:id`

**Implementación:**
- Crear página `frontend/src/app/admin/leads/page.tsx`
- Listar todos los leads con paginación
- Mostrar: nombre, email, asunto, fecha de creación
- Permitir ver detalle completo de cada lead
- Implementar filtros y búsqueda

**Archivos a crear:**
- `frontend/src/app/admin/leads/page.tsx`
- `frontend/src/app/admin/leads/[id]/page.tsx` (opcional, para ver detalle)

#### 2.2 Panel de Suscriptores del Newsletter
**Endpoints:** `GET /api/newsletter/subscribers`, `DELETE /api/newsletter/subscribers/:id`

**Implementación:**
- Crear página `frontend/src/app/admin/newsletter/page.tsx`
- Listar todos los suscriptores con paginación
- Mostrar: email, fecha de suscripción
- Permitir eliminar suscriptores
- Exportar lista a CSV (opcional)

**Archivos a crear:**
- `frontend/src/app/admin/newsletter/page.tsx`

#### 2.3 Panel de Gestión de Categorías
**Endpoints:** `POST /api/categories`, `GET /api/categories/:id`

**Implementación:**
- Crear página `frontend/src/app/admin/categories/page.tsx`
- Listar todas las categorías
- Permitir crear nuevas categorías
- Permitir ver detalle de categoría (opcional)

**Archivos a crear:**
- `frontend/src/app/admin/categories/page.tsx`

### Fase 3: Mejoras y Utilidades (Prioridad Baja)

#### 3.1 Health Check
**Endpoint:** `GET /api/health`

**Implementación:**
- Crear componente `HealthCheck.tsx` para verificar estado del API
- Mostrar en página de administración o en footer (opcional)
- Útil para debugging y monitoreo

**Archivos a crear:**
- `frontend/src/components/HealthCheck.tsx` (opcional)

## Tipos TypeScript Requeridos

### Agregar a `frontend/src/types/index.ts`:

```typescript
export interface Lead {
  id: number;
  full_name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

export interface NewsletterSubscriber {
  id: number;
  email: string;
  subscribed_at: string;
}
```

**Nota:** Estos tipos ya están definidos en `api.ts` como interfaces locales. Deben moverse a `types/index.ts` para reutilización.

## Consideraciones de Seguridad

**Importante:** Según la documentación del backend, todos los endpoints son públicos y no requieren autenticación. Esto significa que:

1. Cualquier usuario puede editar o eliminar negocios
2. Cualquier usuario puede acceder al panel de administración
3. Cualquier usuario puede ver leads y suscriptores

**Recomendaciones:**
- Considerar implementar autenticación en el futuro
- Para MVP, puede ser aceptable, pero documentar esta limitación
- Considerar agregar validaciones adicionales en el frontend

## Priorización de Implementación

### Prioridad Alta (Implementar Primero)
1. Editar negocio existente
2. Eliminar negocio
3. Agregar imágenes a negocio existente
4. Eliminar imagen específica

**Razón:** Estas funcionalidades son esenciales para la gestión completa de negocios y mejoran significativamente la experiencia del usuario.

### Prioridad Media (Implementar Después)
1. Panel de Leads
2. Panel de Suscriptores del Newsletter
3. Panel de Gestión de Categorías

**Razón:** Estas funcionalidades son útiles para administración pero no son críticas para el funcionamiento básico de la aplicación.

### Prioridad Baja (Opcional)
1. Health Check
2. Ver detalle de categoría
3. Ver detalle de lead individual

**Razón:** Funcionalidades adicionales que pueden agregarse según necesidad.

## Checklist de Implementación

### Fase 1: Gestión de Negocios
- [ ] Crear página de edición de negocio
- [ ] Agregar botón "Editar" en página de detalle
- [ ] Agregar botón "Eliminar" en página de detalle
- [ ] Implementar confirmación de eliminación
- [ ] Agregar sección para subir más imágenes
- [ ] Agregar botón de eliminar en cada imagen
- [ ] Implementar actualización de galería después de cambios
- [ ] Mover tipos TypeScript a `types/index.ts`

### Fase 2: Panel de Administración
- [ ] Crear estructura de carpetas `/admin`
- [ ] Crear página de leads
- [ ] Crear página de suscriptores
- [ ] Crear página de categorías
- [ ] Implementar paginación en todas las listas
- [ ] Implementar búsqueda y filtros

### Fase 3: Mejoras
- [ ] Crear componente HealthCheck (opcional)
- [ ] Agregar validaciones adicionales en frontend
- [ ] Documentar limitaciones de seguridad

## Notas Técnicas

### Manejo de FormData para Actualización
El endpoint `PUT /api/businesses/:id` acepta `application/json`, no `multipart/form-data`. Esto significa que:
- Para actualizar solo datos del negocio: usar JSON
- Para agregar imágenes: usar endpoint separado `POST /api/businesses/:id/images`

### Manejo de Errores
Todos los endpoints devuelven errores en el formato:
```json
{
  "success": false,
  "message": "Descripción del error",
  "error": "Detalles técnicos (solo en desarrollo)"
}
```

El frontend ya tiene un interceptor en `api.ts` que maneja estos errores correctamente.

### Validación
El backend valida todos los datos con Joi. El frontend debe:
- Validar antes de enviar (mejor UX)
- Manejar errores de validación del backend (seguridad)

---

**Última actualización:** 2024
**Versión:** 1.0

