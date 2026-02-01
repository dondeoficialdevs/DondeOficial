'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { promotionApi } from '@/lib/api';
import { Promotion } from '@/types';

export default function AnnouncementPopup() {
    const [isOpen, setIsOpen] = useState(false);
    const [promotion, setPromotion] = useState<Promotion | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPopup = async () => {
            try {
                const activePopup = await promotionApi.getActivePopup();
                if (activePopup) {
                    setPromotion(activePopup);

                    // Solo mostrar el popup después de 3 segundos si no se ha visto antes
                    const timer = setTimeout(() => {
                        const hasSeenPopup = sessionStorage.getItem(`hasSeenAnnouncement_${activePopup.id}`);
                        if (!hasSeenPopup) {
                            setIsOpen(true);
                        }
                    }, 3000);

                    return () => clearTimeout(timer);
                }
            } catch (error) {
                console.error('Error fetching announcement popup:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPopup();
    }, []);

    const closePopup = () => {
        setIsOpen(false);
        if (promotion) {
            sessionStorage.setItem(`hasSeenAnnouncement_${promotion.id}`, 'true');
        }
    };

    if (loading || !isOpen || !promotion) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl transform transition-all animate-bounce-in">
                {/* Botón de Cerrar */}
                <button
                    onClick={closePopup}
                    className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-md"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="flex flex-col">
                    {/* Imagen de la Oferta */}
                    <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-orange-500">
                        {promotion.image_url && (
                            <>
                                {/* Blurred Background */}
                                <div
                                    className="absolute inset-0 bg-cover bg-center blur-xl opacity-50 scale-110"
                                    style={{ backgroundImage: `url(${promotion.image_url})` }}
                                />
                                {/* Main Image */}
                                <Image
                                    src={promotion.image_url}
                                    alt={promotion.title}
                                    fill
                                    className="relative object-contain z-10"
                                />
                            </>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-6 left-6 right-6">
                            {(promotion.badge_text || promotion.is_discount) && (
                                <span className="bg-orange-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter mb-2 inline-block">
                                    {promotion.badge_text || '¡Oferta Exclusiva!'}
                                </span>
                            )}
                            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                                {promotion.title}
                            </h2>
                        </div>
                    </div>

                    {/* Contenido */}
                    <div className="p-8 text-center bg-white">
                        <p className="text-gray-600 mb-8 font-medium">
                            {promotion.description}
                        </p>
                        <div className="flex flex-col space-y-3">
                            {promotion.button_link && (
                                <Link
                                    href={promotion.button_link}
                                    onClick={closePopup}
                                    className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white font-black rounded-2xl transition-all shadow-lg hover:shadow-orange-200 uppercase tracking-widest text-sm"
                                >
                                    {promotion.button_text || 'Ver Todas las Ofertas'}
                                </Link>
                            )}
                            <button
                                onClick={closePopup}
                                className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-500 font-bold rounded-2xl transition-all text-sm uppercase tracking-wide"
                            >
                                Quizás más tarde
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
