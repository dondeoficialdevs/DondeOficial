'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface Image {
    id: number;
    image_url: string;
}

interface LightboxProps {
    images: Image[];
    initialIndex: number;
    isOpen: boolean;
    onClose: () => void;
}

export default function Lightbox({ images, initialIndex, isOpen, onClose }: LightboxProps) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    useEffect(() => {
        setCurrentIndex(initialIndex);
    }, [initialIndex]);

    const handlePrevious = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    }, [images.length]);

    const handleNext = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    }, [images.length]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft') handlePrevious();
            if (e.key === 'ArrowRight') handleNext();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose, handlePrevious, handleNext]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md transition-all duration-300 animate-in fade-in"
            onClick={onClose}
        >
            {/* Header Info */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-[110] bg-gradient-to-b from-black/50 to-transparent">
                <div className="text-white font-bold text-lg">
                    {currentIndex + 1} / {images.length}
                </div>
                <button
                    onClick={onClose}
                    className="p-2 bg-white/20 hover:bg-white/40 rounded-full text-white transition-all transform active:scale-95"
                >
                    <X size={24} />
                </button>
            </div>

            {/* Main Image */}
            <div className="relative w-full h-full p-4 md:p-12 flex items-center justify-center select-none">
                {/* Previous Button */}
                <button
                    onClick={handlePrevious}
                    className="absolute left-4 md:left-8 p-3 md:p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all z-[110] backdrop-blur-sm hidden sm:block"
                >
                    <ChevronLeft size={32} />
                </button>

                <div
                    className="relative max-w-7xl max-h-full flex items-center justify-center"
                    onClick={(e) => e.stopPropagation()}
                >
                    <img
                        src={images[currentIndex].image_url}
                        alt={`Imagen ${currentIndex + 1}`}
                        className="max-w-full max-h-[85vh] object-contain shadow-2xl rounded-sm animate-in zoom-in-95 duration-300"
                    />
                </div>

                {/* Next Button */}
                <button
                    onClick={handleNext}
                    className="absolute right-4 md:right-8 p-3 md:p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all z-[110] backdrop-blur-sm hidden sm:block"
                >
                    <ChevronRight size={32} />
                </button>
            </div>

            {/* Mobile Swipe Simulation / Taps */}
            <div className="absolute inset-y-0 left-0 w-1/4 sm:hidden" onClick={handlePrevious}></div>
            <div className="absolute inset-y-0 right-0 w-1/4 sm:hidden" onClick={handleNext}></div>

            {/* Footer / Thumbnails preview or simple hint */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 text-xs font-medium uppercase tracking-widest hidden md:block">
                Presiona ESC para salir o usa las flechas para navegar
            </div>
        </div>
    );
}
