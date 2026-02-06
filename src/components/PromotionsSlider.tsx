'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Promotion } from '@/types';
import { promotionApi } from '@/lib/api';

const MOCK_PROMOTIONS: Promotion[] = [
    {
        id: -1,
        title: 'Sabor que Enamora',
        description: 'Disfruta de un 20% de descuento en todas nuestras hamburguesas gourmet seleccionadas.',
        image_url: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=1920',
        button_text: 'Ver Oferta',
        button_link: '/listings?search=hamburguesa',
        badge_text: '20% OFF',
        is_discount: true,
        active: true,
        priority: 1,
        created_at: new Date().toISOString()
    },
    {
        id: -2,
        title: 'Nueva Colección 2024',
        description: 'Descubre las últimas tendencias en moda con nuestra nueva colección exclusiva de temporada.',
        image_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1920',
        button_text: 'Explorar Tiendas',
        button_link: '/listings?category=Moda',
        badge_text: 'NUEVO',
        is_discount: false,
        active: true,
        priority: 2,
        created_at: new Date().toISOString()
    },
    {
        id: -3,
        title: 'Tecnología al Alcance',
        description: 'Encuentra los mejores expertos en soporte técnico y soluciones digitales para tu negocio.',
        image_url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1920',
        button_text: 'Servicios IT',
        button_link: '/listings?category=Tecnología',
        badge_text: 'SOPORTE',
        is_discount: false,
        active: true,
        priority: 3,
        created_at: new Date().toISOString()
    }
];

export default function PromotionsSlider() {
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const displayPromotions = promotions.length > 0 ? promotions : MOCK_PROMOTIONS;

    const nextSlide = useCallback(() => {
        if (displayPromotions.length === 0) return;
        setCurrentSlide((prev: number) => (prev === displayPromotions.length - 1 ? 0 : prev + 1));
    }, [displayPromotions.length]);

    const prevSlide = () => {
        if (displayPromotions.length === 0) return;
        setCurrentSlide((prev: number) => (prev === 0 ? displayPromotions.length - 1 : prev - 1));
    };

    useEffect(() => {
        const fetchPromotions = async () => {
            try {
                const data = await promotionApi.getActive();
                if (data && Array.isArray(data)) {
                    setPromotions(data);
                }
            } catch (error) {
                console.error('Error fetching promotions:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPromotions();
    }, []);

    useEffect(() => {
        if (!isPaused && displayPromotions.length > 0) {
            const timer = setInterval(() => {
                nextSlide();
            }, 5000);
            return () => clearInterval(timer);
        }
    }, [nextSlide, isPaused, displayPromotions.length]);

    if (loading) return (
        <div className="w-full h-[300px] flex items-center justify-center bg-gray-950">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
    );

    return (
        <section
            className="relative w-full h-[450px] md:h-[550px] lg:h-[650px] overflow-hidden bg-gray-950 group"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Slides */}
            {displayPromotions.map((promo, index) => (
                <div
                    key={promo.id || index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
                >
                    {/* Background Image Layer */}
                    <div className="absolute inset-0 z-0">
                        {promo.image_url ? (
                            <div className="relative w-full h-full bg-gray-950">
                                <div
                                    className="absolute inset-0 bg-cover bg-center blur-3xl opacity-50 scale-125"
                                    style={{ backgroundImage: `url(${promo.image_url})` }}
                                />
                                <div className="relative w-full h-full flex items-center justify-center p-4 md:p-12">
                                    <Image
                                        src={promo.image_url}
                                        alt={promo.title || 'Promoción'}
                                        fill
                                        className="object-contain transition-transform duration-[10s] group-hover:scale-105 drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                                        priority={index === 0}
                                        unoptimized
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="absolute inset-0 bg-gray-900"></div>
                        )}
                    </div>

                    <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/60 via-black/20 to-transparent"></div>
                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

                    <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center z-20">
                        <div className={`max-w-3xl transition-all duration-1000 transform ${index === currentSlide ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'
                            }`}>
                            <div className="flex flex-wrap items-center gap-4 mb-8">
                                <div
                                    className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase backdrop-blur-md border border-white/20 ${promo.is_discount ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20' : 'bg-white/10 text-white'}`}
                                >
                                    {promo.badge_text || (promo.is_discount ? 'OFERTA' : 'DESTACADO')}
                                </div>
                                {promo.is_discount && (
                                    <div className="flex items-center gap-2">
                                        <span className="flex h-2 w-2 relative">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                        </span>
                                        <span className="text-[10px] font-black text-emerald-400 tracking-wider uppercase">En Vivo</span>
                                    </div>
                                )}
                            </div>

                            <h2 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white mb-4 sm:mb-8 leading-[0.9] tracking-tighter drop-shadow-2xl">
                                {promo.title}
                            </h2>

                            <p className="text-sm sm:text-lg md:text-2xl text-white mb-6 sm:mb-12 max-w-2xl leading-relaxed font-medium [text-shadow:0_2px_4px_rgba(0,0,0,0.8)]">
                                {promo.description}
                            </p>

                            {promo.button_link && (
                                <div className="flex items-center gap-6">
                                    <Link
                                        href={promo.button_link}
                                        className="group relative inline-flex items-center justify-center px-8 sm:px-12 py-3 sm:py-5 font-black text-white transition-all duration-500 rounded-xl sm:rounded-2xl hover:scale-105 active:scale-95 shadow-2xl overflow-hidden bg-orange-600"
                                    >
                                        <span className="relative z-10 flex items-center text-sm sm:text-lg uppercase tracking-wider">
                                            {promo.button_text || 'Explorar'}
                                            <svg className="w-5 h-5 sm:w-6 h-6 ml-2 sm:ml-3 transition-transform duration-500 group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}

            {/* Navigation Arrows */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-20 flex justify-between px-4 sm:px-8 pointer-events-none">
                <button
                    onClick={prevSlide}
                    className="p-4 sm:p-5 rounded-2xl bg-black/20 hover:bg-white/10 text-white backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100 focus:outline-none pointer-events-auto border border-white/5"
                    aria-label="Anterior promoción"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <button
                    onClick={nextSlide}
                    className="p-4 sm:p-5 rounded-2xl bg-black/20 hover:bg-white/10 text-white backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100 focus:outline-none pointer-events-auto border border-white/5"
                    aria-label="Siguiente promoción"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {/* Indicators */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-end space-x-5">
                {displayPromotions.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className="group py-2 focus:outline-none"
                        aria-label={`Ir a promoción ${index + 1}`}
                    >
                        <div className={`relative h-1.5 transition-all duration-500 overflow-hidden rounded-full ${index === currentSlide ? 'w-16 bg-white/20' : 'w-5 bg-white/10 hover:bg-white/30'
                            }`}>
                            {index === currentSlide && (
                                <div
                                    className={`absolute inset-0 bg-orange-500`}
                                ></div>
                            )}
                        </div>
                    </button>
                ))}
            </div>
        </section>
    );
}
