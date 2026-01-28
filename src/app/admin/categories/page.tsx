'use client';

import { useState, useEffect } from 'react';
import { categoryApi } from '@/lib/api';
import { Category } from '@/types';

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
    <div className="p-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Categorías</h2>
          <p className="text-gray-600 mt-1">
            Total: {categories.length} categoría{categories.length !== 1 ? 's' : ''}
          </p>
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
          className={`px-4 py-2 text-white rounded-md transition-colors font-medium whitespace-nowrap ${showCreateForm ? 'bg-gray-600 hover:bg-gray-700' : 'bg-blue-600 hover:bg-blue-700'
            }`}
        >
          {showCreateForm ? 'Cancelar' : '+ Nueva Categoría'}
        </button>
      </div>

      {/* Formulario de creación/edición */}
      {showCreateForm && (
        <div className="mb-6 bg-white rounded-xl p-6 border border-blue-100 shadow-sm animate-in slide-in-from-top duration-300">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            {isEditing ? 'Editar Categoría' : 'Crear Nueva Categoría'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Nombre de la Categoría *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Ej: Restaurantes, Tiendas, etc."
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                Descripción (opcional)
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Descripción de la categoría..."
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-md shadow-blue-100 transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-all font-bold"
              >
                Cancelar
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="group bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-50 transition-all duration-300 flex flex-col"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{category.name}</h3>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleEdit(category)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    title="Editar"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(category.id, category.name)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Eliminar"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {category.description && (
                <p className="text-sm text-gray-600 mb-6 line-clamp-3 bg-gray-50 p-3 rounded-lg border border-gray-100 flex-grow">
                  {category.description}
                </p>
              )}

              <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="text-[10px] uppercase tracking-wider font-bold text-gray-400">
                  Creada {formatDate(category.created_at)}
                </div>
                <button
                  onClick={() => setSelectedCategory(category)}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  Detalles
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

