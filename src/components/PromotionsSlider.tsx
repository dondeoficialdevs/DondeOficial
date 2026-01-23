'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Promotion } from '@/types';
import { promotionApi } from '@/lib/api';

const MOCK_PROMOTIONS: Promotion[] = [
    {
        id: 1,
        title: 'Sabor que Enamora',
        description: 'Disfruta de un 20% de descuento en todas nuestras hamburguesas gourmet seleccionadas.',
        image_url: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=1920',
        button_text: 'Ver Oferta',
        button_link: '/listings?search=hamburguesa',
        active: true,
        priority: 1,
        created_at: new Date().toISOString()
    },
    {
        id: 2,
        title: 'Nueva Colección 2024',
        description: 'Descubre las últimas tendencias en moda con nuestra nueva colección exclusiva de temporada.',
        image_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1920',
        button_text: 'Explorar Tiendas',
        button_link: '/listings?category=Moda',
        active: true,
        priority: 2,
        created_at: new Date().toISOString()
    },
    {
        id: 3,
        title: 'Tecnología al Alcance',
        description: 'Encuentra los mejores expertos en soporte técnico y soluciones digitales para tu negocio.',
        image_url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1920',
        button_text: 'Servicios IT',
        button_link: '/listings?category=Tecnología',
        active: true,
        priority: 3,
        created_at: new Date().toISOString()
    }
];

export default function PromotionsSlider() {
    const [promotions, setPromotions] = useState<Promotion[]>(MOCK_PROMOTIONS);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev === promotions.length - 1 ? 0 : prev + 1));
    }, [promotions.length]);

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? promotions.length - 1 : prev - 1));
    };

    useEffect(() => {
        const fetchPromotions = async () => {
            try {
                const data = await promotionApi.getActive();
                if (data && data.length > 0) {
                    setPromotions(data);
                }
            } catch (error) {
                console.log('Using mock promotions as fallback');
            }
        };
        fetchPromotions();
    }, []);

    useEffect(() => {
        if (!isPaused && promotions.length > 0) {
            const timer = setInterval(() => {
                nextSlide();
            }, 5000); // Cambiar cada 5 segundos
            return () => clearInterval(timer);
        }
    }, [nextSlide, isPaused, promotions.length]);

    if (promotions.length === 0) return null;

    return (
        <section
            className="relative w-full h-[450px] md:h-[550px] lg:h-[650px] overflow-hidden bg-gray-900 group"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Slides */}
            {promotions.map((promo, index) => (
                <div
                    key={promo.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
                >
                    {/* Background Image with Overlay */}
                    <div className="absolute inset-0">
                        <Image
                            src={promo.image_url}
                            alt={promo.title}
                            fill
                            className="object-cover"
                            priority={index === 0}
                        />
                        {/* Premium Gradient Overlay */}
                        <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/40 to-transparent"></div>
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent"></div>
                    </div>

                    {/* Content */}
                    <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
                        <div className={`max-w-3xl transition-all duration-1000 transform ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                            }`}>
                            <div className="flex items-center gap-3 mb-6">
                                <span className="h-px w-8 bg-blue-500"></span>
                                <span className="text-xs font-bold tracking-[0.2em] text-blue-400 uppercase">
                                    OFERTA EXCLUSIVA
                                </span>
                            </div>

                            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-[1.1] tracking-tight">
                                {promo.title}
                            </h2>

                            <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-xl leading-relaxed">
                                {promo.description}
                            </p>

                            {promo.button_link && (
                                <Link
                                    href={promo.button_link}
                                    className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-300 bg-blue-600 rounded-full hover:bg-blue-700 hover:scale-105 active:scale-95 shadow-2xl shadow-blue-600/40 overflow-hidden"
                                >
                                    <span className="relative z-10 flex items-center">
                                        {promo.button_text || 'Más información'}
                                        <svg className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </span>
                                    <div className="absolute inset-0 bg-linear-to-r from-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            ))}

            {/* Navigation Arrows */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-20 flex justify-between px-4 sm:px-8 pointer-events-none">
                <button
                    onClick={prevSlide}
                    className="p-3 sm:p-4 rounded-full bg-black/20 hover:bg-blue-600/40 text-white backdrop-blur-md transition-all duration-300 opacity-0 group-hover:opacity-100 focus:outline-none pointer-events-auto border border-white/10 hover:border-blue-400/50"
                    aria-label="Anterior promoción"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <button
                    onClick={nextSlide}
                    className="p-3 sm:p-4 rounded-full bg-black/20 hover:bg-blue-600/40 text-white backdrop-blur-md transition-all duration-300 opacity-0 group-hover:opacity-100 focus:outline-none pointer-events-auto border border-white/10 hover:border-blue-400/50"
                    aria-label="Siguiente promoción"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {/* Indicators / Progress Bar */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-end space-x-4">
                {promotions.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className="group py-2 focus:outline-none"
                        aria-label={`Ir a promoción ${index + 1}`}
                    >
                        <div className={`relative h-1 transition-all duration-500 overflow-hidden rounded-full ${index === currentSlide ? 'w-12 bg-gray-600/30' : 'w-4 bg-white/20 hover:bg-white/40'
                            }`}>
                            {index === currentSlide && (
                                <div
                                    className={`absolute inset-0 bg-blue-500 animate-slider-progress ${isPaused ? '[animation-play-state:paused]' : ''}`}
                                ></div>
                            )}
                        </div>
                    </button>
                ))}
            </div>

            {/* Luxury Light Effects */}
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] z-10 pointer-events-none"></div>
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] z-10 pointer-events-none"></div>
        </section>
    );
}
