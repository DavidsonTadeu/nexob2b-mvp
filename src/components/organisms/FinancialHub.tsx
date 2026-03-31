"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { 
  TrendingUp, Activity, ArrowDownRight, ShieldCheck, 
  Wallet, Clock, CheckCircle2, Lock, Layers3
} from "lucide-react";
import { PriceTicker } from "@/components/atoms/PriceTicker";
import { useNexoStore } from "@/store/useNexoStore";

// --- 1. Motor Financeiro (CTO) ---
function useFinancialSplit(grossAmount: number) {
  const TAKE_RATE = 0.07;
  const grossInCents = Math.round(grossAmount * 100);
  const feeInCents = Math.round(grossInCents * TAKE_RATE);
  const netInCents = grossInCents - feeInCents;

  return {
    gross: grossAmount,
    fee: feeInCents / 100,
    net: netInCents / 100,
  };
}

// --- 2. Tooltip Customizado B2B (Creative Dev) ---
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const rawVolume = payload[0].value;
    const split = useFinancialSplit(rawVolume);

    return (
      <div className="bg-brand-surface/95 backdrop-blur-md border border-brand-border p-3 sm:p-4 rounded-xl shadow-2xl text-xs sm:text-sm">
        <p className="text-white font-medium mb-2 sm:mb-3 border-b border-brand-border/50 pb-2">{label}</p>
        <div className="space-y-2">
          <div className="flex justify-between items-center gap-4 sm:gap-6">
            <span className="text-brand-muted uppercase">Volume Bruto</span>
            <span className="text-white font-mono">R$ {split.gross.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between items-center gap-4 sm:gap-6">
            <span className="text-purple-400 uppercase flex items-center gap-1"><ShieldCheck className="w-3 h-3"/> Fee NexoB2B (7%)</span>
            <span className="text-purple-400 font-mono">- R$ {split.fee.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between items-center gap-4 sm:gap-6 pt-2 border-t border-brand-border/50">
            <span className="text-emerald-400 uppercase font-bold">Líquido (93%)</span>
            <span className="text-emerald-400 font-mono font-bold">R$ {split.net.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

// --- Componente Principal ---
export function FinancialHub() {
  const orders = useNexoStore((state) => state.orders);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  // Agregação Dinâmica de Dados do Zustand
  const { realGross, realPipeline } = useMemo(() => {
    let gross = 0;
    let pipeline = 0;
    
    orders.forEach(order => {
      // Receita Líquida: Apenas ordens prontas para pagamento ou concluídas
      if (order.state === "payment" || order.state === "completed") {
        gross += order.amount;
      }
      // Projeção: Ordens presas nos Gates de aprovação
      if (order.state === "provider" || order.state === "manager") {
        pipeline += order.amount;
      }
    });
    
    return { realGross: gross, realPipeline: pipeline };
  }, [orders]);

  // Gráfico Dinâmico: Histórico Base + Ação Atual
  const dynamicChartData = useMemo(() => {
    return [
      { date: "01 Mar", volume: 12500 },
      { date: "05 Mar", volume: 18400 },
      { date: "10 Mar", volume: 15200 },
      { date: "15 Mar", volume: 29800 },
      { date: "20 Mar", volume: 35000 },
      { date: "25 Mar", volume: 42300 },
      // O ponto de 'Hoje' reage aos negócios fechados na plataforma
      { date: "Hoje (Live)", volume: 42300 + realGross }, 
    ];
  }, [realGross]);

  const totalSplit = useFinancialSplit(realGross);
  const projectedPipeline = realPipeline;
  
  // Evita Hydration Mismatch
  if (!isMounted) return null;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 relative z-10 flex flex-col gap-6 sm:gap-8">
      
      {/* Header Analítico Responsivo */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 sm:gap-6">
        <div className="w-full lg:w-auto">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Activity className="text-emerald-400 w-6 h-6 sm:w-8 sm:h-8" />
            Financial Hub
          </h1>
          <p className="text-brand-muted mt-1 text-sm sm:text-base">Análise de fluxo de receita, projeções e liquidação.</p>
        </div>
        
        {/* Badges de Status Globais Dinâmicos */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 bg-brand-surface border border-brand-border rounded-lg p-2 w-full lg:w-auto">
          <div className="flex justify-center items-center gap-1.5 px-3 py-2 sm:py-1.5 bg-brand-dark rounded text-xs font-medium text-brand-muted border border-brand-border/50">
            <Clock className="w-3.5 h-3.5" /> Processando
          </div>
          <div className="flex justify-center items-center gap-1.5 px-3 py-2 sm:py-1.5 bg-brand-dark rounded text-xs font-medium text-purple-400 border border-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.15)]">
            <Lock className="w-3.5 h-3.5" /> Pipeline: R$ {(projectedPipeline / 1000).toFixed(1)}k
          </div>
        </div>
      </div>

      {/* Top Indicators - Stagger Animation */}
      <motion.div 
        initial="hidden" animate="show" 
        variants={{ show: { transition: { staggerChildren: 0.1 } } }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6"
      >
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring" } } }} className="bg-brand-surface border border-brand-border p-5 sm:p-6 rounded-2xl shadow-glass">
          <p className="text-brand-muted text-[10px] sm:text-xs uppercase tracking-wider mb-2 flex items-center gap-2"><Wallet className="w-4 h-4 text-emerald-400 shrink-0" /> Saldo Disponível (Líquido)</p>
          <PriceTicker value={totalSplit.net} className="text-3xl sm:text-4xl text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]" />
        </motion.div>

        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring" } } }} className="bg-brand-surface border border-brand-border p-5 sm:p-6 rounded-2xl shadow-glass">
          <p className="text-brand-muted text-[10px] sm:text-xs uppercase tracking-wider mb-2 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-brand-primary shrink-0" /> Volume Transacionado (Bruto)</p>
          <PriceTicker value={totalSplit.gross} className="text-3xl sm:text-4xl text-white" />
        </motion.div>

        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring" } } }} className="bg-brand-surface border border-brand-border p-5 sm:p-6 rounded-2xl shadow-glass">
          <p className="text-brand-muted text-[10px] sm:text-xs uppercase tracking-wider mb-2 flex items-center gap-2"><Clock className="w-4 h-4 text-brand-muted shrink-0" /> Projeção (Em Pipeline)</p>
          <PriceTicker value={projectedPipeline} className="text-3xl sm:text-4xl text-brand-muted/70" />
        </motion.div>
      </motion.div>

      {/* Main Content: Gráfico e Cascata */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Gráfico de Área (Col-Span-2) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
          className="xl:col-span-2 bg-brand-surface border border-brand-border rounded-2xl p-5 sm:p-6 shadow-glass flex flex-col min-h-[300px] sm:min-h-[400px]"
        >
          <div className="mb-4 sm:mb-6">
            <h3 className="text-white font-semibold text-sm sm:text-base">Revenue Flow</h3>
            <p className="text-brand-muted text-xs sm:text-sm">Crescimento do volume de vendas no período.</p>
          </div>
          
          <div className="flex-1 w-full h-full min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dynamicChartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2A303C" />
                <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
<YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$ ${value / 1000}k`} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#4F46E5', strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Area 
                  type="monotone" 
                  dataKey="volume" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorVolume)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* A Cascata Financeira (Art Director Masterpiece) */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3, type: "spring" }}
          className="bg-brand-surface border border-brand-border rounded-2xl p-6 sm:p-8 shadow-glass relative overflow-hidden"
        >
          {/* Background Decorativo */}
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <h3 className="text-white font-semibold mb-6 sm:mb-8 flex items-center gap-2 text-sm sm:text-base">
            <Layers3 className="w-5 h-5 text-brand-primary" />
            Cascata de Liquidação
          </h3>

          <div className="flex flex-col relative">
            {/* Linha conectora vertical cravada no centro dos ícones (w-12 = 48px -> centro = 24px) */}
            <div className="absolute left-[23px] top-10 bottom-10 w-0.5 bg-brand-border z-0" />

            {/* Step 1: Gross */}
            <div className="relative z-10 flex items-start gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="w-12 h-12 rounded-full bg-brand-dark border-2 border-brand-border flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div className="pt-1">
                <p className="text-brand-muted text-[10px] sm:text-xs uppercase tracking-wider mb-1">Volume Processado</p>
                <p className="text-lg sm:text-xl font-mono text-white">R$ {totalSplit.gross.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
              </div>
            </div>

            {/* Step 2: Take Rate (Roxo profundo) */}
            <div className="relative z-10 flex items-start gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="w-12 h-12 rounded-full bg-purple-500/10 border-2 border-purple-500/30 flex items-center justify-center shrink-0">
                <ArrowDownRight className="w-5 h-5 text-purple-400" />
              </div>
              <div className="pt-1">
                <p className="text-purple-400 text-[10px] sm:text-xs uppercase tracking-wider mb-1 flex items-center gap-1">
                  Taxa NexoB2B <span className="bg-purple-500/20 px-1.5 rounded text-[9px] sm:text-[10px] font-bold">7%</span>
                </p>
                <p className="text-lg sm:text-xl font-mono text-purple-400">- R$ {totalSplit.fee.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
              </div>
            </div>

            {/* Step 3: Net (Esmeralda) */}
            <div className="relative z-10 flex items-start gap-3 sm:gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-400/10 border-2 border-emerald-400/40 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="pt-1">
                <p className="text-emerald-400 text-[10px] sm:text-xs uppercase tracking-wider mb-1 font-bold">Líquido para Saque</p>
                <p className="text-2xl sm:text-3xl font-mono text-emerald-400 font-bold drop-shadow-[0_0_10px_rgba(16,185,129,0.4)]">
                  R$ {totalSplit.net.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>

          </div>

          <button className="w-full mt-8 sm:mt-10 py-3 sm:py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-brand-dark text-sm sm:text-base font-bold uppercase tracking-wider transition-colors shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            Solicitar Saque
          </button>
        </motion.div>

      </div>
    </div>
  );
}