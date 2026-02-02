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
    <div className="min-h-screen bg-[#020617] relative overflow-hidden flex items-center justify-center font-sans tracking-tight">
      {/* Dynamic Background Mesh */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse delay-700"></div>
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-purple-600/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>
      </div>

      {/* Main Glass Container */}
      <main className="relative z-10 w-full max-w-lg px-4 sm:px-6">
        <div className="bg-white/[0.03] backdrop-blur-2xl rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-10 md:p-12 border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] relative overflow-hidden group">
          {/* Subtle Inner Glow */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

          {/* Header Section */}
          <div className="text-center mb-8 sm:mb-10 relative">
            <div className="inline-block relative mb-6 sm:mb-8">
              {/* Animated Rings */}
              <div className="absolute inset-[-10px] sm:inset-[-12px] border border-white/5 rounded-[2.2rem] sm:rounded-[2.5rem] animate-[spin_10s_linear_infinite]"></div>
              <div className="absolute inset-[-5px] sm:inset-[-6px] border border-white/10 rounded-[2rem] sm:rounded-[2.2rem] animate-[spin_6s_linear_infinite_reverse]"></div>

              <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[1.8rem] sm:rounded-[2rem] flex items-center justify-center p-3 sm:p-4 shadow-2xl transform transition-transform duration-500 group-hover:scale-105">
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

            <h1 className="text-2xl sm:text-3xl font-black text-white mb-2 tracking-tighter uppercase italic">
              Donde<span className="text-blue-500 not-italic">Oficial</span>
            </h1>
            <p className="text-gray-400 font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[9px] sm:text-[10px]">
              Admin Control Center
            </p>
          </div>

          {error && (
            <div className="mb-6 sm:mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                <p className="text-xs text-red-200 font-bold tracking-wide">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="space-y-1.5 sm:space-y-2">
              <label className="block text-[9px] sm:text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-2">
                User Access Key
              </label>
              <div className="relative group/input">
                <div className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within/input:text-white transition-colors">
                  <Mail size={18} className="sm:size-5" strokeWidth={2.5} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-white/[0.02] border-2 border-white/5 focus:border-white/20 focus:bg-white/[0.05] rounded-xl sm:rounded-2xl py-3.5 sm:py-4 pl-12 sm:pl-14 pr-6 outline-none text-white text-sm sm:text-base font-bold transition-all placeholder:text-white/10"
                  placeholder="admin@dondeoficial.com"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <label className="block text-[9px] sm:text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-2">
                Secret Password
              </label>
              <div className="relative group/input">
                <div className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within/input:text-white transition-colors">
                  <Lock size={18} className="sm:size-5" strokeWidth={2.5} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-white/[0.02] border-2 border-white/5 focus:border-white/20 focus:bg-white/[0.05] rounded-xl sm:rounded-2xl py-3.5 sm:py-4 pl-12 sm:pl-14 pr-12 sm:pr-14 outline-none text-white text-sm sm:text-base font-bold transition-all placeholder:text-white/10"
                  placeholder="••••••••••••"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 sm:right-5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} className="sm:size-5" /> : <Eye size={18} className="sm:size-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full relative group/btn pt-2"
            >
              <div className="absolute inset-0 bg-blue-600 rounded-xl sm:rounded-2xl blur-md opacity-20 group-hover/btn:opacity-40 transition-opacity"></div>
              <div className="relative flex items-center justify-center gap-3 bg-white text-black py-4 sm:py-5 rounded-xl sm:rounded-2xl font-black text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] transition-all group-hover/btn:scale-[1.02] group-active/btn:scale-[0.98]">
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>Decrypt & Enter</span>
                    <LogIn size={18} strokeWidth={3} className="group-hover/btn:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </button>
          </form>

          {/* Footer Info */}
          <div className="mt-10 sm:mt-12 text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px w-6 sm:w-8 bg-white/5"></div>
              <span className="text-[8px] sm:text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Contact Protocol</span>
              <div className="h-px w-6 sm:w-8 bg-white/5"></div>
            </div>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 text-[9px] sm:text-[10px] font-black text-white/40 hover:text-white transition-all uppercase tracking-widest"
            >
              <HelpCircle size={14} />
              Emergency Support
            </a>
          </div>
        </div>
      </main>
    </div>
  );

}

