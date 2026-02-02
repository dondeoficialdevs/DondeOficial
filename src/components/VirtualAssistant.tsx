'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Send, User, Loader2, Volume2, VolumeX, MessageCircle, Sparkles } from 'lucide-react';

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
                <div className="fixed z-[9999] flex flex-col overflow-hidden
                    bottom-[88px] right-4 left-4
                    sm:bottom-20 sm:right-6 sm:left-auto sm:w-[380px]
                    md:bottom-24 md:right-6 md:w-[400px]
                    lg:w-[420px]
                    max-h-[calc(100vh-104px)]
                    sm:max-h-[calc(100vh-112px)]
                    md:max-h-[580px]
                    lg:max-h-[620px]
                    bg-white/95 backdrop-blur-3xl 
                    rounded-2xl sm:rounded-[1.5rem] md:rounded-2xl
                    shadow-[0_8px_32px_-8px_rgba(0,0,0,0.2)] md:shadow-[0_12px_48px_-12px_rgba(0,0,0,0.25)]
                    border border-slate-200/60
                    animate-in fade-in zoom-in-95 slide-in-from-bottom-5 duration-500 origin-bottom-right">


                    {/* Header Ultra-Premium */}
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 
                        p-3.5 sm:p-4 md:p-5 text-white flex justify-between items-center relative overflow-hidden shrink-0">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent)] pointer-events-none"></div>

                        <div className="flex items-center gap-3 sm:gap-4 relative z-10">
                            <div className="relative">
                                <div className="w-10 h-10 sm:w-11 sm:h-11 bg-white/95 
                                    rounded-xl overflow-hidden border border-orange-200/50 flex items-center justify-center shadow-sm relative">
                                    {/* Custom Karen Icon */}
                                    <div className="relative">
                                        <MessageCircle size={18} className="sm:w-5 sm:h-5 text-orange-600" strokeWidth={2} />
                                        <Sparkles size={8} className="sm:w-2 sm:h-2 text-orange-500 fill-orange-500 absolute -top-0.5 -right-0.5" />
                                    </div>
                                </div>
                                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-500 border-2 
                                    border-white rounded-full shadow-sm"></div>
                            </div>
                            <div>
                                <h3 className="font-bold text-base sm:text-lg tracking-tight leading-none flex items-center gap-1.5">
                                    Karen AI
                                </h3>
                                <p className="text-[10px] sm:text-[11px] font-medium text-white/80 mt-0.5">Asistente Virtual</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-1.5 sm:gap-2 relative z-10">
                            <button
                                onClick={() => setIsMuted(!isMuted)}
                                className="bg-white/15 hover:bg-white/25 p-1.5 rounded-lg transition-all active:scale-95"
                            >
                                {isMuted ? <VolumeX size={16} className="sm:w-[17px] sm:h-[17px]" /> : <Volume2 size={16} className="sm:w-[17px] sm:h-[17px]" />}
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="bg-white/15 hover:bg-white/25 p-1.5 rounded-lg transition-all active:scale-95"
                            >
                                <X size={17} className="sm:w-[18px] sm:h-[18px]" />
                            </button>
                        </div>
                    </div>


                    {/* Feed de Chat */}
                    <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-5 space-y-4 sm:space-y-5 md:space-y-6 
                        bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.02),transparent)] scrollbar-hide">
                        {messages.map((m: Message, i: number) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} 
                                animate-in slide-in-from-bottom-4 duration-500 ease-out`}>
                                <div className={`max-w-[85%] sm:max-w-[80%] p-3 sm:p-3.5 
                                    rounded-2xl sm:rounded-[1.2rem] 
                                    text-[13px] sm:text-[13.5px] leading-relaxed ${m.role === 'user'
                                        ? 'bg-orange-500 text-white rounded-tr-md shadow-sm'
                                        : 'bg-white text-slate-700 border border-slate-200/60 shadow-sm rounded-tl-md'
                                    }`}>
                                    <div className="flex items-center gap-1.5 mb-1.5 opacity-50 
                                        text-[9px] sm:text-[10px] font-semibold uppercase tracking-wide">
                                        {m.role === 'user' ? 'Tú' : 'Karen'}
                                    </div>
                                    <div className="whitespace-pre-wrap">{m.content}</div>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start animate-in fade-in duration-300">
                                <div className="bg-white p-3 sm:p-3.5 
                                    rounded-2xl rounded-tl-md border border-slate-200/60 
                                    flex items-center gap-2 sm:gap-2.5 text-orange-600 shadow-sm">
                                    <div className="flex space-x-1">
                                        <div className="w-1 h-1 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                        <div className="w-1 h-1 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                        <div className="w-1 h-1 bg-orange-500 rounded-full animate-bounce"></div>
                                    </div>
                                    <span className="font-bold italic text-[10px] sm:text-[11px]">Karen escribe...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 sm:p-3.5 md:p-4 bg-white/80 backdrop-blur-xl border-t border-slate-200/60 shrink-0">
                        <div className="flex gap-2 items-center bg-slate-50 p-2 
                            rounded-xl border border-slate-200/60 focus-within:border-orange-400 
                            focus-within:bg-white transition-all duration-200">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Escribe a Karen..."
                                className="flex-1 bg-transparent border-none px-3 py-1.5 
                                    text-sm focus:outline-none text-slate-700 placeholder:text-slate-400 font-medium"
                                disabled={isLoading}
                            />
                            <button
                                onClick={handleSend}
                                disabled={isLoading || !input.trim()}
                                className="bg-orange-500 hover:bg-orange-600 text-white 
                                    p-2 rounded-lg shadow-sm active:scale-95 
                                    disabled:opacity-30 transition-all duration-200"
                            >
                                <Send size={16} strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Botón Flotante - Fijo para evitar overlap */}
            <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 md:bottom-24 md:right-6 z-[9999] group">
                {!isOpen && (
                    <div className="absolute inset-0 -m-0.5 bg-orange-500/40 
                        rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                )}

                <button
                    onClick={handleInteraction}
                    className={`relative w-14 h-14 sm:w-[60px] sm:h-[60px] rounded-2xl 
                        shadow-lg transition-all duration-300 flex items-center justify-center overflow-hidden
                    ${isOpen
                            ? 'bg-white text-orange-600 scale-95 border-2 border-slate-200'
                            : 'bg-orange-500 text-white border-2 border-orange-400/50 hover:bg-orange-600 hover:scale-105 active:scale-95'}`}
                >
                    {isOpen ? (
                        <X size={20} className="sm:w-[22px] sm:h-[22px]" strokeWidth={2.5} />
                    ) : (
                        <div className={`relative w-full h-full flex items-center justify-center transition-all duration-300 ${isInteracting ? 'scale-110' : ''}`}>
                            {/* Custom Karen Icon for Floating Button */}
                            <div className="relative">
                                <MessageCircle size={22} className="sm:w-6 sm:h-6 text-white" strokeWidth={2.5} />
                                <div className="absolute -top-1 -right-1 w-2 h-2 bg-white/30 rounded-full"></div>
                            </div>
                            <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 w-2 h-2 
                                bg-emerald-500 border-2 border-white rounded-full shadow-sm"></div>
                        </div>
                    )}
                </button>
            </div>
        </>
    );
}
