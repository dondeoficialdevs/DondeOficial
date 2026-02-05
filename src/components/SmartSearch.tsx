'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Sparkles, Navigation, X, Store, Tag, ArrowRight, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { businessApi, categoryApi } from '../lib/api';
import { Business, Category } from '../types';

interface SmartSearchProps {
    onSearch?: (search: string, location: string) => void;
}

const COLOMBIAN_CITIES = [
    { name: 'Tunja', department: 'Boyacá' },
    { name: 'Bogotá', department: 'Cundinamarca' },
    { name: 'Medellín', department: 'Antioquia' },
    { name: 'Cali', department: 'Valle del Cauca' },
    { name: 'Barranquilla', department: 'Atlántico' },
    { name: 'Duitama', department: 'Boyacá' },
    { name: 'Sogamoso', department: 'Boyacá' },
    { name: 'Villa de Leyva', department: 'Boyacá' },
    { name: 'Paipa', department: 'Boyacá' },
    { name: 'Bucaramanga', department: 'Santander' },
    { name: 'Cartagena', department: 'Bolívar' },
    { name: 'Pereira', department: 'Risaralda' },
    { name: 'Manizales', department: 'Caldas' },
    { name: 'Ibagué', department: 'Tolima' },
    { name: 'Villavicencio', department: 'Meta' },
    { name: 'Santa Marta', department: 'Magdalena' },
    { name: 'Cúcuta', department: 'Norte de Santander' },
];

export default function SmartSearch({ onSearch }: SmartSearchProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [location, setLocation] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [suggestions, setSuggestions] = useState<{ categories: Category[], businesses: Business[] }>({ categories: [], businesses: [] });
    const [locationSuggestions, setLocationSuggestions] = useState<typeof COLOMBIAN_CITIES>([]);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const locationRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
            if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
                setShowLocationSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Filter locations locally
    useEffect(() => {
        if (location.length >= 2) {
            const filtered = COLOMBIAN_CITIES.filter(city =>
                city.name.toLowerCase().includes(location.toLowerCase()) ||
                city.department.toLowerCase().includes(location.toLowerCase())
            );
            setLocationSuggestions(filtered);
            setShowLocationSuggestions(filtered.length > 0);
        } else {
            setLocationSuggestions([]);
            setShowLocationSuggestions(false);
        }
    }, [location]);

    // Debounced suggestion fetch
    useEffect(() => {
        const timer = setTimeout(async () => {
            const trimmedTerm = searchTerm.trim();
            if (trimmedTerm.length >= 2) {
                setIsLoadingSuggestions(true);
                setShowSuggestions(true);
                try {
                    const [cats, biz] = await Promise.all([
                        categoryApi.getAll(),
                        businessApi.getAll({ search: trimmedTerm, limit: 5 })
                    ]);

                    // Filter categories locally to avoid excessive API calls if necessary
                    const filteredCats = cats.filter(c =>
                        c.name.toLowerCase().includes(trimmedTerm.toLowerCase())
                    ).slice(0, 4);

                    setSuggestions({ categories: filteredCats, businesses: biz });
                } catch (error) {
                    console.error('Error fetching suggestions:', error);
                } finally {
                    setIsLoadingSuggestions(false);
                }
            } else {
                setSuggestions({ categories: [], businesses: [] });
                setShowSuggestions(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        executeSearch(searchTerm, location);
    };

    const executeSearch = (term: string, loc: string) => {
        const trimmedTerm = term.trim();
        const trimmedLoc = loc.trim();
        const params = new URLSearchParams();
        if (trimmedTerm) params.set('search', trimmedTerm);
        if (trimmedLoc) params.set('location', trimmedLoc);

        router.push(`/listings?${params.toString()}`);
        if (onSearch) onSearch(trimmedTerm, trimmedLoc);
        setShowSuggestions(false);
        setShowLocationSuggestions(false);
    };

    const handleSuggestionClick = (type: 'category' | 'business', value: string) => {
        if (type === 'category') {
            const params = new URLSearchParams();
            params.set('category', value);
            router.push(`/listings?${params.toString()}`);
        } else {
            executeSearch(value, location);
        }
        setShowSuggestions(false);
    };

    const handleLocationClick = (cityName: string) => {
        setLocation(cityName);
        setShowLocationSuggestions(false);
        // Opcional: ejecutar búsqueda inmediata al seleccionar ciudad
        // executeSearch(searchTerm, cityName);
    };

    return (
        <div ref={searchRef} className="relative max-w-4xl mx-auto px-4 lg:px-0 -mt-6 md:-mt-8 lg:-mt-14 z-30 transition-all duration-700 animate-float">
            {/* Glow Effect - pointer-events-none is CRITICAL here to allow clicking through to the form */}
            <div className={`absolute -inset-1 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 rounded-[2rem] lg:rounded-full blur-xl opacity-20 transition-opacity duration-500 pointer-events-none ${isFocused || showSuggestions || showLocationSuggestions ? 'opacity-40' : 'opacity-10'}`}></div>

            <form
                onSubmit={handleSubmit}
                className={`relative bg-white/70 backdrop-blur-3xl p-1.5 md:p-2 lg:p-2.5 rounded-[2rem] lg:rounded-full border transition-all duration-500 flex flex-col lg:flex-row gap-1.5 lg:gap-0 z-10 ${isFocused || showSuggestions || showLocationSuggestions ? 'border-white/90 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.3)] -translate-y-1' : 'border-white/30 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.15)]'
                    }`}
            >
                {/* Input Search Group */}
                <div className="relative flex-[1.2] group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-orange-600 transition-transform duration-300 group-focus-within:scale-110 pointer-events-none">
                        <Search className="w-[18px] h-[18px] md:w-[20px] md:h-[20px] lg:w-[22px] lg:h-[22px]" strokeWidth={2.5} />
                    </div>
                    <input
                        type="text"
                        placeholder="¿Qué buscas?"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => {
                            setIsFocused(true);
                            if (searchTerm.length >= 2) setShowSuggestions(true);
                        }}
                        onBlur={() => setIsFocused(false)}
                        className="w-full bg-white/40 lg:bg-transparent pl-12 pr-12 py-3 md:py-4 lg:py-5 rounded-[1.5rem] lg:rounded-none text-gray-900 placeholder-gray-500 focus:outline-none font-bold text-sm md:text-base lg:text-lg border border-transparent focus:border-orange-500/20 lg:border-none uppercase tracking-tight"
                    />
                    {searchTerm && (
                        <button
                            type="button"
                            onClick={() => setSearchTerm('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-orange-600 transition-colors"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>

                {/* Separator - Hidden on tablet/mobile */}
                <div className="hidden lg:block w-[1.5px] h-10 bg-gradient-to-b from-transparent via-gray-200 to-transparent self-center mx-3"></div>

                {/* Input Location Group */}
                <div ref={locationRef} className="relative flex-1 group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-pink-600 transition-transform duration-300 group-focus-within:scale-110 pointer-events-none">
                        <Navigation className="w-[18px] h-[18px] md:w-[20px] md:h-[20px] lg:w-[22px] lg:h-[22px]" strokeWidth={2.5} />
                    </div>
                    <input
                        type="text"
                        placeholder="¿En dónde?"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        onFocus={() => {
                            setIsFocused(true);
                            if (location.length >= 2) setShowLocationSuggestions(true);
                        }}
                        onBlur={() => setIsFocused(false)}
                        className="w-full bg-white/40 lg:bg-transparent pl-12 pr-10 py-3 md:py-4 lg:py-5 rounded-[1.5rem] lg:rounded-none text-gray-900 placeholder-gray-500 focus:outline-none font-bold text-sm md:text-base lg:text-lg border border-transparent focus:border-pink-500/20 lg:border-none uppercase tracking-tight"
                    />
                    {location && (
                        <button
                            type="button"
                            onClick={() => setLocation('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-pink-600 transition-colors"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>

                {/* Action Button */}
                <button
                    type="submit"
                    className="relative group p-0.5 md:p-1"
                >
                    {/* Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 rounded-[1.5rem] lg:rounded-full group-active:scale-95 transition-transform duration-300"></div>

                    <div className="relative bg-transparent rounded-[1.5rem] lg:rounded-full px-8 md:px-12 lg:px-10 py-3 md:py-4 lg:py-5 flex items-center justify-center gap-2 overflow-hidden">
                        <span className="text-white font-black text-xs md:text-sm lg:text-base tracking-[0.1em] z-10">EXPLORAR</span>
                        <Sparkles size={16} className="text-white animate-pulse z-10" />

                        {/* Inner Sheen */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer_btn"></div>
                    </div>
                </button>
            </form>

            {/* Unified Panel - Shown if either search or location suggestions are active */}
            {(showSuggestions || showLocationSuggestions) && (
                <div className="absolute left-0 right-0 top-full mt-4 bg-white/90 backdrop-blur-3xl rounded-[2.5rem] border border-white/40 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500 z-50">
                    {/* Header Context */}
                    <div className="px-8 py-5 border-b border-gray-100 bg-gradient-to-r from-orange-50/50 to-pink-50/50 flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Buscando</span>
                            <span className="text-xs font-black text-orange-600 uppercase tracking-tight leading-none bg-orange-100 px-2 py-1 rounded-md max-w-[150px] truncate">{searchTerm || 'Cualquier negocio'}</span>
                        </div>
                        <div className="hidden sm:block w-[1px] h-4 bg-gray-200"></div>
                        <div className="flex items-center gap-2">
                            <Navigation size={12} className="text-pink-500" />
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">En</span>
                            <span className="text-xs font-black text-pink-600 uppercase tracking-tight leading-none bg-pink-100 px-2 py-1 rounded-md max-w-[150px] truncate">{location || 'Toda Colombia'}</span>
                        </div>
                    </div>

                    <div className="p-4 md:p-6 lg:p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                        {/* Loading State */}
                        {isLoadingSuggestions && (
                            <div className="flex items-center justify-center py-10">
                                <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}

                        {!isLoadingSuggestions && !showLocationSuggestions && searchTerm.length >= 2 && suggestions.categories.length === 0 && suggestions.businesses.length === 0 && (
                            <div className="text-center py-10">
                                <p className="text-gray-400 font-bold uppercase text-xs tracking-widest italic">No encontramos coincidencias para "{searchTerm}"</p>
                            </div>
                        )}

                        {/* Locations Section (Cities) */}
                        {showLocationSuggestions && locationSuggestions.length > 0 && (
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2 px-2">
                                    <MapPin size={12} className="text-pink-500" />
                                    <span>Ciudades en Colombia</span>
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                    {locationSuggestions.map((city, idx) => (
                                        <button
                                            key={`${city.name}-${idx}`}
                                            type="button"
                                            onClick={() => handleLocationClick(city.name)}
                                            className="flex items-center gap-4 p-4 bg-pink-50/30 hover:bg-pink-100/50 rounded-2xl group transition-all duration-300 border border-transparent hover:border-pink-200"
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-pink-600 shadow-sm transition-transform group-hover:scale-110">
                                                <Navigation size={18} strokeWidth={2.5} />
                                            </div>
                                            <div className="flex flex-col text-left">
                                                <span className="text-sm font-black text-gray-800 uppercase tracking-tight">{city.name}</span>
                                                <span className="text-[10px] font-bold text-gray-400 uppercase">{city.department}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Categories Section */}
                        {!isLoadingSuggestions && suggestions.categories.length > 0 && (
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2 px-2">
                                    <Tag size={12} className="text-orange-500" />
                                    <span>Categorías Sugeridas</span>
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {suggestions.categories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => handleSuggestionClick('category', cat.name)}
                                            className="flex items-center justify-between p-4 bg-orange-50/30 hover:bg-orange-100/50 rounded-2xl group transition-all duration-300 border border-transparent hover:border-orange-200"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-orange-600 shadow-sm transition-transform group-hover:scale-110">
                                                    <Store size={18} />
                                                </div>
                                                <span className="font-bold text-gray-800 uppercase text-sm tracking-tight">{cat.name}</span>
                                            </div>
                                            <ArrowRight size={14} className="text-gray-300 group-hover:text-orange-600 transform group-hover:translate-x-1 transition-all" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Businesses Section */}
                        {!isLoadingSuggestions && suggestions.businesses.length > 0 && (
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2 px-2">
                                    <Store size={12} className="text-purple-500" />
                                    <span>Negocios Recomendados</span>
                                </h4>
                                <div className="space-y-3">
                                    {suggestions.businesses.map((biz) => (
                                        <button
                                            key={biz.id}
                                            onClick={() => handleSuggestionClick('business', biz.name)}
                                            className="w-full flex items-center justify-between p-4 bg-purple-50/30 hover:bg-purple-100/50 rounded-2xl group transition-all duration-300 border border-transparent hover:border-purple-200"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-white shadow-sm border border-gray-100 transition-transform group-hover:scale-105">
                                                    {biz.images && biz.images[0] ? (
                                                        <img src={biz.images[0].image_url} alt={biz.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-200 bg-gray-50">
                                                            <Store size={24} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col items-start gap-0.5">
                                                    <span className="font-black text-gray-950 uppercase text-sm tracking-tight group-hover:text-purple-700 transition-colors">{biz.name}</span>
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{biz.category_name || 'Comercio'}</span>
                                                </div>
                                            </div>
                                            <div className="px-5 py-2.5 bg-white rounded-xl shadow-sm border border-purple-100 group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-600 transition-all duration-300">
                                                <span className="text-[10px] font-black uppercase tracking-widest">Ver Perfil</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer / Hint */}
                    <div className="bg-gray-50/80 px-8 py-5 flex items-center justify-between border-t border-gray-100">
                        <div className="flex items-center gap-3">
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Presiona</span>
                            <span className="px-2 py-1 bg-white border border-gray-200 rounded-md text-[10px] font-black text-gray-600 shadow-sm">ENTER</span>
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">para una búsqueda completa</span>
                        </div>
                        <div className="flex gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500/50"></span>
                            <span className="w-1.5 h-1.5 rounded-full bg-pink-500/50"></span>
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500/50"></span>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
        @keyframes shimmer_btn {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer_btn {
          animation: shimmer_btn 2s infinite linear;
        }
        input::placeholder {
           text-transform: uppercase;
           font-size: 0.65rem;
           letter-spacing: 0.1em;
           font-weight: 800;
           opacity: 0.5;
        }
        @media (min-width: 1024px) {
          input::placeholder {
            font-size: 0.75rem;
          }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
        </div>
    );
}
