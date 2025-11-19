-- ============================================
-- Database initialization script for DondeOficial MVP
-- ============================================
-- Este script crea todas las tablas, índices y datos iniciales
-- Ejecutar COMPLETAMENTE desde el inicio hasta el final
-- ============================================

-- ============================================
-- STEP 1: CREATE ALL TABLES
-- ============================================

-- Create users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(200) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create refresh_tokens table for managing refresh tokens
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens (user_id);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token ON refresh_tokens (token);

-- Insert default admin user
-- Password: admin123 (IMPORTANTE: Cambiar en producción)
INSERT INTO
    users (email, password, full_name)
VALUES (
        'admin@dondeoficial.com',
        '$2a$12$girc3Yd2Y9eC9mQLrSVkje5qWLNkDlQat26AhqlbYygkTlQr2056i', -- hashed password for 'admin123*'
        'Karen Zarate'
    ) ON CONFLICT (email) DO NOTHING;

-- Tabla: categories
-- Almacena las categorías de negocios
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: businesses
-- Almacena la información de los negocios
CREATE TABLE IF NOT EXISTS businesses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(100),
    website VARCHAR(200),
    category_id INTEGER REFERENCES categories (id),
    opening_hours TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_business_name UNIQUE (name),
    CONSTRAINT unique_business_email UNIQUE (email)
);

-- Tabla: business_images
-- Almacena las imágenes de los negocios (integración con Cloudinary)
CREATE TABLE IF NOT EXISTS business_images (
    id SERIAL PRIMARY KEY,
    business_id INTEGER NOT NULL REFERENCES businesses (id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    cloudinary_public_id TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: leads
-- Almacena los leads del formulario de contacto
CREATE TABLE IF NOT EXISTS leads (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(200) NOT NULL,
    email VARCHAR(100) NOT NULL,
    subject VARCHAR(200),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_lead_email_fullname UNIQUE (email, full_name)
);

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

CREATE INDEX IF NOT EXISTS idx_reviews_business_id ON reviews (business_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews (created_at DESC);

-- Tabla: newsletter_subscribers
-- Almacena los suscriptores del newsletter
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- STEP 2: CREATE INDEXES
-- ============================================

-- Índices para mejorar el rendimiento de las consultas

-- Índice para búsquedas por categoría
CREATE INDEX IF NOT EXISTS idx_businesses_category ON businesses (category_id);

-- Índice para búsquedas por nombre
CREATE INDEX IF NOT EXISTS idx_businesses_name ON businesses (name);

-- Índice para búsquedas por ubicación (geolocalización)
CREATE INDEX IF NOT EXISTS idx_businesses_location ON businesses (latitude, longitude);

-- Índice para búsquedas de imágenes por negocio
CREATE INDEX IF NOT EXISTS idx_business_images_business_id ON business_images (business_id);

-- ============================================
-- STEP 3: INSERT SAMPLE DATA
-- ============================================

-- Insertar categorías de ejemplo
INSERT INTO
    categories (name, description)
VALUES (
        'Restaurant',
        'Popular restaurants in your area'
    ),
    (
        'Museums',
        'Museums and cultural attractions'
    ),
    (
        'Game Field',
        'Sports and gaming venues'
    ),
    (
        'Job & Feed',
        'Professional services and agencies'
    ),
    (
        'Party Center',
        'Event and party venues'
    ),
    (
        'Fitness Zone',
        'Gyms and fitness centers'
    ) ON CONFLICT (name) DO NOTHING;

-- Insertar negocios de ejemplo
INSERT INTO
    businesses (
        name,
        description,
        address,
        phone,
        email,
        website,
        category_id,
        opening_hours
    )
VALUES (
        'Food Corner',
        'Popular restaurant in california serving delicious meals and great ambiance',
        'California, USA',
        '+98 (265) 3652 - 05',
        'info@foodcorner.com',
        'https://foodcorner.com',
        1,
        'Open'
    ),
    (
        'Central History',
        'Experience the rich history and culture at our central history museum',
        'California, USA',
        '+98 (265) 3652 - 05',
        'info@centralhistory.com',
        'https://centralhistory.com',
        2,
        'Open'
    ),
    (
        'Xtream Gym',
        'Modern fitness center with state-of-the-art equipment and professional trainers',
        'California, USA',
        '+98 (265) 3652 - 05',
        'info@xtreamgym.com',
        'https://xtreamgym.com',
        6,
        'Close'
    ),
    (
        'Mega Agency',
        'Professional recruitment agency connecting talent with opportunities',
        'California, USA',
        '+98 (265) 3652 - 05',
        'info@megaagency.com',
        'https://megaagency.com',
        4,
        'Open'
    ),
    (
        'Central Plaza',
        'Shopping and entertainment center in the heart of the city',
        'California, USA',
        '+98 (265) 3652 - 05',
        'info@centralplaza.com',
        'https://centralplaza.com',
        5,
        'Close'
    ),
    (
        'National Art',
        'Contemporary art gallery showcasing local and international artists',
        'California, USA',
        '+98 (265) 3652 - 05',
        'info@nationalart.com',
        'https://nationalart.com',
        2,
        'Open'
    ),
    (
        'Gym Ground',
        'Professional sports facility offering various fitness activities',
        'California, USA',
        '+98 (265) 3652 - 05',
        'info@gymground.com',
        'https://gymground.com',
        6,
        'Close'
    ),
    (
        'City Palace',
        'Elegant venue for special events and celebrations',
        'California, USA',
        '+98 (265) 3652 - 05',
        'info@citypalace.com',
        'https://citypalace.com',
        5,
        'Open'
    ),
    (
        'Pizza Recipe',
        'Authentic Italian pizzeria with traditional recipes and fresh ingredients',
        'California, USA',
        '+98 (265) 3652 - 05',
        'info@pizzarecipe.com',
        'https://pizzarecipe.com',
        1,
        'Open'
    ) ON CONFLICT DO NOTHING;

-- Insertar leads de ejemplo (formulario de contacto)
INSERT INTO
    leads (
        full_name,
        email,
        subject,
        message
    )
VALUES (
        'Ana Torres',
        'ana.torres@email.com',
        'Consulta sobre servicios',
        'Hola, me gustaría conocer más información sobre sus servicios.'
    ),
    (
        'Carlos Rivera',
        'carlos.rivera@email.com',
        'Soporte técnico',
        'Tengo problemas al registrar mi negocio en la plataforma. ¿Me pueden ayudar?'
    ),
    (
        'Lucía Fernández',
        'lucia.fernandez@email.com',
        'Oportunidad de colaboración',
        'Me interesa una colaboración con DondeOficial. Por favor, contáctenme.'
    ) ON CONFLICT ON CONSTRAINT unique_lead_email_fullname DO NOTHING;

-- Insertar suscriptores de newsletter de ejemplo
INSERT INTO
    newsletter_subscribers (email)
VALUES ('sofia.mendez@email.com'),
    ('rob.robles@email.com'),
    ('patricia.gomez@email.com') ON CONFLICT (email) DO NOTHING;

-- ============================================
-- SCRIPT COMPLETADO
-- ============================================
-- Verificar que todas las tablas se crearon correctamente:
-- SELECT table_name FROM information_schema.tables
-- WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
-- ============================================