-- Agregar campos de redes sociales y WhatsApp a la tabla businesses
ALTER TABLE businesses 
ADD COLUMN IF NOT EXISTS facebook_url VARCHAR(255),
ADD COLUMN IF NOT EXISTS instagram_url VARCHAR(255),
ADD COLUMN IF NOT EXISTS tiktok_url VARCHAR(255),
ADD COLUMN IF NOT EXISTS whatsapp_url VARCHAR(255);

-- Crear índices para mejorar las consultas
CREATE INDEX IF NOT EXISTS idx_businesses_facebook ON businesses(facebook_url) WHERE facebook_url IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_businesses_instagram ON businesses(instagram_url) WHERE instagram_url IS NOT NULL;

