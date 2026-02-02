'use client';

import { useState, useEffect } from 'react';
import { businessApi } from '@/lib/api';
import { Business, BusinessImage } from '@/types';
import { useRouter } from 'next/navigation';
import { CheckCircle2, XCircle, Clock, Image as ImageIcon, MapPin, Phone, Mail, Globe, ExternalLink, Calendar, ChevronRight, X, AlertCircle, ShieldCheck } from 'lucide-react';

export default function VerificationPage() {
  const router = useRouter();
  const [pendingBusinesses, setPendingBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [expandedBusiness, setExpandedBusiness] = useState<number | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    loadPendingBusinesses();
  }, []);

  const loadPendingBusinesses = async () => {
    try {
      setLoading(true);
      setError(null);
      const businesses = await businessApi.getPending();
      setPendingBusinesses(businesses);
    } catch (error) {
      console.error('Error loading pending businesses:', error);
      setError('Error al cargar los negocios pendientes. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas aprobar este negocio? Será publicado en el directorio.')) {
      return;
    }

    try {
      setProcessingId(id);
      await businessApi.approve(id);
      await loadPendingBusinesses();
    } catch (error) {
      console.error('Error approving business:', error);
      const errorMessage = error instanceof Error
        ? error.message
        : 'Error al aprobar el negocio. Por favor intenta de nuevo.';
      alert(errorMessage);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: number) => {
    const reason = prompt('¿Por qué rechazas este negocio? (Opcional)');

    if (reason === null) return;
    if (!confirm('¿Estás seguro de que deseas rechazar este negocio?')) return;

    try {
      setProcessingId(id);
      await businessApi.reject(id);
      await loadPendingBusinesses();
    } catch (error) {
      console.error('Error rejecting business:', error);
      const errorMessage = error instanceof Error
        ? error.message
        : 'Error al rechazar el negocio. Por favor intenta de nuevo.';
      alert(errorMessage);
    } finally {
      setProcessingId(null);
    }
  };

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
            onClick={loadPendingBusinesses}
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
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Verificación</h1>
          <p className="text-gray-500 font-medium italic">Revisa y aprueba negocios pendientes</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-orange-50 border-2 border-orange-100 text-orange-700 px-6 py-3 rounded-2xl flex items-center gap-3 shadow-sm">
            <Clock size={20} />
            <span className="text-sm font-black uppercase tracking-widest">
              {pendingBusinesses.length} Pendiente{pendingBusinesses.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      {pendingBusinesses.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-50 rounded-full mb-6">
            <CheckCircle2 size={40} className="text-green-600" />
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">¡Todo al día!</h3>
          <p className="text-gray-500 font-medium italic">No hay negocios pendientes de verificación</p>
        </div>
      ) : (
        <div className="space-y-8">
          {pendingBusinesses.map((business) => (
            <div
              key={business.id}
              className="bg-white border border-gray-100 rounded-[2.5rem] shadow-2xl overflow-hidden hover:border-black transition-all duration-500"
            >
              <div className="p-8 sm:p-10">
                <div className="flex flex-col xl:flex-row gap-10">
                  {/* Galería de imágenes Premium */}
                  <div className="w-full xl:w-96 flex-shrink-0">
                    {(() => {
                      const businessImages: BusinessImage[] = business.images || (business as any).business_images || [];
                      return businessImages.length > 0 ? (
                        <div className="space-y-4">
                          <div className="relative group rounded-3xl overflow-hidden border-2 border-gray-50 shadow-inner aspect-square xl:aspect-auto xl:h-64">
                            <img
                              src={businessImages[selectedImageIndex[business.id] || 0]?.image_url || businessImages[0]?.image_url || '/placeholder-image.png'}
                              alt={business.name}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute top-4 right-4 bg-orange-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-xl uppercase tracking-widest">
                              Pendiente
                            </div>
                            {businessImages.length > 1 && (
                              <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest">
                                {selectedImageIndex[business.id] !== undefined ? selectedImageIndex[business.id] + 1 : 1} / {businessImages.length}
                              </div>
                            )}
                          </div>
                          
                          {businessImages.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                              {businessImages.map((image: BusinessImage, idx: number) => (
                                <button
                                  key={image.id}
                                  onClick={() => setSelectedImageIndex({ ...selectedImageIndex, [business.id]: idx })}
                                  className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${(selectedImageIndex[business.id] || 0) === idx
                                    ? 'border-black scale-95'
                                    : 'border-transparent opacity-60 hover:opacity-100 font-bold uppercase tracking-widest px-2'
                                    }`}
                                >
                                  <img
                                    src={image.image_url}
                                    alt={`${business.name} - Imagen ${idx + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="relative w-full h-64 flex flex-col items-center justify-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 group">
                           <ImageIcon size={48} className="text-gray-300 group-hover:text-black transition-colors mb-4" />
                           <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Sin imágenes</p>
                           <div className="absolute top-4 right-4 bg-orange-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-xl uppercase tracking-widest">
                              Pendiente
                            </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Información del negocio */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-8">
                      <div>
                        <h3 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">{business.name}</h3>
                        <div className="flex flex-wrap gap-2">
                          {business.category_name && (
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 text-gray-600 text-[10px] font-black uppercase tracking-widest rounded-xl">
                              <ShieldCheck size={14} className="text-black" />
                              {business.category_name}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="hidden sm:block text-right">
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Registrado</div>
                        <div className="text-xs font-bold text-gray-900 flex items-center gap-2 justify-end">
                          <Calendar size={14} />
                          {formatDate(business.created_at).split(' a ')[0]}
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-3xl p-6 sm:p-8 mb-8 border border-gray-100/50">
                      <p className={`text-gray-700 font-medium leading-relaxed italic ${expandedBusiness === business.id ? '' : 'line-clamp-4'}`}>
                        "{business.description}"
                      </p>
                      {business.description && business.description.length > 200 && (
                        <button
                          onClick={() => setExpandedBusiness(expandedBusiness === business.id ? null : business.id)}
                          className="mt-4 text-[10px] font-black text-black uppercase tracking-widest hover:gap-2 transition-all flex items-center gap-1"
                        >
                          {expandedBusiness === business.id ? 'Ver menos' : 'Leer descripción completa'}
                          <ChevronRight size={12} strokeWidth={3} />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-10 px-2">
                      <div className="space-y-4">
                        {business.address && (
                          <div className="flex items-start gap-4">
                            <div className="p-2 bg-white rounded-lg shadow-sm text-gray-400 group-hover:text-black transition-colors">
                              <MapPin size={16} />
                            </div>
                            <span className="text-sm font-bold text-gray-600 break-words leading-tight mt-1">{business.address}</span>
                          </div>
                        )}
                        {business.phone && (
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-white rounded-lg shadow-sm text-gray-400 group-hover:text-black transition-colors">
                              <Phone size={16} />
                            </div>
                            <a href={`tel:${business.phone}`} className="text-sm font-bold text-gray-900 group-hover:text-black transition-colors">
                              {business.phone}
                            </a>
                          </div>
                        )}
                      </div>
                      <div className="space-y-4">
                        {business.email && (
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-white rounded-lg shadow-sm text-gray-400 group-hover:text-black transition-colors">
                              <Mail size={16} />
                            </div>
                            <a href={`mailto:${business.email}`} className="text-sm font-bold text-gray-900 group-hover:text-black transition-colors break-all">
                              {business.email}
                            </a>
                          </div>
                        )}
                        {business.website && (
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-white rounded-lg shadow-sm text-gray-400 group-hover:text-black transition-colors">
                              <Globe size={16} />
                            </div>
                            <a href={business.website} target="_blank" rel="noopener noreferrer" className="text-sm font-black text-black flex items-center gap-1 hover:gap-2 transition-all">
                              Ir al Sitio Web
                              <ExternalLink size={12} strokeWidth={3} />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Acciones Premium */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 pt-10 border-t border-gray-100">
                      <button
                        onClick={() => handleApprove(business.id)}
                        disabled={processingId === business.id}
                        className="w-full sm:flex-1 py-5 bg-black text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3 group/btn"
                      >
                        {processingId === business.id ? (
                          <div className="flex items-center gap-3">
                            <Clock size={14} className="animate-spin" />
                            <span>Procesando...</span>
                          </div>
                        ) : (
                          <>
                            <CheckCircle2 size={18} className="group-hover/btn:scale-110 transition-transform" />
                            <span>Aprobar y Publicar</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleReject(business.id)}
                        disabled={processingId === business.id}
                        className="w-full sm:w-auto px-10 py-5 bg-gray-100 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 group/reject"
                      >
                        <XCircle size={18} className="group-hover/reject:scale-110 transition-transform" />
                        <span>Rechazar</span>
                      </button>
                      
                      <button
                        onClick={() => router.push(`/businesses/${business.id}`)}
                        className="w-full sm:w-auto p-5 bg-gray-50 text-gray-400 hover:text-black hover:bg-white border border-transparent hover:border-gray-200 rounded-[1.5rem] transition-all flex items-center justify-center"
                        title="Ver detalles"
                      >
                        <ExternalLink size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
