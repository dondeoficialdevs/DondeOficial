'use client';

import { useRouter } from 'next/navigation';
import { Category } from '../types';
import {
  Dumbbell,
  Utensils,
  Trophy,
  Palmtree,
  HeartPulse,
  Briefcase,
  ShoppingBag,
  MapPin,
  Music,
  Sparkles,
  Landmark,
  CalendarDays,
  Store,
  Pizza,
  Plane
} from 'lucide-react';
import { useRef, useEffect, useState } from 'react';

interface CategorySectionProps {
  categories: Category[];
  onCategorySelect?: (categoryName: string) => void;
}

const getCategoryIcon = (name: string) => {
  const iconProps = {
    size: 28,
    strokeWidth: 1.5,
    color: '#FF6B35',
  };

  const icons: { [key: string]: React.ReactElement } = {
    'Belleza': <Sparkles {...iconProps} />,
    'Entretenimiento': <Music {...iconProps} />,
    'Gastronomía': <Utensils {...iconProps} />,
    'Restaurante': <Pizza {...iconProps} />,
    'Viajes': <Plane {...iconProps} />,
    'Turismo': <Palmtree {...iconProps} />,
    'Salud': <HeartPulse {...iconProps} />,
    'Bienestar': <HeartPulse {...iconProps} />,
    'Servicios': <Briefcase {...iconProps} />,
    'Productos': <ShoppingBag {...iconProps} />,
    'Tiendas': <Store {...iconProps} />,
    'Cerca': <MapPin {...iconProps} />,
    'Gimnasio': <Dumbbell {...iconProps} />,
    'Deportivo': <Trophy {...iconProps} />,
    'Museo': <Landmark {...iconProps} />,
    'Eventos': <CalendarDays {...iconProps} />,
  };

  const nameLower = name.toLowerCase();
  const foundKey = Object.keys(icons).find(key => nameLower.includes(key.toLowerCase()));

  return foundKey ? icons[foundKey] : <MapPin {...iconProps} />;
};

export default function CategorySection({ categories, onCategorySelect }: CategorySectionProps) {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const scrollSpeed = 0.5; // Adjusted for a professional, smooth "tape" movement

  const handleCategoryClick = (categoryName: string) => {
    if (onCategorySelect) {
      onCategorySelect(categoryName);
    }
    const encodedCategory = encodeURIComponent(categoryName);
    router.push(`/listings?category=${encodedCategory}`);
  };

  // Triple categories for a truly seamless infinite loop
  const displayCategories = [...categories, ...categories, ...categories];

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    let lastTime = 0;

    const scroll = (time: number) => {
      if (!isInteracting) {
        if (lastTime !== 0) {
          const deltaTime = (time - lastTime) / 16; // Normalize to ~60fps
          scrollContainer.scrollLeft += scrollSpeed * deltaTime;

          // Seamless loop logic: reset to middle third if we exceed boundaries
          const third = scrollContainer.scrollWidth / 3;
          if (scrollContainer.scrollLeft >= third * 2) {
            scrollContainer.scrollLeft = third;
          } else if (scrollContainer.scrollLeft <= 0) {
            scrollContainer.scrollLeft = third;
          }
        }
        lastTime = time;
      } else {
        lastTime = 0; // Reset timer on interaction
      }
      animationId = requestAnimationFrame(scroll);
    };

    // Initialize position to middle third for seamless backward/forward scrolling
    if (scrollContainer.scrollLeft === 0) {
      const third = scrollContainer.scrollWidth / 3;
      scrollContainer.scrollLeft = third;
    }

    animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  }, [isInteracting, categories.length]);

  return (
    <section className="py-8 bg-white overflow-hidden relative group/section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Professional "Tape" Gradient Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

        <div
          ref={scrollRef}
          className="flex overflow-x-auto no-scrollbar pt-2 cursor-grab active:cursor-grabbing select-none"
          onMouseEnter={() => setIsInteracting(true)}
          onMouseLeave={() => setIsInteracting(false)}
          onTouchStart={() => setIsInteracting(true)}
          onTouchEnd={() => setIsInteracting(false)}
        >
          <div className="flex items-center space-x-6 py-4 px-20">
            {displayCategories.map((cat, index) => (
              <div
                key={`${cat.id}-${index}`}
                className="flex flex-col items-center flex-shrink-0"
              >
                <button
                  onClick={() => handleCategoryClick(cat.name)}
                  className="group relative flex flex-col items-center space-y-3 p-2 rounded-2xl transition-all duration-500 hover:bg-orange-50/50 min-w-[110px]"
                >
                  <div className="relative w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] group-hover:shadow-[0_10px_25px_-5px_rgba(255,107,53,0.3)] border border-gray-100 transition-all duration-500 group-hover:-translate-y-2 group-hover:scale-110 group-hover:border-orange-100">
                    <div className="transition-transform duration-500 group-hover:rotate-12 group-active:scale-90">
                      {getCategoryIcon(cat.name)}
                    </div>
                    <div className="absolute inset-0 rounded-2xl bg-orange-400/0 group-hover:bg-orange-400/5 transition-colors duration-500" />
                  </div>

                  <span className="text-[11px] font-bold text-gray-600 tracking-tight transition-colors duration-300 group-hover:text-orange-600 whitespace-nowrap px-1">
                    {cat.name}
                  </span>

                  <div className="absolute -bottom-1 w-0 h-0.5 bg-orange-500 rounded-full transition-all duration-300 group-hover:w-1/2" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}

