'use client';

import { useState, useEffect } from 'react';
import { actionCardApi } from '@/lib/api';
import { ActionCard } from '@/types';
import { Save, AlertCircle, CheckCircle2, Info, ArrowLeft, Image as ImageIcon, Search as SearchIcon, MessageSquare, ExternalLink } from 'lucide-react';
import AdminImageUpload from '@/components/admin/AdminImageUpload';
import Image from 'next/image';
import Link from 'next/link';

export default function ActionCardsAdmin() {
    const [cards, setCards] = useState<ActionCard[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [selectedType, setSelectedType] = useState<'whatsapp' | 'directory'>('whatsapp');
    const [formData, setFormData] = useState<Partial<ActionCard>>({});

    // Image metrics state
    const [imageMetrics, setImageMetrics] = useState<{
        width: number;
        height: number;
        ratio: string;
        quality: 'excellent' | 'ok' | 'low';
    } | null>(null);

    useEffect(() => {
        loadCards();
    }, []);

    useEffect(() => {
        if (cards.length > 0) {
            const card = cards.find(c => c.type === selectedType);
            if (card) {
                setFormData(card);
                analyzeImage(card.image_url);
            }
        }
    }, [selectedType, cards]);

    const loadCards = async () => {
        setLoading(true);
        const data = await actionCardApi.getAll();
        setCards(data);
        setLoading(false);
    };

    const analyzeImage = (url: string) => {
        if (!url) {
            setImageMetrics(null);
            return;
        }

        const img = new window.Image();
        img.onload = () => {
            const width = img.width;
            const height = img.height;
            const ratio = (width / height).toFixed(2);

            let quality: 'excellent' | 'ok' | 'low' = 'low';
            if (width >= 1200 && height >= 600) quality = 'excellent';
            else if (width >= 800) quality = 'ok';

            setImageMetrics({ width, height, ratio, quality });
        };
        img.src = url;
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await actionCardApi.update(selectedType, formData);
            await loadCards();
            alert('¡Configuración guardada correctamente!');
        } catch (err) {
            console.error('Error saving:', err);
            alert('Error al guardar los cambios');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
        </div>
    );

    return (
        <div className="p-4 sm:p-8 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">Tarjetas de Acción</h1>
                    <p className="text-gray-500 font-medium text-lg italic">Personaliza los accesos directos de la portada</p>
                </div>
                <Link
                    href="/admin"
                    className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full font-bold transition-all shadow-sm"
                >
                    <ArrowLeft size={18} />
                    Panel Principal
                </Link>
            </div>

            {/* Selector de Tarjeta */}
            <div className="flex p-1 bg-gray-100 rounded-[2rem] mb-10 w-fit">
                <button
                    onClick={() => setSelectedType('whatsapp')}
                    className={`px-8 py-4 rounded-[1.8rem] font-black tracking-wide transition-all flex items-center gap-3 ${selectedType === 'whatsapp' ? 'bg-white text-green-600 shadow-xl scale-105' : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <MessageSquare size={20} />
                    WhatsApp
                </button>
                <button
                    onClick={() => setSelectedType('directory')}
                    className={`px-8 py-4 rounded-[1.8rem] font-black tracking-wide transition-all flex items-center gap-3 ${selectedType === 'directory' ? 'bg-white text-orange-600 shadow-xl scale-105' : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <SearchIcon size={20} />
                    Directorio
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Formulario */}
                <div className="space-y-8 animate-in fade-in slide-in-from-left duration-500">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-gray-100">
                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="space-y-2 text-left">
                                <label className="text-sm font-black text-gray-400 uppercase tracking-widest px-2">Título de la Tarjeta</label>
                                <input
                                    type="text"
                                    value={formData.title || ''}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-orange-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-800"
                                    placeholder="Ej: Escríbenos por WhatsApp"
                                    required
                                />
                            </div>

                            <div className="space-y-2 text-left">
                                <label className="text-sm font-black text-gray-400 uppercase tracking-widest px-2">Descripción</label>
                                <textarea
                                    value={formData.description || ''}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-orange-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-800 min-h-[100px]"
                                    placeholder="Brief description..."
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2 text-left">
                                    <label className="text-sm font-black text-gray-400 uppercase tracking-widest px-2">Etiqueta (Badge)</label>
                                    <input
                                        type="text"
                                        value={formData.badge_text || ''}
                                        onChange={(e) => setFormData({ ...formData, badge_text: e.target.value })}
                                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-orange-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-800"
                                        placeholder="Ej: Contacto Directo"
                                    />
                                </div>
                                <div className="space-y-2 text-left">
                                    <label className="text-sm font-black text-gray-400 uppercase tracking-widest px-2">Enlace / URL</label>
                                    <input
                                        type="text"
                                        value={formData.button_link || ''}
                                        onChange={(e) => setFormData({ ...formData, button_link: e.target.value })}
                                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-orange-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-800"
                                        placeholder="URL o número WA"
                                        required
                                    />
                                </div>
                            </div>

                            <AdminImageUpload
                                onUploadComplete={(url) => setFormData({ ...formData, image_url: url })}
                                currentImageUrl={formData.image_url}
                                folder="action-cards"
                                label="Imagen de Fondo"
                            />

                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full py-5 bg-black text-white rounded-2xl font-black uppercase tracking-widest shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 mt-4"
                            >
                                {saving ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                ) : (
                                    <>
                                        <Save size={20} />
                                        Guardar Cambios
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Image Suitability Poster */}
                    {formData.image_url && (
                        <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${imageMetrics?.quality === 'excellent' ? 'bg-green-100 text-green-600' :
                                    imageMetrics?.quality === 'ok' ? 'bg-orange-100 text-orange-600' : 'bg-red-100 text-red-600'
                                    }`}>
                                    {imageMetrics?.quality === 'excellent' ? <CheckCircle2 size={24} /> :
                                        imageMetrics?.quality === 'ok' ? <Info size={24} /> : <AlertCircle size={24} />}
                                </div>
                                <div>
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Medidor de Calidad Visual</p>
                                    <p className="font-bold text-gray-800">
                                        {imageMetrics?.quality === 'excellent' ? 'Excelente Resolución' :
                                            imageMetrics?.quality === 'ok' ? 'Resolución Aceptable' : 'Calidad Baja'}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Dimensiones</p>
                                <p className="font-bold text-gray-800">{imageMetrics ? `${imageMetrics.width}x${imageMetrics.height}` : '---'}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Preview */}
                <div className="lg:sticky lg:top-8 animate-in fade-in slide-in-from-right duration-500">
                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest px-2 mb-6 text-left">Vista Previa en Tiempo Real</h3>

                    <div className="relative group rounded-2xl overflow-hidden shadow-2xl min-h-[220px] bg-gray-200">
                        {/* Background Image */}
                        {formData.image_url ? (
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                style={{ backgroundImage: `url(${formData.image_url})` }}
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                <ImageIcon size={48} strokeWidth={1} />
                            </div>
                        )}

                        {/* Overlays matching ActionCards.tsx */}
                        <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/60 to-black/40 group-hover:from-black/60 group-hover:via-black/50 group-hover:to-black/30 transition-all duration-500"></div>
                        <div className={`absolute inset-0 bg-linear-to-r ${selectedType === 'whatsapp' ? 'from-green-600/30' : 'from-orange-600/30 via-red-600/20'
                            } via-transparent to-transparent`}></div>

                        {/* Content */}
                        <div className="relative z-10 h-full flex flex-col justify-between p-8 text-left">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-center gap-6 flex-1">
                                    {/* Icon Box */}
                                    <div className={`shrink-0 w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-2xl ${selectedType === 'whatsapp' ? 'border-2 border-green-400/30' : 'bg-white/20 backdrop-blur-md border border-white/30'
                                        }`}>
                                        {selectedType === 'whatsapp' ? (
                                            <svg className="w-12 h-12" fill="#25D366" viewBox="0 0 24 24">
                                                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.49 1.32 5.01L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm.01 18.05c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31c-.82-1.31-1.26-2.83-1.26-4.38 0-4.54 3.7-8.24 8.24-8.24s8.24 3.7 8.24 8.24-3.69 8.24-8.23 8.24z" />
                                            </svg>
                                        ) : (
                                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                            </svg>
                                        )}
                                    </div>

                                    <div>
                                        <div className="inline-flex items-center gap-2 mb-2">
                                            <span className={`w-2 h-2 rounded-full animate-pulse ${selectedType === 'whatsapp' ? 'bg-green-400' : 'bg-orange-400'}`}></span>
                                            <span className="text-xs font-black text-white/90 uppercase tracking-widest">
                                                {formData.badge_text || 'Highlight'}
                                            </span>
                                        </div>
                                        <h3 className="text-2xl font-black text-white leading-tight">
                                            {formData.title || 'Título de la Tarjeta'}
                                        </h3>
                                        <p className="text-sm text-white/80 mt-2 line-clamp-2">
                                            {formData.description || 'Escribe una descripción corta para atraer clics...'}
                                        </p>
                                    </div>
                                </div>

                                <div className="shrink-0 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 bg-orange-50 p-6 rounded-[2rem] border border-orange-100 text-left">
                        <h4 className="flex items-center gap-2 text-orange-800 font-black uppercase tracking-widest text-xs mb-3">
                            <Info size={16} />
                            Recomendaciones de Imagen
                        </h4>
                        <ul className="text-sm text-orange-900/70 space-y-2 font-medium">
                            <li>• Tamaño ideal: **1200 x 600 px** (Relación 2:1).</li>
                            <li>• Intenta que el fondo sea oscuro o tenga texturas suaves.</li>
                            <li>• Las imágenes AVIF o JPG comprimidas cargan más rápido.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
