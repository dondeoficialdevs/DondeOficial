'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';


import { authApi } from '@/lib/api';
import { useSettings } from '@/hooks/useSettings';
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, HelpCircle, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { logoUrl } = useSettings();

  useEffect(() => {
    // Si ya está autenticado, redirigir al admin
    if (authApi.isAuthenticated()) {
      router.push('/admin');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authApi.login(email, password);
      router.push('/admin');
    } catch (err: unknown) {
      console.error('Error en login:', err);
      const errorMessage = err instanceof Error
        ? err.message
        : 'Error al iniciar sesión. Por favor verifica tus credenciales.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden flex items-center justify-center font-sans tracking-tight">
      {/* Dynamic Branded Background Mesh */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-orange-600/10 rounded-full blur-[140px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-amber-600/10 rounded-full blur-[140px] animate-pulse delay-700"></div>
        <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-orange-500/5 rounded-full blur-[120px] animate-pulse delay-1000"></div>

        {/* Fine Grain Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      </div>

      {/* Main Glass Container */}
      <main className="relative z-10 w-full max-w-lg px-4 sm:px-6">
        <div className="bg-white/[0.02] backdrop-blur-3xl rounded-[2.5rem] sm:rounded-[3.5rem] p-8 sm:p-10 md:p-14 border border-white/10 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.8)] relative overflow-hidden group">
          {/* Subtle Inner Glow */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent"></div>
          <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-white/5 to-transparent"></div>

          {/* Header Section */}
          <div className="text-center mb-10 sm:mb-12 relative">
            <div className="inline-block relative mb-8 sm:mb-10">
              {/* Pro Animated Rings */}
              <div className="absolute inset-[-12px] sm:inset-[-15px] border border-orange-500/10 rounded-[2.5rem] sm:rounded-[2.8rem] animate-[spin_15s_linear_infinite]"></div>
              <div className="absolute inset-[-6px] sm:inset-[-8px] border border-white/5 rounded-[2.2rem] sm:rounded-[2.5rem] animate-[spin_10s_linear_infinite_reverse]"></div>

              <div className="relative w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-orange-500 to-amber-600 rounded-[2.2rem] sm:rounded-[2.5rem] flex items-center justify-center p-4 sm:p-5 shadow-[0_20px_40px_rgba(249,115,22,0.3)] transform transition-all duration-700 group-hover:scale-105 group-hover:rotate-3">
                <div className="relative w-full h-full">
                  <Image
                    src={logoUrl}
                    alt="Logo"
                    fill
                    className="object-contain drop-shadow-2xl"
                    priority
                    unoptimized
                  />
                </div>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white mb-3 tracking-tighter uppercase italic">
              Donde<span className="text-orange-500 not-italic">Oficial</span>
            </h1>
            <div className="flex items-center justify-center gap-2">
              <span className="w-8 h-px bg-white/10"></span>
              <p className="text-white/40 font-black uppercase tracking-[0.4em] text-[9px] sm:text-[10px]">
                Admin Protocol
              </p>
              <span className="w-8 h-px bg-white/10"></span>
            </div>
          </div>

          {error && (
            <div className="mb-8 p-5 bg-red-500/5 border border-red-500/20 rounded-[1.5rem] animate-in fade-in zoom-in-95 duration-300">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                </div>
                <p className="text-[11px] text-red-200 font-bold uppercase tracking-wider leading-tight">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-7">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-4">
                Identity Identifier
              </label>
              <div className="relative group/input">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/input:text-orange-500 transition-all duration-300">
                  <Mail size={20} strokeWidth={2} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-white/[0.01] border-2 border-white/5 focus:border-orange-500/30 focus:bg-white/[0.03] rounded-2xl py-4 sm:py-5 pl-14 pr-6 outline-none text-white text-base font-bold transition-all placeholder:text-white/5"
                  placeholder="name@official.com"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-4">
                Access Credentials
              </label>
              <div className="relative group/input">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/input:text-orange-500 transition-all duration-300">
                  <Lock size={20} strokeWidth={2} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-white/[0.01] border-2 border-white/5 focus:border-orange-500/30 focus:bg-white/[0.03] rounded-2xl py-4 sm:py-5 pl-14 pr-14 outline-none text-white text-base font-bold transition-all placeholder:text-white/5"
                  placeholder="••••••••••••"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-white/10 hover:text-orange-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full relative group/btn pt-4"
            >
              <div className="absolute inset-0 bg-orange-600 rounded-2xl blur-xl opacity-20 group-hover/btn:opacity-40 transition-opacity duration-500"></div>
              <div className="relative flex items-center justify-center gap-4 bg-white text-black py-5 sm:py-6 rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] transition-all duration-500 group-hover/btn:bg-orange-500 group-hover/btn:text-white group-hover/btn:shadow-[0_20px_40px_rgba(249,115,22,0.4)] group-active/btn:scale-[0.98]">
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin text-orange-500 group-hover/btn:text-white" />
                ) : (
                  <>
                    <span>Acceder</span>
                    <LogIn size={20} strokeWidth={3} className="group-hover/btn:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </button>
          </form>

          {/* Footer Info */}
          <div className="mt-12 sm:mt-14 pt-8 border-t border-white/5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <a
                href="/contact"
                className="group flex items-center gap-3 text-[10px] font-black text-white/20 hover:text-orange-500 transition-all uppercase tracking-widest"
              >
                <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-orange-500/10 transition-colors">
                  <HelpCircle size={14} />
                </div>
                Support Line
              </a>

              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.5)]"></div>
                <span className="text-[9px] font-black text-white/10 uppercase tracking-widest">Secure Environment</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );

}

