'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SiteSettings } from '@/types';
import { settingsApi } from '@/lib/api';

// Fallback values
const DEFAULT_LOGO = '/images/logo/Logo_Dondel.png';

const DEFAULT_SETTINGS: SiteSettings = {
    id: 0,
    logo_url: DEFAULT_LOGO,
    footer_logo_url: DEFAULT_LOGO,
    site_name: 'DondeOficial',
    primary_color: '#f97316',
    secondary_color: '#ea580c',
    header_color: '#ffffff',
    footer_color: '#111827',
    bg_color: '#f9fafb',
    gradient_direction: 'horizontal',
    footer_description: 'La plataforma definitiva para descubrir los tesoros ocultos de tu ciudad. Calidad, confianza y los mejores precios en un solo lugar.',
    footer_phone: '+57 322 411 7575',
    footer_email: 'dondeoficial@gmail.com',
    footer_address: 'Tunja, Boyacá',
    facebook_url: 'https://www.facebook.com/profile.php?id=61573619618382',
    instagram_url: 'https://www.instagram.com/dondeoficial',
    tiktok_url: '#',
    youtube_url: '#'
};

interface SettingsContextType {
    settings: SiteSettings;
    loading: boolean;
    logoUrl: string;
    footerLogoUrl: string;
    refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
    const [loading, setLoading] = useState(true);
    const [logoUrl, setLogoUrl] = useState(DEFAULT_LOGO);
    const [footerLogoUrl, setFooterLogoUrl] = useState(DEFAULT_LOGO);

    // Initialize from localStorage immediately to avoid flicker
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const cached = localStorage.getItem('site_settings');
            if (cached) {
                try {
                    const parsed = JSON.parse(cached);
                    setSettings(parsed);
                    setLogoUrl(parsed.logo_url || DEFAULT_LOGO);
                    setFooterLogoUrl(parsed.footer_logo_url || parsed.logo_url || DEFAULT_LOGO);
                    setLoading(false); // Optimistic loading
                } catch (e) {
                    console.error('Error parsing cached settings', e);
                }
            }
        }
    }, []);

    const fetchSettings = useCallback(async () => {
        try {
            const data = await settingsApi.getSettings();
            if (data) {
                // Merge with defaults to ensure all fields exist
                const mergedSettings = { ...DEFAULT_SETTINGS, ...data };

                setSettings(mergedSettings);
                setLogoUrl(mergedSettings.logo_url || DEFAULT_LOGO);
                setFooterLogoUrl(mergedSettings.footer_logo_url || mergedSettings.logo_url || DEFAULT_LOGO);

                // Update cache
                if (typeof window !== 'undefined') {
                    localStorage.setItem('site_settings', JSON.stringify(mergedSettings));
                }
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial fetch
    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    return (
        <SettingsContext.Provider value={{ settings, loading, logoUrl, footerLogoUrl, refreshSettings: fetchSettings }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettingsContext() {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettingsContext must be used within a SettingsProvider');
    }
    return context;
}
