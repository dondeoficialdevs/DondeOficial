'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2, Volume2, VolumeX, CircleUserRound, Sparkles } from 'lucide-react';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export default function VirtualAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: '¡Hola! Soy Karen, tu asistente virtual premium de DondeOficial. ✨ ¿En qué puedo ayudarte hoy?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isInteracting, setIsInteracting] = useState(false);
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
        audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3');
    }, []);

    const playNotification = () => {
        if (!isMuted && audioRef.current) {
            audioRef.current.play().catch((e: any) => console.log('Audio play failed:', e));
        }
    };

    const handleInteraction = () => {
        setIsInteracting(true);
        setTimeout(() => setIsInteracting(false), 800);
        if (!isOpen) setIsOpen(true);
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages((prev: Message[]) => [...prev, { role: 'user', content: userMessage }]);
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

            setMessages((prev: Message[]) => [...prev, { role: 'assistant', content: data.reply }]);
            playNotification();
        } catch (error) {
            console.error('Error:', error);
            const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
            setMessages((prev: Message[]) => [...prev, { role: 'assistant', content: `Uppps! Tuvimos un problemita: ${errorMsg}. Por favor, verifica que tu conexión esté bien e intenta de nuevo.` }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
            {/* Ventana de Chat */}
            {isOpen && (
                <div className="mb-6 w-80 md:w-96 h-[550px] max-h-[80vh] bg-white/90 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_25px_60px_rgba(0,0,0,0.2)] border border-white/40 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-500 origin-bottom-right">

                    {/* Header Premium - Karen */}
                    <div className="bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 p-6 text-white flex justify-between items-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent)]"></div>

                        <div className="flex items-center gap-4 relative z-10">
                            <div className={`relative transition-all duration-500 ${isInteracting ? 'scale-110 -rotate-6' : ''}`}>
                                <div className="w-14 h-14 bg-white/20 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/30 flex items-center justify-center shadow-inner">
                                    <CircleUserRound size={36} className="text-white drop-shadow-lg" />
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 border-2 border-indigo-700 rounded-full shadow-[0_0_12px_rgba(52,211,153,0.5)] animate-pulse"></div>
                            </div>
                            <div>
                                <h3 className="font-bold text-xl tracking-tight leading-tight flex items-center gap-2">
                                    Karen <Sparkles size={16} className="text-yellow-300 animate-pulse" />
                                </h3>
                                <p className="text-[10px] font-bold text-white/70 uppercase tracking-[0.2em] mt-1">Soporte Inteligente</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 relative z-10">
                            <button
                                onClick={() => setIsMuted(!isMuted)}
                                className="hover:bg-white/20 p-2.5 rounded-2xl transition-all active:scale-90"
                            >
                                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="hover:bg-white/20 p-2.5 rounded-2xl transition-all active:scale-90"
                            >
                                <X size={22} />
                            </button>
                        </div>
                    </div>

                    {/* Mensajes con estilo Premium */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-transparent to-gray-50/30 scrollbar-hide">
                        {messages.map((m: Message, i: number) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-4 duration-500`}>
                                <div className={`max-w-[85%] p-4.5 rounded-[2rem] text-[13.5px] leading-relaxed shadow-sm transition-all hover:shadow-md ${m.role === 'user'
                                        ? 'bg-gradient-to-tr from-indigo-600 to-blue-600 text-white rounded-tr-none'
                                        : 'bg-white text-gray-800 border border-gray-100 shadow-[0_4px_15px_rgba(0,0,0,0.03)] rounded-tl-none font-medium'
                                    }`}>
                                    <div className="flex items-center gap-2 mb-2 opacity-50 text-[9px] font-black uppercase tracking-widest">
                                        {m.role === 'user' ? <User size={10} /> : <CircleUserRound size={10} />}
                                        {m.role === 'user' ? 'Tú' : 'Karen'}
                                    </div>
                                    <div className="whitespace-pre-wrap">{m.content}</div>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start animate-pulse">
                                <div className="bg-white/90 backdrop-blur-sm p-4.5 rounded-[2rem] rounded-tl-none shadow-sm border border-gray-100 text-indigo-600 text-[13px] flex items-center gap-3">
                                    <div className="flex gap-1.5">
                                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
                                    </div>
                                    <span className="font-semibold italic">Karen está redactando...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area Glassmorphism */}
                    <div className="p-6 bg-white/60 backdrop-blur-xl border-t border-white/20">
                        <div className="flex gap-3 items-center bg-gray-100/60 p-2.5 rounded-[1.5rem] border border-gray-200/50 focus-within:ring-4 focus-within:ring-indigo-500/10 focus-within:bg-white focus-within:border-indigo-300 transition-all duration-300">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Habla con Karen..."
                                className="flex-1 bg-transparent border-none rounded-xl px-3 py-1.5 text-sm focus:outline-none text-gray-800 placeholder:text-gray-400 font-semibold"
                                disabled={isLoading}
                            />
                            <button
                                onClick={handleSend}
                                disabled={isLoading || !input.trim()}
                                className="bg-gradient-to-r from-indigo-600 to-blue-700 text-white p-3 rounded-2xl hover:shadow-[0_10px_20px_rgba(79,70,229,0.2)] active:scale-95 disabled:opacity-30 transition-all duration-300"
                            >
                                <Send size={20} />
                            </button>
                        </div>
                        <p className="text-[9px] text-gray-400 text-center mt-4 font-black uppercase tracking-[0.25em]">DondeOficial Core Interface</p>
                    </div>
                </div>
            )}

            {/* Botón Flotante Karen - Estilo Avatar Premium Icon */}
            <button
                onClick={handleInteraction}
                className={`group relative w-16 h-16 rounded-[2rem] shadow-[0_20px_50px_rgba(79,70,229,0.3)] hover:shadow-[0_25px_60px_rgba(79,70,229,0.5)] transition-all duration-500 flex items-center justify-center overflow-hidden
                ${isOpen ? 'bg-white text-indigo-600 scale-90' : 'bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 text-white hover:scale-110 active:scale-95'}`}
            >
                {isOpen ? (
                    <X size={28} className="animate-in rotate-in duration-500" />
                ) : (
                    <div className={`relative w-full h-full flex items-center justify-center transition-transform duration-500 ${isInteracting ? 'scale-125' : ''}`}>
                        <CircleUserRound size={36} className="group-hover:scale-110 transition-transform drop-shadow-lg" />
                        <div className="absolute top-4 right-4 w-3.5 h-3.5 bg-emerald-400 border-2 border-white/20 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.5)]"></div>
                    </div>
                )}
            </button>
        </div>
    );
}
