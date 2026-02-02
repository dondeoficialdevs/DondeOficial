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
        <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700 pb-20 px-4">
            {/* Mega Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gray-100 pb-10">
                <div className="space-y-3">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center shadow-2xl rotate-3 group hover:rotate-0 transition-transform duration-500">
                            <Shield size={28} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">
                                Ajustes<span className="text-blue-600 not-italic">.</span>
                            </h1>
                            <p className="text-xs font-black text-gray-400 uppercase tracking-[0.4em] ml-1">
                                Command Control Center
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white px-8 py-5 rounded-[2.5rem] border border-gray-100 shadow-xl flex items-center gap-5 group hover:border-black transition-all">
                    <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse shadow-[0_0_10px_rgba(37,99,235,0.4)]"></div>
                    <span className="text-xs font-black uppercase tracking-widest text-gray-900">
                        System Synchronized
                    </span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-12">
                {/* Core Identity Section */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                    <div className="xl:col-span-1 space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white">
                                <Palette size={20} />
                            </div>
                            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight italic">Identidad<span className="text-blue-600 not-italic">.</span></h2>
                        </div>
                        <p className="text-sm font-bold text-gray-400 leading-relaxed uppercase tracking-wider">
                            Define el ADN visual de la plataforma. Logos, nombres y la primera impresión de tus usuarios.
                        </p>
                    </div>

                    <div className="xl:col-span-2 space-y-8">
                        <div className="bg-white rounded-[3rem] p-8 md:p-12 border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)] relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-[5rem] -mr-10 -mt-10 group-hover:bg-blue-50/50 transition-colors" />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative">
                                <div className="space-y-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2">Platform Name</label>
                                        <input
                                            type="text"
                                            value={settings.site_name}
                                            onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                                            className="w-full px-6 py-5 bg-gray-50/50 border-2 border-transparent focus:border-black rounded-2xl outline-none transition-all font-black text-lg text-gray-900"
                                            placeholder="DondeOficial"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2">Main Logo (Header)</label>
                                        <div className="p-1 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
                                            <AdminImageUpload
                                                onUploadComplete={(url) => setSettings({ ...settings, logo_url: url })}
                                                currentImageUrl={settings.logo_url}
                                                folder="settings"
                                                label="Primary"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2">Footer Logo (Secondary)</label>
                                    <div className="p-1 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200 h-full min-h-[200px]">
                                        <AdminImageUpload
                                            onUploadComplete={(url) => setSettings({ ...settings, footer_logo_url: url })}
                                            currentImageUrl={settings.footer_logo_url}
                                            folder="settings"
                                            label="Secondary"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Design System Section */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                    <div className="xl:col-span-1 space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white">
                                <Layout size={20} />
                            </div>
                            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight italic">Diseño<span className="text-blue-600 not-italic">.</span></h2>
                        </div>
                        <p className="text-sm font-bold text-gray-400 leading-relaxed uppercase tracking-wider">
                            Controla la atmósfera cromática y los degradados que dan vida a la interfaz.
                        </p>
                    </div>

                    <div className="xl:col-span-2">
                        <div className="bg-white rounded-[3rem] p-8 md:p-12 border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {[
                                    { label: 'Primary Theme', key: 'primary_color' },
                                    { label: 'Secondary Theme', key: 'secondary_color' },
                                    { label: 'Header BG', key: 'header_color' },
                                    { label: 'Footer BG', key: 'footer_color' },
                                    { label: 'Body Global', key: 'bg_color' },
                                ].map((item) => (
                                    <div key={item.key} className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2 block">{item.label}</label>
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100 hover:border-black transition-all group">
                                            <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-inner flex-shrink-0">
                                                <input
                                                    type="color"
                                                    value={(settings as any)[item.key]}
                                                    onChange={(e) => setSettings({ ...settings, [item.key]: e.target.value })}
                                                    className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer"
                                                />
                                            </div>
                                            <input
                                                type="text"
                                                value={(settings as any)[item.key]}
                                                onChange={(e) => setSettings({ ...settings, [item.key]: e.target.value })}
                                                className="bg-transparent font-mono font-black text-sm outline-none uppercase w-full"
                                                maxLength={7}
                                            />
                                        </div>
                                    </div>
                                ))}

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2 block">Gradient Engine</label>
                                    <div className="flex p-1 bg-gray-50 rounded-2xl border border-gray-100">
                                        <button
                                            type="button"
                                            onClick={() => setSettings({ ...settings, gradient_direction: 'horizontal' })}
                                            className={`flex-1 py-3 px-4 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${settings.gradient_direction === 'horizontal' ? 'bg-black text-white shadow-xl' : 'text-gray-400 hover:text-black'}`}
                                        >
                                            Horizontal
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setSettings({ ...settings, gradient_direction: 'vertical' })}
                                            className={`flex-1 py-3 px-4 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${settings.gradient_direction === 'vertical' ? 'bg-black text-white shadow-xl' : 'text-gray-400 hover:text-black'}`}
                                        >
                                            Vertical
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Advanced Preview Area */}
                            <div className="mt-12 p-10 rounded-[2.5rem] bg-[#0A0A0B] relative overflow-hidden group">
                                <div
                                    className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity blur-3xl"
                                    style={{ background: getGradientStyle() }}
                                />

                                <div className="relative z-10 flex flex-col items-center gap-8">
                                    <div className="flex flex-col sm:flex-row gap-6 w-full max-w-lg">
                                        <div
                                            className="flex-1 px-8 py-5 rounded-2xl flex items-center justify-center font-black text-xs uppercase tracking-[0.3em] text-white shadow-2xl transition-transform hover:scale-105"
                                            style={{ background: getGradientStyle() }}
                                        >
                                            Primary UI
                                        </div>
                                        <div
                                            className="flex-1 px-8 py-5 rounded-2xl flex items-center justify-center font-black text-xs uppercase tracking-[0.3em] border-2 transition-transform hover:scale-105"
                                            style={{ borderColor: settings.primary_color, color: settings.primary_color }}
                                        >
                                            Secondary UI
                                        </div>
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 italic">Real-time Visualization Engine</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Global Registry Section */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                    <div className="xl:col-span-1 space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white">
                                <Globe size={20} />
                            </div>
                            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight italic">Global<span className="text-blue-600 not-italic">.</span></h2>
                        </div>
                        <p className="text-sm font-bold text-gray-400 leading-relaxed uppercase tracking-wider">
                            Información de contacto, redes sociales y metadatos del sistema.
                        </p>
                    </div>

                    <div className="xl:col-span-2 space-y-8">
                        {/* Contact Grid */}
                        <div className="bg-white rounded-[3rem] p-8 md:p-12 border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {[
                                    { label: 'Central Email', key: 'footer_email', icon: Mail, type: 'email' },
                                    { label: 'Support Phone', key: 'footer_phone', icon: Phone, type: 'text' },
                                    { label: 'Admin HQ', key: 'footer_address', icon: MapPin, type: 'text' },
                                ].map((field) => (
                                    <div key={field.key} className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2 flex items-center gap-2">
                                            <field.icon size={12} className="text-blue-500" />
                                            {field.label}
                                        </label>
                                        <input
                                            type={field.type}
                                            value={(settings as any)[field.key]}
                                            onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                                            className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-black rounded-2xl outline-none transition-all font-bold text-gray-700"
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="mt-10 space-y-3">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2 block">Global Description / Manifesto</label>
                                <textarea
                                    value={settings.footer_description}
                                    onChange={(e) => setSettings({ ...settings, footer_description: e.target.value })}
                                    className="w-full px-6 py-5 bg-gray-50 border-2 border-transparent focus:border-black rounded-3xl outline-none transition-all font-bold text-gray-700 min-h-[150px] resize-none"
                                />
                            </div>
                        </div>

                        {/* Social Matrix */}
                        <div className="bg-[#020617] rounded-[3rem] p-8 md:p-12 border border-white/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[80px] -mr-20 -mt-20 rounded-full" />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                                {[
                                    { label: 'Facebook URL', key: 'facebook_url', icon: Facebook, color: 'text-blue-500' },
                                    { label: 'Instagram URL', key: 'instagram_url', icon: Instagram, color: 'text-pink-500' },
                                    { label: 'TikTok URL', key: 'tiktok_url', icon: Globe, color: 'text-white' },
                                    { label: 'YouTube URL', key: 'youtube_url', icon: Youtube, color: 'text-red-500' },
                                ].map((net) => (
                                    <div key={net.key} className="space-y-3">
                                        <label className={`text-[9px] font-black uppercase tracking-widest ml-2 flex items-center gap-2 ${net.color}`}>
                                            <net.icon size={12} />
                                            {net.label}
                                        </label>
                                        <input
                                            type="url"
                                            value={(settings as any)[net.key]}
                                            onChange={(e) => setSettings({ ...settings, [net.key]: e.target.value })}
                                            className="w-full px-6 py-4 bg-white/5 border border-white/10 focus:border-white/30 rounded-2xl outline-none transition-all font-bold text-white text-sm"
                                            placeholder="https://..."
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Global Save Action */}
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full py-6 bg-black text-white rounded-[2.5rem] font-black text-lg uppercase tracking-[0.2em] shadow-[0_30px_60px_rgba(0,0,0,0.3)] hover:bg-blue-600 hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 border-t-4 border-white/10 group overflow-hidden"
                    >
                        <div className="relative z-10 flex items-center justify-center gap-4">
                            {saving ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    <span>Transmitting...</span>
                                </>
                            ) : (
                                <>
                                    <Save size={20} className="group-hover:rotate-12 transition-transform" />
                                    <span>Update Global Protocol</span>
                                </>
                            )}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                </div>
            </form>
        </div>
    );
}
