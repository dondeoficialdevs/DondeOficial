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

export async function generateMetadata(): Promise<Metadata> {
  const settings = await settingsApi.getSettings();
  const useFavorite = settings?.use_favorite_favicon ?? false;
  const faviconPath = useFavorite ? '/favicons/favorite' : '/favicons/classic';

  return {
    title: "DondeOficial",
    description: "Encuentra negocios y servicios en tu ciudad",
    manifest: "/manifest.json",
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: "DondeOficial",
    },
    icons: {
      icon: [
        { url: `${faviconPath}/favicon.ico`, sizes: "any" },
        { url: `${faviconPath}/icon-192.png`, sizes: "192x192", type: "image/png" },
        { url: `${faviconPath}/icon-512.png`, sizes: "512x512", type: "image/png" },
      ],
      apple: [
        { url: `${faviconPath}/apple-icon.png`, sizes: "180x180", type: "image/png" },
      ],
    },
    openGraph: {
      type: "website",
      siteName: "DondeOficial",
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

