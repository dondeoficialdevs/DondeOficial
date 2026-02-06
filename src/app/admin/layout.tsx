'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/lib/api';
import { User } from '@/types';
import {
  ShieldCheck,
  LayoutDashboard,
  Users,
  Mail,
  Tags,
  Gift,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Monitor,
  Loader2,
  Crown
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (pathname === '/admin/login') {
        setLoading(false);
        return;
      }

      if (!authApi.isAuthenticated()) {
        router.push('/admin/login');
        setLoading(false);
        return;
      }

      try {
        const currentUser = await authApi.verify();
        setUser(currentUser);
      } catch (error) {
        console.error('Auth verification error:', error);
        await authApi.logout();
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [pathname, router]);

  const handleLogout = async () => {
    await authApi.logout();
    router.push('/admin/login');
  };

  const navItems = [
    { href: '/admin/verification', label: 'Verificación', icon: ShieldCheck },
    { href: '/admin/businesses', label: 'Directorio', icon: LayoutDashboard },
    { href: '/admin/leads', label: 'Leads', icon: Users },
    { href: '/admin/newsletter', label: 'Newsletter', icon: Mail },
    { href: '/admin/categories', label: 'Categorías', icon: Tags },
    { href: '/admin/promotions', label: 'Promociones', icon: Gift },
    { href: '/admin/action-cards', label: 'Tarjetas Acción', icon: CreditCard },
    { href: '/admin/memberships', label: 'Membresías', icon: Crown },
    { href: '/admin/payments', label: 'Pagos', icon: CreditCard },
    { href: '/admin/settings', label: 'Configuración', icon: Settings },
  ];

  if (pathname === '/admin/login') return <>{children}</>;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-black animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex">
      {/* Mobile Drawer Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-[110] bg-black text-white px-4 py-8 transition-all duration-500 ease-in-out lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isCollapsed ? 'w-[80px]' : 'w-[280px]'}
      `}>
        <div className="flex flex-col h-full">
          {/* Brand */}
          <div className={`flex items-center gap-3 mb-10 transition-all duration-500 ${isCollapsed ? 'justify-center px-0' : 'px-2'}`}>
            <div className={`
              bg-white/10 rounded-xl flex items-center justify-center border border-white/20 shrink-0 transition-all duration-500
              ${isCollapsed ? 'w-12 h-12' : 'w-10 h-10'}
            `}>
              <ShieldCheck className={isCollapsed ? 'w-7 h-7' : 'w-6 h-6'} />
            </div>
            {!isCollapsed && (
              <div className="animate-in fade-in slide-in-from-left-2 duration-500">
                <p className="text-sm font-black uppercase tracking-[0.2em] leading-none mb-1">DondeOficial</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-none">Panel de Control</p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto pr-0 custom-scrollbar overflow-x-hidden">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    group flex items-center px-4 py-3.5 rounded-xl transition-all duration-300 relative
                    ${isActive ? 'bg-white text-black shadow-[0_10px_30px_rgba(255,255,255,0.1)]' : 'text-gray-400 hover:text-white hover:bg-white/5'}
                    ${isCollapsed ? 'justify-center' : 'justify-between'}
                  `}
                  onClick={() => setIsSidebarOpen(false)}
                  title={isCollapsed ? item.label : ''}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={20} className={isActive ? 'text-black' : 'text-gray-500 group-hover:text-white'} />
                    {!isCollapsed && (
                      <span className="text-sm font-bold uppercase tracking-tighter whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-500">
                        {item.label}
                      </span>
                    )}
                  </div>
                  {isActive && !isCollapsed && <ChevronRight size={14} className="animate-in fade-in zoom-in duration-300" />}
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="mt-8 pt-8 border-t border-white/10 space-y-4 px-0">
            <div className={`flex items-center gap-3 mb-6 transition-all duration-500 ${isCollapsed ? 'justify-center' : 'px-2'}`}>
              <div className="w-10 h-10 bg-linear-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center border border-white/20 font-black text-xs shrink-0">
                {user?.full_name?.charAt(0)}
              </div>
              {!isCollapsed && (
                <div className="min-w-0 animate-in fade-in slide-in-from-left-2 duration-500">
                  <p className="text-sm font-black truncate">{user?.full_name}</p>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Online</p>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={handleLogout}
              className={`
                w-full flex items-center gap-3 py-4 bg-white/5 hover:bg-red-500/10 hover:text-red-500 text-gray-400 rounded-xl transition-all font-bold text-xs uppercase tracking-widest
                ${isCollapsed ? 'justify-center px-0' : 'px-4'}
              `}
              title={isCollapsed ? 'Cerrar Sesión' : ''}
            >
              <LogOut size={16} />
              {!isCollapsed && <span className="animate-in fade-in slide-in-from-left-2 duration-500">Cerrar Sesión</span>}
            </button>
          </div>

          {/* Collapse Toggle Button (Desktop Only) */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-black border border-white/10 rounded-full items-center justify-center text-white hover:bg-white hover:text-black transition-all shadow-xl z-50 group"
          >
            <ChevronRight size={16} className={`transition-transform duration-500 ${isCollapsed ? '' : 'rotate-180'} group-hover:scale-110`} />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden h-screen bg-gray-50">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 lg:px-10 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-all"
            >
              <Menu size={24} />
            </button>
            <div className="hidden lg:flex items-center gap-3 group">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
                <Monitor size={16} className="text-white" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-900 italic">Acceso al Portal Principal<span className="text-blue-600 not-italic">.</span></p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-3">
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-400">Estado del Sistema</span>
              <div className="flex items-center gap-2 bg-black/[0.03] px-4 py-2 rounded-xl border border-black/5 shadow-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">EN LINEA</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Canvas */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-12 scroll-smooth">
          <div className="max-w-6xl mx-auto animate-in fade-in duration-700">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
