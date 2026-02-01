'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Heart, User, Contact } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';

export default function MobileNavbar() {
    const pathname = usePathname();
    const { favoritesCount } = useFavorites();

    const navItems = [
        { name: 'Inicio', href: '/', icon: Home },
        { name: 'Directorio', href: '/listings', icon: Search },
        { name: 'Favoritos', href: '/favorites', icon: Heart, badge: favoritesCount },
        { name: 'Contacto', href: '/contact', icon: Contact },
    ];

    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] px-4 pb-4 pt-2">
            <nav className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] rounded-[2rem] flex items-center justify-around h-16 px-2 relative overflow-hidden">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`relative flex flex-col items-center justify-center w-full h-full transition-all duration-300 ${isActive ? 'text-orange-600' : 'text-gray-400'
                                }`}
                        >
                            {/* Active Background Glow */}
                            {isActive && (
                                <div className="absolute inset-0 bg-orange-500/10 blur-xl rounded-full scale-75 animate-pulse"></div>
                            )}

                            <div className="relative">
                                <Icon
                                    size={22}
                                    strokeWidth={isActive ? 2.5 : 2}
                                    className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'scale-100 hover:scale-105'}`}
                                />

                                {/* Badge for Favorites */}
                                {item.badge !== undefined && item.badge > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">
                                        {item.badge > 9 ? '9+' : item.badge}
                                    </span>
                                )}
                            </div>

                            <span className={`text-[10px] font-bold mt-1 uppercase tracking-tighter transition-all duration-300 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
                                }`}>
                                {item.name}
                            </span>

                            {/* Active Dot */}
                            {isActive && (
                                <div className="absolute bottom-1 w-1 h-1 bg-orange-600 rounded-full shadow-[0_0_8px_rgba(234,88,12,0.6)]"></div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Safe Area Spacer for iOS/Android notches */}
            <div className="h-[env(safe-area-inset-bottom)]"></div>
        </div>
    );
}
