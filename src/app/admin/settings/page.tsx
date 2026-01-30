'use client';

import { useState, useEffect } from 'react';
import { settingsApi } from '@/lib/api';
import { SiteSettings } from '@/types';
import Image from 'next/image';

export default function SettingsPage() {
    const [settings, setSettings] = useState<SiteSettings>({
        id: 0,
        logo_url: '/images/logo/Logo_Dondel.png',
        site_name: 'DondeOficial',
        primary_color: '#f97316',
        secondary_color: '#ea580c',
        header_color: '#ffffff',
        footer_color: '#111827',
        bg_color: '#f9fafb',
        gradient_direction: 'horizontal'
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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
                    gradient_direction: (data.gradient_direction as any) || 'horizontal'
                });
                setPreviewUrl(data.logo_url);
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            let logo_url = settings.logo_url;

            if (logoFile) {
                logo_url = await settingsApi.uploadLogo(logoFile);
            }

            const updatedSettings = await settingsApi.updateSettings({
                ...settings,
                logo_url
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
            </form>
        </div>
    );
}
