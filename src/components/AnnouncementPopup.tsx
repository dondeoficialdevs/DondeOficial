'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function AnnouncementPopup() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Mostrar el popup después de 3 segundos
        const timer = setTimeout(() => {
            const hasSeenPopup = sessionStorage.getItem('hasSeenAnnouncement');
            if (!hasSeenPopup) {
                setIsOpen(true);
            }
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    const closePopup = () => {
        setIsOpen(false);
        sessionStorage.setItem('hasSeenAnnouncement', 'true');
    };

    if (!isOpen) return null;

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
                    <div className="relative h-64 sm:h-80 w-full bg-orange-500">
                        <Image
                            src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=800"
                            alt="Anuncio Especial"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-6 left-6 right-6">
                            <span className="bg-orange-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter mb-2 inline-block">
                                ¡Oferta Exclusiva!
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                                Descubre los mejores descuentos hoy
                            </h2>
                        </div>
                    </div>

                    {/* Contenido */}
                    <div className="p-8 text-center bg-white">
                        <p className="text-gray-600 mb-8 font-medium">
                            Únete a nuestra comunidad y recibe las mejores ofertas de tu ciudad directamente en tu WhatsApp.
                        </p>
                        <div className="flex flex-col space-y-3">
                            <Link
                                href="/listings?has_offer=true"
                                onClick={closePopup}
                                className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white font-black rounded-2xl transition-all shadow-lg hover:shadow-orange-200 uppercase tracking-widest text-sm"
                            >
                                Ver Todas las Ofertas
                            </Link>
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
