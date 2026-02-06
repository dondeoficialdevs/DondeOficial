import { MetadataRoute } from 'next';
import { settingsApi } from '@/lib/api';

export default async function manifest(): Promise<MetadataRoute.Manifest> {
    const settings = await settingsApi.getSettings();

    const siteName = settings?.site_name || 'DondeOficial';
    const pwaIcon = settings?.pwa_icon_url || '/icon-192.png';

    return {
        name: `${siteName} - Directorio de Negocios`,
        short_name: siteName,
        description: `Encuentra negocios y servicios en ${siteName}. El directorio comercial más completo`,
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: settings?.primary_color || '#2563eb',
        orientation: 'portrait-primary',
        icons: [
            {
                src: pwaIcon,
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any',
            },
            {
                src: pwaIcon,
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any maskable',
            },
        ],
        categories: ['business', 'shopping', 'utilities'],
        shortcuts: [
            {
                name: 'Añadir Negocio',
                short_name: 'Añadir',
                description: 'Añade tu negocio al directorio',
                url: '/add-listing',
                icons: [{ src: pwaIcon, sizes: '192x192', type: 'image/png' }]
            },
            {
                name: 'Explorar',
                short_name: 'Explorar',
                description: 'Explora todos los negocios',
                url: '/listings',
                icons: [{ src: pwaIcon, sizes: '192x192', type: 'image/png' }]
            }
        ]
    };
}
