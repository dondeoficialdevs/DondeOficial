'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Category } from '../types';
import { categoryApi } from '../lib/api';

interface CategorySectionProps {
  categories: Category[];
  onCategorySelect?: (categoryName: string) => void;
  onRefresh?: () => void;
}

const getCategoryIcon = (name: string) => {
  const iconStyle = {
    color: '#FF6B35',
    filter: 'drop-shadow(0 0 1px rgba(255, 107, 53, 0.4))',
  };

  const icons: { [key: string]: React.ReactElement } = {
    'Belleza': (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={iconStyle}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    'Entretenimiento': (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={iconStyle}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    'Gastronomía': (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={iconStyle}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253c0-.855-.917-1.545-2.05-1.545-1.133 0-2.05.69-2.05 1.545 0 .855.917 1.545 2.05 1.545 1.133 0 2.05-.69 2.05-1.545z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    'Viajes y turismo': (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={iconStyle}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    'Bienestar y salud': (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={iconStyle}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    'Servicios': (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={iconStyle}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8" />
      </svg>
    ),
    'Productos': (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={iconStyle}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    'Cerca de mí': (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={iconStyle}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  };
  return icons[name] || (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={iconStyle}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
};

export default function CategorySection({ categories, onCategorySelect, onRefresh }: CategorySectionProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCategoryClick = (categoryName: string) => {
    if (onCategorySelect) {
      onCategorySelect(categoryName);
    }
    const encodedCategory = encodeURIComponent(categoryName);
    router.push(`/listings?category=${encodedCategory}`);
  };

  const handleEditClick = (e: React.MouseEvent, category: Category) => {
    e.stopPropagation();
    setEditingCategory(category);
    setNewCategoryName(category.name);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (e: React.MouseEvent, categoryId: number) => {
    e.stopPropagation();
    if (confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
      try {
        setLoading(true);
        await categoryApi.delete(categoryId);
        if (onRefresh) onRefresh();
      } catch (error) {
        console.error('Error al eliminar categoría:', error);
        alert('Error al eliminar la categoría');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCreateClick = () => {
    setEditingCategory(null);
    setNewCategoryName('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    try {
      setLoading(true);
      if (editingCategory) {
        await categoryApi.update(editingCategory.id, { name: newCategoryName });
      } else {
        await categoryApi.create({ name: newCategoryName });
      }
      setIsModalOpen(false);
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error al guardar categoría:', error);
      alert('Error al guardar la categoría');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-6 bg-white overflow-visible">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-visible">
        <div className="flex items-center space-x-6 overflow-x-auto pt-5 pb-4 no-scrollbar">
          {categories.map((cat) => (
            <div key={cat.id} className="relative flex flex-col items-center flex-shrink-0">
              <button
                onClick={() => handleCategoryClick(cat.name)}
                className="flex flex-col items-center space-y-2 px-3 py-2 rounded-lg transition-all hover:bg-gray-50 text-gray-700 min-w-[85px] group/btn"
              >
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-md group-hover/btn:shadow-lg transition-all duration-300 group-hover/btn:scale-110 border border-gray-100">
                  {getCategoryIcon(cat.name)}
                </div>
                <span className="text-xs font-semibold whitespace-nowrap">{cat.name}</span>
              </button>

              {/* Botones de acción siempre visibles */}
              <div className="absolute -top-2 -right-1 flex space-x-1 z-20">
                <button
                  onClick={(e) => handleEditClick(e, cat)}
                  className="p-1.5 bg-white rounded-full shadow-md border border-blue-100 text-blue-500 hover:bg-blue-50 hover:text-blue-700 transition-all opacity-100"
                  title="Editar"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button
                  onClick={(e) => handleDeleteClick(e, cat.id)}
                  className="p-1.5 bg-white rounded-full shadow-md border border-red-100 text-red-500 hover:bg-red-50 hover:text-red-700 transition-all opacity-100"
                  title="Eliminar"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}

          {/* Botón Crear siempre visible */}
          <button
            onClick={handleCreateClick}
            className="flex flex-col items-center space-y-2 px-3 py-2 rounded-lg transition-all hover:bg-orange-50 text-orange-600 min-w-[85px] group flex-shrink-0"
          >
            <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110 border border-orange-200 border-dashed">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="text-xs font-bold whitespace-nowrap">Crear</span>
          </button>
        </div>
      </div>

      {/* Modal para Crear/Editar */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Ej: Restaurantes, Moda..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none"
                  required
                  autoFocus
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 transition-all shadow-md shadow-orange-200 disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
