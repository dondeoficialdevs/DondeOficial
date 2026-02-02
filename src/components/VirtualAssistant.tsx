'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Send, User, Loader2, Volume2, VolumeX, CircleUserRound, Sparkles } from 'lucide-react';

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
        setIsOpen(!isOpen);
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
        <>
            {/* Ventana de Chat - Posicionada de forma independiente */}
            {isOpen && (
                <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-24 md:right-6 z-[9999] 
                    w-[calc(100vw-32px)] sm:w-[calc(100vw-48px)] md:w-[420px] lg:w-[440px]
                    h-[calc(100vh-100px)] sm:h-[calc(100vh-140px)] md:h-[600px] lg:h-[650px]
                    bg-white/95 backdrop-blur-3xl rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.5rem] 
                    shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] md:shadow-[0_30px_90px_-15px_rgba(0,0,0,0.3)] 
                    border border-white/50 flex flex-col overflow-hidden 
                    animate-in fade-in zoom-in-95 slide-in-from-bottom-5 duration-500 origin-bottom-right">


                    {/* Header Ultra-Premium */}
                    <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-rose-500 
                        p-4 sm:p-5 md:p-6 text-white flex justify-between items-center relative overflow-hidden shrink-0">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent)] pointer-events-none"></div>

                        <div className="flex items-center gap-3 sm:gap-4 relative z-10">
                            <div className="relative">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-tr from-white/30 to-white/10 backdrop-blur-xl 
                                    rounded-xl sm:rounded-2xl overflow-hidden border border-white/40 flex items-center justify-center shadow-inner">
                                    <CircleUserRound size={32} className="sm:w-9 sm:h-9 text-white drop-shadow-xl" strokeWidth={1.5} />
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-emerald-400 border-[2.5px] sm:border-[3px] 
                                    border-purple-700 rounded-full shadow-[0_0_15px_rgba(52,211,153,0.6)] animate-pulse"></div>
                            </div>
                            <div>
                                <h3 className="font-extrabold text-lg sm:text-xl tracking-tight leading-none flex items-center gap-2">
                                    Karen <Sparkles size={14} className="sm:w-4 sm:h-4 text-yellow-300 animate-pulse fill-yellow-300" />
                                </h3>
                                <p className="text-[8px] sm:text-[9px] font-black text-white/70 uppercase tracking-[0.2em] mt-1 sm:mt-1.5">Soporte Premium</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-1.5 sm:gap-2 relative z-10">
                            <button
                                onClick={() => setIsMuted(!isMuted)}
                                className="bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-all active:scale-90"
                            >
                                {isMuted ? <VolumeX size={16} className="sm:w-[18px] sm:h-[18px]" /> : <Volume2 size={16} className="sm:w-[18px] sm:h-[18px]" />}
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-all active:scale-90"
                            >
                                <X size={18} className="sm:w-5 sm:h-5" />
                            </button>
                        </div>
                    </div>


                    {/* Feed de Chat */}
                    <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-5 space-y-4 sm:space-y-5 md:space-y-6 
                        bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.02),transparent)] scrollbar-hide">
                        {messages.map((m: Message, i: number) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} 
                                animate-in slide-in-from-bottom-4 duration-500 ease-out`}>
                                <div className={`max-w-[90%] sm:max-w-[85%] p-3.5 sm:p-4 md:p-4.5 
                                    rounded-[1.5rem] sm:rounded-[1.8rem] md:rounded-[2rem] 
                                    text-[12.5px] sm:text-[13px] md:text-[13.5px] leading-relaxed shadow-sm ${m.role === 'user'
                                        ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-tr-none'
                                        : 'bg-white text-slate-800 border border-slate-100 shadow-sm rounded-tl-none font-medium'
                                    }`}>
                                    <div className="flex items-center gap-2 mb-1 sm:mb-1.5 opacity-40 
                                        text-[7px] sm:text-[8px] font-black uppercase tracking-widest">
                                        {m.role === 'user' ? 'Tú' : 'Karen'}
                                    </div>
                                    <div className="whitespace-pre-wrap">{m.content}</div>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start animate-in fade-in duration-300">
                                <div className="bg-white/90 backdrop-blur-md p-3.5 sm:p-4 
                                    rounded-[1.5rem] sm:rounded-[1.8rem] rounded-tl-none border border-slate-100 
                                    flex items-center gap-2.5 sm:gap-3 text-purple-600">
                                    <div className="flex space-x-1">
                                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                        <div className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                        <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce"></div>
                                    </div>
                                    <span className="font-bold italic text-[10px] sm:text-[11px]">Karen escribe...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 sm:p-4 md:p-6 bg-white/60 backdrop-blur-xl border-t border-slate-100 shrink-0">
                        <div className="flex gap-2 sm:gap-2.5 md:gap-3 items-center bg-slate-100/50 p-1.5 sm:p-2 
                            rounded-[1.2rem] sm:rounded-[1.5rem] border border-transparent focus-within:border-purple-200 
                            focus-within:bg-white transition-all duration-300">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Escribe a Karen..."
                                className="flex-1 bg-transparent border-none rounded-xl px-2.5 sm:px-3 py-1.5 
                                    text-[13px] sm:text-sm focus:outline-none text-slate-800 placeholder:text-slate-400 font-bold"
                                disabled={isLoading}
                            />
                            <button
                                onClick={handleSend}
                                disabled={isLoading || !input.trim()}
                                className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white 
                                    p-2 sm:p-2.5 rounded-xl sm:rounded-2xl shadow-lg active:scale-95 
                                    disabled:opacity-20 transition-all duration-300"
                            >
                                <Send size={16} className="sm:w-[18px] sm:h-[18px]" strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Botón Flotante - Fijo para evitar overlap */}
            <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-24 md:right-6 z-[9999] group">
                {!isOpen && (
                    <div className="absolute inset-0 -m-1 bg-gradient-to-br from-indigo-500 via-purple-500 to-rose-500 
                        rounded-[1.5rem] sm:rounded-[2rem] blur-md opacity-30 group-hover:opacity-100 animate-pulse transition-opacity duration-700"></div>
                )}

                <button
                    onClick={handleInteraction}
                    className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-[1.5rem] sm:rounded-[2rem] 
                        shadow-2xl transition-all duration-500 flex items-center justify-center overflow-hidden border-2
                    ${isOpen
                            ? 'bg-white text-indigo-600 scale-90 border-slate-100'
                            : 'bg-gradient-to-br from-indigo-600 via-purple-600 to-rose-500 text-white border-white/20 hover:scale-105 active:scale-95'}`}
                >
                    {isOpen ? (
                        <X size={22} className="sm:w-[26px] sm:h-[26px] animate-in spin-in-90 duration-500" strokeWidth={2.5} />
                    ) : (
                        <div className={`relative w-full h-full flex items-center justify-center transition-all duration-500 ${isInteracting ? 'scale-125' : ''}`}>
                            <div className="flex flex-col items-center gap-0.5">
                                <CircleUserRound size={26} className="sm:w-[30px] sm:h-[30px]" strokeWidth={2} />
                                <span className="text-[7px] sm:text-[8px] font-black uppercase tracking-tight">Karen</span>
                            </div>
                            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-2.5 h-2.5 sm:w-3 sm:h-3 
                                bg-emerald-400 border-2 border-white rounded-full shadow-lg"></div>
                        </div>
                    )}
                </button>
            </div>
        </>
    );
}
