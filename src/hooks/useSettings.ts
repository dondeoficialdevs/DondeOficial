'use client';

import { useState, useEffect } from 'react';
import { settingsApi } from '@/lib/api';
import { SiteSettings } from '@/types';

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

    const logoUrl = settings?.logo_url || '/images/logo/Logo_Dondel.png';

    return { settings, loading, logoUrl, refreshSettings: fetchSettings };
}
