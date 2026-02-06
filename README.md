# DondeOficial - Directorio Comercial Pro

Directorio comercial moderno y escalable construido con **Next.js 15**, **React 19** y **Supabase**. Diseñado para ofrecer una estética limpia, nítida y profesional en todos los dispositivos.

## Características Principales

- **PWA (Progressive Web App)**: Instalable en dispositivos móviles con iconos administrables desde el panel.
- **Ajustes Globales Dinámicos**: Control total de colores, logos, redes sociales y metadatos desde el administrador.
- **Estética Limpia**: Política de imágenes nítidas, eliminando degradados oscuros innecesarios.
- **Optimización Móvil**: Interfaz adaptativa que prioriza el contenido clave en pantallas pequeñas.
- **Soporte IA**: Incluye guías de arquitectura (`ARCHITECTURE.md`) diseñadas para que agentes de IA puedan escalar el proyecto sin errores.

## Stack Tecnológico

- **Frontend**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
- **Base de Datos & Auth**: [Supabase](https://supabase.com/)
- **Estilos**: [Tailwind CSS 4.0](https://tailwindcss.com/)
- **Iconos**: [Lucide React](https://lucide.dev/)

## Instalación y Configuración

1. **Dependencias**:
   ```bash
   npm install
   ```

2. **Variables de Entorno**:
   Crea un archivo `.env.local` con tus credenciales de Supabase:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=tu_url_aqui
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_llave_aqui
   ```

3. **Desarrollo**:
   ```bash
   npm run dev
   ```

4. **Producción**:
   ```bash
   npm run build
   npm start
   ```

## Arquitectura y Escalabilidad

Consulta el archivo [ARCHITECTURE.md](file:///e:/DirectorioComercial/ARCHITECTURE.md) para entender:
- Estructura de carpetas y flujo de datos.
- Cómo añadir nuevos módulos y tablas.
- Patrones de diseño de identidad visual.

## Soporte para Editores de IA

Este proyecto utiliza el sistema de **Knowledge Items** para que los asistentes de IA puedan entender rápidamente el contexto del negocio y las reglas técnicas establecidas. Consulte `/ARCHITECTURE.md` para guías de implementación.