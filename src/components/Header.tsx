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
              href="/admin"
              className="flex items-center space-x-2 bg-linear-to-r from-purple-600 to-indigo-600 text-white px-4 py-2.5 rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 border border-purple-500/20"
              title="Panel de Administración"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Admin</span>
            </Link>
            <Link
              href="/add-listing"
              className="text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(var(--gradient-direction), var(--primary-color), var(--secondary-color))' }}
            >
              Agregar Negocio
            </Link>
          </div>

          {/* Mobile actions (Reduced) - No burger menu since we have Bottom Nav */}
          <div className="lg:hidden flex items-center gap-3">
            <Link
              href="/favorites"
              className="relative p-2 text-gray-600"
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
          </div>
        </div>
      </div>
    </header>
  );
}
