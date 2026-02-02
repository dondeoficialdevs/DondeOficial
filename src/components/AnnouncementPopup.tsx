'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { promotionApi } from '@/lib/api';
import { Promotion } from '@/types';

export default function AnnouncementPopup() {
    const [isOpen, setIsOpen] = useState(false);
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPopups = async () => {
            try {
                const activePopups = await promotionApi.getActivePopups();
                if (activePopups && activePopups.length > 0) {
                    // Filtrar los que ya se han visto en esta sesión
                    const unseenPopups = activePopups.filter(p => !sessionStorage.getItem(`hasSeenAnnouncement_${p.id}`));

                    if (unseenPopups.length > 0) {
                        setPromotions(unseenPopups);
                        // Mostrar después de 3 segundos
                        const timer = setTimeout(() => {
                            setIsOpen(true);
                        }, 3000);
                        return () => clearTimeout(timer);
                    }
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
        // Marcar todos los de esta tanda como vistos
        promotions.forEach(p => {
            sessionStorage.setItem(`hasSeenAnnouncement_${p.id}`, 'true');
        });
    };

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev === promotions.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? promotions.length - 1 : prev - 1));
    };

    if (loading || !isOpen || promotions.length === 0) return null;

    const currentPromo = promotions[currentIndex];

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] overflow-hidden shadow-2xl transform transition-all animate-bounce-in border border-white/10">

                {/* Close Button */}
                <button
                    onClick={closePopup}
                    className="absolute top-5 right-5 z-[60] w-10 h-10 bg-black/20 hover:bg-black/50 text-white rounded-full flex items-center justify-center transition-all backdrop-blur-md border border-white/10 active:scale-95"
                    aria-label="Cerrar"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Slider Controls (Only if multiple) */}
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
                    {/* Image Area */}
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
                                        className="object-contain drop-shadow-2xl transition-transform duration-500 hover:scale-105"
                                        priority
                                        unoptimized
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="absolute inset-0 bg-linear-to-br from-orange-500 to-orange-700"></div>
                        )}

                        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent z-10"></div>

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

                        {/* Pagination Dots */}
                        {promotions.length > 1 && (
                            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 flex gap-1.5 px-3 py-1.5 rounded-full bg-black/20 backdrop-blur-md">
                                {promotions.map((_, i) => (
                                    <div
                                        key={i}
                                        className={`h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/40'}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Content Area */}
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
