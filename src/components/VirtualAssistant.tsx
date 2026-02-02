'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Send, User, Loader2, Volume2, VolumeX, CircleUserRound, Sparkles, MessageCircleCode } from 'lucide-react';

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
        <div className="fixed bottom-24 right-6 z-[9999] flex flex-col items-end font-sans">
            {/* Ventana de Chat Premium */}
            {isOpen && (
                <div className="mb-6 w-[340px] md:w-[400px] h-[600px] max-h-[85vh] bg-white/95 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_30px_90px_-15px_rgba(0,0,0,0.3)] border border-white/50 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-bottom-10 duration-500 origin-bottom-right">

                    {/* Header Ultra-Premium */}
                    <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-rose-500 p-7 text-white flex justify-between items-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent)] pointer-events-none"></div>
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

                        <div className="flex items-center gap-4 relative z-10">
                            <div className={`relative transition-all duration-700 ${isInteracting ? 'scale-110 -rotate-12' : ''}`}>
                                <div className="w-16 h-16 bg-gradient-to-tr from-white/30 to-white/10 backdrop-blur-xl rounded-[1.25rem] overflow-hidden border border-white/40 flex items-center justify-center shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)]">
                                    <CircleUserRound size={40} className="text-white drop-shadow-xl" strokeWidth={1.5} />
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 border-[3px] border-purple-700 rounded-full shadow-[0_0_15px_rgba(52,211,153,0.6)] animate-pulse"></div>
                            </div>
                            <div>
                                <h3 className="font-extrabold text-2xl tracking-tight leading-none flex items-center gap-2">
                                    Karen <Sparkles size={18} className="text-yellow-300 animate-pulse fill-yellow-300" />
                                </h3>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="flex h-2 w-2 relative">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                    </span>
                                    <p className="text-[10px] font-black text-white/80 uppercase tracking-[0.25em]">Concierge IA</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 relative z-10">
                            <button
                                onClick={() => setIsMuted(!isMuted)}
                                className="bg-white/10 hover:bg-white/25 p-2.5 rounded-2xl transition-all active:scale-90 border border-white/10"
                            >
                                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="bg-white/10 hover:bg-white/25 p-2.5 rounded-2xl transition-all active:scale-90 border border-white/10"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Feed de Chat Estilizado */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-7 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.03),transparent)] scrollbar-hide">
                        {messages.map((m: Message, i: number) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-6 duration-700 ease-out`}>
                                <div className={`max-w-[85%] p-5 rounded-[2.2rem] text-[14px] leading-[1.6] shadow-md transition-all ${m.role === 'user'
                                        ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-tr-none shadow-indigo-200/50'
                                        : 'bg-white text-slate-800 border border-slate-100/80 shadow-slate-200/40 rounded-tl-none font-medium'
                                    }`}>
                                    <div className={`flex items-center gap-2 mb-2.5 opacity-40 text-[9px] font-black uppercase tracking-[0.2em] ${m.role === 'user' ? 'justify-end' : ''}`}>
                                        {m.role === 'user' ? 'Tú' : 'Karen AI'}
                                    </div>
                                    <div className="whitespace-pre-wrap">{m.content}</div>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start animate-in fade-in duration-500">
                                <div className="bg-white/80 backdrop-blur-md p-5 rounded-[2.2rem] rounded-tl-none border border-slate-100 flex items-center gap-4 text-purple-600">
                                    <div className="flex space-x-1.5">
                                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                        <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                        <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
                                    </div>
                                    <span className="font-bold italic text-xs tracking-wide">Karen está pensando...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area Glassmorphism Moderno */}
                    <div className="p-7 bg-white/80 backdrop-blur-2xl border-t border-slate-100">
                        <div className="group flex gap-3 items-center bg-slate-50 p-2.5 rounded-[1.8rem] border-2 border-transparent focus-within:border-purple-200 focus-within:bg-white focus-within:shadow-xl focus-within:shadow-purple-100/50 transition-all duration-500">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Escribe tu mensaje a Karen..."
                                className="flex-1 bg-transparent border-none rounded-2xl px-4 py-2 text-[14px] focus:outline-none text-slate-900 placeholder:text-slate-400 font-bold"
                                disabled={isLoading}
                            />
                            <button
                                onClick={handleSend}
                                disabled={isLoading || !input.trim()}
                                className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-3.5 rounded-2xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5 active:scale-95 disabled:opacity-20 transition-all duration-300"
                            >
                                <Send size={22} strokeWidth={2.5} />
                            </button>
                        </div>
                        <p className="text-[10px] text-slate-300 text-center mt-5 font-black uppercase tracking-[0.3em]">Powered by DondeOficial Intelligence</p>
                    </div>
                </div>
            )}

            {/* Nuevo Botón Flotante Ultra-Estilizado */}
            <div className="relative group">
                {/* Efecto de Halo Animado */}
                {!isOpen && (
                    <div className="absolute inset-0 -m-1.5 bg-gradient-to-br from-indigo-500 via-purple-500 to-rose-500 rounded-[2.2rem] blur-md opacity-40 group-hover:opacity-100 animate-pulse transition-opacity duration-700"></div>
                )}

                <button
                    onClick={handleInteraction}
                    className={`relative w-[72px] h-[72px] rounded-[2.2rem] shadow-[0_20px_40px_rgba(79,70,229,0.3)] transition-all duration-500 flex items-center justify-center overflow-hidden border-2
                    ${isOpen
                            ? 'bg-white text-indigo-600 scale-90 border-slate-100'
                            : 'bg-gradient-to-br from-indigo-600 via-purple-600 to-rose-500 text-white border-white/30 hover:scale-105 active:scale-95'}`}
                >
                    {isOpen ? (
                        <div className="flex flex-col items-center">
                            <X size={28} strokeWidth={2.5} className="animate-in spin-in-180 duration-500" />
                        </div>
                    ) : (
                        <div className={`relative w-full h-full flex items-center justify-center transition-all duration-500 ${isInteracting ? 'scale-125 rotate-default' : ''}`}>
                            <div className="flex flex-col items-center gap-1 group-hover:translate-y-[-2px] transition-transform duration-300">
                                <CircleUserRound size={34} strokeWidth={2} className="drop-shadow-lg" />
                                <span className="text-[9px] font-black uppercase tracking-tight leading-none">Karen</span>
                            </div>

                            {/* Badge de Notificación Premium */}
                            <div className="absolute top-4 right-4 w-4 h-4 bg-emerald-400 border-[3px] border-white rounded-full shadow-lg"></div>
                        </div>
                    )}
                </button>

                {/* Tooltip elegante al hover si está cerrado */}
                {!isOpen && (
                    <div className="absolute right-[85px] top-1/2 -translate-y-1/2 px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-slate-100 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-5 group-hover:translate-x-0 pointer-events-none whitespace-nowrap hidden md:block">
                        <p className="text-slate-800 text-xs font-bold flex items-center gap-2">
                            ¿Necesitas ayuda? <span className="text-purple-600 italic">Pregúntale a Karen</span>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
