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
            {/* Glow Effect */}
            <div className={`absolute -inset-1 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 rounded-[2rem] lg:rounded-full blur-xl opacity-20 transition-opacity duration-500 ${isFocused || showSuggestions || showLocationSuggestions ? 'opacity-40' : 'opacity-10'}`}></div>

            <form
                onSubmit={handleSubmit}
                className={`relative bg-white/70 backdrop-blur-3xl p-1.5 md:p-2 lg:p-2.5 rounded-[2rem] lg:rounded-full border transition-all duration-500 flex flex-col lg:flex-row gap-1.5 lg:gap-0 ${isFocused || showSuggestions || showLocationSuggestions ? 'border-white/90 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.3)] -translate-y-1' : 'border-white/30 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.15)]'
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

                    {/* Location Suggestions Dropdown */}
                    {showLocationSuggestions && (
                        <div className="absolute left-0 right-0 top-full mt-6 bg-white/90 backdrop-blur-2xl rounded-3xl border border-white/40 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300 z-50">
                            <div className="p-2 space-y-1">
                                <div className="px-4 py-3 border-b border-gray-50 mb-1">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ciudades Encontradas</span>
                                </div>
                                {locationSuggestions.map((city, idx) => (
                                    <button
                                        key={`${city.name}-${idx}`}
                                        type="button"
                                        onClick={() => handleLocationClick(city.name)}
                                        className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-pink-50 rounded-2xl group transition-all duration-300 text-left"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center text-pink-600 transition-colors group-hover:bg-white group-hover:shadow-sm">
                                            <MapPin size={16} strokeWidth={2.5} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-gray-800 uppercase tracking-tight">{city.name}</span>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase">{city.department}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
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

            {/* Suggestions Dropdown */}
            {showSuggestions && (
                <div className="absolute left-0 right-0 top-full mt-4 bg-white/80 backdrop-blur-3xl rounded-[2.5rem] border border-white/40 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500 z-50">
                    <div className="p-4 md:p-6 lg:p-8 space-y-6">

                        {/* Loading State */}
                        {isLoadingSuggestions && (
                            <div className="flex items-center justify-center py-10">
                                <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}

                        {!isLoadingSuggestions && suggestions.categories.length === 0 && suggestions.businesses.length === 0 && (
                            <div className="text-center py-10">
                                <p className="text-gray-400 font-bold uppercase text-xs tracking-widest italic">No encontramos coincidencias para "{searchTerm}"</p>
                            </div>
                        )}

                        {/* Categories Section */}
                        {!isLoadingSuggestions && suggestions.categories.length > 0 && (
                            <div className="space-y-3">
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2 px-2">
                                    <Tag size={12} className="text-orange-500" />
                                    <span>Categorías Sugeridas</span>
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {suggestions.categories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => handleSuggestionClick('category', cat.name)}
                                            className="flex items-center justify-between p-4 bg-gray-50/50 hover:bg-orange-50 rounded-2xl group transition-all duration-300"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-orange-600 shadow-sm border border-gray-100 group-hover:border-orange-200">
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
                            <div className="space-y-3">
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2 px-2">
                                    <Store size={12} className="text-pink-500" />
                                    <span>Negocios Relacionados</span>
                                </h4>
                                <div className="space-y-2">
                                    {suggestions.businesses.map((biz) => (
                                        <button
                                            key={biz.id}
                                            onClick={() => handleSuggestionClick('business', biz.name)}
                                            className="w-full flex items-center justify-between p-4 bg-gray-50/50 hover:bg-pink-50 rounded-2xl group transition-all duration-300"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white border border-gray-100 group-hover:border-pink-200">
                                                    {biz.images && biz.images[0] ? (
                                                        <img src={biz.images[0].image_url} alt={biz.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                            <Store size={20} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col items-start gap-0.5">
                                                    <span className="font-black text-gray-900 uppercase text-sm tracking-tight">{biz.name}</span>
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{biz.category_name}</span>
                                                </div>
                                            </div>
                                            <div className="px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-100 group-hover:border-pink-200 group-hover:bg-pink-100 transition-all">
                                                <span className="text-[9px] font-black text-pink-600 uppercase tracking-widest">Ver Perfil</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer / Hint */}
                    <div className="bg-gray-50/80 px-8 py-4 flex items-center justify-between border-t border-gray-100">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Presiona ENTER para buscar "{searchTerm}"</span>
                        <div className="flex gap-2">
                            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                            <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse delay-75"></span>
                            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse delay-150"></span>
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
      `}</style>
        </div>
    );
}
