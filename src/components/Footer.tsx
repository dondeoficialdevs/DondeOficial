'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { newsletterApi } from '@/lib/api';
import { useSettings } from '@/hooks/useSettings';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const { logoUrl, settings } = useSettings();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await newsletterApi.subscribe(email);
      setSubmitted(true);
      setEmail('');
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err: unknown) {
      console.error('Error subscribing:', err);
      const errorMessage = err instanceof Error
        ? err.message
        : (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Error al suscribirse. Por favor intenta de nuevo.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  return (
    <footer
      className="text-white"
      style={{ backgroundColor: 'var(--footer-bg)' }}
    >
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-6">
              <div className="relative w-32 h-10 sm:w-40 sm:h-12 md:w-48 md:h-14 flex-shrink-0">
                <Image
                  src={logoUrl}
                  alt="DondeOficial Logo"
                  fill
                  className="object-contain" // Keep aspect ratio
                  sizes="(max-width: 640px) 128px, (max-width: 768px) 160px, 192px"
                  unoptimized={true}
                />
              </div>
            </div>
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
              Tu plataforma de directorio integral para descubrir y explorar los mejores negocios y destinos.
              Conéctate con negocios locales verificados y encuentra exactamente lo que buscas.
            </p>

            {/* Social Media */}
            <div className="flex space-x-4 mb-6">
              <a
                href="https://www.facebook.com/profile.php?id=61573619618382"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#1877F2] hover:bg-[#166FE5] rounded-lg flex items-center justify-center transition-all duration-200 group"
                title="Síguenos en Facebook"
                aria-label="Seguir a DondeOficial en Facebook"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="white" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/dondeoficial?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] hover:opacity-90 rounded-lg flex items-center justify-center transition-all duration-200 group"
                title="Síguenos en Instagram"
                aria-label="Seguir a DondeOficial en Instagram"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="white" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-black hover:bg-gray-900 rounded-lg flex items-center justify-center transition-all duration-200 group"
                title="Síguenos en TikTok"
                aria-label="Seguir a DondeOficial en TikTok"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="white" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </a>
            </div>

            {/* Newsletter */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Mantente Actualizado</h4>
              <p className="text-gray-300 text-sm mb-3">Recibe las últimas ofertas y listados de negocios</p>
              {submitted ? (
                <div className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium text-center">
                  ✓ ¡Suscrito!
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col space-y-2">
                  {error && (
                    <div className="text-red-400 text-xs">{error}</div>
                  )}
                  <div className="flex space-x-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError('');
                      }}
                      placeholder="Ingresa tu correo"
                      required
                      className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? '...' : 'Suscribirse'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-6 text-lg">Contacto</h4>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 mr-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:dondeoficial@gmail.com" className="hover:text-white transition-colors">dondeoficial@gmail.com</a>
              </li>
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 mr-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+57 322 411 7575</span> {/* Placeholder based on typical USER request if not found */}
              </li>
              <li className="flex items-start text-gray-300">
                <svg className="w-5 h-5 mr-3 text-orange-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <span>Tunja, Boyacá</span>
              </li>
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 mr-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Lun - Dom: Siempre Abierto</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-6 text-lg">Menú</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/listings" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group">
                  Directorio
                </Link>
              </li>
              <li>
                <Link href="/add-listing" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group">
                  Agregar Negocio
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-6 text-lg">Categorías Populares</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/category/restaurant" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group">
                  <svg className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Restaurantes
                </Link>
              </li>
              <li>
                <Link href="/category/museum" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group">
                  <svg className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Museos
                </Link>
              </li>
              <li>
                <Link href="/category/fitness zone" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group">
                  <svg className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Zona Fitness
                </Link>
              </li>
              <li>
                <Link href="/listings" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group">
                  <svg className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Ver Todas
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-700/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-6 mb-4 md:mb-0">
              <p className="text-gray-400 text-sm">
                Copyright © 2025 DondeOficial. Todos los derechos reservados.
              </p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-end space-x-6">
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                Términos y Condiciones
              </Link>
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                Política de Privacidad
              </Link>
              <Link href="/services" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                Servicios
              </Link>
              <Link href="/career" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                Carrera
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
