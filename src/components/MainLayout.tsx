'use client';

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileNavbar from "@/components/MobileNavbar";
import ThemeManager from "@/components/ThemeManager";
import UpdateNotificationClient from "@/components/UpdateNotificationClient";
import { SettingsProvider } from "@/context/SettingsContext";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdminPath = pathname?.startsWith('/admin');

    return (
        <body className="antialiased">
            <SettingsProvider>
                <Header />
                <main className="pb-24 lg:pb-0">
                    {children}
                </main>
                <MobileNavbar />
                <Footer />
                <ThemeManager />
                <UpdateNotificationClient />
            </SettingsProvider>
        </body>
    );
}
