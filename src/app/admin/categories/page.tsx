'use client';

import { useState, useEffect } from 'react';
import { categoryApi } from '@/lib/api';
import { Category } from '@/types';
import { Plus, Edit3, Trash2, Tag, Calendar, ChevronRight, X, AlertCircle } from 'lucide-react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const categoriesData = await categoryApi.getAll();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading categories:', error);
      let errorMessage = 'Error al cargar las categorías. ';
      if (error instanceof Error) {
        if (error.message.includes('conectar') || error.message.includes('Network')) {
          errorMessage += 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.';
        } else {
          errorMessage += error.message;
        }
      } else {
        errorMessage += 'Por favor intenta de nuevo.';
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre de la categoría es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      if (isEditing && selectedCategory) {
        await categoryApi.update(selectedCategory.id, formData);
        alert('Categoría actualizada con éxito');
      } else {
        await categoryApi.create(formData);
        alert('Categoría creada con éxito');
      }

      setFormData({ name: '', description: '' });
      setShowCreateForm(false);
      setIsEditing(false);
      setSelectedCategory(null);
      await loadCategories();
    } catch (error: unknown) {
      console.error('Error saving category:', error);
      const errorMessage = error instanceof Error
        ? error.message
        : 'Error al guardar la categoría. Por favor intenta de nuevo.';
      alert(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
    });
    setIsEditing(true);
    setShowCreateForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar la categoría "${name}"?`)) {
      try {
        await categoryApi.delete(id);
        alert('Categoría eliminada con éxito');
        await loadCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Error al eliminar la categoría. Asegúrate de que no tenga negocios asociados.');
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
          <button
            onClick={loadCategories}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto">
      <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Categorías</h1>
          <p className="text-gray-500 font-medium italic">Gestiona los sectores de los negocios</p>
        </div>
        <button
          onClick={() => {
            if (showCreateForm && isEditing) {
              setIsEditing(false);
              setFormData({ name: '', description: '' });
            } else {
              setShowCreateForm(!showCreateForm);
            }
          }}
          className={`flex items-center gap-2 px-6 py-3 text-white rounded-full transition-all font-black uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 ${showCreateForm ? 'bg-gray-800' : 'bg-black'
            }`}
        >
          {showCreateForm ? (
            <>
              <X size={18} />
              Cancelar
            </>
          ) : (
            <>
              <Plus size={18} />
              Nueva Categoría
            </>
          )}
        </button>
      </div>

      {/* Formulario de creación/edición */}
      {showCreateForm && (
        <div className="mb-12 bg-white rounded-[2.5rem] p-8 sm:p-10 border border-gray-100 shadow-2xl animate-in fade-in slide-in-from-top duration-500">
          <div className="flex items-center gap-3 mb-8">
            <div className={`p-3 rounded-2xl ${isEditing ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
              {isEditing ? <Edit3 size={24} /> : <Plus size={24} />}
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                {isEditing ? 'Editar Categoría' : 'Nueva Categoría'}
              </h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Completa los campos requeridos</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label htmlFor="name" className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">
                  Nombre de la Categoría
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={`w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-black rounded-2xl outline-none transition-all font-bold text-gray-800 ${errors.name ? 'border-red-500' : ''}`}
                  placeholder="Ej: Restaurantes, Tiendas, etc."
                />
                {errors.name && (
                  <p className="mt-1 text-xs font-bold text-red-500 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">
                  Descripción (Opcional)
                </label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-black rounded-2xl outline-none transition-all font-bold text-gray-800"
                  placeholder="Una breve descripción..."
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-100">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-4 bg-black text-white rounded-2xl font-black uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
              >
                {saving ? 'Guardando...' : (isEditing ? 'Actualizar Categoría' : 'Crear Categoría')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setIsEditing(false);
                  setFormData({ name: '', description: '' });
                  setErrors({});
                }}
                className="px-8 py-4 bg-gray-100 text-gray-600 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-200 transition-all"
              >
                Cerrar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de categorías */}
      {categories.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
            />
          </svg>
          <p className="text-gray-500 text-lg">No hay categorías registradas</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div
              key={category.id}
              className="group bg-white rounded-[2rem] p-8 border border-gray-100 hover:border-black hover:shadow-2xl transition-all duration-500 flex flex-col relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-full -mr-16 -mt-16 group-hover:bg-black/5 transition-colors"></div>

              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-black group-hover:text-white transition-all duration-500 shadow-inner">
                  <Tag size={20} />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                    title="Editar"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id, category.name)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    title="Eliminar"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-black text-gray-900 mb-3 group-hover:translate-x-1 transition-transform uppercase tracking-tight">{category.name}</h3>

              {category.description ? (
                <p className="text-sm text-gray-500 font-medium mb-8 flex-grow line-clamp-2">
                  {category.description}
                </p>
              ) : (
                <div className="flex-grow mb-8 border-b-2 border-dashed border-gray-100"></div>
              )}

              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-400 border-t border-gray-50 pt-6">
                <div className="flex items-center gap-2">
                  <Calendar size={12} />
                  {formatDate(category.created_at)}
                </div>
                <button
                  onClick={() => setSelectedCategory(category)}
                  className="flex items-center gap-1 text-black hover:gap-2 transition-all font-black"
                >
                  Detalles
                  <ChevronRight size={12} strokeWidth={3} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de detalles de categoría */}
      {selectedCategory && !isEditing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-black text-gray-900">Vista Previa</h3>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="bg-gray-100 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-black rounded-full mb-1">
                    ID #{selectedCategory.id}
                  </span>
                  <p className="text-3xl font-black text-gray-900 leading-tight">{selectedCategory.name}</p>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-gray-400 mb-2">Descripción</label>
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                    <p className="text-gray-700 leading-relaxed italic">
                      {selectedCategory.description || 'Sin descripción detallada disponible.'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-4">
                  <div>
                    <label className="block text-xs font-black uppercase text-gray-400 mb-1">Creada el</label>
                    <p className="text-sm font-bold text-gray-800">{formatDate(selectedCategory.created_at)}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase text-gray-400 mb-1">Actualizada</label>
                    <p className="text-sm font-bold text-gray-800">{formatDate(selectedCategory.updated_at)}</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex space-x-3">
                <button
                  onClick={() => handleEdit(selectedCategory)}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>Editar</span>
                </button>
                <button
                  onClick={() => handleDelete(selectedCategory.id, selectedCategory.name)}
                  className="px-6 py-3 bg-red-100 text-red-600 rounded-xl font-black hover:bg-red-200 transition-all flex items-center justify-center"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

