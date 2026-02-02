'use client';

import { useState, useEffect } from 'react';
import { settingsApi } from '@/lib/api';
import { SiteSettings } from '@/types';
import Image from 'next/image';

export default function SettingsPage() {
    const [settings, setSettings] = useState<SiteSettings>({
        id: 0,
        logo_url: '/images/logo/Logo_Dondel.png',
        footer_logo_url: '/images/logo/Logo_Dondel.png',
        site_name: 'DondeOficial',
        primary_color: '#f97316',
        secondary_color: '#ea580c',
        header_color: '#ffffff',
        footer_color: '#111827',
        bg_color: '#f9fafb',
        gradient_direction: 'horizontal',
        footer_description: '',
        footer_phone: '',
        footer_email: '',
        footer_address: '',
        facebook_url: '',
        instagram_url: '',
        tiktok_url: '',
        youtube_url: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [footerLogoFile, setFooterLogoFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [footerPreviewUrl, setFooterPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            setLoading(true);
            const data = await settingsApi.getSettings();
            if (data) {
                setSettings({
                    ...data,
                    primary_color: data.primary_color || '#f97316',
                    secondary_color: data.secondary_color || '#ea580c',
                    header_color: data.header_color || '#ffffff',
                    footer_color: data.footer_color || '#111827',
                    bg_color: data.bg_color || '#f9fafb',
                    gradient_direction: (data.gradient_direction as any) || 'horizontal',
                    footer_description: data.footer_description || '',
                    footer_phone: data.footer_phone || '',
                    footer_email: data.footer_email || '',
                    footer_address: data.footer_address || '',
                    facebook_url: data.facebook_url || '',
                    instagram_url: data.instagram_url || '',
                    tiktok_url: data.tiktok_url || '',
                    youtube_url: data.youtube_url || ''
                });
                setPreviewUrl(data.logo_url);
                setFooterPreviewUrl(data.footer_logo_url || data.logo_url);
            }
        } catch (err) {
            console.error('Error loading settings:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setLogoFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleFooterLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFooterLogoFile(file);
            setFooterPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            let logo_url = settings.logo_url;
            let footer_logo_url = settings.footer_logo_url;

            if (logoFile) {
                logo_url = await settingsApi.uploadLogo(logoFile, 'site-logo');
            }

            if (footerLogoFile) {
                footer_logo_url = await settingsApi.uploadLogo(footerLogoFile, 'footer-logo');
            }

            const updatedSettings = await settingsApi.updateSettings({
                ...settings,
                logo_url,
                footer_logo_url
            });

            setSettings(updatedSettings);
            // Cache locally to ensure preloader shows new logo immediately after reload
            if (typeof window !== 'undefined') {
                localStorage.setItem('site_settings', JSON.stringify(updatedSettings));
            }
            alert('Configuración guardada correctamente');
            window.location.reload();
        } catch (err: any) {
            console.error('Error saving settings:', err);
            const message = err.message || 'Error desconocido';
            alert(`Error al guardar la configuración: ${message}`);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
        </div>
    );

    const getGradientStyle = () => {
        const direction = settings.gradient_direction === 'vertical' ? 'to bottom' : 'to right';
        return `linear-gradient(${direction}, ${settings.primary_color}, ${settings.secondary_color})`;
    };

    return (
        <div className="p-4 sm:p-8 max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 uppercase tracking-tight text-center sm:text-left">Personalización</h1>
                <p className="text-xs sm:text-base text-gray-500 font-medium text-center sm:text-left">Gestiona la identidad visual global</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                {/* Logo Section */}
                <div className="bg-white rounded-3xl sm:rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden p-6 sm:p-12">
                    <h2 className="text-lg sm:text-xl font-black mb-6 sm:mb-8 text-gray-900 uppercase tracking-tight flex items-center justify-center sm:justify-start gap-3">
                        <span className="w-1.5 h-6 bg-orange-600 rounded-full"></span>
                        Identidad Visual
                    </h2>

                    <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-10">
                        <div className="relative w-full sm:w-48 h-48 bg-gray-50 rounded-2xl sm:rounded-3xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden group">
                            {previewUrl ? (
                                <Image
                                    src={previewUrl}
                                    alt="Logo Preview"
                                    fill
                                    className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                                    unoptimized
                                />
                            ) : (
                                <div className="text-gray-400 text-center p-4">
                                    <svg className="w-12 h-12 mx-auto mb-2 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-xs font-bold tracking-tighter uppercase">Sin Logo</span>
                                </div>
                            )}
                        </div>

                        <div className="flex-1 w-full space-y-6">
                            <div className="space-y-2 text-center sm:text-left">
                                <label className="text-xs font-black text-gray-500 uppercase tracking-widest block">Nombre del Sitio</label>
                                <input
                                    type="text"
                                    value={settings.site_name}
                                    onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                                    className="w-full px-4 py-3 sm:py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-orange-500 rounded-xl sm:rounded-2xl outline-none transition-all font-bold text-gray-800 text-center sm:text-left"
                                    placeholder="Nombre de tu marca..."
                                />
                            </div>

                            <div className="flex justify-center sm:justify-start">
                                <label className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-orange-600 text-white rounded-xl font-black text-xs uppercase tracking-widest cursor-pointer hover:bg-orange-700 transition-all transform active:scale-95 shadow-lg shadow-orange-500/20">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                    </svg>
                                    Cambiar Logo
                                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Logo Section */}
                <div className="mt-12 pt-12 border-t border-gray-100">
                    <h3 className="text-lg font-black mb-6 text-gray-900 uppercase tracking-tight flex items-center gap-3">
                        <span className="w-1 h-4 bg-gray-400 rounded-full"></span>
                        Logo del Footer
                    </h3>
                    <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-10">
                        <div className="relative w-full sm:w-48 h-24 bg-gray-900 rounded-2xl border-2 border-dashed border-gray-700 flex items-center justify-center overflow-hidden group">
                            {footerPreviewUrl ? (
                                <Image
                                    src={footerPreviewUrl}
                                    alt="Footer Logo Preview"
                                    fill
                                    className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                                    unoptimized
                                />
                            ) : (
                                <span className="text-gray-600 text-[10px] font-black uppercase">Sin Logo</span>
                            )}
                        </div>
                        <div className="flex-1 w-full">
                            <label className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-gray-800 text-white rounded-xl font-black text-xs uppercase tracking-widest cursor-pointer hover:bg-gray-700 transition-all transform active:scale-95">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                                Cambiar Logo Footer
                                <input type="file" className="hidden" accept="image/*" onChange={handleFooterLogoChange} />
                            </label>
                            <p className="mt-3 text-[10px] text-gray-400 font-medium">Se recomienda un logo con fondo transparente o colores claros para el footer oscuro.</p>
                        </div>
                    </div>
                </div>

                {/* Footer Content Section */}
                <div className="bg-white rounded-3xl sm:rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden p-6 sm:p-12">
                    <h2 className="text-lg sm:text-xl font-black mb-6 sm:mb-8 text-gray-900 uppercase tracking-tight flex items-center justify-center sm:justify-start gap-3">
                        <span className="w-1.5 h-6 bg-orange-600 rounded-full"></span>
                        Contenido del Footer
                    </h2>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest block">Descripción del Footer</label>
                            <textarea
                                value={settings.footer_description}
                                onChange={(e) => setSettings({ ...settings, footer_description: e.target.value })}
                                className="w-full px-4 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-orange-500 rounded-2xl outline-none transition-all font-bold text-gray-800 min-h-[100px]"
                                placeholder="Breve descripción de la marca para el footer..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-500 uppercase tracking-widest block">Teléfono</label>
                                <input
                                    type="text"
                                    value={settings.footer_phone}
                                    onChange={(e) => setSettings({ ...settings, footer_phone: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-orange-500 rounded-xl outline-none transition-all font-bold text-gray-800"
                                    placeholder="+57..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-500 uppercase tracking-widest block">Email</label>
                                <input
                                    type="email"
                                    value={settings.footer_email}
                                    onChange={(e) => setSettings({ ...settings, footer_email: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-orange-500 rounded-xl outline-none transition-all font-bold text-gray-800"
                                    placeholder="contacto@..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-500 uppercase tracking-widest block">Dirección / Ciudad</label>
                                <input
                                    type="text"
                                    value={settings.footer_address}
                                    onChange={(e) => setSettings({ ...settings, footer_address: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-orange-500 rounded-xl outline-none transition-all font-bold text-gray-800"
                                    placeholder="Tunja, Boyacá..."
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Social Media Section */}
                <div className="bg-white rounded-3xl sm:rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden p-6 sm:p-12">
                    <h2 className="text-lg sm:text-xl font-black mb-6 sm:mb-8 text-gray-900 uppercase tracking-tight flex items-center justify-center sm:justify-start gap-3">
                        <span className="w-1.5 h-6 bg-orange-600 rounded-full"></span>
                        Redes Sociales
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest block flex items-center gap-2">
                                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.597 0 0 .597 0 1.326v21.348C0 23.403.597 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.597 1.323-1.326V1.326C24 .597 23.403 0 22.675 0z" /></svg>
                                Facebook
                            </label>
                            <input
                                type="url"
                                value={settings.facebook_url}
                                onChange={(e) => setSettings({ ...settings, facebook_url: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-orange-500 rounded-xl outline-none transition-all font-bold text-gray-800"
                                placeholder="https://facebook.com/..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest block flex items-center gap-2">
                                <svg className="w-4 h-4 text-pink-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126s1.336 1.079 2.126 1.384c.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384s1.079-1.336 1.384-2.126c.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126s-1.336-1.079-2.126-1.384c-.765-.296-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.584-.071 4.85c-.055 1.17-.249 1.805-.415 2.227-.217.562-.477.96-.896 1.382-.42.419-.819.679-1.381.896-.422.164-1.056.36-2.227.413-1.266.057-1.646.07-4.85.07s-3.584-.015-4.85-.071c-1.17-.055-1.805-.249-2.227-.415-.562-.217-.96-.477-1.382-.896-.419-.42-.679-.819-.896-1.381-.164-.422-.36-1.057-.413-2.227-.057-1.266-.07-1.646-.07-4.85s.015-3.584.071-4.85c.055-1.17.249-1.805.415-2.227.217-.562.477-.96.896-1.382.42-.419.819-.679 1.381-.896.422-.164 1.057-.36 2.227-.413 1.286-.057 1.646-.07 4.85-.07zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                                Instagram
                            </label>
                            <input
                                type="url"
                                value={settings.instagram_url}
                                onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-orange-500 rounded-xl outline-none transition-all font-bold text-gray-800"
                                placeholder="https://instagram.com/..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest block flex items-center gap-2">
                                <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.59-1 .01 2.62.02 5.24 0 7.86-.08 2.04-.46 4.14-1.61 5.83-1.31 2.03-3.58 3.19-5.97 3.27-2.45.11-4.87-.93-6.33-2.9-1.58-2.1-1.77-5.18-.46-7.4 1.23-2.04 3.55-3.23 5.92-3.13.01.03.01.06.02.09.01 1.34.02 2.68.03 4.02-1.58-.05-3.32.79-3.95 2.26-.6 1.32-.23 3.12.92 4.03.93.75 2.21.84 3.32.22 1.07-.53 1.69-1.68 1.73-2.85.02-2.31.02-4.63.03-6.94v-3.32z" /></svg>
                                TikTok
                            </label>
                            <input
                                type="url"
                                value={settings.tiktok_url}
                                onChange={(e) => setSettings({ ...settings, tiktok_url: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-orange-500 rounded-xl outline-none transition-all font-bold text-gray-800"
                                placeholder="https://tiktok.com/@..."
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest block flex items-center gap-2">
                                <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                                YouTube
                            </label>
                            <input
                                type="url"
                                value={settings.youtube_url}
                                onChange={(e) => setSettings({ ...settings, youtube_url: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-orange-500 rounded-xl outline-none transition-all font-bold text-gray-800"
                                placeholder="https://youtube.com/..."
                            />
                        </div>
                    </div>
                </div>

                {/* Colors Section */}
                <div className="bg-white rounded-3xl sm:rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden p-6 sm:p-12">
                    <h2 className="text-lg sm:text-xl font-black mb-6 sm:mb-8 text-gray-900 uppercase tracking-tight flex items-center justify-center sm:justify-start gap-3">
                        <span className="w-1.5 h-6 bg-orange-600 rounded-full"></span>
                        Diseño y Colores
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 sm:gap-y-8">
                        {/* Primary & Secondary */}
                        <div className="space-y-3">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest block text-center sm:text-left">Color Primario</label>
                            <div className="flex items-center gap-3 sm:gap-4 p-2 bg-gray-50 rounded-xl sm:rounded-2xl border-2 border-transparent">
                                <div className="relative w-10 sm:w-12 h-10 sm:h-12 flex-shrink-0 bg-white rounded-lg border border-gray-200 overflow-hidden">
                                    <input type="color" value={settings.primary_color} onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })} className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer" />
                                    <div className="w-full h-full" style={{ backgroundColor: settings.primary_color }}></div>
                                </div>
                                <input type="text" value={settings.primary_color} onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })} className="flex-1 bg-transparent font-mono font-bold text-sm sm:text-base outline-none uppercase" maxLength={7} />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest block text-center sm:text-left">Color Secundario</label>
                            <div className="flex items-center gap-3 sm:gap-4 p-2 bg-gray-50 rounded-xl sm:rounded-2xl border-2 border-transparent">
                                <div className="relative w-10 sm:w-12 h-10 sm:h-12 flex-shrink-0 bg-white rounded-lg border border-gray-200 overflow-hidden">
                                    <input type="color" value={settings.secondary_color} onChange={(e) => setSettings({ ...settings, secondary_color: e.target.value })} className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer" />
                                    <div className="w-full h-full" style={{ backgroundColor: settings.secondary_color }}></div>
                                </div>
                                <input type="text" value={settings.secondary_color} onChange={(e) => setSettings({ ...settings, secondary_color: e.target.value })} className="flex-1 bg-transparent font-mono font-bold text-sm sm:text-base outline-none uppercase" maxLength={7} />
                            </div>
                        </div>

                        {/* Gradient Direction */}
                        <div className="space-y-3 col-span-1 md:col-span-2">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest block text-center sm:text-left">Dirección del Degradado</label>
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 font-black">
                                <button
                                    type="button"
                                    onClick={() => setSettings({ ...settings, gradient_direction: 'horizontal' })}
                                    className={`flex-1 py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs uppercase tracking-widest transition-all ${settings.gradient_direction === 'horizontal' ? 'bg-orange-600 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                >
                                    Horizontal
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSettings({ ...settings, gradient_direction: 'vertical' })}
                                    className={`flex-1 py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs uppercase tracking-widest transition-all ${settings.gradient_direction === 'vertical' ? 'bg-orange-600 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                >
                                    Vertical
                                </button>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest block text-center sm:text-left">Fondo del Header</label>
                            <div className="flex items-center gap-3 sm:gap-4 p-2 bg-gray-50 rounded-xl sm:rounded-2xl border-2 border-transparent">
                                <div className="relative w-10 sm:w-12 h-10 sm:h-12 flex-shrink-0 bg-white rounded-lg border border-gray-200 overflow-hidden">
                                    <input type="color" value={settings.header_color} onChange={(e) => setSettings({ ...settings, header_color: e.target.value })} className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer" />
                                    <div className="w-full h-full" style={{ backgroundColor: settings.header_color }}></div>
                                </div>
                                <input type="text" value={settings.header_color} onChange={(e) => setSettings({ ...settings, header_color: e.target.value })} className="flex-1 bg-transparent font-mono font-bold text-sm sm:text-base outline-none uppercase" maxLength={7} />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest block text-center sm:text-left">Fondo del Footer</label>
                            <div className="flex items-center gap-3 sm:gap-4 p-2 bg-gray-50 rounded-xl sm:rounded-2xl border-2 border-transparent">
                                <div className="relative w-10 sm:w-12 h-10 sm:h-12 flex-shrink-0 bg-white rounded-lg border border-gray-200 overflow-hidden">
                                    <input type="color" value={settings.footer_color} onChange={(e) => setSettings({ ...settings, footer_color: e.target.value })} className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer" />
                                    <div className="w-full h-full" style={{ backgroundColor: settings.footer_color }}></div>
                                </div>
                                <input type="text" value={settings.footer_color} onChange={(e) => setSettings({ ...settings, footer_color: e.target.value })} className="flex-1 bg-transparent font-mono font-bold text-sm sm:text-base outline-none uppercase" maxLength={7} />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest block text-center sm:text-left">Fondo Página</label>
                            <div className="flex items-center gap-3 sm:gap-4 p-2 bg-gray-50 rounded-xl sm:rounded-2xl border-2 border-transparent">
                                <div className="relative w-10 sm:w-12 h-10 sm:h-12 flex-shrink-0 bg-white rounded-lg border border-gray-200 overflow-hidden">
                                    <input type="color" value={settings.bg_color} onChange={(e) => setSettings({ ...settings, bg_color: e.target.value })} className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer" />
                                    <div className="w-full h-full" style={{ backgroundColor: settings.bg_color }}></div>
                                </div>
                                <input type="text" value={settings.bg_color} onChange={(e) => setSettings({ ...settings, bg_color: e.target.value })} className="flex-1 bg-transparent font-mono font-bold text-sm sm:text-base outline-none uppercase" maxLength={7} />
                            </div>
                        </div>
                    </div>

                    {/* Preview Helper */}
                    <div className="mt-8 sm:mt-12 p-6 sm:p-10 rounded-[2rem] bg-gray-900 overflow-hidden relative group">
                        <div className="absolute inset-0 opacity-20" style={{ background: getGradientStyle() }}></div>
                        <div className="relative z-10 flex flex-col items-center">
                            <h4 className="text-white font-black uppercase tracking-widest text-[10px] sm:text-xs mb-6 text-center">Vista Previa</h4>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full">
                                <button
                                    className="w-full sm:w-auto px-6 sm:px-10 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm uppercase tracking-widest text-white shadow-2xl transition-transform hover:scale-105"
                                    style={{ background: getGradientStyle() }}
                                    type="button"
                                >
                                    Degradado
                                </button>
                                <div
                                    className="w-full sm:w-auto px-6 sm:px-10 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm uppercase tracking-widest border-2 text-center"
                                    style={{ borderColor: settings.primary_color, color: settings.primary_color }}
                                >
                                    Delineado
                                </div>
                            </div>
                            <p className="mt-6 sm:mt-8 text-white/40 text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-center">
                                Estilo aplicado a botones y elementos clave
                            </p>
                        </div>
                    </div>
                </div>

                <div className="pt-2 sm:pt-4 pb-12">
                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full py-4 sm:py-6 bg-orange-600 text-white rounded-2xl sm:rounded-[2rem] font-black text-lg sm:text-xl hover:bg-orange-700 hover:shadow-2xl hover:shadow-orange-200 transition-all active:scale-[0.97] disabled:opacity-50 uppercase tracking-wide"
                    >
                        {saving ? 'Guardando...' : 'Aplicar Cambios'}
                    </button>
                </div>
            </form >
        </div >
    );
}
