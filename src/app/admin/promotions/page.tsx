'use client';

import { useState, useEffect } from 'react';
import { promotionApi } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import { Promotion, Business } from '@/types';
import Image from 'next/image';

export default function VitrinaAdminPage() {
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [imageMetrics, setImageMetrics] = useState<{
        width: number;
        height: number;
        status: 'excellent' | 'ok' | 'low' | 'idle';
        aspectRatio: number;
    }>({ width: 0, height: 0, status: 'idle', aspectRatio: 0 });

    const initialFormState = {
        title: '',
        description: '',
        image_url: '',
        button_text: 'Ver Negocio',
        button_link: '',
        badge_text: '',
        is_discount: false,
        business_id: undefined as number | null | undefined,
        active: true,
        priority: 0,
        is_popup: false
    };

    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        loadPromotions();
    }, []);

    useEffect(() => {
        if (!formData.image_url) {
            setImageMetrics({ width: 0, height: 0, status: 'idle', aspectRatio: 0 });
            return;
        }

        const img = new (window as any).Image();
        img.onload = () => {
            const w = img.width;
            const h = img.height;
            const ratio = w / h;

            let status: 'excellent' | 'ok' | 'low' = 'low';
            if (w >= 1200 && Math.abs(ratio - 1.77) < 0.3) status = 'excellent';
            else if (w >= 800) status = 'ok';

            setImageMetrics({ width: w, height: h, status, aspectRatio: ratio });
        };
        img.src = formData.image_url;
    }, [formData.image_url]);

    const loadPromotions = async () => {
        try {
            setLoading(true);
            const data = await promotionApi.getAll();
            setPromotions(data);
        } catch (err) {
            console.error('Error loading promotions:', err);
            setError('No se pudieron cargar las promociones.');
        } finally {
            setLoading(false);
        }
    };

    const loadBusinesses = async () => {
        try {
            // Buscamos todos los negocios incluyendo sus imágenes
            const { data, error } = await supabase
                .from('businesses')
                .select(`
                    *,
                    business_images (*)
                `)
                .order('name');

            if (error) throw error;

            // Mapeamos las imágenes al formato que espera el tipo Business
            const formatted = (data || []).map(b => ({
                ...b,
                images: b.business_images
            }));

            setBusinesses(formatted as Business[]);
        } catch (err) {
            console.error('Error loading businesses:', err);
        }
    };

    const handleToggleForm = () => {
        const nextState = !showForm;
        setShowForm(nextState);
        if (nextState) {
            // Recargar lista de clientes al abrir formulario para tener datos frescos
            loadBusinesses();
            setEditingId(null);
            setFormData(initialFormState);
        }
    };

    const handleBusinessSelect = (idStr: string) => {
        const id = idStr ? parseInt(idStr) : undefined;
        if (id) {
            const selected = businesses.find(b => b.id === id);
            if (selected) {
                // Obtenemos la imagen principal o la primera disponible
                const businessImg = selected.images?.find(img => img.is_primary)?.image_url
                    || selected.images?.[0]?.image_url
                    || '';

                setFormData({
                    ...formData,
                    business_id: id,
                    button_link: `/businesses/${id}`,
                    title: selected.name, // Forzamos el título del negocio para automatizar
                    description: selected.description?.substring(0, 120) + '...',
                    image_url: businessImg // Captura automática de la foto del cliente
                });
            }
        } else {
            setFormData({ ...formData, business_id: undefined });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            console.log('Saving promotion data:', formData);
            // Limpiar datos
            const dataToSave = {
                ...formData,
                business_id: formData.business_id || null, // Asegurar null si no hay id
                priority: parseInt(formData.priority.toString()) || 0
            };

            if (editingId) {
                await promotionApi.update(editingId, dataToSave);
            } else {
                await promotionApi.create({
                    ...dataToSave,
                    created_at: new Date().toISOString()
                });
            }
            alert('Promoción guardada correctamente');
            setShowForm(false);
            setEditingId(null);
            setFormData(initialFormState);
            loadPromotions();
        } catch (err: any) {
            console.error('Error saving:', err);
            let errorMessage = 'Error al procesar la solicitud';
            if (err.message) errorMessage = err.message;
            if (err.details) errorMessage += ` (${err.details})`;

            // Error específico para la columna faltante
            if (errorMessage.includes('is_popup')) {
                alert('FALTA COLUMNA EN BASE DE DATOS:\n\nPara que los popups funcionen, debes ejecutar este SQL en Supabase:\n\nALTER TABLE promotions ADD COLUMN is_popup BOOLEAN DEFAULT FALSE;\n\nLuego recarga esta página.');
            } else {
                alert(errorMessage);
            }
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (promo: Promotion) => {
        setEditingId(promo.id);
        setFormData({
            title: promo.title,
            description: promo.description,
            image_url: promo.image_url,
            button_text: promo.button_text || 'Ver Negocio',
            button_link: promo.button_link || '',
            badge_text: promo.badge_text || '',
            is_discount: !!promo.is_discount,
            business_id: promo.business_id,
            active: promo.active,
            priority: promo.priority,
            is_popup: !!promo.is_popup
        });
        loadBusinesses();
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: number) => {
        if (confirm('¿Deseas retirar este espacio publicitario?')) {
            try {
                await promotionApi.delete(id);
                loadPromotions();
            } catch (err) {
                console.error('Error deleting:', err);
                alert('Error al retirar');
            }
        }
    };

    const toggleActive = async (promo: Promotion) => {
        try {
            await promotionApi.update(promo.id, { active: !promo.active });
            loadPromotions();
        } catch (err) {
            console.error('Error toggling active:', err);
        }
    };

    if (loading) return (
        <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
    );

    return (
        <div className="p-4 sm:p-8 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">Vitrina Comercial</h1>
                    <p className="text-gray-500 font-medium text-lg italic">Gestiona los espacios destacados que los negocios han pagado</p>
                </div>
                <button
                    onClick={handleToggleForm}
                    className={`px-8 py-4 rounded-full font-black tracking-wide transition-all shadow-2xl transform hover:-translate-y-1 active:scale-95 ${showForm
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-linear-to-r from-blue-600 to-indigo-700 text-white shadow-blue-500/30'
                        }`}
                >
                    {showForm ? 'Regresar' : 'Asignar Nuevo Espacio'}
                </button>
            </div>

            {showForm && (
                <div className="mb-16 grid grid-cols-1 lg:grid-cols-3 gap-10 text-left">
                    {/* Preview Card - 16:9 Landscape matching Slider */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 space-y-6">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest px-2 text-left">Vista Previa (Portada)</h3>

                            <div className="relative aspect-video rounded-[2rem] overflow-hidden shadow-2xl border border-gray-100 bg-gray-950 group">
                                {formData.image_url ? (
                                    <div className="relative w-full h-full">
                                        {/* Blurred Background Layer (Mismo que el slider) */}
                                        <div
                                            className="absolute inset-0 bg-cover bg-center blur-2xl opacity-40 scale-110"
                                            style={{ backgroundImage: `url(${formData.image_url})` }}
                                        />
                                        {/* Main Image Layer */}
                                        <div className="relative w-full h-full flex items-center justify-center p-4">
                                            <Image
                                                src={formData.image_url}
                                                fill
                                                alt="Preview"
                                                className="object-contain drop-shadow-2xl"
                                                unoptimized
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="absolute inset-0 bg-linear-to-br from-gray-900 to-black flex items-center justify-center text-gray-700 font-black uppercase tracking-tighter text-xs">Sin imagen</div>
                                )}

                                {/* Slidert-like Overlays */}
                                <div className="absolute inset-0 z-10 bg-linear-to-r from-black/90 via-black/30 to-transparent"></div>
                                <div className="absolute inset-0 z-10 bg-linear-to-t from-black/60 via-transparent to-transparent"></div>

                                <div className="absolute inset-0 z-20 p-6 flex flex-col justify-center">
                                    <div className="max-w-[80%] space-y-2">
                                        <div className={`inline-block px-2 py-0.5 rounded-full text-[7px] font-black tracking-widest uppercase border ${formData.is_discount ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20' : 'bg-blue-600/20 text-blue-400 border-blue-500/20'
                                            }`}>
                                            {formData.badge_text || (formData.is_discount ? 'OFERTA' : 'DESTACADO')}
                                        </div>

                                        <h4 className="text-white font-black text-lg leading-none drop-shadow-lg uppercase tracking-tighter line-clamp-2">
                                            {formData.title || 'Nombre del Negocio'}
                                        </h4>

                                        <p className="text-white/70 text-[9px] line-clamp-2 font-medium leading-tight">
                                            {formData.description || 'Descripción publicitaria...'}
                                        </p>

                                        {formData.button_link && (
                                            <div className="mt-2 inline-block py-1.5 px-4 rounded-lg text-[8px] font-black uppercase tracking-widest bg-blue-600 text-white">
                                                {formData.button_text || 'Ver Negocio'}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Suitability Badge */}
                            {imageMetrics.status !== 'idle' && (
                                <div className={`p-4 rounded-2xl border-2 flex flex-col gap-2 ${imageMetrics.status === 'excellent' ? 'bg-emerald-50 border-emerald-100 text-emerald-900' :
                                        imageMetrics.status === 'ok' ? 'bg-amber-50 border-amber-100 text-amber-900' :
                                            'bg-red-50 border-red-100 text-red-900'
                                    }`}>
                                    <div className="flex items-center justify-between font-black uppercase tracking-widest text-[10px]">
                                        <span>Medidor de Calidad</span>
                                        <span className={`px-2 py-0.5 rounded-md ${imageMetrics.status === 'excellent' ? 'bg-emerald-500 text-white' :
                                                imageMetrics.status === 'ok' ? 'bg-amber-500 text-white' :
                                                    'bg-red-500 text-white'
                                            }`}>
                                            {imageMetrics.status === 'excellent' ? 'Excelente' :
                                                imageMetrics.status === 'ok' ? 'Aceptable' : 'Baja Calidad'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-[11px] font-bold">
                                        <span>Resolución: {imageMetrics.width}x{imageMetrics.height}</span>
                                        <span>Aspecto: {imageMetrics.aspectRatio.toFixed(2)}</span>
                                    </div>
                                    <p className="text-[10px] font-medium opacity-80 italic">
                                        {imageMetrics.status === 'excellent' ? '✓ Imagen perfecta para el slider panorámico.' :
                                            imageMetrics.status === 'ok' ? '⚠ La imagen funcionará, pero una mayor resolución se vería mejor.' :
                                                '✗ Imagen demasiado pequeña o vertical. Se verá borrosa en pantallas grandes.'}
                                    </p>
                                </div>
                            )}

                            <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50">
                                <h4 className="text-[10px] font-black text-blue-900 uppercase tracking-widest mb-2">Guía Profesional</h4>
                                <ul className="text-[10px] space-y-1.5 font-medium text-blue-800">
                                    <li className="flex gap-2"><span>•</span> <b>Ideal:</b> 1920x1080px (16:9)</li>
                                    <li className="flex gap-2"><span>•</span> <b>Mínimo:</b> 1200px de ancho</li>
                                    <li className="flex gap-2"><span>•</span> <b>Formato:</b> Mantén el sujeto al centro</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Main Form */}
                    <div className="lg:col-span-2 bg-white p-8 md:p-12 rounded-[3rem] border border-gray-100 shadow-2xl text-left relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

                        <h2 className="text-2xl font-black mb-10 text-gray-900 border-b border-gray-100 pb-8 uppercase tracking-tight flex items-center gap-3">
                            <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
                            Configuración de Anuncio
                        </h2>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-sm font-black text-gray-700 uppercase tracking-wider block">Seleccionar Negocio Pagador</label>
                                <select
                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-blue-500 rounded-2xl outline-none transition-all font-bold text-gray-800"
                                    value={formData.business_id || ''}
                                    onChange={(e) => handleBusinessSelect(e.target.value)}
                                >
                                    <option value="">-- Elige un negocio registrado --</option>
                                    {businesses.map(b => (
                                        <option key={b.id} value={b.id}>{b.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="text-sm font-black text-gray-700 uppercase tracking-wider block">Título de la Pieza</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-blue-500 rounded-2xl outline-none transition-all font-bold text-gray-800"
                                    placeholder="Nombre del negocio o frase ganadora..."
                                />
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="text-sm font-black text-gray-700 uppercase tracking-wider block">Mensaje Publicitario</label>
                                <textarea
                                    required
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-blue-500 rounded-2xl outline-none h-32 transition-all resize-none font-medium text-gray-700"
                                    placeholder="Describe el producto o beneficio..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-black text-gray-700 uppercase tracking-wider block">URL de Imagen</label>
                                <input
                                    type="url"
                                    required
                                    value={formData.image_url}
                                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-blue-500 rounded-2xl outline-none transition-all font-bold text-gray-900"
                                    placeholder="https://..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-black text-gray-700 uppercase tracking-wider block">Texto Botón</label>
                                <input
                                    type="text"
                                    value={formData.button_text}
                                    onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-blue-500 rounded-2xl outline-none transition-all font-bold text-gray-900"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-black text-gray-700 uppercase tracking-wider block">Oferta (Ej: -20%)</label>
                                <input
                                    type="text"
                                    value={formData.badge_text}
                                    onChange={(e) => setFormData({ ...formData, badge_text: e.target.value })}
                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-blue-500 rounded-2xl outline-none transition-all font-bold text-gray-900"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-black text-gray-700 uppercase tracking-divider block">Prioridad</label>
                                <input
                                    type="number"
                                    value={formData.priority}
                                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })}
                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-blue-500 rounded-2xl outline-none transition-all font-black text-gray-900"
                                />
                            </div>

                            <div className="md:col-span-2 flex flex-wrap items-center gap-10 pt-4">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            checked={formData.is_discount}
                                            onChange={(e) => setFormData({ ...formData, is_discount: e.target.checked })}
                                            className="sr-only"
                                        />
                                        <div className={`w-14 h-7 rounded-full transition-all duration-300 ${formData.is_discount ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-gray-200'}`}></div>
                                        <div className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full shadow-lg transition-transform duration-300 ${formData.is_discount ? 'translate-x-[1.75rem]' : ''}`}></div>
                                    </div>
                                    <span className="text-sm font-black text-gray-600 uppercase tracking-tighter">Es Descuento</span>
                                </label>

                                <label className="flex items-center gap-3 cursor-pointer ml-auto">
                                    <span className="text-sm font-black text-gray-600 uppercase tracking-tighter">Activo en Portada</span>
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            checked={formData.active}
                                            onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                            className="sr-only"
                                        />
                                        <div className={`w-14 h-7 rounded-full transition-all duration-300 ${formData.active ? 'bg-blue-600 shadow-blue-500/20' : 'bg-gray-200'}`}></div>
                                        <div className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full shadow-lg transition-transform duration-300 ${formData.active ? 'translate-x-[1.75rem]' : ''}`}></div>
                                    </div>
                                </label>

                                <label className="flex items-center gap-3 cursor-pointer">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            checked={formData.is_popup}
                                            onChange={(e) => setFormData({ ...formData, is_popup: e.target.checked })}
                                            className="sr-only"
                                        />
                                        <div className={`w-14 h-7 rounded-full transition-all duration-300 ${formData.is_popup ? 'bg-amber-500 shadow-amber-500/20' : 'bg-gray-200'}`}></div>
                                        <div className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full shadow-lg transition-transform duration-300 ${formData.is_popup ? 'translate-x-[1.75rem]' : ''}`}></div>
                                    </div>
                                    <span className="text-sm font-black text-gray-600 uppercase tracking-tighter">Es un Popup Emergente</span>
                                </label>
                            </div>

                            <div className="md:col-span-2 pt-10">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full py-5 bg-linear-to-r from-blue-600 to-indigo-700 text-white rounded-[2rem] font-black text-xl hover:shadow-2xl hover:shadow-blue-600/40 transition-all active:scale-[0.97] disabled:opacity-50 uppercase"
                                >
                                    {saving ? 'Guardando...' : (editingId ? 'Actualizar Anuncio' : 'Confirmar Espacio')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {error ? (
                <div className="bg-amber-50 border border-amber-200 p-8 rounded-[2rem] text-amber-900 shadow-inner">
                    <p className="font-bold underline mb-4">Error:</p>
                    <p className="font-medium opacity-80">{error}</p>
                </div>
            ) : (
                <div className="space-y-6 text-left">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">Espacios Destacados Actualmente</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {promotions.map((promo) => (
                            <div key={promo.id} className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-lg hover:shadow-3xl transition-all duration-500 group relative">
                                <div className="relative h-60 bg-gray-100 overflow-hidden">
                                    <Image
                                        src={promo.image_url}
                                        alt={promo.title}
                                        fill
                                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                    <div className="absolute top-5 left-5 right-5 flex justify-between items-start">
                                        <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg ${promo.active ? 'bg-blue-600 text-white' : 'bg-gray-400 text-white'
                                            }`}>
                                            {promo.active ? 'Vigente' : 'Pausado'}
                                        </span>
                                        <button
                                            onClick={() => toggleActive(promo)}
                                            className="w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md bg-white/90 text-blue-600 shadow-xl border border-blue-100 transition-all active:scale-90"
                                        >
                                            <div className={`w-2 h-2 rounded-full ${promo.active ? 'bg-blue-600 animate-pulse' : 'bg-gray-300'}`}></div>
                                        </button>
                                    </div>
                                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent"></div>
                                    <div className="absolute bottom-6 left-6 right-6 text-left">
                                        <h3 className="text-white font-black text-xl line-clamp-1">{promo.title}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Prio {promo.priority}</span>
                                            {promo.is_discount && <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">• OFERTA</span>}
                                            {promo.is_popup && <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">• POPUP</span>}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-8 text-left">
                                    <p className="text-gray-500 text-sm font-medium line-clamp-2 h-10 mb-8 leading-relaxed italic text-left">
                                        {promo.description}
                                    </p>
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => handleEdit(promo)}
                                            className="flex-1 px-6 py-4 text-sm font-black text-blue-600 bg-blue-50 rounded-2xl hover:bg-blue-600 hover:text-white transition-all transform active:scale-95"
                                        >
                                            Corregir
                                        </button>
                                        <button
                                            onClick={() => handleDelete(promo.id)}
                                            className="p-4 text-red-600 bg-red-50 rounded-2xl hover:bg-red-600 hover:text-white transition-all transform active:scale-95"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {promotions.length === 0 && (
                            <div className="col-span-full py-24 text-center rounded-[3rem] border-4 border-dashed border-gray-100 flex flex-col items-center">
                                <p className="text-xl font-black text-gray-300 uppercase tracking-widest">No hay espacios asignados</p>
                                <button
                                    onClick={handleToggleForm}
                                    className="mt-8 px-12 py-4 bg-gray-900 text-white rounded-full font-black text-sm tracking-widest hover:bg-blue-600 transition-all active:scale-95"
                                >
                                    Asignar Vitrina Comercial
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
