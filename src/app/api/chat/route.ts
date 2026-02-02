import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const GROQ_API_KEY = process.env.GROQ_API_KEY;

export async function POST(req: NextRequest) {
    try {
        const { message, history } = await req.json();

        if (!GROQ_API_KEY) {
            return NextResponse.json({ error: 'API Key not configured' }, { status: 500 });
        }

        // 1. Obtener contexto de la base de datos (Búsqueda semántica simple por ahora usando ILIKE)
        // En un futuro se podría usar pgvector para búsqueda semántica real
        const { data: businesses, error: bError } = await supabase
            .from('businesses')
            .select('name, description, address, phone, email')
            .eq('status', 'approved')
            .limit(10);

        const { data: categories, error: cError } = await supabase
            .from('categories')
            .select('name');

        if (bError) console.error('Supabase Businesses Error:', bError);
        if (cError) console.error('Supabase Categories Error:', cError);

        console.log(`AI Context: Found ${businesses?.length || 0} businesses and ${categories?.length || 0} categories.`);

        const context = `
    Información del Directorio Comercial "DondeOficial":
    Categorías disponibles: ${categories?.map(c => c.name).join(', ')}.
    Algunos negocios destacados:
    ${businesses?.map(b => `- ${b.name}: ${b.description}. Dirección: ${b.address || 'No disponible'}. Contacto: ${b.phone || b.email || 'No disponible'}`).join('\n')}
    
    Instrucciones para el asistente:
    - Eres el asistente virtual oficial de "DondeOficial".
    - Ayudas a los usuarios a encontrar negocios, contactos e información del proyecto.
    - Si el usuario pregunta por soporte, indícale que puede contactarnos a través del formulario de contacto en el sitio.
    - Mantén un tono amable, profesional y servicial.
    - Si no conoces la respuesta específica sobre un negocio, invita al usuario a usar el buscador principal del sitio.
    `;

        // 2. Llamar a Groq con el modelo Llama 3
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY.trim()}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'llama3-8b-8192',
                messages: [
                    { role: 'system', content: context },
                    ...history.map((m: any) => ({ role: m.role, content: m.content })).slice(-10),
                    { role: 'user', content: message }
                ],
                temperature: 0.7,
                max_tokens: 1024,
            }),
        });

        const data = await response.json();

        if (data.error) {
            console.error('Groq API Error Detail:', JSON.stringify(data.error));
            return NextResponse.json({ error: 'Error del modelo: ' + (data.error.message || 'Error desconocido') }, { status: 500 });
        }

        if (!data.choices || !data.choices[0]) {
            console.error('Unexpected Groq Response:', JSON.stringify(data));
            return NextResponse.json({ error: 'Respuesta inesperada del modelo' }, { status: 500 });
        }

        const reply = data.choices[0].message.content;

        return NextResponse.json({ reply });
    } catch (error) {
        console.error('Chat API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
