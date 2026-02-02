'use client';

import React from 'react';
import { useSettings } from '@/hooks/useSettings';

export default function TermsPage() {
    const { settings } = useSettings();

    return (
        <div className="min-h-screen bg-white py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-black uppercase tracking-tighter mb-8 italic">
                    Términos y Condiciones<span className="text-orange-500 not-italic">.</span>
                </h1>
                <div className="prose prose-orange lg:prose-xl text-gray-600 space-y-6">
                    <p className="font-bold text-gray-900">Bienvenido a {settings.site_name}.</p>
                    <p>Al acceder a nuestro sitio web, usted acepta cumplir con estos términos de servicio, todas las leyes y regulaciones aplicables y acepta que es responsable del cumplimiento de cualquier ley local aplicable.</p>
                    <h2 className="text-xl font-black uppercase text-gray-900 mt-8">Uso del Sitio</h2>
                    <p>Se otorga permiso para descargar temporalmente una copia de los materiales (información o software) en el sitio web de {settings.site_name} para visualización transitoria personal y no comercial solamente.</p>
                    <h2 className="text-xl font-black uppercase text-gray-900 mt-8">Responsabilidad</h2>
                    <p>Los materiales en el sitio web de {settings.site_name} se proporcionan &quot;tal cual&quot;. DondeOficial no ofrece garantías, expresas o implícitas, y por la presente renuncia y niega todas las demás garantías.</p>
                </div>
            </div>
        </div>
    );
}
