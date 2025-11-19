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
        'Restaurantes populares en Tunja'
    ),
    (
        'Museums',
        'Museos y atracciones culturales en Tunja'
    ),
    (
        'Game Field',
        'Campos deportivos y lugares de entretenimiento'
    ),
    (
        'Job & Feed',
        'Servicios profesionales y agencias en Tunja'
    ),
    (
        'Party Center',
        'Salones de eventos y celebraciones'
    ),
    (
        'Fitness Zone',
        'Gimnasios y centros de acondicionamiento físico'
    ) ON CONFLICT (name) DO NOTHING;

-- Insertar negocios de ejemplo en Tunja, Colombia
INSERT INTO
    businesses (
        name,
        description,
        address,
        phone,
        email,
        website,
        category_id,
        opening_hours,
        latitude,
        longitude
    )
VALUES (
        'Asadero Moscovita',
        'Restaurante especializado en carnes asadas y comida típica colombiana. Ambiente acogedor y servicio de calidad',
        'Avenida Norte 54-72, Barrio La Granja, Tunja, Boyacá',
        '+57 310 123 4567',
        'contacto@moscovita.com',
        'https://moscovita.com',
        1,
        'Lun-Dom: 11:00 AM - 10:00 PM',
        5.5423,
        -73.3615
    ),
    (
        'Museo Casa del Fundador Gonzalo Suárez Rendón',
        'Museo histórico que expone la rica historia colonial de Tunja y la región boyacense',
        'Carrera 9 #19-56, Centro Histórico, Tunja, Boyacá',
        '+57 3229635412',
        'museo@tunja.gov.co',
        'https://tunja.gov.co/museo',
        2,
        'Mar-Dom: 9:00 AM - 5:00 PM',
        5.5331,
        -73.3683
    ),
    (
        'Xtream Gym Tunja',
        'Centro de acondicionamiento físico moderno con equipos de última generación y entrenadores profesionales',
        'Carrera 11 #22-45, Centro, Tunja, Boyacá',
        '+57 310 987 6543',
        'info@xtreamgymtunja.com',
        'https://xtreamgymtunja.com',
        6,
        'Lun-Sab: 5:00 AM - 10:00 PM, Dom: 8:00 AM - 6:00 PM',
        5.5367,
        -73.3645
    ),
    (
        'Agencia de Empleo Boyacá',
        'Agencia profesional de recursos humanos conectando talento con oportunidades laborales en la región',
        'Carrera 8 #21-67, Local 2, Edificio Centro K, Tunja, Boyacá',
        '+57 3008526496',
        'info@empleoboyaca.com',
        'https://empleoboyaca.com',
        4,
        'Lun-Vie: 8:00 AM - 6:00 PM',
        5.5355,
        -73.3677
    ),
    (
        'Salón de Eventos La Candelaria',
        'Elegante salón para eventos sociales y corporativos en el corazón de Tunja',
        'Carrera 10 #18-30, Centro Histórico, Tunja, Boyacá',
        '+57 310 555 8899',
        'eventos@candelaria.com',
        'https://saloncandelaria.com',
        5,
        'Lun-Dom: 10:00 AM - 11:00 PM',
        5.5342,
        -73.3689
    ),
    (
        'Galería de Arte Contemporáneo Boyacá',
        'Galería de arte que exhibe obras de artistas locales e internacionales',
        'Carrera 16 #34-45, Portal de San Gabriel, Barrio Gaitán, Tunja, Boyacá',
        '+57 320 777 2233',
        'info@galeriaboyaca.com',
        'https://galeriaboyaca.com',
        2,
        'Mar-Sab: 10:00 AM - 7:00 PM',
        5.5289,
        -73.3543
    ),
    (
        'Campo Deportivo El Libertador',
        'Instalaciones deportivas profesionales con canchas múltiples y espacios para entrenamiento',
        'Avenida Universitaria, Barrio La Glorieta, Tunja, Boyacá',
        '+57 310 444 7788',
        'contacto@campolibertador.com',
        'https://campolibertador.com',
        3,
        'Lun-Dom: 6:00 AM - 8:00 PM',
        5.5476,
        -73.3712
    ),
    (
        'Salón de Fiestas Los Portales',
        'Salón de eventos familiares y sociales con capacidad para grandes celebraciones',
        'Diagonal 38 #37-265, Barrio La María, Tunja, Boyacá',
        '+57 310 888 1122',
        'reservas@losportales.com',
        'https://losportales.com',
        5,
        'Lun-Dom: 12:00 PM - 12:00 AM',
        5.5134,
        -73.3821
    ),
    (
        'Pizzería La Tradición',
        'Pizzería artesanal con recetas tradicionales italianas e ingredientes frescos',
        'Carrera 9 #23-45, Centro, Tunja, Boyacá',
        '+57 310 666 3344',
        'pedidos@latradicion.com',
        'https://latradicion.com',
        1,
        'Lun-Dom: 12:00 PM - 11:00 PM',
        5.5353,
        -73.3677
    ),
    (
        'Gimnasio FitZone Tunja',
        'Centro de fitness completo con áreas de cardio, pesas, clases grupales y entrenamiento personalizado',
        'Carrera 11 #19-85, Centro, Tunja, Boyacá',
        '+57 320 999 4455',
        'info@fitzonetunja.com',
        'https://fitzonetunja.com',
        6,
        'Lun-Vie: 5:00 AM - 11:00 PM, Sab-Dom: 7:00 AM - 9:00 PM',
        5.5362,
        -73.3664
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