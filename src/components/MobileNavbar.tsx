'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Search, Heart, MessageSquare, X } from 'lucide-react';
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
        { name: 'Contacto', href: '/contact', icon: MessageSquare },
    ];

    return (
        <>
            {/* Premium Search Modal */}
            {showSearch && (
                <div className="fixed inset-0 z-[110] flex flex-col bg-white/80 backdrop-blur-2xl animate-in fade-in duration-500">
                    <div className="p-6 pt-12">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-black uppercase tracking-tighter">Buscar</h2>
                            <button
                                onClick={() => setShowSearch(false)}
                                className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-full text-gray-900"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSearch} className="relative">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-orange-500" strokeWidth={2.5} />
                            <input
                                type="text"
                                placeholder="¿Qué estás buscando?"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                autoFocus
                                className="w-full pl-14 pr-6 py-5 bg-gray-50 border-none rounded-[2rem] 
                                    text-xl text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-orange-500/20 
                                    transition-all font-bold"
                            />
                        </form>

                        <div className="mt-8">
                            <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Sugerencias</p>
                            <div className="flex flex-wrap gap-2">
                                {['Restaurantes', 'Hoteles', 'Servicios', 'Tiendas'].map(tag => (
                                    <button
                                        key={tag}
                                        onClick={() => { setSearchTerm(tag); }}
                                        className="px-4 py-2 bg-gray-100 rounded-full text-sm font-bold text-gray-600"
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Capsule Navbar */}
            <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] w-[92%] max-w-md">
                <nav className="bg-black/90 backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-[2.5rem] flex items-center justify-around h-20 px-4 relative overflow-hidden">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        if (item.isSearch) {
                            return (
                                <button
                                    key="search"
                                    onClick={() => setShowSearch(true)}
                                    className="relative flex flex-col items-center justify-center w-full h-full text-gray-400 hover:text-white transition-all active:scale-90"
                                >
                                    <Icon size={24} strokeWidth={2.5} />
                                    <span className="text-[10px] font-black mt-1 uppercase tracking-tighter">Buscar</span>
                                </button>
                            );
                        }

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`relative flex flex-col items-center justify-center w-full h-full transition-all duration-300 ${isActive ? 'text-white' : 'text-gray-400 hover:text-gray-200'
                                    } active:scale-90`}
                            >
                                <div className="relative">
                                    <Icon
                                        size={24}
                                        strokeWidth={isActive ? 3 : 2}
                                    />

                                    {/* Badge for Favorites */}
                                    {item.badge !== undefined && item.badge > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-[9px] font-black w-4.5 h-4.5 flex items-center justify-center rounded-full border-2 border-black">
                                            {item.badge > 9 ? '9+' : item.badge}
                                        </span>
                                    )}
                                </div>

                                <span className={`text-[10px] font-black mt-1 uppercase tracking-tighter ${isActive ? 'opacity-100' : 'opacity-60'
                                    }`}>
                                    {item.name}
                                </span>

                                {/* Active Indicator Glow */}
                                {isActive && (
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 blur-xl rounded-full -z-10"></div>
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </>
    );
}
