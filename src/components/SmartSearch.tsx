'use client';

import { useState } from 'react';
import { Search, Sparkles, Navigation } from 'lucide-react';

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
        <div className="relative max-w-4xl mx-auto px-4 lg:px-0 -mt-6 md:-mt-8 lg:-mt-14 z-30 transition-all duration-700 animate-float">
            {/* Glow Effect */}
            <div className={`absolute -inset-1 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 rounded-[2rem] lg:rounded-full blur-xl opacity-20 transition-opacity duration-500 ${isFocused ? 'opacity-40' : 'opacity-10'}`}></div>

            <form
                onSubmit={handleSubmit}
                className={`relative bg-white/70 backdrop-blur-3xl p-1.5 md:p-2 lg:p-2.5 rounded-[2rem] lg:rounded-full border transition-all duration-500 flex flex-col lg:flex-row gap-1.5 lg:gap-0 ${isFocused ? 'border-white/90 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.3)] -translate-y-1' : 'border-white/30 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.15)]'
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
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        className="w-full bg-white/40 lg:bg-transparent pl-12 pr-4 py-3 md:py-4 lg:py-5 rounded-[1.5rem] lg:rounded-none text-gray-900 placeholder-gray-500 focus:outline-none font-bold text-sm md:text-base lg:text-lg border border-transparent focus:border-orange-500/20 lg:border-none uppercase tracking-tight"
                    />
                </div>

                {/* Separator - Hidden on tablet/mobile */}
                <div className="hidden lg:block w-[1.5px] h-10 bg-gradient-to-b from-transparent via-gray-200 to-transparent self-center mx-3"></div>

                {/* Input Location Group */}
                <div className="relative flex-1 group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-pink-600 transition-transform duration-300 group-focus-within:scale-110 pointer-events-none">
                        <Navigation className="w-[18px] h-[18px] md:w-[20px] md:h-[20px] lg:w-[22px] lg:h-[22px]" strokeWidth={2.5} />
                    </div>
                    <input
                        type="text"
                        placeholder="¿En dónde?"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        className="w-full bg-white/40 lg:bg-transparent pl-12 pr-4 py-3 md:py-4 lg:py-5 rounded-[1.5rem] lg:rounded-none text-gray-900 placeholder-gray-500 focus:outline-none font-bold text-sm md:text-base lg:text-lg border border-transparent focus:border-pink-500/20 lg:border-none uppercase tracking-tight"
                    />
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
