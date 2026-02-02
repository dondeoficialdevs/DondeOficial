'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Search, Heart, User, Contact, X } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { useState } from 'react';

export default function MobileNavbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { favoritesCount } = useFavorites();
    const [showSearch, setShowSearch] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            router.push(`/listings?search=${encodeURIComponent(searchTerm)}`);
            setShowSearch(false);
            setSearchTerm('');
        }
    };

    const navItems = [
        { name: 'Inicio', href: '/', icon: Home },
        { name: 'Buscar', href: '#', icon: Search, isSearch: true },
        { name: 'Favoritos', href: '/favorites', icon: Heart, badge: favoritesCount },
        { name: 'Contacto', href: '/contact', icon: Contact },
    ];

    return (
        <>
            {/* Search Modal */}
            {showSearch && (
                <div className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
                    onClick={() => setShowSearch(false)}>
                    <div className="fixed top-0 left-0 right-0 p-4 bg-white shadow-lg animate-in slide-in-from-top duration-300"
                        onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-3">
                            <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-500" strokeWidth={2.5} />
                                    <input
                                        type="text"
                                        placeholder="Buscar negocios..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        autoFocus
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl 
                                            text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-orange-400 
                                            focus:bg-white transition-all font-medium"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold 
                                        rounded-xl transition-all active:scale-95 shadow-sm"
                                >
                                    Buscar
                                </button>
                            </form>
                            <button
                                onClick={() => setShowSearch(false)}
                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <X size={24} className="text-slate-600" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] px-4 pb-4 pt-2">
                <nav className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] rounded-[2rem] flex items-center justify-around h-16 px-2 relative overflow-hidden">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        if (item.isSearch) {
                            return (
                                <button
                                    key="search"
                                    onClick={() => setShowSearch(true)}
                                    className="relative flex flex-col items-center justify-center w-full h-full transition-all duration-300 text-gray-400 hover:text-orange-500"
                                >
                                    <div className="relative">
                                        <Icon
                                            size={22}
                                            strokeWidth={2}
                                            className="transition-transform duration-300 hover:scale-105"
                                        />
                                    </div>
                                    <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter opacity-0">
                                        {item.name}
                                    </span>
                                </button>
                            );
                        }

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
        </>
    );
}
