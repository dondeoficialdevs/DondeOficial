'use client';

import { useState } from 'react';
import { Search, MapPin } from 'lucide-react';

interface SmartSearchProps {
    onSearch: (search: string, location: string) => void;
}

export default function SmartSearch({ onSearch }: SmartSearchProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [location, setLocation] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(searchTerm, location);
    };

    return (
        <div className="relative max-w-4xl mx-auto px-4 -mt-10 z-30">
            <form
                onSubmit={handleSubmit}
                className={`bg-white/80 backdrop-blur-xl p-2 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border transition-all duration-500 flex flex-col md:flex-row gap-2 ${isFocused ? 'border-orange-400 ring-4 ring-orange-400/10 -translate-y-1' : 'border-white/50'
                    }`}
            >
                {/* Input Search */}
                <div className="flex-1 relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-orange-500 transition-colors">
                        <Search size={20} />
                    </div>
                    <input
                        type="text"
                        placeholder="¿Qué estás buscando hoy?"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        className="w-full bg-transparent pl-12 pr-4 py-4 rounded-2xl text-gray-800 placeholder-gray-500 focus:outline-none font-medium"
                    />
                </div>

                {/* Separator Desktop */}
                <div className="hidden md:block w-px h-10 bg-gray-200 self-center"></div>

                {/* Input Location */}
                <div className="flex-1 relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-orange-500 transition-colors">
                        <MapPin size={20} />
                    </div>
                    <input
                        type="text"
                        placeholder="Ubicación (Barrio, Calle...)"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        className="w-full bg-transparent pl-12 pr-4 py-4 rounded-2xl text-gray-800 placeholder-gray-500 focus:outline-none font-medium"
                    />
                </div>

                {/* Action Button */}
                <button
                    type="submit"
                    className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-tighter transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 group"
                >
                    <span>Buscar</span>
                    <Search size={18} className="transition-transform group-hover:rotate-12" />
                </button>
            </form>

            {/* Elegant Shimmer Effect inside the container */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer pointer-events-none rounded-3xl overflow-hidden"></div>

            <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 3s infinite linear;
        }
      `}</style>
        </div>
    );
}
