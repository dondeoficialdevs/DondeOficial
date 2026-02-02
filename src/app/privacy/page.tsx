'use client';

import React from 'react';
import { useSettings } from '@/hooks/useSettings';

export default function PrivacyPage() {
    const { settings } = useSettings();

    return (
        <div className="min-h-screen bg-white py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-black uppercase tracking-tighter mb-8 italic">
                    Política de Privacidad<span className="text-orange-500 not-italic">.</span>
                </h1>
                <div className="prose prose-orange lg:prose-xl text-gray-600 space-y-6">
                    <p className="font-bold text-gray-900">En {settings.site_name}, su privacidad es nuestra prioridad.</p>
                    <p>Es política de {settings.site_name} respetar su privacidad con respecto a cualquier información que podamos recopilar de usted a través de nuestro sitio web.</p>
                    <h2 className="text-xl font-black uppercase text-gray-900 mt-8">Recopilación de Datos</h2>
                    <p>Solo solicitamos información personal cuando realmente la necesitamos para brindarle un servicio. Lo hacemos por medios justos y legales, con su conocimiento y consentimiento.</p>
                    <h2 className="text-xl font-black uppercase text-gray-900 mt-8">Seguridad</h2>
                    <p>Protegemos los datos almacenados dentro de medios comercialmente aceptables para evitar pérdidas y robos, así como el acceso, divulgación, copia, uso o modificación no autorizados.</p>
                </div>
            </div>
        </div>
    );
}
