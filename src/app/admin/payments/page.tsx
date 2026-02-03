'use client';

import { useState, useEffect } from 'react';
import { membershipRequestApi } from '@/lib/api';
import { MembershipRequest } from '@/types';
import {
    CreditCard,
    Clock,
    CheckCircle2,
    XCircle,
    MoreVertical,
    Phone,
    Mail,
    Building,
    Filter,
    Search,
    Loader2,
    Calendar,
    ArrowRight
} from 'lucide-react';

export default function PaymentsPage() {
    const [requests, setRequests] = useState<MembershipRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed' | 'cancelled'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        try {
            setLoading(true);
            const data = await membershipRequestApi.getAll();
            setRequests(data);
        } catch (err) {
            console.error('Error loading requests:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id: string, newStatus: 'pending' | 'completed' | 'cancelled') => {
        try {
            await membershipRequestApi.updateStatus(id, newStatus);
            setRequests(requests.map(r => r.id === id ? { ...r, status: newStatus } : r));
        } catch (err) {
            console.error('Error updating status:', err);
            alert('Error al actualizar el estado');
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            maximumFractionDigits: 0
        }).format(price);
    };

    const filteredRequests = requests.filter(request => {
        const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
        const matchesSearch =
            request.business_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            request.client_email.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-50 text-green-600 border-green-100';
            case 'cancelled': return 'bg-red-50 text-red-600 border-red-100';
            default: return 'bg-orange-50 text-orange-600 border-orange-100';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed': return <CheckCircle2 size={14} />;
            case 'cancelled': return <XCircle size={14} />;
            default: return <Clock size={14} />;
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="animate-spin text-orange-600" size={32} />
        </div>
    );

    return (
        <div className="space-y-10 pb-20">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-5xl font-black text-gray-900 tracking-tighter uppercase italic mb-2">
                        Pagos de <span className="text-orange-600">Membresía</span>
                    </h1>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Administra las solicitudes y activaciones de planes</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-white px-6 py-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
                            <CreditCard size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pendientes</p>
                            <p className="text-xl font-black text-black">
                                {requests.filter(r => r.status === 'pending').length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl flex flex-col md:flex-row gap-6 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar por negocio o email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-14 pr-6 py-4 bg-gray-50 border-2 border-transparent focus:border-black rounded-xl outline-none font-bold text-sm transition-all"
                    />
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="flex bg-gray-50 p-1.5 rounded-xl border-2 border-transparent">
                        {(['all', 'pending', 'completed', 'cancelled'] as const).map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`
                                    px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all
                                    ${statusFilter === status
                                        ? 'bg-black text-white shadow-lg'
                                        : 'text-gray-400 hover:text-black'}
                                `}
                            >
                                {status === 'all' ? 'Todos' :
                                    status === 'pending' ? 'Pendientes' :
                                        status === 'completed' ? 'Pagados' : 'Cancelados'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Grid of requests */}
            <div className="grid grid-cols-1 gap-6">
                {filteredRequests.length === 0 ? (
                    <div className="bg-white rounded-[2rem] border-2 border-dashed border-gray-100 p-20 text-center">
                        <CreditCard size={48} className="mx-auto text-gray-200 mb-6" />
                        <h3 className="text-xl font-black text-gray-400 uppercase tracking-widest">No hay solicitudes</h3>
                    </div>
                ) : (
                    filteredRequests.map((request) => (
                        <div
                            key={request.id}
                            className={`
                                bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden transition-all hover:shadow-2xl group
                                ${request.status === 'pending' ? 'border-l-8 border-l-orange-500' : ''}
                            `}
                        >
                            <div className="p-8 lg:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                                {/* Business & Client Info */}
                                <div className="flex-1 space-y-6">
                                    <div className="flex items-center justify-between lg:justify-start gap-4">
                                        <div className={`
                                            px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border flex items-center gap-2
                                            ${getStatusColor(request.status)}
                                        `}>
                                            {getStatusIcon(request.status)}
                                            {request.status === 'pending' ? 'Pendiente' : request.status === 'completed' ? 'Completado' : 'Cancelado'}
                                        </div>
                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                            <Calendar size={12} />
                                            {new Date(request.created_at).toLocaleDateString()}
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-6">
                                        <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center shrink-0 border border-orange-100">
                                            <Building className="text-orange-500" size={28} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-2 group-hover:text-orange-600 transition-colors">
                                                {request.business_name}
                                            </h3>
                                            <div className="flex flex-wrap gap-4 text-xs font-bold text-gray-400">
                                                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                                                    <Mail size={14} className="text-gray-300" />
                                                    {request.client_email}
                                                </div>
                                                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                                                    <Phone size={14} className="text-gray-300" />
                                                    {request.client_phone}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Plan Summary */}
                                <div className="bg-gray-50 rounded-[2rem] p-8 lg:w-96 border border-gray-100 flex items-center justify-between shadow-inner">
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Plan Escogido</p>
                                        <h4 className="text-xl font-black text-black uppercase tracking-tight">{request.plan?.name}</h4>
                                        <span className="inline-block px-3 py-1 bg-black text-[10px] text-white font-black rounded-full uppercase tracking-tighter">
                                            {request.billing_cycle === 'monthly' ? 'Mensual' : 'Anual'}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total COP</p>
                                        <p className="text-2xl font-black text-orange-600">{formatPrice(request.total_price)}</p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-row lg:flex-col gap-3">
                                    {request.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => handleStatusUpdate(request.id, 'completed')}
                                                className="flex-1 lg:w-48 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                                            >
                                                <CheckCircle2 size={16} /> Completar Pago
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(request.id, 'cancelled')}
                                                className="flex-1 lg:w-48 py-4 bg-white hover:bg-gray-50 text-gray-400 border border-gray-100 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all active:scale-95"
                                            >
                                                <XCircle size={16} className="inline mr-2" /> Cancelar
                                            </button>
                                        </>
                                    )}
                                    {request.status === 'completed' && (
                                        <button
                                            // Future action to link to business profile
                                            className="w-full lg:w-48 py-4 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                                        >
                                            <ArrowRight size={16} /> Ver Directorio
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
