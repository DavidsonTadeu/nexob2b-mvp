"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Activity } from "lucide-react";

// O Organismo Kanban
import { VisualPipeline } from "@/components/organisms/VisualPipeline";

export default function ApprovalsDashboardPage() {
  return (
    <motion.main
      // Transição nativa: Deslize lateral suave para dar sensação de App
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      className="min-h-screen w-full bg-brand-dark flex flex-col"
    >
      
      {/* 1. Dashboard Top Navigation (Arte) */}
      <nav className="w-full border-b border-brand-border/50 bg-brand-surface/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-brand-muted hover:text-white transition-colors" title="Voltar ao Início">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="h-4 w-px bg-brand-border/50" />
            <div className="flex items-center gap-2 font-semibold text-white tracking-tight">
              <ShieldCheck className="w-5 h-5 text-brand-primary" />
              <span>Workspace de Aprovação (Dual-Gate)</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/dashboard/vendor" className="text-xs font-medium text-brand-muted hover:text-white transition-colors flex items-center gap-1.5 border-r border-brand-border/50 pr-4">
              <Activity className="w-3.5 h-3.5" /> Ir para Hub Financeiro
            </Link>
            <span className="text-[10px] font-mono text-emerald-400 uppercase bg-emerald-400/10 px-2 py-1 rounded border border-emerald-400/20 flex items-center gap-1.5 shadow-glow">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Ambiente Seguro
            </span>
          </div>
        </div>
      </nav>

      {/* 2. O Motor do Pipeline (CTO & Creative Dev) */}
      <div className="flex-1 w-full py-8">
        {/* O VisualPipeline assume o controle aqui. 
            Ele já está conectado ao Zustand e renderizará os cards dinamicamente. */}
        <VisualPipeline />
      </div>

    </motion.main>
  );
}