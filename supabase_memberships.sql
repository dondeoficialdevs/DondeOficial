-- Create membership_plans table
CREATE TABLE IF NOT EXISTS membership_plans (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    level INTEGER NOT NULL CHECK (level IN (1, 2, 3)),
    monthly_price DECIMAL(10, 2) NOT NULL,
    yearly_price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    features TEXT[] DEFAULT '{}',
    badge_text TEXT,
    is_popular BOOLEAN DEFAULT FALSE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add membership_id and level to businesses
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'businesses' AND COLUMN_NAME = 'level') THEN
        ALTER TABLE businesses ADD COLUMN level INTEGER DEFAULT 1;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'businesses' AND COLUMN_NAME = 'membership_id') THEN
        ALTER TABLE businesses ADD COLUMN membership_id INTEGER REFERENCES membership_plans(id);
    END IF;
END $$;

-- Seed initial plans
INSERT INTO membership_plans (name, level, monthly_price, yearly_price, description, features, badge_text, is_popular)
VALUES 
('Básico', 1, 0, 0, 'Presencia esencial en nuestro directorio comercial.', ARRAY['Listado estandard', 'Información de contacto', '1 Foto de perfil', 'Mapa de ubicación'], 'GRATIS', false),
('Destacado (Slider)', 2, 49900, 499000, 'Visibilidad premium en nuestro carrusel principal.', ARRAY['Todo lo del plan Básico', 'Presencia en el Slider principal', 'Hasta 10 fotos', 'Botón directo a WhatsApp', 'Soporte prioritario'], 'RECOMENDADO', true),
('Elite (Pop-up)', 3, 99900, 999000, 'Máximo impacto con anuncios emergentes exclusivos.', ARRAY['Todo lo del plan Slider', 'Anuncios Pop-up emergentes', 'Perfil verificado premium', 'Estadísticas de visitas', 'Publicidad en Redes Sociales'], 'MÁXIMO NIVEL', false)
ON CONFLICT DO NOTHING;
