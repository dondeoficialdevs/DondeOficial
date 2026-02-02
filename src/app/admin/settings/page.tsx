'use client';

import { useState, useEffect } from 'react';
import { settingsApi } from '@/lib/api';
import { SiteSettings } from '@/types';
import Image from 'next/image';
import AdminImageUpload from '@/components/admin/AdminImageUpload';
import { Palette, Globe, Mail, Phone, MapPin, Facebook, Instagram, Youtube, Save, Layout, Shield } from 'lucide-react';

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
            const updatedSettings = await settingsApi.updateSettings(settings);

            setSettings(updatedSettings);
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
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl overflow-hidden p-8 sm:p-12">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white shadow-xl">
                            <Palette size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Identidad Visual</h2>
                            <p className="text-sm text-gray-500 font-medium">Logos y nombre de la plataforma</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Nombre del Sitio</label>
                                <input
                                    type="text"
                                    value={settings.site_name}
                                    onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                                    className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-black rounded-2xl outline-none transition-all font-bold text-gray-800"
                                    placeholder="Nombre de tu marca..."
                                />
                            </div>

                            <AdminImageUpload
                                onUploadComplete={(url) => setSettings({ ...settings, logo_url: url })}
                                currentImageUrl={settings.logo_url}
                                folder="settings"
                                label="Logo Principal (Header)"
                            />
                        </div>

                        <div className="space-y-6">
                            <AdminImageUpload
                                onUploadComplete={(url) => setSettings({ ...settings, footer_logo_url: url })}
                                currentImageUrl={settings.footer_logo_url}
                                folder="settings"
                                label="Logo Secundario (Footer)"
                            />
                            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest px-2">
                                Nota: Se recomienda un logo con fondo transparente para el pie de página.
                            </p>
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
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl overflow-hidden p-8 sm:p-12">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white shadow-xl">
                            <Globe size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Redes Sociales</h2>
                            <p className="text-sm text-gray-500 font-medium">Enlaces a tus perfiles oficiales</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1 flex items-center gap-2">
                                <Facebook size={14} className="text-blue-600" />
                                Facebook
                            </label>
                            <input
                                type="url"
                                value={settings.facebook_url}
                                onChange={(e) => setSettings({ ...settings, facebook_url: e.target.value })}
                                className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-black rounded-2xl outline-none transition-all font-bold text-gray-800"
                                placeholder="https://facebook.com/..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1 flex items-center gap-2">
                                <Instagram size={14} className="text-pink-600" />
                                Instagram
                            </label>
                            <input
                                type="url"
                                value={settings.instagram_url}
                                onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
                                className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-black rounded-2xl outline-none transition-all font-bold text-gray-800"
                                placeholder="https://instagram.com/..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1 flex items-center gap-2">
                                <div className="w-3.5 h-3.5 bg-black rounded-sm flex items-center justify-center text-[8px] text-white font-black">T</div>
                                TikTok
                            </label>
                            <input
                                type="url"
                                value={settings.tiktok_url}
                                onChange={(e) => setSettings({ ...settings, tiktok_url: e.target.value })}
                                className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-black rounded-2xl outline-none transition-all font-bold text-gray-800"
                                placeholder="https://tiktok.com/@..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1 flex items-center gap-2">
                                <Youtube size={14} className="text-red-600" />
                                YouTube
                            </label>
                            <input
                                type="url"
                                value={settings.youtube_url}
                                onChange={(e) => setSettings({ ...settings, youtube_url: e.target.value })}
                                className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-black rounded-2xl outline-none transition-all font-bold text-gray-800"
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
