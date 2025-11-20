-- Script para agregar campos de precio y ofertas a la tabla businesses
-- Ejecutar este script en tu base de datos PostgreSQL

-- Agregar campo de precio (precio mínimo en pesos colombianos)
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS price DECIMAL(10, 2);

-- Agregar campo de precio con oferta (precio con descuento)
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS offer_price DECIMAL(10, 2);

-- Agregar campo para indicar si tiene oferta activa
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS has_offer BOOLEAN DEFAULT FALSE;

-- Agregar campo para descripción de la oferta
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS offer_description TEXT;

-- Crear índice para mejorar la búsqueda por precio
CREATE INDEX IF NOT EXISTS idx_businesses_price ON businesses (price);
CREATE INDEX IF NOT EXISTS idx_businesses_has_offer ON businesses (has_offer);

