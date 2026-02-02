'use client';
import { useState, useEffect } from 'react';


import { newsletterApi } from '@/lib/api';
import { NewsletterSubscriber } from '@/types';
import { Search, Mail, Download, Trash2, Calendar, ChevronLeft, ChevronRight, Inbox, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const itemsPerPage = 20;

  useEffect(() => {
    loadSubscribers();
  }, []);

  const loadSubscribers = async () => {
    try {
      setLoading(true);
      setError(null);
      const subscribersData = await newsletterApi.getAllSubscribers();
      setSubscribers(subscribersData);
    } catch (error) {
      console.error('Error loading subscribers:', error);
      setError('Error al cargar los suscriptores. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, email: string) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar al suscriptor ${email}?`)) {
      return;
    }

    setDeletingId(id);
    try {
      await newsletterApi.deleteSubscriber(id);
      setSubscribers(subscribers.filter((sub) => sub.id !== id));
    } catch (error) {
      console.error('Error deleting subscriber:', error);
      alert('Error al eliminar el suscriptor. Por favor intenta de nuevo.');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredSubscribers = subscribers.filter((subscriber) => {
    const searchLower = searchTerm.toLowerCase();
    return subscriber.email.toLowerCase().includes(searchLower);
  });

  const totalPages = Math.ceil(filteredSubscribers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSubscribers = filteredSubscribers.slice(startIndex, endIndex);

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

  const exportToCSV = () => {
    const headers = ['Email', 'Fecha de Suscripción'];
    const rows = subscribers.map((sub) => [
      sub.email,
      formatDate(sub.subscribed_at),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `suscriptores_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            onClick={loadSubscribers}
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
      {/* Header mejorado */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Newsletter</h1>
          <p className="text-gray-500 font-medium italic">Gestiona tus suscriptores</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={exportToCSV}
            className="group bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-2xl flex items-center gap-3 shadow-xl transition-all hover:scale-105 active:scale-95"
          >
            <Download size={20} className="group-hover:bounce" />
            <span className="text-sm font-black uppercase tracking-widest">Exportar CSV</span>
          </button>
          <div className="bg-black text-white px-6 py-3 rounded-2xl flex items-center gap-3 shadow-xl">
            <Mail size={20} className="text-gray-400" />
            <span className="text-sm font-black uppercase tracking-widest">
              {filteredSubscribers.length} Suscriptores
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
            placeholder="Buscar por email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-14 pr-6 py-5 bg-white border-2 border-gray-100 focus:border-black rounded-[2rem] outline-none text-gray-800 placeholder-gray-400 shadow-sm transition-all font-bold"
          />
        </div>
      </div>

      {paginatedSubscribers.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-50 rounded-full mb-6">
            <Inbox size={40} className="text-gray-200" />
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">Sin suscriptores</h3>
          <p className="text-gray-500 font-medium italic">
            {searchTerm ? 'No hay emails que coincidan con la búsqueda' : 'Aún no tienes suscriptores en tu lista'}
          </p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Email del Suscriptor
                    </th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Fecha de Registro
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
                  {paginatedSubscribers.map((subscriber) => (
                    <tr key={subscriber.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gray-50 rounded-lg text-gray-400 group-hover:text-black transition-colors">
                            <Mail size={16} />
                          </div>
                          <span className="text-base font-black text-gray-900">{subscriber.email}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                          <Calendar size={12} />
                          {formatDate(subscriber.subscribed_at).split(' a ')[0]}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                          <CheckCircle2 size={10} />
                          Activo
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <button
                          onClick={() => handleDelete(subscriber.id, subscriber.email)}
                          disabled={deletingId === subscriber.id}
                          className="p-3 bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all shadow-sm group/del"
                          title="Eliminar suscriptor"
                        >
                          <Trash2 size={18} className="group-hover/del:scale-110 transition-transform" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                <div className="text-xs font-black text-gray-400 uppercase tracking-widest">
                  Mostrando {startIndex + 1}-{Math.min(endIndex, filteredSubscribers.length)} de {filteredSubscribers.length}
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
        </>
      )}
    </div>
  );
}

