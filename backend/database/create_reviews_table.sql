-- Script para crear la tabla de reviews (calificaciones y comentarios)
-- Ejecutar este script en tu base de datos PostgreSQL
-- NOTA: Esta tabla también está incluida en init.sql
-- Usa este script solo si necesitas crear únicamente la tabla de reviews

-- Tabla: reviews
-- Almacena las calificaciones y comentarios de los negocios
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    business_id INTEGER NOT NULL REFERENCES businesses (id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    user_name VARCHAR(200),
    user_email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_reviews_business_id ON reviews (business_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews (created_at DESC);

-- Comentarios en la tabla (opcional, solo si tu PostgreSQL soporta COMMENT ON)
-- COMMENT ON TABLE reviews IS 'Almacena las calificaciones y comentarios de los negocios';
-- COMMENT ON COLUMN reviews.rating IS 'Calificación de 1 a 5 estrellas';
-- COMMENT ON COLUMN reviews.comment IS 'Comentario opcional del usuario';
-- COMMENT ON COLUMN reviews.user_name IS 'Nombre del usuario (opcional)';
-- COMMENT ON COLUMN reviews.user_email IS 'Email del usuario (opcional)';

