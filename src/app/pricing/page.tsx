'use client';

import { useState, useEffect } from 'react';
import { membershipApi } from '@/lib/api';
import { MembershipPlan } from '@/types';
import { Check, Crown, Zap, Rocket, Star, Shield, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
    const [plans, setPlans] = useState<MembershipPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

    useEffect(() => {
        const loadPlans = async () => {
            try {
                const data = await membershipApi.getAll();
                setPlans(data.filter(p => p.active));
            } catch (err) {
                console.error('Error loading plans:', err);
            } finally {
                setLoading(false);
            }
        };
        loadPlans();
    }, []);

    const getIcon = (level: number) => {
        switch (level) {
            case 1: return <Shield className="w-10 h-10 text-gray-400" />;
            case 2: return <Star className="w-10 h-10 text-orange-500" />;
            case 3: return <Crown className="w-10 h-10 text-orange-500" />;
            default: return <Zap className="w-10 h-10 text-orange-500" />;
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            maximumFractionDigits: 0
        }).format(price);
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <Loader2 className="w-12 h-12 text-orange-600 animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative pt-24 pb-20 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-linear-to-b from-orange-50 to-transparent rounded-full blur-3xl -z-10 opacity-40"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8 animate-in fade-in slide-in-from-bottom duration-700">
                        <Zap size={14} className="text-orange-500" />
                        Impulsa tu Negocio
                    </div>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 mb-8 tracking-tighter leading-[0.9] animate-in fade-in slide-in-from-bottom duration-700 delay-100 uppercase">
                        Planes de <span className="text-orange-600">Publicidad</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-500 max-w-3xl mx-auto mb-12 font-medium leading-relaxed animate-in fade-in slide-in-from-bottom duration-700 delay-200">
                        Elige el nivel de visibilidad perfecto para tu negocio y empieza a recibir más clientes hoy mismo.
                    </p>

                    {/* Billing Toggle */}
                    <div className="flex items-center justify-center gap-6 mb-16 animate-in fade-in slide-in-from-bottom duration-700 delay-300">
                        <span className={`text-sm font-black uppercase tracking-widest ${billingCycle === 'monthly' ? 'text-black' : 'text-gray-400'}`}>Mensual</span>
                        <button
                            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                            className="relative w-16 h-8 bg-gray-100 rounded-full border border-gray-200 p-1 transition-all duration-300"
                        >
                            <div className={`w-6 h-6 bg-black rounded-full transition-transform duration-300 shadow-lg ${billingCycle === 'yearly' ? 'translate-x-8' : 'translate-x-0'}`}></div>
                        </button>
                        <div className="flex items-center gap-3">
                            <span className={`text-sm font-black uppercase tracking-widest ${billingCycle === 'yearly' ? 'text-black' : 'text-gray-400'}`}>Anual</span>
                            <span className="px-3 py-1 bg-orange-100 text-orange-600 text-[10px] font-black rounded-full uppercase tracking-tighter border border-orange-200">Ahorra 20%</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="pb-32 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 lg:gap-8">
                    {plans.map((plan, index) => (
                        <div
                            key={plan.id}
                            className={`
                relative flex flex-col p-8 lg:p-12 rounded-[3.5rem] border transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl group
                ${plan.is_popular ? 'bg-black text-white border-black scale-105 z-10' : 'bg-white text-gray-900 border-gray-100'}
                animate-in fade-in slide-in-from-bottom duration-700
              `}
                            style={{ animationDelay: `${(index + 4) * 100}ms` }}
                        >
                            {plan.badge_text && (
                                <div className={`
                  absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl
                  ${plan.is_popular ? 'bg-orange-500 text-white' : 'bg-white text-black border border-gray-100'}
                `}>
                                    {plan.badge_text}
                                </div>
                            )}

                            <div className="mb-10 text-center">
                                <div className={`
                  mb-8 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6
                  ${plan.is_popular ? 'bg-white/10' : 'bg-orange-50 shadow-inner'}
                `}>
                                    {getIcon(plan.level)}
                                </div>
                                <h3 className="text-3xl font-black uppercase tracking-tight mb-4">{plan.name}</h3>
                                <p className={`text-sm font-medium leading-relaxed opacity-70 italic ${plan.is_popular ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {plan.description}
                                </p>
                            </div>

                            <div className="mb-10 text-center">
                                <div className="flex flex-col items-center gap-1">
                                    <span className="text-5xl font-black tracking-tighter">
                                        {formatPrice(billingCycle === 'monthly' ? plan.monthly_price : plan.yearly_price)}
                                    </span>
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                                        COP / {billingCycle === 'monthly' ? 'mes' : 'año'}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4 mb-12 flex-grow">
                                {plan.features.map((feature, i) => (
                                    <div key={i} className="flex items-start gap-4 animate-in fade-in duration-500" style={{ animationDelay: `${(i + 5) * 150}ms` }}>
                                        <div className={`mt-1 p-0.5 rounded-full ${plan.is_popular ? 'bg-orange-500' : 'bg-black'} shrink-0`}>
                                            <Check size={14} className="text-white" />
                                        </div>
                                        <span className="text-sm font-bold opacity-90">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <Link
                                href={`/checkout/${plan.id}?cycle=${billingCycle}`}
                                className={`
                  w-full py-5 rounded-[2rem] font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all duration-300
                  ${plan.is_popular
                                        ? 'bg-orange-600 text-white hover:bg-orange-500 shadow-[0_10px_20px_rgba(234,88,12,0.3)]'
                                        : 'bg-black text-white hover:bg-orange-600 shadow-xl'
                                    }
                `}
                            >
                                Empezar Ahora
                                <ArrowRight size={18} />
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* Comparison Section (Simplified) */}
            <section className="py-32 bg-gray-50 border-y border-gray-100">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-4xl font-black mb-16 uppercase tracking-tight">¿Por qué anunciarte con nosotros?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
                        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 hover:border-orange-200 transition-colors">
                            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-6">
                                <Rocket size={24} />
                            </div>
                            <h4 className="text-xl font-black mb-4 uppercase">Visibilidad Masiva</h4>
                            <p className="text-gray-500 font-medium italic leading-relaxed">Tu negocio llegará a miles de personas que buscan servicios en tu zona diariamente.</p>
                        </div>
                        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 hover:border-orange-200 transition-colors">
                            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-6">
                                <Shield size={24} />
                            </div>
                            <h4 className="text-xl font-black mb-4 uppercase">Confianza Total</h4>
                            <p className="text-gray-500 font-medium italic leading-relaxed">Un perfil en nuestro directorio otorga autoridad y confianza a tus clientes potenciales.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer CTA */}
            <section className="py-24 bg-black text-white text-center overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(234,88,12,0.15)_0%,_transparent_70%)]"></div>
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter uppercase italic">¿Listo para <span className="text-orange-500">crecer?</span></h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 font-medium">No esperes más para darle a su negocio la importancia que se merece.</p>
                    <button className="px-12 py-6 bg-orange-600 text-white font-black uppercase tracking-widest rounded-full hover:scale-110 active:scale-95 transition-all shadow-2xl hover:bg-orange-500">
                        Contactar Soporte
                    </button>
                </div>
            </section>
        </div>
    );
}
