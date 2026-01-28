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

  const handleCategoryClick = (categoryName: string) => {
    if (onCategorySelect) {
      onCategorySelect(categoryName);
    }
    const encodedCategory = encodeURIComponent(categoryName);
    router.push(`/listings?category=${encodedCategory}`);
  };

  return (
    <section className="py-8 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center space-x-8 overflow-x-auto pb-6 no-scrollbar pt-2">
          {categories.map((cat, index) => (
            <div
              key={cat.id}
              className="flex flex-col items-center flex-shrink-0 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <button
                onClick={() => handleCategoryClick(cat.name)}
                className="group relative flex flex-col items-center space-y-3 p-2 rounded-2xl transition-all duration-500 hover:bg-orange-50/50 min-w-[95px]"
              >
                {/* Icon Container with multi-layered animation */}
                <div className="relative w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] group-hover:shadow-[0_10px_25px_-5px_rgba(255,107,53,0.3)] border border-gray-100 transition-all duration-500 group-hover:-translate-y-2 group-hover:scale-110 group-hover:border-orange-100">
                  <div className="transition-transform duration-500 group-hover:rotate-12 group-active:scale-90">
                    {getCategoryIcon(cat.name)}
                  </div>

                  {/* Subtle background glow on hover */}
                  <div className="absolute inset-0 rounded-2xl bg-orange-400/0 group-hover:bg-orange-400/5 transition-colors duration-500" />
                </div>

                {/* Text with elegant transition */}
                <span className="text-xs font-bold text-gray-600 tracking-tight transition-colors duration-300 group-hover:text-orange-600 whitespace-nowrap">
                  {cat.name}
                </span>

                {/* Selection indicator (bottom line) */}
                <div className="absolute -bottom-1 w-0 h-0.5 bg-orange-500 rounded-full transition-all duration-300 group-hover:w-1/2" />
              </button>
            </div>
          ))}
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
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          opacity: 0;
          animation: fadeInUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
      `}</style>
    </section>
  );
}

