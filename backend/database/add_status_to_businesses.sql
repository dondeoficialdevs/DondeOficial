-- Agregar campo status a la tabla businesses
-- Valores posibles: 'pending', 'approved', 'rejected'
ALTER TABLE businesses 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'));

-- Actualizar negocios existentes a 'approved' para que sigan siendo visibles
UPDATE businesses SET status = 'approved' WHERE status IS NULL OR status = 'pending';

-- Crear índice para mejorar las consultas por status
CREATE INDEX IF NOT EXISTS idx_businesses_status ON businesses(status);

