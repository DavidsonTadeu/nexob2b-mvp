"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Wallet, Activity, AlertCircle, Inbox, Calendar, ArrowRight, ShieldCheck, FileSignature } from "lucide-react";
import Link from "next/link";
import { PriceTicker } from "@/components/atoms/PriceTicker";
import { useNexoStore } from "@/store/useNexoStore";

// 1. Hook Financeiro (CTO): Matemática baseada em centavos para precisão absoluta
function useFinancialSplit(grossAmount: number) {
  const TAKE_RATE = 0.07; // 7% NexoB2B Fee
  
  // Converte para centavos (inteiros) para evitar erros de ponto flutuante
  const grossInCents = Math.round(grossAmount * 100);
  const feeInCents = Math.round(grossInCents * TAKE_RATE);
  const netInCents = grossInCents - feeInCents;

  return {
    gross: grossAmount,
    fee: feeInCents / 100,
    net: netInCents / 100,
  };
}

// 2. Variantes de Animação em Cascata (Creative Dev) com as const
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring" as const, stiffness: 120, damping: 15 } 
  },
};

export function SupplierDashboard() {
  const orders = useNexoStore((state) => state.orders);
  const [period, setPeriod] = useState<"current" | "previous">("current");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  // Motor de Dados em Tempo Real
  const { realGrossVolume, pendingRFQs, jitCount } = useMemo(() => {
    let gross = 0;
    let pending = 0;
    let jit = 0;

    orders.forEach(order => {
      // Receita Líquida é baseada no que já foi aprovado para pagamento
      if (order.state === "payment" || order.state === "completed") {
        gross += order.amount;
      }
      // Contagem de RFQs pendentes
      if (order.state === "provider" || order.state === "manager") {
        pending += 1;
      }
      // Contagem de Ordens Just-in-Time
      if (order.isJIT) {
        jit += 1;
      }
    });

    return { realGrossVolume: gross, pendingRFQs: pending, jitCount: jit };
  }, [orders]);
  
  // O botão "Mês Passado" usa um mock histórico. "Este Mês" usa dados reais.
  const rawVolume = period === "current" ? realGrossVolume : 89400.00;
  const financials = useFinancialSplit(rawVolume);

  // Calcula % do medidor JIT (exemplo: max 10 ordens)
  const jitPercentage = Math.min(Math.round((jitCount / 10) * 100), 100);
  const dashOffset = 276 - (276 * jitPercentage) / 100;

  if (!isMounted) return null; // Previne erro de hidratação

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 relative z-10">
      
      {/* Header do Dashboard */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 sm:mb-8 gap-4 sm:gap-6">
        <div className="w-full md:w-auto">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Activity className="text-brand-primary w-6 h-6 sm:w-8 sm:h-8" />
            Centro de Comando
          </h1>
          <p className="text-brand-muted mt-1 text-sm sm:text-base">Visão geral da sua operação B2B e liquidação financeira.</p>
        </div>

        {/* Filtro de Período Responsivo */}
        <div className="flex bg-brand-surface border border-brand-border rounded-lg p-1 w-full sm:w-auto">
          <button 
            onClick={() => setPeriod("current")}
            className={`flex-1 sm:flex-none justify-center px-3 sm:px-4 py-2.5 sm:py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${period === "current" ? "bg-brand-border text-white shadow-sm" : "text-brand-muted hover:text-white"}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" /> Este Mês (Live)
          </button>
          <button 
            onClick={() => setPeriod("previous")}
            className={`flex-1 sm:flex-none justify-center px-3 sm:px-4 py-2.5 sm:py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${period === "previous" ? "bg-brand-border text-white shadow-sm" : "text-brand-muted hover:text-white"}`}
          >
            Mês Passado
          </button>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6"
      >
        
        {/* Card 1: Performance Financeira (Destaque Col-Span-2) */}
        <motion.div variants={cardVariants} className="md:col-span-2 bg-brand-surface border border-brand-border rounded-2xl p-5 sm:p-8 shadow-glass flex flex-col justify-between relative overflow-hidden">
          {/* Fundo Glow decorativo */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center gap-2 mb-6 text-brand-muted font-medium text-xs sm:text-sm uppercase tracking-wider relative z-10">
            <Wallet className="w-4 h-4 text-brand-primary shrink-0" />
            Receita Líquida (93%)
          </div>

          <div className="mb-6 sm:mb-8 relative z-10">
            <div className="scale-90 origin-left sm:scale-100">
              <PriceTicker value={financials.net} />
            </div>
            <p className="text-feedback-success text-xs sm:text-sm mt-2 flex items-start sm:items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 sm:mt-0" /> 
              {period === "current" && realGrossVolume === 0 ? "Aguardando faturamento no Pipeline" : "Custódia liberada para saque"}
            </p>
          </div>

          {/* Breakdown Transparente do Take Rate Responsivo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-5 sm:pt-6 border-t border-brand-border/50 relative z-10">
            <div>
              <p className="text-brand-muted text-[10px] sm:text-xs uppercase mb-1">Volume Bruto Transacionado</p>
              <p className="font-mono text-white text-base sm:text-lg">
                R$ {financials.gross.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <p className="text-brand-muted text-[10px] sm:text-xs uppercase mb-1 flex items-center gap-1">
                Fee da Plataforma (7%)
              </p>
              <p className="font-mono text-brand-accent text-base sm:text-lg">
                - R$ {financials.fee.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Card 2: Alerta Just-in-Time Dinâmico */}
        <motion.div variants={cardVariants} className="bg-brand-surface border border-brand-border rounded-2xl p-5 sm:p-6 shadow-glass flex flex-col relative overflow-hidden">
          <div className="flex items-center gap-2 mb-4 text-brand-muted font-medium text-xs sm:text-sm uppercase tracking-wider">
            <AlertCircle className={`w-4 h-4 shrink-0 ${jitCount > 0 ? "text-feedback-warning" : "text-emerald-400"}`} />
            SLA de Produção
          </div>
          <div className="flex-1 flex flex-col justify-center items-center text-center py-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-brand-border/50 flex items-center justify-center mb-4 relative">
              <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                <circle cx="50%" cy="50%" r="44%" stroke="currentColor" strokeWidth="4" fill="transparent" className={`transition-all duration-1000 ${jitCount > 0 ? "text-feedback-warning" : "text-emerald-400"}`} strokeDasharray="276" strokeDashoffset={dashOffset} />
              </svg>
              <span className="text-xl sm:text-2xl font-bold text-white">{jitPercentage}%</span>
            </div>
            <h3 className="text-white font-medium text-sm sm:text-base">Capacidade JIT</h3>
            <p className="text-brand-muted text-xs mt-2">
              {jitCount > 0 
                ? `Você possui ${jitCount} ordens em regime Back-to-Back ativas.` 
                : "Operação rodando com estoque físico estável."}
            </p>
          </div>
        </motion.div>

        {/* Card 3: Empty State vs Active RFQs Dinâmico */}
        <motion.div variants={cardVariants} className="md:col-span-3 h-full">
          {pendingRFQs === 0 ? (
            <div className="h-full bg-brand-dark border border-dashed border-brand-border rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center group transition-colors hover:border-brand-primary/50">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-surface rounded-full flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform shrink-0">
                <Inbox className="w-5 h-5 sm:w-6 sm:h-6 text-brand-muted group-hover:text-brand-primary transition-colors" />
              </div>
              <h3 className="text-white font-medium text-sm sm:text-base mb-1">Nenhuma RFQ Pendente</h3>
              <p className="text-brand-muted text-xs sm:text-sm max-w-md">
                Você não possui solicitações de cotação ou aprovações pendentes no momento.
              </p>
            </div>
          ) : (
            <Link href="/dashboard/approvals" className="block h-full bg-gradient-to-br from-brand-surface to-brand-primary/10 border border-brand-primary/30 hover:border-brand-primary rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center transition-all group shadow-[0_0_30px_rgba(79,70,229,0.15)] relative overflow-hidden">
              <div className="absolute inset-0 bg-brand-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-brand-primary/20 rounded-full flex items-center justify-center mb-3 sm:mb-4 border border-brand-primary/50 relative shrink-0">
                <FileSignature className="w-6 h-6 sm:w-7 sm:h-7 text-brand-primary" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-brand-accent text-[9px] font-bold text-brand-dark items-center justify-center">{pendingRFQs}</span>
                </span>
              </div>
              <h3 className="text-white font-medium text-base sm:text-lg mb-1 group-hover:text-brand-primary transition-colors">Ação Requerida</h3>
              <p className="text-brand-muted text-xs sm:text-sm max-w-md mb-4">
                Você possui <span className="text-white font-bold">{pendingRFQs} proposta(s)</span> pendentes no Pipeline de Aprovação.
              </p>
              <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-brand-primary">
                Acessar Pipeline <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          )}
        </motion.div>

      </motion.div>
    </div>
  );
}