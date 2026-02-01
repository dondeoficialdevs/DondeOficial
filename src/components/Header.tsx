'use client';

import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';
import { useFavorites } from '@/hooks/useFavorites';
import { useSettings } from '@/hooks/useSettings';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { favoritesCount } = useFavorites();
  const { logoUrl } = useSettings();

  return (
    <header
      className="shadow-lg sticky top-0 z-50 border-b border-gray-100"
      style={{ backgroundColor: 'var(--header-bg)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center group">
              <div className="relative w-32 h-10 sm:w-40 sm:h-12 md:w-48 md:h-16 flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src={logoUrl}
                  alt="DondeOficial Logo"
                  fill
                  className="object-contain" // Keep aspect ratio
                  priority
                  sizes="(max-width: 640px) 128px, (max-width: 768px) 160px, 192px"
                  unoptimized={true}
                />
                <span className="sr-only">DondeOficial</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 ml-8">
            <Link href="/" className="text-gray-700 hover:text-orange-600 font-medium transition-colors duration-200 relative group py-2">
              Inicio
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-600 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link href="/listings" className="text-gray-700 hover:text-orange-600 font-medium transition-colors duration-200 relative group py-2">
              Directorio
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-600 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-orange-600 font-medium transition-colors duration-200 relative group py-2">
              Contacto
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-600 transition-all duration-200 group-hover:w-full"></span>
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link
              href="/favorites"
              className="relative flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors duration-200 group"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill={favoritesCount > 0 ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="text-sm font-medium">Favoritos</span>
              {favoritesCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {favoritesCount > 9 ? '9+' : favoritesCount}
                </span>
              )}
            </Link>
            <Link
              href="/add-listing"
              className="text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(var(--gradient-direction), var(--primary-color), var(--secondary-color))' }}
            >
              Agregar Negocio
            </Link>
          </div>

          {/* Mobile actions */}
          <div className="lg:hidden flex items-center gap-2">
            <Link
              href="/favorites"
              className="relative p-2 text-gray-600 hover:text-red-500 transition-colors"
            >
              <svg className="w-6 h-6" fill={favoritesCount > 0 ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {favoritesCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {favoritesCount > 9 ? '9+' : favoritesCount}
                </span>
              )}
            </Link>

            <button
              className="p-2 text-gray-700 hover:text-orange-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              title="Menú"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Overlay */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 py-6 px-4 bg-white/95 backdrop-blur-md animate-in slide-in-from-top duration-300">
            <nav className="flex flex-col space-y-5">
              <Link
                href="/"
                className="text-lg font-semibold text-gray-800 flex items-center gap-3 p-2 hover:bg-orange-50 rounded-xl transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                </div>
                Inicio
              </Link>
              <Link
                href="/listings"
                className="text-lg font-semibold text-gray-800 flex items-center gap-3 p-2 hover:bg-blue-50 rounded-xl transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                Directorio
              </Link>
              <Link
                href="/contact"
                className="text-lg font-semibold text-gray-800 flex items-center gap-3 p-2 hover:bg-green-50 rounded-xl transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                Contacto
              </Link>

            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
