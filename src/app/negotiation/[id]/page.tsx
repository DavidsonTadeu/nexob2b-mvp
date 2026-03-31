"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Terminal, ShieldCheck, ArrowRight, Activity, Lock } from "lucide-react";
import { NegotiationPanel } from "@/components/organisms/NegotiationPanel";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-brand-dark flex flex-col relative overflow-hidden">
      
      {/* Background Decorativo (Aquele Glow incrível) */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-brand-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[40vw] h-[40vw] bg-brand-accent/10 rounded-full blur-[100px] pointer-events-none" />

      {/* --- NOVO HEADER CORPORATIVO --- */}
      <header className="w-full border-b border-white/5 bg-brand-dark/50 backdrop-blur-xl z-50 sticky top-0">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          
          {/* Logotipo e Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-brand-primary flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.3)]">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold tracking-tight text-white block leading-none">NexoB2B</span>
              <span className="text-[10px] text-brand-muted uppercase tracking-widest font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> Enterprise
              </span>
            </div>
          </div>

          {/* Área de Navegação Rápida e Call to Action */}
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-brand-muted">
              <a href="#solucoes" className="hover:text-white transition-colors">Soluções</a>
              <a href="#compliance" className="hover:text-white transition-colors">Compliance</a>
              <a href="#api" className="hover:text-white transition-colors flex items-center gap-1">
                API <Activity className="w-3 h-3" />
              </a>
            </nav>

            <div className="w-px h-6 bg-white/10 hidden md:block" />

            <Link 
              href="/login" 
              className="group relative inline-flex items-center justify-center px-6 py-2.5 font-bold text-white transition-all duration-200 bg-brand-surface border border-brand-border rounded-lg hover:bg-brand-primary hover:border-brand-primary overflow-hidden"
            >
              <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
                <div className="relative h-full w-8 bg-white/20" />
              </div>
              <span className="flex items-center gap-2 relative z-10 text-sm">
                <Lock className="w-4 h-4 text-brand-muted group-hover:text-white transition-colors" />
                Acesso Corporativo
              </span>
            </Link>
          </div>
        </div>
      </header>
      {/* --- FIM DO HEADER --- */}

      {/* Main Content (A Vitrine) */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-12 relative z-10">
        
        {/* Hero Section Copy */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-surface border border-brand-border text-xs font-mono text-brand-muted uppercase mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
            Plataforma Homologada v2.0
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-[1.1] mb-6">
            O Motor Dual-Gate para <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-accent">
              Suprimentos Industriais.
            </span>
          </h1>
          <p className="text-brand-muted text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Simule o poder de negociação da sua empresa abaixo. Defina volumes, acione gatilhos de SLA e abra uma Sala de Guerra em tempo real.
          </p>
        </motion.div>

        {/* Simulador Interativo */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-2xl flex justify-center"
        >
          <NegotiationPanel />
        </motion.div>
        
      </main>
      
      {/* Rodapé Simples */}
      <footer className="w-full py-6 border-t border-brand-border/30 text-center relative z-10 mt-auto">
        <p className="text-brand-muted text-xs font-mono">
          © {new Date().getFullYear()} NexoB2B Corporate. Infraestrutura de ponta a ponta.
        </p>
      </footer>
    </div>
  );
}