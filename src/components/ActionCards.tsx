'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { actionCardApi } from '@/lib/api';
import { ActionCard } from '@/types';
import { MessageCircle, Search } from 'lucide-react';

export default function ActionCards() {
  const [cards, setCards] = useState<ActionCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCards = async () => {
      try {
        const data = await actionCardApi.getAll();
        setCards(data);
      } catch (err) {
        console.error('Error loading action cards:', err);
      } finally {
        setLoading(false);
      }
    };
    loadCards();
  }, []);

  if (loading) return (
    <div className="py-8 bg-linear-to-br from-slate-50 via-orange-50 to-red-50">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-[200px] bg-gray-200 animate-pulse rounded-2xl shadow-sm"></div>
        <div className="h-[200px] bg-gray-200 animate-pulse rounded-2xl shadow-sm"></div>
      </div>
    </div>
  );

  // Fallback in case table is empty or API fails
  const displayCards = cards.length > 0 ? cards : [
    {
      type: 'whatsapp' as const,
      title: 'Escríbenos por WhatsApp',
      description: 'Contáctanos directamente y te responderemos al instante',
      badge_text: 'Contacto Directo',
      image_url: '/images/action-cards/fondo-whatsapp.avif',
      button_link: 'https://wa.me/1234567890',
      icon_type: 'whatsapp'
    },
    {
      type: 'directory' as const,
      title: 'Explora el Directorio',
      description: 'Descubre todos los negocios y servicios de turismo disponibles',
      badge_text: 'Explorar',
      image_url: '/images/action-cards/Fondo-turismo.jpg',
      button_link: '/listings',
      icon_type: 'search'
    }
  ];

  return (
    <section className="relative bg-linear-to-br from-slate-50 via-orange-50 to-red-50 overflow-hidden py-12">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {displayCards.map((card) => (
            <CardItem key={card.type || Math.random()} card={card as ActionCard} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CardItem({ card }: { card: ActionCard }) {
  const isWhatsApp = card.type === 'whatsapp';

  const content = (
    <>
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
        style={{ backgroundImage: `url(${card.image_url})` }}
      />

      {/* Premium Overlays */}
      <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/60 to-black/20 group-hover:from-black/70 group-hover:via-black/50 group-hover:to-black/10 transition-all duration-500"></div>
      <div className={`absolute inset-0 bg-linear-to-r ${isWhatsApp ? 'from-green-600/40' : 'from-orange-600/40 via-red-600/20'
        } via-transparent to-transparent`}></div>

      {/* Shine Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1500ms]"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col justify-between p-8 text-left">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-6 flex-1">
            {/* Icon Box */}
            <div className={`shrink-0 w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 group-hover:scale-110 ${isWhatsApp ? 'border-2 border-green-400/30 relative overflow-hidden' : 'bg-white/20 backdrop-blur-md border border-white/30'
              }`}>
              {isWhatsApp ? (
                <>
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <MessageCircle className="w-12 h-12 text-[#25D366] relative z-10" strokeWidth={2.5} />
                </>
              ) : (
                <Search className="w-10 h-10 text-white" strokeWidth={2.5} />
              )}
            </div>

            <div>
              <div className="inline-flex items-center gap-2 mb-2">
                <span className={`w-2 h-2 rounded-full animate-pulse ${isWhatsApp ? 'bg-green-400' : 'bg-orange-400'}`}></span>
                <span className="text-xs font-black text-white/90 uppercase tracking-widest leading-none">
                  {card.badge_text}
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-white leading-tight tracking-tight uppercase">
                {card.title}
              </h3>
              <p className="text-base text-white/80 mt-2 font-medium max-w-sm line-clamp-2 leading-relaxed">
                {card.description}
              </p>
            </div>
          </div>

          <div className="shrink-0 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 group-hover:bg-white group-hover:text-black transition-all duration-300 group-hover:translate-x-1">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </div>
      </div>
    </>
  );

  const containerStyle = "group relative block rounded-[2.5rem] overflow-hidden shadow-2xl hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] transition-all duration-500 transform hover:-translate-y-2 min-h-[220px]";

  if (isWhatsApp) {
    return (
      <a href={card.button_link} target="_blank" rel="noopener noreferrer" className={containerStyle}>
        {content}
      </a>
    );
  }

  return (
    <Link href={card.button_link} className={containerStyle}>
      {content}
    </Link>
  );
}
