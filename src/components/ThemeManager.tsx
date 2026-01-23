'use client';

import { useEffect } from 'react';
import { useSettings } from '@/hooks/useSettings';

export default function ThemeManager() {
    const { settings } = useSettings();

    useEffect(() => {
        if (!settings) return;

        const root = document.documentElement;

        // Aplicar colores globales como variables CSS
        if (settings.primary_color) {
            root.style.setProperty('--primary-color', settings.primary_color);
        }
        if (settings.secondary_color) {
            root.style.setProperty('--secondary-color', settings.secondary_color);
        }
        if (settings.bg_color) {
            root.style.setProperty('--site-bg', settings.bg_color);
        }
        if (settings.header_color) {
            root.style.setProperty('--header-bg', settings.header_color);
        }
        if (settings.footer_color) {
            root.style.setProperty('--footer-bg', settings.footer_color);
        }
        if (settings.gradient_direction) {
            const direction = settings.gradient_direction === 'vertical' ? 'to bottom' : 'to right';
            root.style.setProperty('--gradient-direction', direction);
        }
    }, [settings]);

    return null; // Este componente no renderiza nada, solo inyecta estilos
}
