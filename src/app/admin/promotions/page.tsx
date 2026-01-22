'use client';

import { useState, useEffect } from 'react';
import { promotionApi } from '@/lib/api';
import { Promotion } from '@/types';
import Image from 'next/image';

export default function PromotionsAdminPage() {
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image_url: '',
        button_text: 'Ver más',
        button_link: '',
        active: true,
        priority: 0
    });

    useEffect(() => {
        loadPromotions();
    }, []);

    const loadPromotions = async () => {
        try {
            setLoading(true);
            const data = await promotionApi.getAll();
            setPromotions(data);
        } catch (err) {
            console.error('Error loading promotions:', err);
            setError('No se pudieron cargar las promociones. Asegúrate de que la tabla "promotions" existe en Supabase.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingId) {
                await promotionApi.update(editingId, formData);
            } else {
                await promotionApi.create({
                    ...formData,
                    created_at: new Date().toISOString()
                });
            }
            setShowForm(false);
            setEditingId(null);
            setFormData({
                title: '',
                description: '',
                image_url: '',
                button_text: 'Ver más',
                button_link: '',
                active: true,
                priority: 0
            });
            loadPromotions();
        } catch (err) {
            console.error('Error saving promotion:', err);
            alert('Error al guardar la promoción');
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
            button_text: promo.button_text || 'Ver más',
            button_link: promo.button_link || '',
            active: promo.active,
            priority: promo.priority
        });
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (confirm('¿Estás seguro de que deseas eliminar esta promoción?')) {
            try {
                await promotionApi.delete(id);
                loadPromotions();
            } catch (err) {
                console.error('Error deleting promotion:', err);
                alert('Error al eliminar');
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

    if (loading) return <div className="p-8 text-center">Cargando...</div>;

    return (
        <div className="p-4 sm:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Gestión de Promociones</h1>
                    <p className="text-gray-600">Administra el slider de la portada principal</p>
                </div>
                <button
                    onClick={() => {
                        setShowForm(!showForm);
                        if (showForm) {
                            setEditingId(null);
                            setFormData({
                                title: '',
                                description: '',
                                image_url: '',
                                button_text: 'Ver más',
                                button_link: '',
                                active: true,
                                priority: 0
                            });
                        }
                    }}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                >
                    {showForm ? 'Cancelar' : (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Nueva Promoción
                        </>
                    )}
                </button>
            </div>

            {showForm && (
                <div className="mb-10 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <h2 className="text-xl font-bold mb-6">{editingId ? 'Editar Promoción' : 'Nueva Promoción'}</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Título de la Promoción</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Ej: Oferta de Verano"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                                <textarea
                                    required
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-24"
                                    placeholder="Breve descripción de la promoción..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Texto del Botón</label>
                                    <input
                                        type="text"
                                        value={formData.button_text}
                                        onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Prioridad (0-10)</label>
                                    <input
                                        type="number"
                                        value={formData.priority}
                                        onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">URL de la Imagen</label>
                                <input
                                    type="url"
                                    required
                                    value={formData.image_url}
                                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="https://images.unsplash.com/..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Link de Destino</label>
                                <input
                                    type="text"
                                    value={formData.button_link}
                                    onChange={(e) => setFormData({ ...formData, button_link: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="/listings?category=..."
                                />
                            </div>
                            <div className="flex items-center gap-2 pt-2">
                                <input
                                    type="checkbox"
                                    id="active"
                                    checked={formData.active}
                                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="active" className="text-sm font-medium text-gray-700">Promoción Activa</label>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50"
                                >
                                    {saving ? 'Guardando...' : (editingId ? 'Actualizar Promoción' : 'Crear Promoción')}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            {error ? (
                <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl text-amber-800">
                    <h3 className="font-bold flex items-center gap-2 mb-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        Aviso de Base de Datos
                    </h3>
                    <p>{error}</p>
                    <p className="mt-4 text-sm font-medium uppercase tracking-wider">SQL para crear la tabla:</p>
                    <pre className="mt-2 bg-black/5 p-4 rounded-lg text-xs overflow-x-auto">
                        {`CREATE TABLE promotions (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  button_text TEXT DEFAULT 'Ver más',
  button_link TEXT,
  active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);`}
                    </pre>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {promotions.map((promo) => (
                        <div key={promo.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                            <div className="relative h-48 bg-gray-100">
                                <Image
                                    src={promo.image_url}
                                    alt={promo.title}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute top-2 right-2">
                                    <button
                                        onClick={() => toggleActive(promo)}
                                        className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md transition-colors ${promo.active ? 'bg-green-500/80 text-white' : 'bg-gray-500/80 text-white'
                                            }`}
                                    >
                                        {promo.active ? 'Activa' : 'Inactiva'}
                                    </button>
                                </div>
                            </div>
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-gray-900 line-clamp-1">{promo.title}</h3>
                                    <span className="text-xs font-medium text-gray-400">Prio: {promo.priority}</span>
                                </div>
                                <p className="text-gray-600 text-sm line-clamp-2 mb-4">{promo.description}</p>
                                <div className="flex justify-between items-center gap-2">
                                    <button
                                        onClick={() => handleEdit(promo)}
                                        className="flex-1 px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(promo.id)}
                                        className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                                        title="Eliminar"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {promotions.length === 0 && (
                        <div className="col-span-full py-12 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                            <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-gray-500 font-medium">No hay promociones registradas</p>
                            <button
                                onClick={() => setShowForm(true)}
                                className="mt-4 text-blue-600 font-bold hover:underline"
                            >
                                Crear la primera →
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
