'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export default function VirtualAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: '¡Hola! Soy tu asistente virtual de DondeOficial. ¿En qué puedo ayudarte hoy? Puedo buscar contactos, direcciones o información sobre el proyecto.' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage, history: messages }),
            });

            if (!response.ok) throw new Error('Error en la comunicación');

            const data = await response.json();
            if (data.error) throw new Error(data.error);

            setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
        } catch (error) {
            console.error('Error:', error);
            const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
            setMessages(prev => [...prev, { role: 'assistant', content: `Uppps! Tuvimos un problemita: ${errorMsg}. Por favor, verifica que tu conexión esté bien e intenta de nuevo.` }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Ventana de Chat */}
            {isOpen && (
                <div className="mb-4 w-80 md:w-96 h-[500px] max-h-[70vh] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
                    {/* Header */}
                    <div className="bg-indigo-600 p-4 text-white flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="bg-white/20 p-2 rounded-full">
                                <Bot size={20} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm">Asistente Virtual</h3>
                                <p className="text-[10px] text-white/80">En línea</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="hover:bg-white/10 p-1 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Mensajes */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${m.role === 'user'
                                    ? 'bg-indigo-600 text-white rounded-tr-none'
                                    : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-none'
                                    }`}>
                                    <div className="flex items-center gap-2 mb-1 opacity-70 text-[10px]">
                                        {m.role === 'user' ? <User size={10} /> : <Bot size={10} />}
                                        {m.role === 'user' ? 'Tú' : 'Asistente'}
                                    </div>
                                    {m.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 italic text-gray-400 text-xs flex items-center gap-2">
                                    <Loader2 size={14} className="animate-spin" /> Escogiendo las mejores opciones...
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 bg-white border-t border-gray-100">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Escribe tu mensaje..."
                                className="flex-1 bg-gray-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-black"
                                disabled={isLoading}
                            />
                            <button
                                onClick={handleSend}
                                disabled={isLoading || !input.trim()}
                                className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 disabled:opacity-50 transition-all"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Botón Flotante */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all flex items-center justify-center ${isOpen ? 'rotate-90' : 'rotate-0'}`}
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
            </button>
        </div>
    );
}
