-- Migration to add footer and social media fields to site_settings table

-- Check if columns exist before adding to avoid errors
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'site_settings' AND COLUMN_NAME = 'footer_logo_url') THEN
        ALTER TABLE site_settings ADD COLUMN footer_logo_url TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'site_settings' AND COLUMN_NAME = 'footer_description') THEN
        ALTER TABLE site_settings ADD COLUMN footer_description TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'site_settings' AND COLUMN_NAME = 'footer_phone') THEN
        ALTER TABLE site_settings ADD COLUMN footer_phone TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'site_settings' AND COLUMN_NAME = 'footer_email') THEN
        ALTER TABLE site_settings ADD COLUMN footer_email TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'site_settings' AND COLUMN_NAME = 'footer_address') THEN
        ALTER TABLE site_settings ADD COLUMN footer_address TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'site_settings' AND COLUMN_NAME = 'facebook_url') THEN
        ALTER TABLE site_settings ADD COLUMN facebook_url TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'site_settings' AND COLUMN_NAME = 'instagram_url') THEN
        ALTER TABLE site_settings ADD COLUMN instagram_url TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'site_settings' AND COLUMN_NAME = 'tiktok_url') THEN
        ALTER TABLE site_settings ADD COLUMN tiktok_url TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'site_settings' AND COLUMN_NAME = 'youtube_url') THEN
        ALTER TABLE site_settings ADD COLUMN youtube_url TEXT;
    END IF;
END $$;

-- Update existing row with default values if they are NULL (optional)
UPDATE site_settings 
SET 
    footer_description = COALESCE(footer_description, 'La plataforma definitiva para descubrir los tesoros ocultos de tu ciudad.'),
    footer_phone = COALESCE(footer_phone, '+57 322 411 7575'),
    footer_email = COALESCE(footer_email, 'dondeoficial@gmail.com'),
    footer_address = COALESCE(footer_address, 'Tunja, Boyacá'),
    footer_logo_url = COALESCE(footer_logo_url, logo_url),
    facebook_url = COALESCE(facebook_url, 'https://www.facebook.com/profile.php?id=61573619618382'),
    instagram_url = COALESCE(instagram_url, 'https://www.instagram.com/dondeoficial')
WHERE id = (SELECT id FROM site_settings LIMIT 1);
