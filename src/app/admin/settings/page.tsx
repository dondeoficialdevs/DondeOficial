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
        <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-1000 pb-32 px-4 md:px-8">
            {/* Cabecera Estilo Centro de Comando */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-b border-gray-100 pb-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 bg-black rounded-[2.5rem] flex items-center justify-center shadow-2xl rotate-2 group-hover:rotate-0 transition-all duration-500 border border-white/10">
                            <Shield size={32} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-5xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">
                                Ajustes<span className="text-orange-600 not-italic">.</span>
                            </h1>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em] ml-1 mt-2">
                                Protocolo de Gestión Global
                            </p>
                        </div>
                    </div>
                </div>

                <div className="hidden sm:flex items-center gap-6 bg-white px-8 py-5 rounded-[2.5rem] border border-gray-100 shadow-[0_15px_35px_rgba(0,0,0,0.05)] transition-all hover:border-orange-500 group">
                    <div className="flex flex-col items-end">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Estado del Sistema</span>
                        <span className="text-xs font-black text-gray-900 uppercase">Sincronizado</span>
                    </div>
                    <div className="w-4 h-4 bg-orange-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(249,115,22,0.5)]"></div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-12 gap-12">
                {/* Columna Izquierda: Identidad y Diseño (Dinamismo Visual) */}
                <div className="xl:col-span-12 lg:col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                    {/* Tarjeta 1: Nombre de Plataforma (Enfoque Minimalista) */}
                    <div className="bg-white rounded-[3rem] p-8 border border-gray-100 shadow-sm flex flex-col justify-between group hover:shadow-xl transition-all h-full">
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-gray-50 rounded-2xl text-gray-400 group-hover:text-orange-500 transition-colors">
                                    <Palette size={20} />
                                </div>
                                <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 italic">Nombre del Sitio<span className="text-orange-500 not-italic">.</span></h3>
                            </div>
                            <div className="space-y-2">
                                <input
                                    type="text"
                                    value={settings.site_name}
                                    onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                                    className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-black rounded-2xl outline-none transition-all font-black text-xl text-gray-900"
                                    placeholder="DondeOficial"
                                />
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Identificador Público del Portal</p>
                            </div>
                        </div>
                    </div>

                    {/* Tarjeta 2: Logo Principal (Visual Amplia) */}
                    <div className="bg-white rounded-[3rem] p-8 border border-gray-100 shadow-sm md:col-span-1 lg:col-span-2 group hover:shadow-xl transition-all">
                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="flex-1 space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-gray-50 rounded-2xl text-gray-400 group-hover:text-orange-500 transition-colors">
                                        <Layout size={20} />
                                    </div>
                                    <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 italic">Identidad Visual Primaria<span className="text-orange-500 not-italic">.</span></h3>
                                </div>
                                <p className="text-xs font-bold text-gray-400 uppercase leading-relaxed tracking-wider max-w-xs">
                                    Carga el logo oficial que se mostrará en la navegación y secciones principales del sistema.
                                </p>
                            </div>
                            <div className="flex-1 min-h-[160px] bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200 p-2 overflow-hidden">
                                <AdminImageUpload
                                    onUploadComplete={(url) => setSettings({ ...settings, logo_url: url })}
                                    currentImageUrl={settings.logo_url}
                                    folder="settings"
                                    label="Subir Logo Principal"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Tarjeta 3: Logo Secundario (Vertical/Compacta) */}
                    <div className="bg-white rounded-[3rem] p-8 border border-gray-100 shadow-sm flex flex-col gap-6 group hover:shadow-xl transition-all">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-gray-50 rounded-2xl text-gray-400 group-hover:text-orange-500 transition-colors">
                                <Shield size={20} />
                            </div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 italic">Logo del Pie de Página<span className="text-orange-500 not-italic">.</span></h3>
                        </div>
                        <div className="flex-1 min-h-[220px] bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200 p-2">
                            <AdminImageUpload
                                onUploadComplete={(url) => setSettings({ ...settings, footer_logo_url: url })}
                                currentImageUrl={settings.footer_logo_url}
                                folder="settings"
                                label="Subir Logo Secundario"
                            />
                        </div>
                        <p className="text-[9px] font-black text-orange-600/60 uppercase tracking-widest text-center px-4 italic">
                            Sugerencia: Usar versiones en negativo o monocromáticas para el pie de página.
                        </p>
                    </div>

                    {/* Tarjeta 4: Motor de Colores (Diseño Innovador) */}
                    <div className="bg-[#0A0A0B] rounded-[3rem] p-8 md:col-span-1 lg:col-span-2 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/5 blur-[80px] -mr-16 -mt-16 rounded-full" />
                        <div className="relative z-10 flex flex-col md:flex-row gap-10">
                            <div className="flex-1 space-y-8">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-black uppercase tracking-[0.2em] text-white italic">Motor Cromático<span className="text-orange-500 not-italic">.</span></h3>
                                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em]">Gestión del Sistema de Diseño Global</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { label: 'Color Primario', key: 'primary_color' },
                                        { label: 'Color Secundario', key: 'secondary_color' },
                                        { label: 'Fondo Cabecera', key: 'header_color' },
                                        { label: 'Fondo Pie de Pág.', key: 'footer_color' },
                                    ].map((item) => (
                                        <div key={item.key} className="space-y-2">
                                            <label className="text-[8px] font-black text-white/20 uppercase tracking-widest ml-1">{item.label}</label>
                                            <div className="flex items-center gap-2 p-2 bg-white/5 rounded-xl border border-white/5 group-hover:border-white/10 transition-all">
                                                <div className="relative w-7 h-7 rounded-lg overflow-hidden flex-shrink-0 border border-white/10 shadow-lg">
                                                    <input
                                                        type="color"
                                                        value={(settings as any)[item.key]}
                                                        onChange={(e) => setSettings({ ...settings, [item.key]: e.target.value })}
                                                        className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer"
                                                    />
                                                </div>
                                                <span className="text-[10px] font-mono text-white/50 uppercase">{(settings as any)[item.key]}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[8px] font-black text-white/20 uppercase tracking-widest ml-1">Eje de Degradado</label>
                                    <div className="flex gap-2 p-1 bg-white/5 rounded-2xl border border-white/5">
                                        <button
                                            type="button"
                                            onClick={() => setSettings({ ...settings, gradient_direction: 'horizontal' })}
                                            className={`flex-1 py-3 px-4 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${settings.gradient_direction === 'horizontal' ? 'bg-orange-600 text-white shadow-[0_10px_20px_rgba(249,115,22,0.3)]' : 'text-white/40 hover:text-white'}`}
                                        >
                                            Horizontal
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setSettings({ ...settings, gradient_direction: 'vertical' })}
                                            className={`flex-1 py-3 px-4 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${settings.gradient_direction === 'vertical' ? 'bg-orange-600 text-white shadow-[0_10px_20px_rgba(249,115,22,0.3)]' : 'text-white/40 hover:text-white'}`}
                                        >
                                            Vertical
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col justify-end gap-6 h-full min-h-[250px] p-8 bg-black/40 rounded-[2.5rem] border border-white/5 backdrop-blur-sm self-center">
                                <div className="flex flex-col gap-4">
                                    <div
                                        className="h-14 rounded-2xl flex items-center justify-center font-black text-[10px] uppercase tracking-[0.3em] text-white shadow-2xl transition-transform hover:scale-105"
                                        style={{ background: getGradientStyle() }}
                                    >
                                        Acción Principal
                                    </div>
                                    <div
                                        className="h-14 rounded-2xl flex items-center justify-center font-black text-[10px] uppercase tracking-[0.3em] border-2 transition-transform hover:scale-105"
                                        style={{ borderColor: settings.primary_color, color: settings.primary_color }}
                                    >
                                        Boton Secundario
                                    </div>
                                </div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20 italic text-center">Motor de Previsualización</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sección de Registro Global y Contacto (Diseño Integrado) */}
                <div className="xl:col-span-12 space-y-12 mt-4">
                    {/* Titulo de Seccion */}
                    <div className="flex items-center gap-4 px-4">
                        <span className="w-12 h-[2px] bg-orange-600/20"></span>
                        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic">Información Institucional & Redes<span className="text-blue-600 not-italic">.</span></h2>
                        <span className="flex-1 h-[1px] bg-gray-100"></span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Bloque Izquierdo: Manifesto y Descripción */}
                        <div className="lg:col-span-2 bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm space-y-8">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] ml-2 block italic">Descripción Institucional / Manifesto del Portal<span className="text-orange-500 not-italic">.</span></label>
                                <textarea
                                    value={settings.footer_description}
                                    onChange={(e) => setSettings({ ...settings, footer_description: e.target.value })}
                                    className="w-full px-8 py-7 bg-gray-50 border-2 border-transparent focus:border-black rounded-[2.5rem] outline-none transition-all font-bold text-gray-700 min-h-[200px] resize-none text-lg leading-relaxed shadow-inner"
                                    placeholder="Describe la misión y visión que aparecerá en el pie de página..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { label: 'E-mail Principal', key: 'footer_email', icon: Mail },
                                    { label: 'Teléfono de Contacto', key: 'footer_phone', icon: Phone },
                                    { label: 'Sede Principal', key: 'footer_address', icon: MapPin },
                                ].map((field) => (
                                    <div key={field.key} className="space-y-3">
                                        <label className="text-[9px] font-black font-bold text-gray-400 uppercase tracking-widest ml-4 flex items-center gap-2">
                                            <field.icon size={12} className="text-orange-500" />
                                            {field.label}
                                        </label>
                                        <input
                                            type="text"
                                            value={(settings as any)[field.key]}
                                            onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                                            className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-black rounded-2xl outline-none transition-all font-bold text-gray-800 text-sm italic"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Bloque Derecho: Redes Sociales (Malla de Seguridad) */}
                        <div className="bg-[#020617] rounded-[3.5rem] p-10 border border-white/5 relative overflow-hidden flex flex-col justify-between">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 blur-[80px] -mr-10 -mt-10 rounded-full" />
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-600/5 blur-[60px] -ml-10 -mb-10 rounded-full" />

                            <div className="space-y-8 relative z-10">
                                <div className="space-y-2">
                                    <h3 className="text-lg font-black uppercase tracking-[0.2em] text-white italic">Protocolo Social<span className="text-blue-500 not-italic">.</span></h3>
                                    <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.3em]">Enlaces a redes verificadas</p>
                                </div>

                                <div className="space-y-5">
                                    {[
                                        { label: 'Perfil de Facebook', key: 'facebook_url', icon: Facebook, color: 'text-blue-500', border: 'border-blue-500/10' },
                                        { label: 'Perfil de Instagram', key: 'instagram_url', icon: Instagram, color: 'text-pink-500', border: 'border-pink-500/10' },
                                        { label: 'Cuenta de TikTok', key: 'tiktok_url', icon: Globe, color: 'text-white', border: 'border-white/5' },
                                        { label: 'Canal de YouTube', key: 'youtube_url', icon: Youtube, color: 'text-red-500', border: 'border-red-500/10' },
                                    ].map((net) => (
                                        <div key={net.key} className="space-y-2">
                                            <div className="flex items-center gap-3 ml-2">
                                                <net.icon size={11} className={net.color} />
                                                <span className="text-[8px] font-black uppercase tracking-widest text-white/40">{net.label}</span>
                                            </div>
                                            <input
                                                type="url"
                                                value={(settings as any)[net.key]}
                                                onChange={(e) => setSettings({ ...settings, [net.key]: e.target.value })}
                                                className={`w-full px-6 py-4 bg-white/[0.03] border ${net.border} focus:border-white/40 rounded-2xl outline-none transition-all font-bold text-white text-[12px] placeholder:text-white/5 italic`}
                                                placeholder="https://plataforma.com/oficial"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-12 flex items-center gap-3 px-2 relative z-10">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                                <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Cifrado de Extremo a Extremo</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Accion Flotante de Guardado (Refinada y Centrada) */}
                <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] w-full max-w-lg px-6">
                    <div className="p-3 bg-white/50 backdrop-blur-3xl rounded-[3.5rem] border border-white/20 shadow-[0_30px_60px_rgba(0,0,0,0.1)] group">
                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full h-20 bg-black text-white rounded-[3rem] font-black text-[13px] uppercase tracking-[0.5em] shadow-2xl hover:bg-orange-600 hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 disabled:opacity-50 relative overflow-hidden group/btn"
                        >
                            <div className="relative z-10 flex items-center justify-center gap-6">
                                {saving ? (
                                    <>
                                        <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin" />
                                        <span>Sincronizando...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save size={24} className="group-hover/btn:rotate-12 transition-transform duration-500" />
                                        <span>Actualizar Protocolo Global</span>
                                    </>
                                )}
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-600 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
