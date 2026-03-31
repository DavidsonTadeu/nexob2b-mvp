"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, ShoppingCart, Kanban, 
  PieChart, Target, Bell, Menu, X, 
  LogOut, Settings, Terminal, Briefcase
} from "lucide-react";

// Definição das rotas do nosso ecossistema
const NAVIGATION = [
  { name: "Marketplace", href: "/catalog", icon: ShoppingCart, section: "Operação" },
  { name: "Pipeline de Aprovação", href: "/dashboard/approvals", icon: Kanban, section: "Operação" },
  { name: "Spend Management", href: "/dashboard/buyer", icon: Target, section: "Diretoria (Comprador)" },
  { name: "Financial Hub", href: "/dashboard/vendor", icon: PieChart, section: "Comercial (Fornecedor)" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Fecha o menu mobile automaticamente ao trocar de rota
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Impede o scroll do body quando o menu mobile está aberto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-brand-surface border-r border-brand-border shadow-2xl z-50">
      {/* Logotipo / Header da Sidebar */}
      <div className="h-20 flex items-center px-6 border-b border-brand-border/50 shrink-0">
        <Link href="/" className="flex items-center gap-3 text-white group">
          <div className="w-10 h-10 rounded-lg bg-brand-primary flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
            <Terminal className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight block leading-none">NexoB2B</span>
            <span className="text-[10px] text-brand-muted uppercase tracking-widest font-semibold">Corporate</span>
          </div>
        </Link>
      </div>

      {/* Links de Navegação */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 custom-scrollbar">
        
        {/* Agrupamento Dinâmico por Seção */}
        {Array.from(new Set(NAVIGATION.map(n => n.section))).map(section => (
          <div key={section} className="space-y-2">
            <h4 className="text-[10px] uppercase font-bold text-brand-muted tracking-wider px-3 mb-3">
              {section}
            </h4>
            <div className="space-y-1">
              {NAVIGATION.filter(n => n.section === section).map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                
                return (
                  <Link 
                    key={item.name} 
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium relative group ${
                      isActive 
                        ? "text-brand-primary bg-brand-primary/10" 
                        : "text-brand-muted hover:text-white hover:bg-brand-border/50"
                    }`}
                  >
                    {isActive && (
                      <motion.div 
                        layoutId="active-pill" 
                        className="absolute left-0 top-0 bottom-0 w-1 bg-brand-primary rounded-r-full"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <Icon className={`w-5 h-5 ${isActive ? "text-brand-primary" : "text-brand-muted group-hover:text-brand-primary/70 transition-colors"}`} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-brand-border/50 shrink-0">
        <button className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-brand-border/50 transition-colors text-left">
          <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
            <Briefcase className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">Diretoria MGS</p>
            <p className="text-[10px] text-brand-muted truncate">CNPJ Validado</p>
          </div>
          <LogOut className="w-4 h-4 text-brand-muted hover:text-danger transition-colors shrink-0" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-brand-dark overflow-hidden">
      
      {/* --- SIDEBAR DESKTOP --- */}
      <aside className="hidden lg:block w-[280px] shrink-0">
        <SidebarContent />
      </aside>

      {/* --- SIDEBAR MOBILE (DRAWER) --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[90] lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 250, damping: 30 }}
              className="fixed inset-y-0 left-0 w-[280px] z-[100] lg:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Header Mobile / Global Topbar */}
        <header className="h-16 lg:h-20 bg-brand-surface/80 backdrop-blur-md border-b border-brand-border/50 flex items-center justify-between px-4 sm:px-8 z-40 shrink-0">
          
          {/* Esquerda: Menu Hamburger (Mobile) ou Breadcrumb (Desktop) */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-brand-muted hover:text-white transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden lg:flex items-center gap-2 text-brand-muted text-sm font-medium">
              <span>NexoB2B Workspace</span>
              <span className="text-brand-border">/</span>
              <span className="text-white">
                {NAVIGATION.find(n => n.href === pathname)?.name || "Dashboard"}
              </span>
            </div>
          </div>

          {/* Direita: Ações Globais */}
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="hidden sm:flex items-center gap-2 bg-brand-dark border border-brand-border px-3 py-1.5 rounded-lg text-xs font-mono text-brand-muted">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Status: Operacional
            </div>
            
            <button className="relative p-2 text-brand-muted hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-accent ring-2 ring-brand-surface" />
            </button>
            
            <button className="p-2 text-brand-muted hover:text-white transition-colors hidden sm:block">
              <Settings className="w-5 h-5" />
            </button>

            {/* Avatar simplificado pro Mobile */}
            <div className="lg:hidden w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0 ml-2">
              <Briefcase className="w-4 h-4 text-indigo-400" />
            </div>
          </div>
        </header>

        {/* Content Scrollable Area onde as páginas são injetadas */}
        <main className="flex-1 overflow-y-auto custom-scrollbar relative">
          <div className="absolute inset-0 pointer-events-none">
            {/* Um glow central sutil que permeia todas as telas */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brand-primary/5 rounded-full blur-[120px]" />
          </div>
          
          {/* As rotas filhas caem aqui dentro */}
          <div className="relative z-10 w-full h-full pb-20">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}