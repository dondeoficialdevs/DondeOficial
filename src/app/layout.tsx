import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import UpdateNotificationClient from "@/components/UpdateNotificationClient";
import ThemeManager from "@/components/ThemeManager";
import { SettingsProvider } from "@/context/SettingsContext";
import Header from "@/components/Header";
import MobileNavbar from "@/components/MobileNavbar";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
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
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
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
    <html lang="es">
      <head>
        {/* Prevenir caché del navegador */}
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
      </head>
      <LayoutContent>{children}</LayoutContent>
    </html>
  );
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPath = pathname?.startsWith('/admin');

  return (
    <body
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <SettingsProvider>
        {!isAdminPath && <Header />}
        <main className={!isAdminPath ? "pb-20 lg:pb-0" : ""}>
          {children}
        </main>
        {!isAdminPath && <MobileNavbar />}
        {!isAdminPath && <Footer />}
        <ThemeManager />
        <UpdateNotificationClient />
      </SettingsProvider>
    </body>
  );
}
