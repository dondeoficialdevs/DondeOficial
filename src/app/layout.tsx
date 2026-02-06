import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MainLayout from "@/components/MainLayout";
import { settingsApi } from "@/lib/api";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await settingsApi.getSettings();
  const siteName = settings?.site_name || "DondeOficial";
  const useFavorite = settings?.use_favorite_favicon ?? false;
  const faviconPath = useFavorite ? '/favicons/favorite' : '/favicons/classic';
  const v = settings?.updated_at ? new Date(settings.updated_at).getTime() : Date.now();

  const icons: any = {
    icon: [
      { url: `${faviconPath}/favicon.ico?v=${v}`, sizes: "any" },
      { url: settings?.pwa_icon_url ? `${settings.pwa_icon_url}?v=${v}` : `${faviconPath}/icon-192.png?v=${v}`, sizes: "192x192", type: "image/png" },
      { url: settings?.pwa_icon_url ? `${settings.pwa_icon_url}?v=${v}` : `${faviconPath}/icon-512.png?v=${v}`, sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: settings?.pwa_icon_url ? `${settings.pwa_icon_url}?v=${v}` : `${faviconPath}/apple-icon.png?v=${v}`, sizes: "180x180", type: "image/png" },
    ],
  };

  return {
    title: siteName,
    description: "Encuentra negocios y servicios en tu ciudad",
    manifest: "/manifest.webmanifest",
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: siteName,
    },
    icons,
    openGraph: {
      type: "website",
      siteName: siteName,
    },
    other: {
      "apple-mobile-web-app-capable": "yes",
      "apple-mobile-web-app-status-bar-style": "default",
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#f97316",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        {/* Prevenir caché del navegador */}
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
      </head>
      <MainLayout>{children}</MainLayout>
    </html>
  );
}

