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
  const { footerLogoUrl, settings } = useSettings();

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
      className="relative text-white overflow-hidden"
      style={{ backgroundColor: '#0a0a0b' }}
    >


      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-80 h-80 bg-orange-600/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* Brand Section */}
          <div className="col-span-1 lg:col-span-1">
            <div className="mb-8">
              <div className="relative w-40 h-14 transition-transform duration-300 hover:scale-105">
                {footerLogoUrl && (
                  <Image
                    src={footerLogoUrl}
                    alt={settings.site_name}
                    fill
                    className="object-contain"
                    sizes="160px"
                    unoptimized={true}
                  />
                )}
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-xs">
              {settings.footer_description || 'La plataforma definitiva para descubrir los tesoros ocultos de tu ciudad.'}
            </p>

            {/* Social Icons - Premium Style */}
            <div className="flex items-center gap-3">
              {[
                {
                  name: 'Facebook',
                  href: settings.facebook_url,
                  enabled: !!settings.facebook_url && settings.facebook_url !== '#',
                  icon: (
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  )
                },
                {
                  name: 'Instagram',
                  href: settings.instagram_url,
                  enabled: !!settings.instagram_url && settings.instagram_url !== '#',
                  icon: (
                    <g><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></g>
                  )
                },
                {
                  name: 'TikTok',
                  href: settings.tiktok_url,
                  enabled: !!settings.tiktok_url && settings.tiktok_url !== '#',
                  icon: (
                    <path d="M9 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M15 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0z M15 2v5a4 4 0 0 1-4 4" />
                  )
                },
                {
                  name: 'YouTube',
                  href: settings.youtube_url,
                  enabled: !!settings.youtube_url && settings.youtube_url !== '#',
                  icon: (
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z M9.75 15.02V8.48L15.45 11.75z" />
                  )
                }
              ].filter(social => social.enabled).map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300 hover:bg-orange-500 hover:border-orange-500 hover:-translate-y-1 group"
                  aria-label={social.name}
                >
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {social.icon}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Contact Details */}
          <div className="lg:ml-8">
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Contacto Directo</h4>
            <div className="space-y-5">
              {settings.footer_email && (
                <a href={`mailto:${settings.footer_email}`} className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0 border border-orange-500/20 group-hover:bg-orange-500 transition-colors">
                    <svg className="w-4 h-4 text-orange-500 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <span className="text-gray-400 text-sm group-hover:text-white transition-colors">{settings.footer_email}</span>
                </a>
              )}
              {settings.footer_phone && (
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0 border border-orange-500/20">
                    <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  </div>
                  <span className="text-gray-400 text-sm">{settings.footer_phone}</span>
                </div>
              )}
              {settings.footer_address && (
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0 border border-orange-500/20">
                    <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                  </div>
                  <span className="text-gray-400 text-sm">{settings.footer_address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Links Section */}
          <div className="grid grid-cols-2 gap-8 lg:col-span-1">
            <div>
              <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Navegación</h4>
              <ul className="space-y-4">
                <li><Link href="/" className="text-gray-400 text-sm hover:text-orange-500 transition-colors">Inicio</Link></li>
                <li><Link href="/listings" className="text-gray-400 text-sm hover:text-orange-500 transition-colors">Directorio</Link></li>
                <li><Link href="/add-listing" className="text-gray-400 text-sm hover:text-orange-500 transition-colors font-bold text-orange-500/80">Anuncia aquí</Link></li>
                <li><Link href="/admin" className="text-gray-400 text-sm hover:text-orange-500 transition-colors font-black uppercase tracking-widest text-[10px] mt-2 block opacity-50 hover:opacity-100">Acceso Admin</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Explora</h4>
              <ul className="space-y-4">
                <li><Link href="/category/restaurantes" className="text-gray-400 text-sm hover:text-orange-500 transition-colors">Comida</Link></li>
                <li><Link href="/category/turismo" className="text-gray-400 text-sm hover:text-orange-500 transition-colors">Turismo</Link></li>
                <li><Link href="/favorites" className="text-gray-400 text-sm hover:text-orange-500 transition-colors">Favoritos</Link></li>
              </ul>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="col-span-1">
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Newsletter</h4>
            <p className="text-gray-400 text-sm mb-6">Recibe las mejores ofertas exclusivas directamente en tu inbox.</p>
            {submitted ? (
              <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-bold text-center animate-bounce-in">
                ¡Gracias por unirte!
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <div className="relative group">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Tu email principal"
                    required
                    className="w-full h-14 pl-5 pr-14 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-gray-600 focus:outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 transition-all"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="absolute right-2 top-2 w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white transition-all hover:bg-orange-700 active:scale-90 disabled:opacity-50 shadow-lg shadow-orange-500/20"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    )}
                  </button>
                </div>
                {error && <p className="text-red-400 text-[10px] px-2">{error}</p>}
              </form>
            )}
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500 text-[11px] font-medium tracking-wider uppercase">
            © {new Date().getFullYear()} {settings.site_name} • Todos los derechos reservados
          </p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
            {[
              { name: 'Privacidad', href: '/privacy' },
              { name: 'Términos', href: '/terms' },
              { name: 'Soporte', href: '/contact' },
              { name: 'Admin', href: '/admin' }
            ].map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-[10px] font-black uppercase tracking-widest transition-colors ${link.name === 'Admin'
                  ? 'text-gray-400 hover:text-white' // More visible color
                  : 'text-gray-500 hover:text-white'
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
