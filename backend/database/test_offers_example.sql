-- Ejemplo de cómo actualizar un negocio para que tenga oferta
-- Reemplaza el ID (1) con el ID de un negocio real de tu base de datos

-- Ejemplo 1: Agregar precio y oferta a un negocio existente
UPDATE businesses 
SET 
  price = 35000,
  offer_price = 25000,
  has_offer = TRUE,
  offer_description = 'Descuento especial del 28%'
WHERE id = 1;

-- Ejemplo 2: Verificar negocios con ofertas
SELECT id, name, price, offer_price, has_offer, offer_description 
FROM businesses 
WHERE has_offer = TRUE;

-- Ejemplo 3: Ver todos los negocios y sus precios
SELECT id, name, price, offer_price, has_offer 
FROM businesses 
ORDER BY id;

