'use client';
import { useState, useEffect } from 'react';


import { leadsApi } from '@/lib/api';
import { Lead } from '@/types';
import { Search, Mail, User, MessageSquare, Calendar, ChevronLeft, ChevronRight, Eye, X, Inbox } from 'lucide-react';

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
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-10 animate-in fade-in duration-700 pb-10">
      {/* Header Section Premium */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 pb-6 sm:pb-10">
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black rounded-xl sm:rounded-2xl flex items-center justify-center shadow-2xl rotate-3 group hover:rotate-0 transition-transform duration-500">
              <Inbox size={20} className="text-white sm:size-6" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tighter uppercase italic">
              Leads<span className="text-blue-600 not-italic">.</span>
            </h1>
          </div>
          <p className="text-[10px] sm:text-sm font-bold text-gray-400 uppercase tracking-[0.2em] sm:tracking-[0.4em] ml-1">
            Incoming Communication Protocol
          </p>
        </div>

        <div className="bg-white px-4 sm:px-6 py-3 sm:py-4 rounded-2xl sm:rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-3 sm:gap-4 self-start md:self-auto">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-gray-500">
            {filteredLeads.length} Total Messages
          </span>
        </div>
      </div>

      {/* Advanced Search Bar */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-6 sm:pl-8 flex items-center pointer-events-none text-gray-300 group-focus-within:text-black transition-colors">
          <Search size={20} className="sm:size-[22px]" strokeWidth={3} />
        </div>
        <input
          type="text"
          placeholder="Filter by name, email..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full pl-14 sm:pl-16 pr-6 sm:pr-8 py-5 sm:py-7 bg-white border-2 border-gray-50 focus:border-black rounded-[2rem] sm:rounded-[2.5rem] outline-none text-gray-900 placeholder-gray-300 shadow-sm transition-all font-black text-base sm:text-lg"
        />
      </div>

      {paginatedLeads.length === 0 ? (
        <div className="py-20 sm:py-32 flex flex-col items-center justify-center bg-white rounded-[2.5rem] sm:rounded-[3.5rem] border-2 border-dashed border-gray-100 italic transition-all hover:border-gray-200">
          <Inbox size={48} className="text-gray-100 mb-4 sm:size-16 sm:mb-6" />
          <h3 className="text-xl sm:text-2xl font-black text-gray-300 uppercase tracking-tighter">Buzón en Espera</h3>
          <p className="text-xs sm:text-gray-400 font-bold mt-2">No se han detectado transmisiones entrantes</p>
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] sm:rounded-[3.5rem] border border-gray-100 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full border-collapse min-w-[800px] lg:min-w-full">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 md:px-10 py-5 sm:py-7 text-left text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">
                    SENDER PROFILE
                  </th>
                  <th className="px-6 md:px-10 py-5 sm:py-7 text-left text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">
                    SUBJECT CODE
                  </th>
                  <th className="px-6 md:px-10 py-5 sm:py-7 text-left text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">
                    TIMESTAMP
                  </th>
                  <th className="px-6 md:px-10 py-5 sm:py-7 text-right text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginatedLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50/80 transition-all group">
                    <td className="px-6 md:px-10 py-6 sm:py-8">
                      <div className="flex flex-col">
                        <span className="text-base sm:text-lg font-black text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
                          {lead.full_name}
                        </span>
                        <span className="text-[10px] sm:text-xs font-bold text-gray-400 lowercase tracking-tight flex items-center gap-2">
                          <Mail size={10} className="text-gray-300 sm:size-3" />
                          <span className="truncate max-w-[150px] sm:max-w-none">{lead.email}</span>
                        </span>
                      </div>
                    </td>
                    <td className="px-6 md:px-10 py-6 sm:py-8">
                      <div className="text-xs sm:text-sm font-bold text-gray-600 italic line-clamp-1 max-w-[200px] lg:max-w-xs">
                        "{lead.subject || 'N/A'}"
                      </div>
                    </td>
                    <td className="px-6 md:px-10 py-6 sm:py-8">
                      <div className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Calendar size={12} className="sm:size-3.5" strokeWidth={2.5} />
                        {formatDate(lead.created_at).split(' a ')[0]}
                      </div>
                    </td>
                    <td className="px-6 md:px-10 py-6 sm:py-8 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2.5 sm:py-3 bg-black text-white hover:bg-blue-600 rounded-xl sm:rounded-2xl transition-all shadow-xl hover:shadow-blue-200 active:scale-95 group/btn"
                      >
                        <Eye size={14} className="sm:size-4 group-hover/btn:scale-125 transition-transform" />
                        <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em]">Open</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Refined */}
          {totalPages > 1 && (
            <div className="px-6 sm:px-10 py-6 sm:py-8 bg-gray-50/30 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-50">
              <span className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                {startIndex + 1}-{Math.min(endIndex, filteredLeads.length)} OF {filteredLeads.length}
              </span>
              <div className="flex gap-2 sm:gap-4">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2.5 sm:p-3 bg-white border border-gray-100 rounded-xl hover:border-black transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                >
                  <ChevronLeft size={18} className="sm:size-5" />
                </button>
                <div className="px-4 sm:px-5 flex items-center text-xs sm:text-sm font-black text-black bg-white border border-gray-100 rounded-xl shadow-sm tracking-widest">
                  {currentPage} / {totalPages}
                </div>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2.5 sm:p-3 bg-white border border-gray-100 rounded-xl hover:border-black transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                >
                  <ChevronRight size={18} className="sm:size-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal Detail Premium */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xl flex items-center justify-center z-[200] p-4 sm:p-6 animate-in fade-in duration-500 overflow-y-auto">
          <div className="bg-white rounded-[2.5rem] sm:rounded-[4rem] max-w-3xl w-full shadow-[0_40px_100px_-20px_rgba(0,0,0,0.4)] overflow-hidden relative group/modal my-auto">
            {/* Close Button UI */}
            <button
              onClick={() => setSelectedLead(null)}
              className="absolute top-6 right-6 sm:top-10 sm:right-10 w-10 h-10 sm:w-12 sm:h-12 bg-gray-50 hover:bg-black hover:text-white rounded-full flex items-center justify-center transition-all duration-500 z-10 hover:rotate-90 group-hover/modal:scale-110 shadow-sm"
            >
              <X size={20} className="sm:size-6" />
            </button>

            <div className="flex flex-col md:flex-row h-full">
              {/* Profile Sidebar */}
              <div className="md:w-1/3 bg-gray-50/50 p-8 sm:p-12 border-b md:border-b-0 md:border-r border-gray-100 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-black rounded-[1.8rem] sm:rounded-[2.5rem] flex items-center justify-center mb-4 sm:mb-6 shadow-2xl transition-transform hover:scale-110 duration-500">
                  <User size={30} className="text-white sm:size-10" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tighter uppercase mb-2 break-all">{selectedLead.full_name}</h3>
                <p className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 sm:mb-6 lowercase">{selectedLead.email}</p>
                <div className="h-px w-12 bg-gray-200"></div>
              </div>

              {/* Content Main */}
              <div className="flex-1 p-8 sm:p-12 space-y-6 sm:space-y-10 overflow-y-auto max-h-[60vh] md:max-h-[80vh] custom-scrollbar">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                  <div className="space-y-1">
                    <p className="text-[8px] sm:text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Subject</p>
                    <p className="text-xs sm:text-sm font-bold text-gray-900 italic">"{selectedLead.subject || 'Sin Asunto'}"</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[8px] sm:text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Received On</p>
                    <p className="text-xs sm:text-sm font-bold text-gray-900">{formatDate(selectedLead.created_at)}</p>
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-3">
                    <MessageSquare size={14} className="text-blue-500 sm:size-4" />
                    <p className="text-[8px] sm:text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Message Content</p>
                  </div>
                  <div className="bg-gray-50 rounded-[1.8rem] sm:rounded-[2.5rem] p-6 sm:p-10 border border-gray-100 transition-all hover:bg-white hover:shadow-xl group/msg">
                    <p className="text-sm sm:text-base text-gray-700 font-medium leading-[1.8] sm:leading-[2] whitespace-pre-wrap italic">
                      "{selectedLead.message}"
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
                  <a
                    href={`mailto:${selectedLead.email}`}
                    className="flex-1 bg-black text-white py-4 sm:py-6 rounded-2xl sm:rounded-3xl font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] text-center shadow-2xl hover:bg-blue-600 transition-all hover:-translate-y-1"
                  >
                    Reply Protocol
                  </a>
                  <button
                    onClick={() => setSelectedLead(null)}
                    className="px-6 sm:px-10 py-4 sm:py-6 bg-gray-100 text-gray-400 hover:text-black rounded-2xl sm:rounded-3xl font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] transition-all"
                  >
                    Exit
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

