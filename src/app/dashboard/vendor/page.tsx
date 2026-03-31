"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Building2, KanbanSquare } from "lucide-react";

// Os Organismos de Elite do Fornecedor
import { SupplierDashboard } from "@/components/organisms/SupplierDashboard";
import { FinancialHub } from "@/components/organisms/FinancialHub";

export default function VendorDashboardPage() {
  return (
    <motion.main
      // Transição nativa: Deslize lateral suave
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      className="min-h-screen w-full bg-brand-dark flex flex-col pb-24"
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
              <Building2 className="w-5 h-5 text-brand-primary" />
              <span>Vendor Command Center</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/dashboard/approvals" className="text-xs font-medium text-brand-muted hover:text-white transition-colors flex items-center gap-1.5 border-r border-brand-border/50 pr-4">
              <KanbanSquare className="w-3.5 h-3.5" /> Ver Pipeline
            </Link>
            <span className="text-[10px] font-mono text-brand-accent uppercase bg-brand-accent/10 px-2 py-1 rounded border border-brand-accent/20 flex items-center gap-1.5 shadow-glow">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse" />
              Live Data
            </span>
          </div>
        </div>
      </nav>

      {/* 2. Ecossistema do Fornecedor (CTO & Creative Dev) */}
      <div className="flex flex-col gap-16 mt-8">
        
        {/* O Bento Grid com os Skeletons, Alertas JIT e Resumo */}
        <SupplierDashboard />
        
        {/* Separador Elegante */}
        <div className="w-full max-w-7xl mx-auto h-px bg-gradient-to-r from-transparent via-brand-border to-transparent opacity-30" />
        
        {/* O Motor Financeiro com a Cascata de Take Rate (7%) e o Gráfico */}
        <FinancialHub />
        
      </div>

    </motion.main>
  );
}