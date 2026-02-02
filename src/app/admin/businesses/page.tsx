'use client';

import { useState, useEffect } from 'react';
import { businessApi } from '@/lib/api';
import { Business } from '@/types';
import { useRouter } from 'next/navigation';
import { Search, Building2, Eye, Edit3, Trash2, Calendar, Mail, MapPin, ChevronLeft, ChevronRight, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

export default function BusinessesPage() {
  const router = useRouter();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const itemsPerPage = 10;

  useEffect(() => {
    loadBusinesses();
  }, []);

  const loadBusinesses = async () => {
    try {
      setLoading(true);
      setError(null);
      const businessesData = await businessApi.getAllForAdmin();
      setBusinesses(businessesData);
    } catch (error) {
      console.error('Error loading businesses:', error);
      setError('Error al cargar los directorios. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirmDelete !== id) {
      setConfirmDelete(id);
      return;
    }

    try {
      setDeletingId(id);
      await businessApi.delete(id);
      await loadBusinesses();
      setConfirmDelete(null);
    } catch (error) {
      console.error('Error deleting business:', error);
      const errorMessage = error instanceof Error
        ? error.message
        : 'Error al eliminar el directorio. Por favor intenta de nuevo.';
      alert(errorMessage);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredBusinesses = businesses.filter((business) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      business.name.toLowerCase().includes(searchLower) ||
      business.description?.toLowerCase().includes(searchLower) ||
      business.address?.toLowerCase().includes(searchLower) ||
      business.email?.toLowerCase().includes(searchLower) ||
      business.category_name?.toLowerCase().includes(searchLower)
    );
  });

  const totalPages = Math.ceil(filteredBusinesses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedBusinesses = filteredBusinesses.slice(startIndex, endIndex);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="bg-red-50 border-2 border-red-100 rounded-[2rem] p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-800 font-bold mb-4">{error}</p>
          <button
            onClick={loadBusinesses}
            className="px-8 py-3 bg-red-600 text-white rounded-xl font-black uppercase tracking-widest hover:bg-red-700 transition-all"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto">
      {/* Header mejorado */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Directorios</h1>
          <p className="text-gray-500 font-medium italic">Gestiona todos los negocios registrados</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-black text-white px-6 py-3 rounded-2xl flex items-center gap-3 shadow-xl">
            <Building2 size={20} className="text-gray-400" />
            <span className="text-sm font-black uppercase tracking-widest">
              {filteredBusinesses.length} Total
            </span>
          </div>
        </div>
      </div>

      {/* Barra de búsqueda mejorada */}
      <div className="mb-10">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-gray-400 group-focus-within:text-black transition-colors">
            <Search size={20} />
          </div>
          <input
            type="text"
            placeholder="Buscar por nombre, descripción, dirección, email o categoría..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-14 pr-6 py-5 bg-white border-2 border-gray-100 focus:border-black rounded-[2rem] outline-none text-gray-800 placeholder-gray-400 shadow-sm transition-all font-bold"
          />
        </div>
      </div>

      {paginatedBusinesses.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-50 rounded-full mb-6">
            <Building2 size={40} className="text-gray-300" />
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">
            {searchTerm ? 'Sin resultados' : 'Vacío'}
          </h3>
          <p className="text-gray-500 font-medium">
            {searchTerm ? 'Intenta con otros términos' : 'No hay directorios registrados aún'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Negocio
                  </th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Categoría
                  </th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Contacto
                  </th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Estado
                  </th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginatedBusinesses.map((business) => (
                  <tr key={business.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-base font-black text-gray-900 group-hover:text-black transition-colors">{business.name}</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1 mt-1">
                          <Calendar size={10} />
                          {formatDate(business.created_at).split(' a ')[0]}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold uppercase tracking-widest">
                        {business.category_name || 'Sin categoría'}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                          <Mail size={12} className="text-gray-400" />
                          {business.email || 'N/A'}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400 truncate max-w-[200px]">
                          <MapPin size={12} />
                          {business.address || 'Tunja, Boyacá'}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${business.status === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : business.status === 'pending'
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                        {business.status === 'approved' ? (
                          <CheckCircle2 size={12} />
                        ) : business.status === 'pending' ? (
                          <Clock size={12} />
                        ) : (
                          <AlertCircle size={12} />
                        )}
                        {business.status === 'approved' ? 'Activo' : business.status === 'pending' ? 'Revision' : 'Rechazado'}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => router.push(`/businesses/${business.id}`)}
                          className="p-2.5 bg-gray-50 text-gray-600 hover:bg-black hover:text-white rounded-xl transition-all shadow-sm"
                          title="Ver"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => router.push(`/businesses/${business.id}/edit`)}
                          className="p-2.5 bg-gray-50 text-gray-600 hover:bg-black hover:text-white rounded-xl transition-all shadow-sm"
                          title="Editar"
                        >
                          <Edit3 size={18} />
                        </button>
                        {confirmDelete === business.id ? (
                          <button
                            onClick={() => handleDelete(business.id)}
                            className="px-4 py-2.5 bg-red-600 text-white rounded-xl text-xs font-black uppercase tracking-widest animate-pulse"
                          >
                            Eliminar
                          </button>
                        ) : (
                          <button
                            onClick={() => setConfirmDelete(business.id)}
                            className="p-2.5 bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all"
                            title="Eliminar"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
              <div className="text-xs font-black text-gray-400 uppercase tracking-widest">
                Mostrando {startIndex + 1}-{Math.min(endIndex, filteredBusinesses.length)} de {filteredBusinesses.length}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 bg-white border-2 border-gray-100 rounded-xl text-gray-600 hover:border-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="px-4 flex items-center text-sm font-black text-gray-900 uppercase tracking-widest bg-white border-2 border-gray-100 rounded-xl">
                  {currentPage} / {totalPages}
                </div>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 bg-white border-2 border-gray-100 rounded-xl text-gray-600 hover:border-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
