'use client';

import { useState, useEffect } from 'react';
import { settingsApi } from '@/lib/api';
import { SiteSettings } from '@/types';
import Image from 'next/image';

export default function SettingsPage() {
    const [settings, setSettings] = useState<SiteSettings>({
        id: 0,
        logo_url: '/images/logo/Logo_Dondel.png',
        site_name: 'DondeOficial'
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
                setSettings(data);
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
            alert('Configuración guardada correctamente');
            window.location.reload(); // Reload to refresh logo in layout/header
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
    );

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Configuración del Sitio</h1>
                <p className="text-gray-500 font-medium">Personaliza la identidad visual de tu plataforma</p>
            </div>

            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-2xl overflow-hidden">
                <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-10">
                    {/* Logo Section */}
                    <div className="space-y-6">
                        <label className="text-sm font-black text-gray-700 uppercase tracking-wider block">Logo Principal</label>

                        <div className="flex flex-col md:flex-row items-center gap-10">
                            {/* Logo Preview Container */}
                            <div className="relative w-48 h-48 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden group">
                                {previewUrl ? (
                                    <Image
                                        src={previewUrl}
                                        alt="Logo Preview"
                                        fill
                                        className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="text-gray-400 text-center p-4">
                                        <svg className="w-12 h-12 mx-auto mb-2 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span className="text-xs font-bold uppercase tracking-tighter">Sin imagen</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 space-y-4">
                                <p className="text-sm text-gray-500 leading-relaxed font-medium">
                                    Recomendamos usar una imagen transparente en formato <span className="font-bold text-gray-900">PNG</span> o <span className="font-bold text-gray-900">SVG</span>.
                                    El tamaño ideal es de <span className="font-bold text-gray-900">512x512 píxeles</span>.
                                </p>

                                <label className="inline-flex items-center px-6 py-3 bg-blue-50 text-blue-600 rounded-xl font-black text-sm uppercase tracking-widest cursor-pointer hover:bg-blue-600 hover:text-white transition-all transform active:scale-95 shadow-sm">
                                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                    </svg>
                                    Subir Nuevo Logo
                                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-gray-100"></div>

                    {/* Site Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-sm font-black text-gray-700 uppercase tracking-wider block">Nombre del Sitio</label>
                            <input
                                type="text"
                                value={settings.site_name}
                                onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-blue-500 rounded-2xl outline-none transition-all font-bold text-gray-800"
                                placeholder="DondeOficial"
                            />
                        </div>
                    </div>

                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full py-5 bg-linear-to-r from-blue-600 to-indigo-700 text-white rounded-[2rem] font-black text-xl hover:shadow-2xl hover:shadow-blue-600/40 transition-all active:scale-[0.97] disabled:opacity-50 uppercase tracking-tight"
                        >
                            {saving ? 'Guardando cambios...' : 'Guardar Configuración'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
