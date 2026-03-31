"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Target, Settings } from "lucide-react";

// O novo organismo que acabamos de criar
import { BuyerDashboard } from "@/components/organisms/BuyerDashboard";

export default function BuyerDashboardPage() {
  return (
    <motion.main
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      className="min-h-screen w-full bg-brand-dark flex flex-col pb-24"
    >
      
      {/* Navegação Topo */}
      <nav className="w-full border-b border-brand-border/50 bg-brand-surface/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-brand-muted hover:text-white transition-colors" title="Voltar ao Início">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="h-4 w-px bg-brand-border/50" />
            <div className="flex items-center gap-2 font-semibold text-white tracking-tight">
              <Target className="w-5 h-5 text-indigo-400" />
              <span>Spend Management Hub (Comprador)</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-mono text-indigo-400 uppercase bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20 flex items-center gap-1.5 shadow-[0_0_10px_rgba(99,102,241,0.2)]">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              Conta Corporativa Ativa
            </span>
          </div>
        </div>
      </nav>

      {/* Injeção do Organismo */}
      <div className="w-full max-w-[1400px] mx-auto pt-8">
        <BuyerDashboard />
      </div>

    </motion.main>
  );
}