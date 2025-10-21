-- Database initialization script for DondeOficial MVP

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create businesses table
CREATE TABLE IF NOT EXISTS businesses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(100),
    website VARCHAR(200),
    category_id INTEGER REFERENCES categories(id),
    opening_hours TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_businesses_category ON businesses(category_id);
CREATE INDEX IF NOT EXISTS idx_businesses_name ON businesses(name);
CREATE INDEX IF NOT EXISTS idx_businesses_location ON businesses(latitude, longitude);

-- Insert sample categories matching the original site
INSERT INTO categories (name, description) VALUES
('Restaurant', 'Popular restaurants in your area'),
('Museums', 'Museums and cultural attractions'),
('Game Field', 'Sports and gaming venues'),
('Job & Feed', 'Professional services and agencies'),
('Party Center', 'Event and party venues'),
('Fitness Zone', 'Gyms and fitness centers')
ON CONFLICT (name) DO NOTHING;

-- Insert sample businesses matching the original site style
INSERT INTO businesses (name, description, address, phone, email, website, category_id, opening_hours) VALUES
('Food Corner', 'Popular restaurant in california serving delicious meals and great ambiance', 'California, USA', '+98 (265) 3652 - 05', 'info@foodcorner.com', 'https://foodcorner.com', 1, 'Open'),
('Central History', 'Experience the rich history and culture at our central history museum', 'California, USA', '+98 (265) 3652 - 05', 'info@centralhistory.com', 'https://centralhistory.com', 2, 'Open'),
('Xtream Gym', 'Modern fitness center with state-of-the-art equipment and professional trainers', 'California, USA', '+98 (265) 3652 - 05', 'info@xtreamgym.com', 'https://xtreamgym.com', 6, 'Close'),
('Mega Agency', 'Professional recruitment agency connecting talent with opportunities', 'California, USA', '+98 (265) 3652 - 05', 'info@megaagency.com', 'https://megaagency.com', 4, 'Open'),
('Central Plaza', 'Shopping and entertainment center in the heart of the city', 'California, USA', '+98 (265) 3652 - 05', 'info@centralplaza.com', 'https://centralplaza.com', 5, 'Close'),
('National Art', 'Contemporary art gallery showcasing local and international artists', 'California, USA', '+98 (265) 3652 - 05', 'info@nationalart.com', 'https://nationalart.com', 2, 'Open'),
('Gym Ground', 'Professional sports facility offering various fitness activities', 'California, USA', '+98 (265) 3652 - 05', 'info@gymground.com', 'https://gymground.com', 6, 'Close'),
('City Palace', 'Elegant venue for special events and celebrations', 'California, USA', '+98 (265) 3652 - 05', 'info@citypalace.com', 'https://citypalace.com', 5, 'Open'),
('Pizza Recipe', 'Authentic Italian pizzeria with traditional recipes and fresh ingredients', 'California, USA', '+98 (265) 3652 - 05', 'info@pizzarecipe.com', 'https://pizzarecipe.com', 1, 'Open')
ON CONFLICT DO NOTHING;
