'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { membershipApi, membershipRequestApi } from '@/lib/api';
import { MembershipPlan } from '@/types';
import { Check, ArrowLeft, Loader2, ShieldCheck, Zap, Star, Crown, Phone, Mail, Building } from 'lucide-react';
import Link from 'next/link';
import Script from 'next/script';

export default function CheckoutPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const planId = parseInt(params.id as string);
    const billingCycle = (searchParams.get('cycle') as 'monthly' | 'yearly') || 'monthly';

    const [plan, setPlan] = useState<MembershipPlan | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const [formData, setFormData] = useState({
        business_name: '',
        client_email: '',
        client_phone: ''
    });

    useEffect(() => {
        const loadPlan = async () => {
            try {
                const data = await membershipApi.getById(planId);
                setPlan(data);
            } catch (err) {
                console.error('Error loading plan:', err);
            } finally {
                setLoading(false);
            }
        };
        if (planId) loadPlan();
    }, [planId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!plan) return;

        setSubmitting(true);
        try {
            // 1. Crear el registro inicial en la DB para obtener el ID como referencia
            const request = await membershipRequestApi.create({
                ...formData,
                plan_id: plan.id,
                billing_cycle: billingCycle,
                total_price: billingCycle === 'monthly' ? plan.monthly_price : plan.yearly_price,
                status: 'pending'
            });

            // 2. Configurar y abrir el Widget de Wompi
            const checkout = (window as any).WidgetCheckout;
            if (!checkout) {
                throw new Error('El script de pagos no ha cargado completamente. Intenta en un momento.');
            }

            const amountInCents = Math.round((billingCycle === 'monthly' ? plan.monthly_price : plan.yearly_price) * 100);

            const configuration = {
                currency: 'COP',
                amountInCents: amountInCents,
                reference: request.id,
                publicKey: process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY || 'pub_test_Q5yS99s5iRST1LHn9S9S6S6S6S6S6S6S',
                redirectUrl: window.location.origin + '/checkout/success'
            };

            const handler = new checkout(configuration);

            handler.open((result: any) => {
                const transaction = result.transaction;
                if (transaction.status === 'APPROVED') {
                    setSubmitted(true);
                } else if (transaction.status === 'DECLINED') {
                    alert('El pago fue rechazado. Por favor intenta con otro medio de pago.');
                }
            });

        } catch (err) {
            console.error('Error processing checkout:', err);
            alert('Hubo un error al procesar tu solicitud. Por favor intenta de nuevo.');
        } finally {
            setSubmitting(false);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            maximumFractionDigits: 0
        }).format(price);
    };

    const getIcon = (level: number) => {
        switch (level) {
            case 1: return <ShieldCheck className="w-8 h-8 text-gray-400" />;
            case 2: return <Star className="w-8 h-8 text-orange-500" />;
            case 3: return <Crown className="w-8 h-8 text-orange-500" />;
            default: return <Zap className="w-8 h-8 text-orange-500" />;
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <Loader2 className="w-12 h-12 text-orange-600 animate-spin" />
        </div>
    );

    if (!plan) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4 text-center">
            <h1 className="text-2xl font-black mb-4">Plan no encontrado</h1>
            <Link href="/pricing" className="text-orange-600 font-bold flex items-center gap-2">
                <ArrowLeft size={20} /> Volver a los planes
            </Link>
        </div>
    );

    if (submitted) return (
        <div className="min-h-screen flex items-center justify-center bg-white p-4">
            <div className="max-w-md w-full bg-white rounded-[3rem] p-12 border border-gray-100 shadow-2xl text-center animate-in zoom-in duration-500">
                <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-8">
                    <Check size={48} className="text-orange-600" />
                </div>
                <h1 className="text-4xl font-black text-gray-900 mb-6 tracking-tighter uppercase">¡Pago Exitoso!</h1>
                <p className="text-gray-500 font-medium mb-10 leading-relaxed">
                    Hemos recibido tu pago para el plan <span className="text-black font-bold">{plan.name}</span>. Tu membresía se activará automáticamente en unos minutos.
                </p>
                <Link
                    href="/"
                    className="block w-full py-5 bg-black text-white rounded-2xl font-black uppercase tracking-widest hover:bg-orange-600 transition-colors shadow-xl"
                >
                    Ir al Directorio
                </Link>
            </div>
        </div>
    );

    const price = billingCycle === 'monthly' ? plan.monthly_price : plan.yearly_price;

    return (
        <>
            <Script
                src="https://checkout.wompi.co/widget.js"
                strategy="lazyOnload"
            />
            <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <Link href="/pricing" className="inline-flex items-center gap-2 text-gray-400 hover:text-black font-black uppercase tracking-widest text-xs mb-12 transition-colors">
                        <ArrowLeft size={16} /> Volver a planes
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                        {/* Form Side */}
                        <div className="bg-white rounded-[3rem] p-8 lg:p-12 border border-gray-100 shadow-2xl animate-in slide-in-from-left duration-700">
                            <h2 className="text-4xl font-black text-gray-900 mb-2 tracking-tighter uppercase">Finalizar Registro</h2>
                            <p className="text-gray-400 font-bold mb-10 uppercase tracking-widest text-xs">Completa tus datos para activar tu plan</p>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4">Nombre de tu Negocio</label>
                                    <div className="relative">
                                        <Building className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                                        <input
                                            required
                                            name="business_name"
                                            value={formData.business_name}
                                            onChange={handleInputChange}
                                            className="w-full pl-16 pr-8 py-5 bg-gray-50 border-2 border-transparent focus:border-black rounded-2xl outline-none transition-all font-bold text-gray-800 placeholder:text-gray-300"
                                            placeholder="EJ: RESTAURANTE GOURMET"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4">Correo Electrónico</label>
                                    <div className="relative">
                                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                                        <input
                                            required
                                            type="email"
                                            name="client_email"
                                            value={formData.client_email}
                                            onChange={handleInputChange}
                                            className="w-full pl-16 pr-8 py-5 bg-gray-50 border-2 border-transparent focus:border-black rounded-2xl outline-none transition-all font-bold text-gray-800 placeholder:text-gray-300"
                                            placeholder="ejemplo@correo.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4">Teléfono de Contacto</label>
                                    <div className="relative">
                                        <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                                        <input
                                            required
                                            type="tel"
                                            name="client_phone"
                                            value={formData.client_phone}
                                            onChange={handleInputChange}
                                            className="w-full pl-16 pr-8 py-5 bg-gray-50 border-2 border-transparent focus:border-black rounded-2xl outline-none transition-all font-bold text-gray-800 placeholder:text-gray-300"
                                            placeholder="+57 300 000 0000"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-6 bg-black text-white rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-orange-600 disabled:bg-gray-200 transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95"
                                >
                                    {submitting ? (
                                        <Loader2 className="animate-spin" />
                                    ) : (
                                        <>Pagar Ahora <Zap size={20} className="text-orange-400" /></>
                                    )}
                                </button>

                                <p className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    PAGO SEGURO PROCESADO POR WOMPI
                                </p>
                            </form>
                        </div>

                        {/* Summary Side */}
                        <div className="lg:sticky lg:top-32 space-y-8 animate-in slide-in-from-right duration-700">
                            <div className="bg-black rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
                                {/* Decorative background element */}
                                <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange-500 rounded-full blur-[100px] opacity-20"></div>

                                <div className="relative z-10">
                                    <div className="flex items-center gap-6 mb-10">
                                        <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-xl border border-white/10">
                                            {getIcon(plan.level)}
                                        </div>
                                        <div>
                                            <h3 className="text-3xl font-black uppercase tracking-tight">{plan.name}</h3>
                                            <span className="px-3 py-1 bg-orange-500 text-white text-[10px] font-black rounded-full uppercase tracking-tighter">
                                                {billingCycle === 'monthly' ? 'Pago Mensual' : 'Pago Anual (20% OFF)'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-10">
                                        {plan.features.map((feature, i) => (
                                            <div key={i} className="flex items-center gap-3">
                                                <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center shrink-0">
                                                    <Check size={12} className="text-white" />
                                                </div>
                                                <span className="text-sm font-bold opacity-80">{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-10 border-t border-white/10 flex justify-between items-end">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Total a pagar</p>
                                            <div className="text-5xl font-black tracking-tighter">
                                                {formatPrice(price)}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs font-black uppercase tracking-widest opacity-40">COP</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-orange-50 rounded-3xl p-8 border border-orange-100 flex items-start gap-5">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                                    <ShieldCheck className="text-orange-500" size={24} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black uppercase tracking-tight mb-1 text-orange-900">Compra Segura</h4>
                                    <p className="text-xs font-bold text-orange-700/70 leading-relaxed uppercase tracking-wide">
                                        Tu pago es procesado de forma segura. Aceptamos tarjetas de crédito, PSE, Nequi y efectivo.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
