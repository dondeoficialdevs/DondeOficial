'use client';

import { useState, useEffect } from 'react';
import { membershipApi } from '@/lib/api';
import { MembershipPlan } from '@/types';
import { Plus, Edit3, Trash2, Crown, Calendar, ChevronRight, X, AlertCircle, CheckCircle2, DollarSign } from 'lucide-react';

export default function MembershipsPage() {
    const [plans, setPlans] = useState<MembershipPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState<Partial<MembershipPlan>>({
        name: '',
        level: 1,
        monthly_price: 0,
        yearly_price: 0,
        description: '',
        features: [],
        badge_text: '',
        is_popular: false,
        active: true,
    });
    const [featureInput, setFeatureInput] = useState('');
    const [saving, setSaving] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        loadPlans();
    }, []);

    const loadPlans = async () => {
        try {
            setLoading(true);
            const data = await membershipApi.getAll();
            setPlans(data);
        } catch (err) {
            console.error('Error loading plans:', err);
            setError('Error al cargar los planes de membresía.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked :
            type === 'number' ? parseFloat(value) : value;

        setFormData(prev => ({ ...prev, [name]: val }));
    };

    const formatCOP = (val: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            maximumFractionDigits: 0
        }).format(val || 0);
    };

    const addFeature = () => {
        if (featureInput.trim()) {
            setFormData(prev => ({
                ...prev,
                features: [...(prev.features || []), featureInput.trim()]
            }));
            setFeatureInput('');
        }
    };

    const removeFeature = (index: number) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features?.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await membershipApi.save(formData);
            alert(isEditing ? 'Plan actualizado con éxito' : 'Plan creado con éxito');
            setShowForm(false);
            setIsEditing(false);
            setFormData({
                name: '',
                level: 1,
                monthly_price: 0,
                yearly_price: 0,
                description: '',
                features: [],
                badge_text: '',
                is_popular: false,
                active: true,
            });
            loadPlans();
        } catch (err) {
            console.error('Error saving plan:', err);
            alert('Error al guardar el plan.');
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (plan: MembershipPlan) => {
        setFormData(plan);
        setIsEditing(true);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: number) => {
        if (confirm('¿Estás seguro de eliminar este plan?')) {
            try {
                await membershipApi.delete(id);
                loadPlans();
            } catch (err) {
                alert('Error al eliminar el plan.');
            }
        }
    };

    <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
    </div>

    return (
        <div className="p-4 sm:p-8 max-w-7xl mx-auto">
            <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Membresías</h1>
                    <p className="text-gray-500 font-medium italic">Gestiona los planes de publicidad del directorio</p>
                </div>
                <button
                    onClick={() => {
                        setShowForm(!showForm);
                        setIsEditing(false);
                        if (!showForm) setFormData({
                            name: '', level: 1, monthly_price: 0, yearly_price: 0,
                            description: '', features: [], badge_text: '', is_popular: false, active: true
                        });
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full transition-all font-black uppercase tracking-widest shadow-xl hover:scale-105"
                >
                    {showForm ? <X size={18} /> : <Plus size={18} />}
                    {showForm ? 'Cancelar' : 'Nuevo Plan'}
                </button>
            </div>

            {showForm && (
                <div className="mb-12 bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-2xl animate-in fade-in slide-in-from-top duration-500">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Nombre del Plan</label>
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-black rounded-2xl outline-none transition-all font-bold text-gray-800"
                                    placeholder="Ej: Plan Slider"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Nivel (1-3)</label>
                                <select
                                    name="level"
                                    value={formData.level}
                                    onChange={handleInputChange}
                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-black rounded-2xl outline-none transition-all font-bold text-gray-800"
                                >
                                    <option value={1}>Nivel 1 (Básico)</option>
                                    <option value={2}>Nivel 2 (Slider)</option>
                                    <option value={3}>Nivel 3 (Pop-up)</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Etiqueta (Badge)</label>
                                <input
                                    name="badge_text"
                                    value={formData.badge_text}
                                    onChange={handleInputChange}
                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-black rounded-2xl outline-none transition-all font-bold text-gray-800"
                                    placeholder="Ej: RECOMENDADO"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Precio Mensual</label>
                                    <span className="text-xs font-bold text-orange-600 italic">{formatCOP(formData.monthly_price || 0)}</span>
                                </div>
                                <div className="relative">
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 font-bold">COP $</span>
                                    <input
                                        type="number"
                                        name="monthly_price"
                                        value={formData.monthly_price}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full pl-20 pr-6 py-4 bg-gray-50 border-2 border-transparent focus:border-black rounded-2xl outline-none transition-all font-bold text-gray-800"
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Precio Anual</label>
                                    <span className="text-xs font-bold text-orange-600 italic">{formatCOP(formData.yearly_price || 0)}</span>
                                </div>
                                <div className="relative">
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 font-bold">COP $</span>
                                    <input
                                        type="number"
                                        name="yearly_price"
                                        value={formData.yearly_price}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full pl-20 pr-6 py-4 bg-gray-50 border-2 border-transparent focus:border-black rounded-2xl outline-none transition-all font-bold text-gray-800"
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Descripción</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-black rounded-2xl outline-none transition-all font-bold text-gray-800 resize-none"
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Características</label>
                            <div className="flex gap-2">
                                <input
                                    value={featureInput}
                                    onChange={(e) => setFeatureInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                                    className="flex-1 px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-black rounded-2xl outline-none transition-all font-bold text-gray-800"
                                    placeholder="Agregar característica..."
                                />
                                <button
                                    type="button"
                                    onClick={addFeature}
                                    className="px-6 py-4 bg-black text-white rounded-2xl font-black uppercase"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.features?.map((f, i) => (
                                    <span key={i} className="px-4 py-2 bg-gray-100 rounded-full text-sm font-bold flex items-center gap-2">
                                        {f}
                                        <button type="button" onClick={() => removeFeature(i)} className="text-red-500"><X size={14} /></button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-8">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="is_popular"
                                    checked={formData.is_popular}
                                    onChange={handleInputChange}
                                    className="w-6 h-6 rounded-lg accent-black"
                                />
                                <span className="text-sm font-black uppercase text-gray-600">Plan Popular</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="active"
                                    checked={formData.active}
                                    onChange={handleInputChange}
                                    className="w-6 h-6 rounded-lg accent-black"
                                />
                                <span className="text-sm font-black uppercase text-gray-600">Activo</span>
                            </label>
                        </div>

                        <div className="flex gap-4 pt-4 border-t">
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex-1 py-4 bg-black text-white rounded-2xl font-black uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
                            >
                                {saving ? 'Guardando...' : (isEditing ? 'Actualizar Plan' : 'Crear Plan')}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {plans.map((plan) => (
                    <div
                        key={plan.id}
                        className="group bg-white rounded-[2rem] p-8 border border-gray-100 hover:border-black hover:shadow-2xl transition-all duration-500 flex flex-col relative overflow-hidden"
                    >
                        {plan.is_popular && (
                            <div className="absolute top-6 -right-12 bg-orange-500 text-white px-12 py-1 rotate-45 text-[10px] font-black uppercase tracking-widest shadow-lg">
                                Popular
                            </div>
                        )}

                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-4 rounded-2xl ${plan.level === 3 ? 'bg-orange-600 text-white' : plan.level === 2 ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'}`}>
                                <Crown size={24} />
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(plan)} className="p-2 text-gray-400 hover:text-blue-600 transition-all"><Edit3 size={18} /></button>
                                <button onClick={() => handleDelete(plan.id)} className="p-2 text-gray-400 hover:text-red-600 transition-all"><Trash2 size={18} /></button>
                            </div>
                        </div>

                        <h3 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">{plan.name}</h3>
                        <div className="flex flex-col mb-6">
                            <span className="text-2xl font-black text-black">
                                {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(plan.monthly_price)}
                            </span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">COP / Mes</span>
                        </div>

                        <p className="text-sm text-gray-500 font-medium mb-8 leading-relaxed italic">{plan.description}</p>

                        <div className="space-y-3 mb-8 flex-grow">
                            {plan.features.map((f, i) => (
                                <div key={i} className="flex items-center gap-3 text-sm font-bold text-gray-700">
                                    <CheckCircle2 size={16} className="text-orange-500" />
                                    {f}
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center justify-between border-t pt-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
                            <div className="flex items-center gap-2">
                                <Calendar size={12} />
                                Nivel {plan.level}
                            </div>
                            <div className={`flex items-center gap-1 ${plan.active ? 'text-orange-600' : 'text-gray-400'}`}>
                                {plan.active ? 'Activo' : 'Inactivo'}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
