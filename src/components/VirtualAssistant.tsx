'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2, Volume2, VolumeX } from 'lucide-react';
import Image from 'next/image';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export default function VirtualAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: '¡Hola! Soy tu asistente virtual inteligente de DondeOficial. ¿En qué puedo ayudarte hoy? Estoy listo para buscar negocios, categorías o darte soporte técnico.' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Inicializar sonido
    useEffect(() => {
        audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3'); // Sonido elegante de notificación
    }, []);

    const playNotification = () => {
        if (!isMuted && audioRef.current) {
            audioRef.current.play().catch(e => console.log('Audio play failed:', e));
        }
    };

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

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `Error del servidor (${response.status})`);
            }

            setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
            playNotification();
        } catch (error) {
            console.error('Error:', error);
            const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
            setMessages(prev => [...prev, { role: 'assistant', content: `Uppps! Tuvimos un problemita: ${errorMsg}. Por favor, verifica que tu conexión esté bien e intenta de nuevo.` }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
            {/* Ventana de Chat */}
            {isOpen && (
                <div className="mb-6 w-80 md:w-96 h-[550px] max-h-[80vh] bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white/40 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300 origin-bottom-right">

                    {/* Header Premium */}
                    <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-500 p-5 text-white flex justify-between items-center shadow-lg relative overflow-hidden">
                        {/* Efecto de luz en header */}
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>

                        <div className="flex items-center gap-3 relative z-10">
                            <div className="relative">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl overflow-hidden border border-white/30 flex items-center justify-center p-1">
                                    <Image
                                        src="/images/robot-avatar.png"
                                        alt="AI Avatar"
                                        width={48}
                                        height={48}
                                        className="object-contain"
                                        onError={(e) => {
                                            const target = e.target as any;
                                            target.src = "https://cdn-icons-png.flaticon.com/512/4712/4712027.png"; // Fallback elegante
                                        }}
                                    />
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-indigo-700 rounded-full animate-pulse"></div>
                            </div>
                            <div>
                                <h3 className="font-bold text-base tracking-tight leading-tight">Virtual Core AI</h3>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-ping"></span>
                                    <p className="text-[11px] font-medium text-white/90 uppercase tracking-widest">En Línea</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 relative z-10">
                            <button
                                onClick={() => setIsMuted(!isMuted)}
                                className="hover:bg-white/20 p-2 rounded-xl transition-all active:scale-90"
                                title={isMuted ? "Activar sonido" : "Silenciar"}
                            >
                                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="hover:bg-white/20 p-2 rounded-xl transition-all active:scale-90"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Mensajes con estilo Premium */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-gradient-to-b from-gray-50/50 to-white/50 scrollbar-thin scrollbar-thumb-indigo-200">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                                <div className={`max-w-[88%] p-4 rounded-3xl text-sm leading-relaxed shadow-sm transition-all hover:shadow-md ${m.role === 'user'
                                        ? 'bg-gradient-to-tr from-indigo-600 to-blue-600 text-white rounded-tr-none'
                                        : 'bg-white/80 backdrop-blur-sm text-gray-800 border border-gray-100/50 rounded-tl-none'
                                    }`}>
                                    <div className="flex items-center gap-2 mb-1.5 opacity-60 text-[10px] font-semibold uppercase tracking-wider">
                                        {m.role === 'user' ? <User size={10} /> : <Bot size={10} />}
                                        {m.role === 'user' ? 'Tú' : 'Virtual Core AI'}
                                    </div>
                                    <div className="whitespace-pre-wrap">{m.content}</div>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start animate-pulse">
                                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-3xl rounded-tl-none shadow-sm border border-gray-100/50 text-indigo-600 text-sm flex items-center gap-3">
                                    <Loader2 size={16} className="animate-spin" />
                                    <span className="font-medium">Procesando respuestas inteligentes...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area Glassmorphism */}
                    <div className="p-5 bg-white/40 backdrop-blur-md border-t border-white/40">
                        <div className="flex gap-3 items-center bg-gray-100/80 p-2 rounded-2xl border border-gray-200/30 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500/50 transition-all">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Escribe tu pregunta aquí..."
                                className="flex-1 bg-transparent border-none rounded-xl px-2 py-1.5 text-sm focus:outline-none text-gray-800 placeholder:text-gray-400 font-medium"
                                disabled={isLoading}
                            />
                            <button
                                onClick={handleSend}
                                disabled={isLoading || !input.trim()}
                                className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-2.5 rounded-xl hover:shadow-lg hover:shadow-indigo-200 active:scale-90 disabled:opacity-30 disabled:grayscale transition-all"
                            >
                                <Send size={20} />
                            </button>
                        </div>
                        <p className="text-[9px] text-gray-400 text-center mt-3 font-medium uppercase tracking-[0.2em]">DondeOficial Smart AI Assistant</p>
                    </div>
                </div>
            )}

            {/* Botón Flotante con efecto 3D pulido */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`group relative w-16 h-16 rounded-3xl shadow-[0_15px_35px_rgba(79,70,229,0.3)] hover:shadow-[0_20px_45px_rgba(79,70,229,0.5)] transition-all duration-500 flex items-center justify-center overflow-hidden
                ${isOpen ? 'bg-white text-indigo-600 scale-90' : 'bg-gradient-to-tr from-indigo-600 to-blue-500 text-white hover:scale-110 active:scale-95'}`}
            >
                {isOpen ? (
                    <X size={28} className="animate-in rotate-in duration-300" />
                ) : (
                    <div className="relative w-full h-full flex items-center justify-center">
                        <Image
                            src="/images/robot-avatar.png"
                            alt="Robot"
                            width={100}
                            height={100}
                            className="object-contain group-hover:scale-125 transition-transform duration-500"
                            priority
                        />
                        {/* Badge de notificación visual */}
                        <div className="absolute top-3 right-3 w-3.5 h-3.5 bg-green-400 border-2 border-indigo-600 rounded-full"></div>
                    </div>
                )}
            </button>
        </div>
    );
}
