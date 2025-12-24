'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface PromotionalSlide {
  id: number;
  image: string;
  title?: string;
  description?: string;
  link?: string;
  buttonText?: string;
}

interface PromotionalCarouselProps {
  slides?: PromotionalSlide[];
  autoPlayInterval?: number; // en milisegundos
  showControls?: boolean;
  showIndicators?: boolean;
}

// Slides por defecto si no se proporcionan
// Las imágenes vienen de Cloudinary
const defaultSlides: PromotionalSlide[] = [
  {
    id: 1,
    image: 'https://res.cloudinary.com/dnehxgvc1/image/upload/v1/dondeoficial/promotional/directorio-comercial-turismo.jpg',
    title: 'Tu Directorio Comercial de Confianza',
    description: 'Descubre los mejores negocios, restaurantes y servicios turísticos en un solo lugar',
    link: '/listings',
    buttonText: 'Explorar Directorio'
  },
  {
    id: 2,
    image: 'https://res.cloudinary.com/dnehxgvc1/image/upload/v1/dondeoficial/promotional/comercios-locales.jpg',
    title: 'Conecta con Comercios Locales',
    description: 'Encuentra productos, servicios y experiencias únicas cerca de ti',
    link: '/add-listing',
    buttonText: 'Agregar mi Negocio'
  }
];

export default function PromotionalCarousel({
  slides = defaultSlides,
  autoPlayInterval = 5000,
  showControls = true,
  showIndicators = true
}: PromotionalCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play del carrusel
  useEffect(() => {
    if (!isPaused && slides.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, autoPlayInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, slides.length, autoPlayInterval]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsPaused(true);
    // Reanudar auto-play después de 3 segundos
    setTimeout(() => setIsPaused(false), 3000);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 3000);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 3000);
  };

  if (slides.length === 0) {
    return null;
  }

  return (
    <section className="relative bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative w-full h-[400px] sm:h-[450px] md:h-[500px] overflow-hidden bg-gray-900 rounded-2xl shadow-2xl border border-gray-200">
      {/* Carrusel de imágenes */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Imagen de fondo */}
            <div className="relative w-full h-full">
              <Image
                src={slide.image}
                alt={slide.title || `Slide ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
                sizes="100vw"
                unoptimized
                onError={(e) => {
                  console.error('Error cargando imagen:', slide.image);
                  // Fallback si la imagen no carga
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              
              {/* Overlay oscuro para mejor legibilidad del texto */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60" />
              
              {/* Contenido del slide */}
              {(slide.title || slide.description || slide.link) && (
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="text-center px-4 sm:px-6 md:px-8 max-w-4xl mx-auto">
                    {slide.title && (
                      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 drop-shadow-lg">
                        {slide.title}
                      </h2>
                    )}
                    {slide.description && (
                      <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-6 sm:mb-8 drop-shadow-md">
                        {slide.description}
                      </p>
                    )}
                    {slide.link && slide.buttonText && (
                      <Link
                        href={slide.link}
                        className="btn-orange inline-block px-6 sm:px-8 md:px-10 py-3 sm:py-4 text-base sm:text-lg md:text-xl rounded-lg"
                      >
                        {slide.buttonText}
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Controles de navegación (flechas) */}
      {showControls && slides.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Slide anterior"
          >
            <svg
              className="w-6 h-6 sm:w-8 sm:h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Slide siguiente"
          >
            <svg
              className="w-6 h-6 sm:w-8 sm:h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </>
      )}

      {/* Indicadores (puntos) */}
      {showIndicators && slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2 sm:gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-white/50 ${
                index === currentSlide
                  ? 'bg-white w-8 sm:w-10 h-3 sm:h-3'
                  : 'bg-white/50 hover:bg-white/75 w-3 sm:w-3 h-3 sm:h-3'
              }`}
              aria-label={`Ir al slide ${index + 1}`}
            />
          ))}
        </div>
      )}
        </div>
      </div>
    </section>
  );
}

