import { MetadataRoute } from 'next';
import { settingsApi } from '@/lib/api';

export const dynamic = 'force-dynamic';

export default async function manifest(): Promise<MetadataRoute.Manifest> {
    const settings = await settingsApi.getSettings();

    const siteName = settings?.site_name || 'DondeOficial';
    const v = settings?.updated_at ? new Date(settings.updated_at).getTime() : Date.now();
    const pwaIcon = settings?.pwa_icon_url ? `${settings.pwa_icon_url}?v=${v}` : `/icon-192.png?v=${v}`;
    const pwaIconLarge = settings?.pwa_icon_url ? `${settings.pwa_icon_url}?v=${v}` : `/icon-512.png?v=${v}`;

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
                src: pwaIconLarge,
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable',
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
