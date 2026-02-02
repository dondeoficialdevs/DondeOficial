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
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
      {/* Header Section Premium */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 pb-10">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
              <Mail size={24} className="text-white" />
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">
              Newsletter<span className="text-blue-600 not-italic">.</span>
            </h1>
          </div>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.4em] ml-1">
            Subscriber List Database
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={exportToCSV}
            className="group bg-blue-600 hover:bg-black text-white px-8 py-4 rounded-[1.5rem] flex items-center gap-3 shadow-2xl shadow-blue-200 transition-all hover:-translate-y-1 active:scale-95 border-b-4 border-blue-800 hover:border-black"
          >
            <Download size={20} className="group-hover:animate-bounce" />
            <span className="text-xs font-black uppercase tracking-[0.1em]">Export CSV</span>
          </button>

          <div className="bg-white px-6 py-4 rounded-[1.5rem] border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-black uppercase tracking-widest text-gray-500">
              {filteredSubscribers.length} Global Members
            </span>
          </div>
        </div>
      </div>

      {/* Advanced Search Bar */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-8 flex items-center pointer-events-none text-gray-300 group-focus-within:text-black transition-colors">
          <Search size={22} strokeWidth={3} />
        </div>
        <input
          type="text"
          placeholder="Lookup by email hash..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full pl-16 pr-8 py-7 bg-white border-2 border-gray-50 focus:border-black rounded-[2.5rem] outline-none text-gray-900 placeholder-gray-300 shadow-sm transition-all font-black text-lg"
        />
      </div>

      {paginatedSubscribers.length === 0 ? (
        <div className="py-32 flex flex-col items-center justify-center bg-white rounded-[3.5rem] border-2 border-dashed border-gray-100 italic">
          <Inbox size={64} className="text-gray-100 mb-6" />
          <h3 className="text-2xl font-black text-gray-300 uppercase tracking-tighter">Null Data</h3>
          <p className="text-gray-400 font-bold mt-2">No se encuentran coincidencias en el sistema</p>
        </div>
      ) : (
        <div className="bg-white rounded-[3.5rem] border border-gray-100 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-10 py-7 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">
                    MEMBER IDENTIFIER
                  </th>
                  <th className="px-10 py-7 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">
                    REGISTRATION DATE
                  </th>
                  <th className="px-10 py-7 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">
                    STATUS
                  </th>
                  <th className="px-10 py-7 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">
                    OPERATIONS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginatedSubscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="hover:bg-gray-50/80 transition-all group">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:scale-110 group-hover:bg-white group-hover:shadow-xl transition-all duration-500">
                          <Mail size={18} strokeWidth={2.5} />
                        </div>
                        <span className="text-lg font-black text-gray-900 group-hover:text-blue-600 transition-colors">
                          {subscriber.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Calendar size={14} strokeWidth={2.5} />
                        {formatDate(subscriber.subscribed_at).split(' a ')[0]}
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-50 text-green-700 rounded-full text-[10px] font-black uppercase tracking-[0.1em] border border-green-100">
                        <CheckCircle2 size={12} strokeWidth={3} />
                        Active
                      </span>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <button
                        onClick={() => handleDelete(subscriber.id, subscriber.email)}
                        disabled={deletingId === subscriber.id}
                        className="w-12 h-12 bg-white border border-gray-100 text-gray-400 hover:text-red-500 hover:border-red-500 hover:bg-red-50 rounded-2xl flex items-center justify-center transition-all shadow-sm hover:shadow-red-100 group/btn"
                      >
                        <Trash2 size={20} className="group-hover/btn:rotate-12 transition-transform" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Refined */}
          {totalPages > 1 && (
            <div className="px-10 py-8 bg-gray-50/30 flex items-center justify-between border-t border-gray-50">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                {startIndex + 1}-{Math.min(endIndex, filteredSubscribers.length)} OF {filteredSubscribers.length}
              </span>
              <div className="flex gap-4">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-3 bg-white border border-gray-100 rounded-xl hover:border-black transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="px-5 flex items-center text-sm font-black text-black bg-white border border-gray-100 rounded-xl shadow-sm tracking-widest">
                  {currentPage} / {totalPages}
                </div>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-3 bg-white border border-gray-100 rounded-xl hover:border-black transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
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

