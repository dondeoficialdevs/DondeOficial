'use client';
import { useState, useEffect } from 'react';


import { leadsApi } from '@/lib/api';
import { Lead } from '@/types';
import { Search, Mail, User, MessageSquare, Calendar, ChevronLeft, ChevronRight, Eye, X, Filter, Quote, ExternalLink, Inbox } from 'lucide-react';

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      setLoading(true);
      setError(null);
      const leadsData = await leadsApi.getAll();
      setLeads(leadsData);
    } catch (error) {
      console.error('Error loading leads:', error);
      setError('Error al cargar los leads. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      lead.full_name.toLowerCase().includes(searchLower) ||
      lead.email.toLowerCase().includes(searchLower) ||
      lead.subject.toLowerCase().includes(searchLower) ||
      lead.message.toLowerCase().includes(searchLower)
    );
  });

  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedLeads = filteredLeads.slice(startIndex, endIndex);

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
            onClick={loadLeads}
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
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Leads</h1>
          <p className="text-gray-500 font-medium italic">Gestión de mensajes y contactos</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-black text-white px-6 py-3 rounded-2xl flex items-center gap-3 shadow-xl">
            <Inbox size={20} className="text-gray-400" />
            <span className="text-sm font-black uppercase tracking-widest">
              {filteredLeads.length} Mensaje{filteredLeads.length !== 1 ? 's' : ''}
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
            placeholder="Buscar por nombre, email, asunto o contenido..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-14 pr-6 py-5 bg-white border-2 border-gray-100 focus:border-black rounded-[2rem] outline-none text-gray-800 placeholder-gray-400 shadow-sm transition-all font-bold"
          />
        </div>
      </div>

      {paginatedLeads.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-50 rounded-full mb-6">
            <Inbox size={40} className="text-gray-200" />
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">Buzón vacío</h3>
          <p className="text-gray-500 font-medium italic">
            {searchTerm ? 'No hay mensajes que coincidan con la búsqueda' : 'No has recibido mensajes todavía'}
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
                      Contacto
                    </th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Asunto
                    </th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Fecha
                    </th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginatedLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-base font-black text-gray-900">{lead.full_name}</span>
                          <span className="text-xs font-medium text-gray-400 flex items-center gap-1.5 mt-1 lowercase">
                            <Mail size={12} />
                            {lead.email}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-sm font-bold text-gray-600 max-w-xs truncate italic" title={lead.subject}>
                          "{lead.subject || 'Sin asunto'}"
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                          <Calendar size={12} />
                          {formatDate(lead.created_at).split(' a ')[0]}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="p-3 bg-gray-50 text-black hover:bg-black hover:text-white rounded-xl transition-all shadow-sm flex items-center gap-2 group/btn"
                        >
                          <Eye size={18} className="group-hover/btn:scale-110 transition-transform" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Leer</span>
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
                  Mostrando {startIndex + 1}-{Math.min(endIndex, filteredLeads.length)} de {filteredLeads.length}
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

      {/* Modal de detalles Premium */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] max-w-2xl w-full shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="relative">
              {/* Header decorativo */}
              <div className="h-32 bg-black flex items-center px-10">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white flex items-center justify-center rounded-2xl shadow-xl">
                    <User size={32} className="text-black" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">{selectedLead.full_name}</h3>
                    <p className="text-gray-400 text-xs font-black uppercase tracking-widest flex items-center gap-2">
                      <Mail size={12} />
                      {selectedLead.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-10 space-y-8">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Asunto</div>
                    <div className="text-sm font-bold text-gray-900">{selectedLead.subject || 'Sin asunto'}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fecha de Envío</div>
                    <div className="text-sm font-bold text-gray-900">{formatDate(selectedLead.created_at)}</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <Quote size={12} />
                    Mensaje
                  </div>
                  <div className="bg-gray-50 rounded-[2rem] p-8 border border-gray-100 italic">
                    <p className="text-gray-700 font-medium leading-relaxed whitespace-pre-wrap">
                      "{selectedLead.message}"
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <a
                    href={`mailto:${selectedLead.email}`}
                    className="flex-1 bg-black text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-center hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
                  >
                    Responder por Email
                  </a>
                  <button
                    onClick={() => setSelectedLead(null)}
                    className="px-10 py-5 bg-gray-100 text-gray-400 hover:text-black rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

