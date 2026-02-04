-- Migración para añadir soporte de Favicon Dinámico
-- Ejecuta este script en el SQL Editor de Supabase

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'site_settings' AND COLUMN_NAME = 'use_favorite_favicon') THEN
        ALTER TABLE site_settings ADD COLUMN use_favorite_favicon BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- Actualizar valor por defecto si es necesario
UPDATE site_settings SET use_favorite_favicon = FALSE WHERE use_favorite_favicon IS NULL;
