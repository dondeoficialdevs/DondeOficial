'use client';

import { useState } from 'react';
import { Search, MapPin, Sparkles } from 'lucide-react';

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
        <div className="relative max-w-4xl mx-auto px-4 md:px-0 -mt-8 md:-mt-12 z-30 transition-all duration-500">
            <form
                onSubmit={handleSubmit}
                className={`bg-white/90 backdrop-blur-2xl p-1.5 md:p-2 rounded-[2rem] md:rounded-full shadow-[0_25px_60px_-15px_rgba(0,0,0,0.2)] border transition-all duration-500 flex flex-col md:flex-row gap-1.5 md:gap-0 ${isFocused ? 'border-orange-400 ring-8 ring-orange-400/5 -translate-y-1' : 'border-white/60'
                    }`}
            >
                {/* Input Search Group */}
                <div className="relative flex-1 group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-600 transition-colors pointer-events-none">
                        <Search size={22} strokeWidth={2.5} />
                    </div>
                    <input
                        type="text"
                        placeholder="¿Qué buscas? (Pizza, Gym...)"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        className="w-full bg-white/40 md:bg-transparent pl-14 pr-4 py-4 md:py-5 rounded-[1.5rem] md:rounded-none text-gray-900 placeholder-gray-500 focus:outline-none font-bold text-base md:text-lg"
                    />
                </div>

                {/* Separator - Hidden on mobile, vertical line on desktop */}
                <div className="hidden md:block w-px h-10 bg-gray-200 self-center mx-2 opacity-50"></div>

                {/* Input Location Group */}
                <div className="relative flex-1 group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-600 transition-colors pointer-events-none">
                        <MapPin size={22} strokeWidth={2.5} />
                    </div>
                    <input
                        type="text"
                        placeholder="¿Dónde? (Barrio, Calle)"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        className="w-full bg-white/40 md:bg-transparent pl-14 pr-4 py-4 md:py-5 rounded-[1.5rem] md:rounded-none text-gray-900 placeholder-gray-500 focus:outline-none font-bold text-base md:text-lg"
                    />
                </div>

                {/* Action Button */}
                <button
                    type="submit"
                    className="bg-orange-600 hover:bg-black text-white px-8 md:px-10 py-4 md:py-2 rounded-[1.5rem] md:rounded-full font-black uppercase tracking-tighter transition-all duration-500 hover:scale-[1.02] active:scale-95 shadow-xl shadow-orange-600/20 flex items-center justify-center gap-2 group relative overflow-hidden"
                >
                    {/* Animated background on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <span className="relative z-10 flex items-center gap-2">
                        EXPLORAR
                        <Sparkles size={18} className="animate-pulse" />
                    </span>
                </button>
            </form>

            {/* Shadow layer for depth */}
            <div className="absolute -inset-1 -z-10 bg-orange-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

            <style jsx>{`
        input::placeholder {
          font-weight: 500;
          opacity: 0.7;
        }
      `}</style>
        </div>
    );
}
