-- Create membership_plans table
CREATE TABLE IF NOT EXISTS membership_plans (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    level INTEGER NOT NULL UNIQUE CHECK (level IN (1, 2, 3)),
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

-- Ensure membership_plans.level is unique (required for ON CONFLICT)
DO $$
BEGIN
    -- Optional: Clean up duplicates if they exist (keep only the first one of each level)
    DELETE FROM membership_plans 
    WHERE id NOT IN (
      SELECT min(id) FROM membership_plans GROUP BY level
    );

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'membership_plans_level_key' 
        OR (contype = 'u' AND conrelid = 'membership_plans'::regclass AND (pg_get_constraintdef(oid) LIKE '%(level)%'))
    ) THEN
        ALTER TABLE membership_plans ADD CONSTRAINT membership_plans_level_key UNIQUE (level);
    END IF;
EXCEPTION
    WHEN others THEN NULL; -- Ignore if already exists or other issues
END $$;

-- Seed initial plans
INSERT INTO membership_plans (name, level, monthly_price, yearly_price, description, features, badge_text, is_popular)
VALUES 
('Básico', 1, 0, 0, 'Presencia esencial en nuestro directorio comercial.', ARRAY['Listado estandard', 'Información de contacto', '1 Foto de perfil', 'Mapa de ubicación'], 'GRATIS', false),
('Destacado (Slider)', 2, 49900, 499000, 'Visibilidad premium en nuestro carrusel principal.', ARRAY['Todo lo del plan Básico', 'Presencia en el Slider principal', 'Hasta 10 fotos', 'Botón directo a WhatsApp', 'Soporte prioritario'], 'RECOMENDADO', true),
('Elite (Pop-up)', 3, 99900, 999000, 'Máximo impacto con anuncios emergentes exclusivos.', ARRAY['Todo lo del plan Slider', 'Anuncios Pop-up emergentes', 'Perfil verificado premium', 'Estadísticas de visitas', 'Publicidad en Redes Sociales'], 'MÁXIMO NIVEL', false)
ON CONFLICT (level) DO UPDATE SET
    name = EXCLUDED.name,
    monthly_price = EXCLUDED.monthly_price,
    yearly_price = EXCLUDED.yearly_price,
    description = EXCLUDED.description,
    features = EXCLUDED.features,
    badge_text = EXCLUDED.badge_text,
    is_popular = EXCLUDED.is_popular,
    updated_at = CURRENT_TIMESTAMP;

-- Create membership_requests table for checkout flow
CREATE TABLE IF NOT EXISTS membership_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    client_phone TEXT,
    plan_id INTEGER NOT NULL REFERENCES membership_plans(id),
    billing_cycle TEXT NOT NULL CHECK (billing_cycle IN ('monthly', 'yearly')),
    total_price DECIMAL(15, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
    business_id INTEGER,
    transaction_id TEXT,
    payment_method TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
