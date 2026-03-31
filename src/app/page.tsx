"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  ArrowRight, LayoutDashboard, KanbanSquare, 
  Terminal, Search, Zap 
} from "lucide-react";

// Importação dos Organismos
import { MarketplaceFeed } from "@/components/organisms/MarketplaceFeed";
import { NegotiationPanel } from "@/components/organisms/NegotiationPanel";

// Variantes de animação para a entrada da página (Page Load)
const pageVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

// CORREÇÃO AQUI: 'as const' blindando o TypeScript do Framer Motion
const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 120, damping: 20 } },
};

export default function Home() {
  
  // Gatilho global para a Command Palette
  const triggerGlobalSearch = () => {
    window.dispatchEvent(new CustomEvent('open-command-palette'));
  };

  return (
    <motion.main 
      variants={pageVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col w-full max-w-[1600px] mx-auto pb-24"
    >
      
      {/* 1. Header & Quick Access (Abertura) */}
      <motion.section variants={sectionVariants} className="px-6 md:px-12 pt-12 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-brand-border/40">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-brand-accent text-sm font-mono font-semibold tracking-wider uppercase mb-3">
            <Terminal className="w-4 h-4" /> Ambiente de Operações
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4 leading-tight">
            Gestão Integrada de <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-accent">Supply Chain B2B</span>
          </h1>
          <p className="text-brand-muted text-lg">
            Acesse o catálogo, negocie volumes industriais e gerencie as aprovações financeiras em um único fluxo.
          </p>
        </div>

        {/* Quick Access Nav (Bento style) */}
        <div className="flex gap-4 w-full md:w-auto">
          <Link href="/dashboard/approvals" className="group flex-1 md:flex-none flex flex-col bg-brand-surface/50 hover:bg-brand-surface border border-brand-border rounded-xl p-4 transition-all hover:border-brand-primary/50">
            <KanbanSquare className="w-6 h-6 text-brand-muted group-hover:text-brand-primary transition-colors mb-3" />
            <span className="text-white font-medium text-sm">Visual Pipeline</span>
            <span className="text-brand-muted text-xs flex items-center gap-1 mt-1">Dual-Gate <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform"/></span>
          </Link>
          
          <Link href="/dashboard/vendor" className="group flex-1 md:flex-none flex flex-col bg-brand-surface/50 hover:bg-brand-surface border border-brand-border rounded-xl p-4 transition-all hover:border-emerald-500/50">
            <LayoutDashboard className="w-6 h-6 text-brand-muted group-hover:text-emerald-400 transition-colors mb-3" />
            <span className="text-white font-medium text-sm">Financial Hub</span>
            <span className="text-brand-muted text-xs flex items-center gap-1 mt-1">Take Rate (7%) <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform"/></span>
          </Link>
        </div>
      </motion.section>

      {/* 2. Global Search Hint (Agora clicável e interativo) */}
      <motion.section variants={sectionVariants} className="px-6 md:px-12 py-6 cursor-pointer" onClick={triggerGlobalSearch}>
        <div className="w-full bg-brand-dark border border-brand-border/60 hover:border-brand-primary/50 transition-colors rounded-xl p-4 flex items-center justify-between shadow-inner group">
          <div className="flex items-center gap-3 text-brand-muted group-hover:text-white transition-colors">
            <Search className="w-5 h-5 group-hover:text-brand-primary transition-colors" />
            <span className="text-sm">Busque por propostas, clientes ou ordens ativas...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-1 bg-brand-surface border border-brand-border rounded px-3 py-1.5 text-xs font-mono text-white shadow-sm group-hover:border-brand-primary/30 transition-colors">
            CTRL + K
          </kbd>
        </div>
      </motion.section>

      {/* 3. Marketplace Feed (O Catálogo Dual-View) */}
      <motion.section variants={sectionVariants} className="pt-8">
        <MarketplaceFeed />
      </motion.section>

      {/* Separador Elegante */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-brand-border to-transparent my-16 opacity-50" />

      {/* 4. Negotiation Panel (Área de Compras de Alto Volume) */}
      <motion.section variants={sectionVariants} className="px-6 md:px-12 flex flex-col items-center justify-center relative">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-xs font-bold uppercase tracking-widest mb-4">
            <Zap className="w-3 h-3" /> Live Demo
          </div>
          <h2 className="text-3xl font-bold text-white">Simulador de Bid & Offer</h2>
          <p className="text-brand-muted mt-2 max-w-xl mx-auto">
            Ajuste o volume de SKUs. Observe a queda do preço unitário e o gatilho automático para solicitação de cotação customizada (RFQ).
          </p>
        </div>
        
        {/* O Painel de Negociação com nosso PriceTicker */}
        <NegotiationPanel />
      </motion.section>

    </motion.main>
  );
}