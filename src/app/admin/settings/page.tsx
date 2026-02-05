'use client';

import { useState, useEffect } from 'react';
import { settingsApi } from '@/lib/api';
import { SiteSettings } from '@/types';
import AdminImageUpload from '@/components/admin/AdminImageUpload';
import { Palette, Globe, Mail, Phone, MapPin, Facebook, Instagram, Youtube, Layout, Shield, Type, Share2, Info, ChevronRight } from 'lucide-react';

type TabType = 'identity' | 'design' | 'contact' | 'social';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<TabType>('identity');
    const [settings, setSettings] = useState<SiteSettings>({
        id: 0,
        logo_url: '/images/logo/Logo_Donde1.png',
        footer_logo_url: '/images/logo/Logo_Donde1.png',
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
        youtube_url: '',
        use_favorite_favicon: false
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

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
                    youtube_url: data.youtube_url || '',
                    use_favorite_favicon: !!data.use_favorite_favicon
                });
            }
        } catch (err) {
            console.error('Error loading settings:', err);
        } finally {
            setLoading(false);
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
            alert(`Error al guardar: ${err.message || 'Error desconocido'}`);
        } finally {
            setSaving(false);
        }
    };

    const getGradientStyle = () => {
        const direction = settings.gradient_direction === 'vertical' ? 'to bottom' : 'to right';
        return `linear-gradient(${direction}, ${settings.primary_color}, ${settings.secondary_color})`;
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    const tabs: { id: TabType; label: string; icon: any }[] = [
        { id: 'identity', label: 'Identidad', icon: Type },
        { id: 'design', label: 'Diseño', icon: Palette },
        { id: 'contact', label: 'Contacto', icon: Info },
        { id: 'social', label: 'Redes', icon: Share2 },
    ];

    return (
        <div className="max-w-5xl mx-auto pb-44 px-2 sm:px-4">
            {/* Header Rediseñado - Más compacto y limpio */}
            <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6 px-2">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white shadow-xl rotate-3 shrink-0">
                            <Shield size={20} />
                        </div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase italic leading-none">
                            Ajustes <span className="text-orange-600 not-italic">Globales</span>
                        </h1>
                    </div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-1">
                        Protocolo de Identidad y Sistema
                    </p>
                </div>

                <div className="flex items-center gap-2 bg-white px-5 py-3 rounded-2xl border border-gray-100 shadow-sm transition-all hover:border-orange-500 group self-start sm:self-auto">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.4)]"></div>
                    <span className="text-[10px] font-black text-gray-800 uppercase tracking-widest">Sistema Listo</span>
                </div>
            </div>

            {/* Navigation Tabs - Estilo Píldora más robusto */}
            <div className="flex flex-nowrap overflow-x-auto pb-2 sm:pb-0 gap-2 mb-8 bg-gray-100/50 p-1.5 rounded-3xl border border-gray-100 custom-scrollbar-hide h-auto items-center">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all whitespace-nowrap flex-1 lg:flex-none ${activeTab === tab.id
                            ? 'bg-white text-orange-600 shadow-md border border-orange-100 scale-105 z-10'
                            : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
                            }`}
                    >
                        <tab.icon size={16} />
                        <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">

                {/* IDENTITY TAB */}
                {activeTab === 'identity' && (
                    <div className="grid grid-cols-1 2xl:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-gray-100 shadow-sm transition-all hover:shadow-md">
                                <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 italic">
                                    <Type size={14} className="text-orange-500" />
                                    Nombre del Portal
                                </label>
                                <div className="relative group">
                                    <input
                                        type="text"
                                        value={settings.site_name}
                                        onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                                        className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-2xl outline-none transition-all font-bold text-lg text-gray-900"
                                        placeholder="DondeOficial"
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-500 opacity-0 group-focus-within:opacity-100 transition-opacity">
                                        <ChevronRight size={20} />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-gray-100 shadow-sm transition-all hover:shadow-md overflow-hidden">
                                <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 italic">
                                    <Globe size={14} className="text-red-500" />
                                    Identidad en Pestaña
                                </label>
                                <div
                                    className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all cursor-pointer ${settings.use_favorite_favicon ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-transparent hover:border-gray-200'
                                        }`}
                                    onClick={() => setSettings(prev => ({ ...prev, use_favorite_favicon: !prev.use_favorite_favicon }))}
                                >
                                    <div className="space-y-0.5">
                                        <p className="text-xs font-black text-gray-900 uppercase italic">Favicon con Corazón</p>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Modo "Sitio Favorito"</p>
                                    </div>
                                    <div className={`w-12 h-6 rounded-full p-1 transition-all duration-300 ${settings.use_favorite_favicon ? 'bg-red-500 shadow-lg shadow-red-200' : 'bg-gray-300'}`}>
                                        <div className={`w-4 h-4 bg-white rounded-full transition-all duration-300 transform ${settings.use_favorite_favicon ? 'translate-x-6' : 'translate-x-0'}`} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col">
                            <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-5 italic">
                                <Layout size={14} className="text-orange-500" />
                                Logo Principal
                            </label>
                            <div className="flex-1 min-h-[200px] bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 p-2 transform transition-all hover:bg-white hover:border-orange-500/30 flex items-center justify-center overflow-hidden">
                                <AdminImageUpload
                                    onUploadComplete={(url) => setSettings({ ...settings, logo_url: url })}
                                    currentImageUrl={settings.logo_url}
                                    folder="settings"
                                    label="Subir Logo"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* DESIGN TAB */}
                {activeTab === 'design' && (
                    <div className="bg-white rounded-[2.5rem] p-6 sm:p-10 border border-gray-100 shadow-sm relative overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                            <div className="lg:col-span-5 space-y-5">
                                <div className="mb-4">
                                    <h3 className="text-lg font-black text-gray-900 uppercase italic leading-none flex items-center gap-2">
                                        <Palette size={18} className="text-orange-500" />
                                        Paleta Premium
                                    </h3>
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-2 ml-7">Identidad Cromática</p>
                                </div>
                                {[
                                    { label: 'Color Primario', key: 'primary_color' },
                                    { label: 'Color Secundario', key: 'secondary_color' },
                                    { label: 'Fondo Footer', key: 'footer_color' },
                                ].map((item) => (
                                    <div key={item.key} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 group transition-all hover:border-orange-200">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{item.label}</span>
                                            <span className="text-[10px] font-mono font-bold text-gray-300 uppercase">{(settings as any)[item.key]}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-white shadow-sm ring-2 ring-gray-100 shrink-0">
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
                                                className="bg-transparent border-none outline-none font-black text-gray-700 uppercase text-xs w-full"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="lg:col-span-7 flex flex-col">
                                <div className="p-6 sm:p-8 bg-[#0a0a0b] rounded-[2rem] space-y-6 shadow-2xl relative overflow-hidden group flex-1">
                                    <div className="absolute top-0 right-0 w-40 h-40 bg-orange-600/10 blur-[60px] rounded-full"></div>
                                    <h4 className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] text-center mb-4">Simulador Visual</h4>

                                    <div className="space-y-3">
                                        <div
                                            className="h-14 rounded-xl flex items-center justify-center font-black text-[10px] uppercase tracking-[0.4em] text-white shadow-lg transform transition-transform hover:scale-[1.02]"
                                            style={{ background: getGradientStyle() }}
                                        >
                                            Botón Pro
                                        </div>
                                        <div
                                            className="h-14 rounded-xl flex items-center justify-center font-black text-[10px] uppercase tracking-[0.4em] border-2 transition-all hover:bg-white/5"
                                            style={{ borderColor: settings.primary_color, color: settings.primary_color }}
                                        >
                                            Esquema B
                                        </div>
                                    </div>

                                    <div className="mt-8 space-y-4">
                                        <div className="flex gap-2 p-1.5 bg-white/5 rounded-xl border border-white/10">
                                            <button
                                                type="button"
                                                onClick={() => setSettings({ ...settings, gradient_direction: 'horizontal' })}
                                                className={`flex-1 py-3 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${settings.gradient_direction === 'horizontal' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
                                            >
                                                Horizontal
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setSettings({ ...settings, gradient_direction: 'vertical' })}
                                                className={`flex-1 py-3 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${settings.gradient_direction === 'vertical' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
                                            >
                                                Vertical
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* CONTACT TAB */}
                {activeTab === 'contact' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-gray-100 shadow-sm space-y-8">
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">
                                    <Info size={14} className="text-orange-500" />
                                    Manifiesto Institucional
                                </label>
                                <textarea
                                    value={settings.footer_description}
                                    onChange={(e) => setSettings({ ...settings, footer_description: e.target.value })}
                                    className="w-full px-6 py-5 bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-3xl outline-none transition-all font-bold text-gray-700 min-h-[140px] resize-none text-base leading-relaxed shadow-inner"
                                    placeholder="Describe la misión del portal..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {[
                                    { label: 'E-mail', key: 'footer_email', icon: Mail, type: 'email' },
                                    { label: 'Teléfono', key: 'footer_phone', icon: Phone, type: 'tel' },
                                    { label: 'Ubicación', key: 'footer_address', icon: MapPin, type: 'text' },
                                ].map((field) => (
                                    <div key={field.key} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-orange-200 transition-all">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                                            <field.icon size={12} className="text-orange-500" />
                                            {field.label}
                                        </label>
                                        <input
                                            type={field.type}
                                            value={(settings as any)[field.key]}
                                            onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                                            className="w-full bg-transparent border-none outline-none font-black text-gray-800 text-xs italic"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-gray-100 shadow-sm">
                            <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-5 italic">
                                <Shield size={14} className="text-orange-500" />
                                Logo del Pie de Página
                            </label>
                            <div className="max-w-md bg-gray-50 rounded-2xl p-2 border-2 border-dashed border-gray-100">
                                <AdminImageUpload
                                    onUploadComplete={(url) => setSettings({ ...settings, footer_logo_url: url })}
                                    currentImageUrl={settings.footer_logo_url}
                                    folder="settings"
                                    label="Cambiar Logo Footer"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* SOCIAL TAB */}
                {activeTab === 'social' && (
                    <div className="bg-[#020617] rounded-[2.5rem] p-8 sm:p-12 border border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-60 h-60 bg-blue-600/10 blur-[80px] rounded-full pointer-events-none" />

                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
                            <div className="space-y-3">
                                <h3 className="text-2xl font-black text-white uppercase italic flex items-center gap-3 leading-none">
                                    <Share2 size={24} className="text-blue-500" />
                                    Presencia <span className="text-blue-500">Social</span>
                                </h3>
                                <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] ml-1">Enlaces verificados</p>
                            </div>

                            <div className="grid grid-cols-1 gap-5">
                                {[
                                    { label: 'Facebook', key: 'facebook_url', icon: Facebook, color: 'text-blue-500', border: 'border-blue-500/10' },
                                    { label: 'Instagram', key: 'instagram_url', icon: Instagram, color: 'text-pink-500', border: 'border-pink-500/10' },
                                    { label: 'TikTok', key: 'tiktok_url', icon: Globe, color: 'text-white', border: 'border-white/5' },
                                    { label: 'YouTube', key: 'youtube_url', icon: Youtube, color: 'text-red-500', border: 'border-red-500/10' },
                                ].map((net) => (
                                    <div key={net.key} className="space-y-1.5 p-4 bg-white/[0.03] rounded-2xl border border-white/[0.05] group transition-all hover:border-white/20">
                                        <div className="flex items-center gap-2 mb-1 ml-1">
                                            <net.icon size={12} className={net.color} />
                                            <span className="text-[8px] font-black uppercase tracking-widest text-white/40">{net.label}</span>
                                        </div>
                                        <input
                                            type="url"
                                            value={(settings as any)[net.key]}
                                            onChange={(e) => setSettings({ ...settings, [net.key]: e.target.value })}
                                            className="w-full bg-transparent border-none outline-none font-bold text-white text-xs placeholder:text-white/5 italic focus:ring-0"
                                            placeholder="https://su-enlace.com"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Botón de Guardado Estático al Final */}
                <div className="pt-12 border-t border-gray-100 mt-12">
                    <div className="max-w-md mx-auto">
                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full h-16 bg-black text-white rounded-3xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:bg-orange-600 hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 disabled:opacity-50 relative overflow-hidden group"
                        >
                            <div className="relative z-10 flex items-center justify-center">
                                <span>{saving ? 'Guardando...' : 'Guardar cambios'}</span>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
