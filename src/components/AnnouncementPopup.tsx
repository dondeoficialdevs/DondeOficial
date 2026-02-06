'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { promotionApi, businessApi } from '@/lib/api';
import { Promotion } from '@/types';

export default function AnnouncementPopup() {
    const [isOpen, setIsOpen] = useState(false);
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [loading, setLoading] = useState(true);

    const nextSlide = useCallback(() => {
        if (promotions.length > 0) {
            setCurrentIndex((prev) => (prev === promotions.length - 1 ? 0 : prev + 1));
        }
    }, [promotions.length]);

    const prevSlide = useCallback(() => {
        if (promotions.length > 0) {
            setCurrentIndex((prev) => (prev === 0 ? promotions.length - 1 : prev - 1));
        }
    }, [promotions.length]);

    // Auto-play Logic
    useEffect(() => {
        if (!isOpen || promotions.length <= 1 || isPaused) return;

        const interval = setInterval(() => {
            nextSlide();
        }, 5000); // Rotar cada 5 segundos

        return () => clearInterval(interval);
    }, [isOpen, promotions.length, isPaused, nextSlide]);

    useEffect(() => {
        const fetchPopups = async () => {
            try {
                // 1. Obtener promociones de tipo popup
                const activePopups = await promotionApi.getActivePopups();
                let combinedItems: Promotion[] = activePopups || [];

                // 2. Si hay menos de 5 elementos, rellenar con negocios destacados
                if (combinedItems.length < 5) {
                    const businesses = await businessApi.getAll({ limit: 10 });
                    const featuredBusinesses = businesses
                        .filter(b => !combinedItems.some(p => p.business_id === b.id)) // Evitar duplicados
                        .slice(0, 5 - combinedItems.length)
                        .map(b => ({
                            id: b.id * -100, // IDs negativos para evitar colisiones con promociones reales
                            title: b.name,
                            description: b.description,
                            image_url: b.images?.[0]?.image_url || '',
                            button_text: 'Ver Negocio',
                            button_link: `/businesses/${b.id}`,
                            badge_text: 'DESTACADO',
                            active: true,
                            priority: 10,
                            business_id: b.id,
                            created_at: new Date().toISOString()
                        } as Promotion));

                    combinedItems = [...combinedItems, ...featuredBusinesses];
                }

                if (combinedItems.length > 0) {
                    setPromotions(combinedItems);
                    // Mostrar después de 3 segundos de carga inicial
                    const timer = setTimeout(() => {
                        setIsOpen(true);
                    }, 3000);
                    return () => clearTimeout(timer);
                }
            } catch (error) {
                console.error('Error fetching announcement popups:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPopups();
    }, []);

    const closePopup = () => {
        setIsOpen(false);
        // Solo marcar como vistos los que son promociones reales (id > 0)
        promotions.forEach(p => {
            if (p.id > 0) {
                sessionStorage.setItem(`hasSeenAnnouncement_${p.id}`, 'true');
            }
        });
    };

    if (loading || !isOpen || promotions.length === 0) return null;

    const currentPromo = promotions[currentIndex];

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm animate-fade-in">
            <div
                className="relative w-full max-w-lg bg-white rounded-[2.5rem] overflow-hidden shadow-2xl transform transition-all animate-bounce-in border border-white/10"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >

                {/* Botón de Cerrar */}
                <button
                    onClick={closePopup}
                    className="absolute top-5 right-5 z-[60] w-10 h-10 bg-black/20 hover:bg-black/50 text-white rounded-full flex items-center justify-center transition-all backdrop-blur-md border border-white/10 active:scale-95"
                    aria-label="Cerrar"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Controles de Navegación (Solo si hay varios) */}
                {promotions.length > 1 && (
                    <>
                        <button
                            onClick={prevSlide}
                            className="absolute left-4 top-[40%] -translate-y-1/2 z-50 w-10 h-10 bg-white/90 hover:bg-white text-orange-600 rounded-full flex items-center justify-center shadow-xl transition-all active:scale-90"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={nextSlide}
                            className="absolute right-4 top-[40%] -translate-y-1/2 z-50 w-10 h-10 bg-white/90 hover:bg-white text-orange-600 rounded-full flex items-center justify-center shadow-xl transition-all active:scale-90"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </>
                )}

                <div className="flex flex-col">
                    {/* Área de Imagen */}
                    <div className="relative h-72 sm:h-96 w-full overflow-hidden bg-orange-600">
                        {currentPromo.image_url ? (
                            <div className="absolute inset-0">
                                <div
                                    className="absolute inset-0 bg-cover bg-center blur-2xl opacity-40 scale-110"
                                    style={{ backgroundImage: `url(${currentPromo.image_url})` }}
                                />
                                <div className="relative w-full h-full flex items-center justify-center p-4">
                                    <Image
                                        src={currentPromo.image_url}
                                        alt={currentPromo.title}
                                        fill
                                        className="object-contain drop-shadow-2xl"
                                        priority
                                        unoptimized
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-700"></div>
                        )}

                        <div className="absolute bottom-8 left-8 right-8 z-20 text-left">
                            {(currentPromo.badge_text || currentPromo.is_discount) && (
                                <span className="bg-orange-600 backdrop-blur-md text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest mb-3 inline-block shadow-lg border border-orange-400/30">
                                    {currentPromo.badge_text || 'OFERTA'}
                                </span>
                            )}
                            <h2 className="text-2xl sm:text-4xl font-black text-white leading-none drop-shadow-2xl uppercase tracking-tighter">
                                {currentPromo.title}
                            </h2>
                        </div>

                        {/* Puntos Indicadores */}
                        {promotions.length > 1 && (
                            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 flex gap-1.5 px-3 py-1.5 rounded-full bg-black/20 backdrop-blur-md">
                                {promotions.map((_, i) => (
                                    <div
                                        key={i}
                                        className={`h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/40'}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Área de Contenido */}
                    <div className="p-8 sm:p-10 text-center bg-white">
                        <p className="text-gray-600 mb-8 font-medium leading-relaxed text-sm sm:text-base">
                            {currentPromo.description}
                        </p>

                        <div className="flex flex-col space-y-4">
                            {currentPromo.button_link && (
                                <Link
                                    href={currentPromo.button_link}
                                    onClick={closePopup}
                                    className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-orange-600/20 active:scale-[0.98] uppercase tracking-widest text-sm"
                                >
                                    {currentPromo.button_text || 'Aprovechar Ahora'}
                                </Link>
                            )}

                            <div className="flex items-center gap-4">
                                <button
                                    onClick={closePopup}
                                    className="flex-1 py-4 bg-gray-50 hover:bg-gray-100 text-gray-500 font-black rounded-2xl transition-all text-[10px] uppercase tracking-widest"
                                >
                                    Cerrar Anuncio
                                </button>
                                {promotions.length > 1 && (
                                    <button
                                        onClick={nextSlide}
                                        className="px-6 py-4 bg-orange-50 text-orange-600 font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-orange-100 transition-all border border-orange-100"
                                    >
                                        Siguiente ({currentIndex + 1}/{promotions.length})
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
