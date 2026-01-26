'use client';

import { useState, useEffect } from 'react';
import { settingsApi } from '@/lib/api';
import { SiteSettings } from '@/types';

// Fallback values in case API fails or settings are not yet set
const DEFAULT_LOGO = '/images/logo/Logo_Dondel.png';
const DEFAULT_SETTINGS: SiteSettings = {
    id: 0,
    logo_url: DEFAULT_LOGO,
    site_name: 'DondeOficial',
    primary_color: '#f97316', // Orange
    secondary_color: '#ea580c',
    header_color: '#ffffff',
    footer_color: '#111827',
    bg_color: '#f9fafb',
    gradient_direction: 'horizontal'
};

export function useSettings() {
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchSettings = async () => {
        try {
            const data = await settingsApi.getSettings();
            setSettings(data);
        } catch (error) {
            console.error('Error in useSettings:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    // Ensure we always have a logo URL, even if the DB has an empty string
    const logoUrl = (settings?.logo_url && settings.logo_url.trim() !== '')
        ? settings.logo_url
        : DEFAULT_LOGO;

    return {
        settings: settings || DEFAULT_SETTINGS,
        loading,
        logoUrl,
        refreshSettings: fetchSettings
    };
}
