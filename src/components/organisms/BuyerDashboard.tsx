"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { 
  Briefcase, TrendingDown, ShieldCheck, PieChart, 
  Target, AlertTriangle, Building
} from "lucide-react";
import { PriceTicker } from "@/components/atoms/PriceTicker";
import { useNexoStore } from "@/store/useNexoStore";

const TOTAL_BUDGET = 250000.00; // Orçamento corporativo simulado (Q1)

// Variantes de Animação com tipagem blindada (as const)
const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const cardVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 120, damping: 15 } } };

export function BuyerDashboard() {
  const orders = useNexoStore((state) => state.orders);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  // Inteligência de Dados do Comprador
  const { totalConsumed, projectedSavings, activeContracts } = useMemo(() => {
    let consumed = 0;
    let savings = 0;
    let contracts = 0;

    orders.forEach(order => {
      // O comprador considera o gasto assim que o fornecedor aceita (Gate 1)
      if (order.state !== "provider") {
        consumed += order.amount;
        contracts += 1;
        
        // Simulação de Savings: Assumimos que a plataforma economizou 12% via negociação RFQ ou Tiered Pricing
        savings += (order.amount / 0.88) - order.amount; 
      }
    });

    return { totalConsumed: consumed, projectedSavings: savings, activeContracts: contracts };
  }, [orders]);

  const availableBudget = Math.max(0, TOTAL_BUDGET - totalConsumed);
  const budgetPercentage = Math.min(100, (totalConsumed / TOTAL_BUDGET) * 100);

  // Mock de distribuição por departamento
  const departmentData = [
    { name: "TI & Infra", spend: totalConsumed * 0.65 },
    { name: "Manutenção", spend: totalConsumed * 0.25 },
    { name: "Operações", spend: totalConsumed * 0.10 },
  ];

  if (!isMounted) return null;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-0">
      
      {/* 1. Visão Geral do Orçamento (Col-Span-2) */}
      <motion.div variants={cardVariants} className="md:col-span-2 bg-brand-surface border border-brand-border rounded-2xl p-6 sm:p-8 shadow-glass flex flex-col justify-between relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-2 mb-4 sm:mb-6 text-brand-muted font-medium text-[10px] sm:text-sm uppercase tracking-wider relative z-10">
          <Target className="w-4 h-4 text-indigo-400 shrink-0" /> Orçamento Q1 (Corporate)
        </div>

        <div className="mb-6 sm:mb-8 relative z-10">
          <p className="text-brand-muted text-[10px] sm:text-xs uppercase mb-1">Total Consumido</p>
          <PriceTicker value={totalConsumed} className="text-4xl sm:text-5xl text-white font-bold" />
          
          {/* Barra de Progresso do Orçamento */}
          <div className="w-full h-3 bg-brand-dark rounded-full mt-4 sm:mt-6 overflow-hidden border border-brand-border/50">
            <motion.div 
              initial={{ width: 0 }} animate={{ width: `${budgetPercentage}%` }} transition={{ duration: 1.5, ease: "easeOut" }}
              className={`h-full rounded-full ${budgetPercentage > 85 ? 'bg-feedback-warning' : 'bg-indigo-500'}`}
            />
          </div>
          <div className="flex justify-between mt-2 text-[10px] sm:text-xs font-mono">
            <span className="text-brand-muted">0%</span>
            <span className={`${budgetPercentage > 85 ? 'text-feedback-warning animate-pulse' : 'text-indigo-400'}`}>
              {budgetPercentage.toFixed(1)}% Utilizado
            </span>
            <span className="text-brand-muted">R$ {(TOTAL_BUDGET / 1000).toFixed(0)}k</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 sm:pt-6 border-t border-brand-border/50 relative z-10">
          <div>
            <p className="text-brand-muted text-[10px] sm:text-xs uppercase mb-1">Disponível para Empenho</p>
            <p className="font-mono text-emerald-400 text-base sm:text-lg font-bold">R$ {availableBudget.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
          </div>
          <div>
            <p className="text-brand-muted text-[10px] sm:text-xs uppercase mb-1 flex items-center gap-1">
              Contratos Ativos <Briefcase className="w-3 h-3" />
            </p>
            <p className="font-mono text-white text-base sm:text-lg">{activeContracts} Fornecedores</p>
          </div>
        </div>
      </motion.div>

      {/* 2. O Argumento de Vendas: Savings (Economia Gerada) */}
      <motion.div variants={cardVariants} className="bg-gradient-to-br from-brand-surface to-emerald-900/20 border border-emerald-500/30 rounded-2xl p-5 sm:p-6 shadow-[0_0_30px_rgba(16,185,129,0.1)] flex flex-col relative overflow-hidden group">
        <div className="absolute inset-0 bg-emerald-400/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="flex items-center gap-2 mb-4 text-emerald-400 font-bold text-xs sm:text-sm uppercase tracking-wider">
          <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" /> Savings Gerados
        </div>
        
        <div className="flex-1 flex flex-col justify-center">
          <p className="text-brand-muted text-xs sm:text-sm mb-2 sm:mb-4">Economia acumulada através do motor de negociação (RFQ) e Tiered Pricing da plataforma:</p>
          <PriceTicker value={projectedSavings} className="text-3xl sm:text-4xl text-emerald-400 font-bold drop-shadow-[0_0_10px_rgba(16,185,129,0.3)] mb-4" />
          
          <div className="bg-brand-dark/50 border border-emerald-500/20 rounded-lg p-3 backdrop-blur-sm">
            <p className="text-[10px] sm:text-xs text-brand-muted flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              ROI Positivo: A plataforma já se pagou neste trimestre superando os custos de licenciamento em 340%.
            </p>
          </div>
        </div>
      </motion.div>

      {/* 3. Distribuição por Centro de Custo */}
      <motion.div variants={cardVariants} className="md:col-span-3 bg-brand-surface border border-brand-border rounded-2xl p-5 sm:p-8 shadow-glass min-h-[300px] sm:min-h-[350px] flex flex-col">
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
          <div>
            <h3 className="text-white font-semibold flex items-center gap-2 text-sm sm:text-base"><Building className="w-4 h-4 text-brand-muted shrink-0" /> Spend Management por CC (Centro de Custo)</h3>
            <p className="text-brand-muted text-xs sm:text-sm">Distribuição do orçamento consumido nos departamentos.</p>
          </div>
        </div>
        
        <div className="flex-1 w-full relative left-[-15px] sm:left-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={departmentData} layout="vertical" margin={{ top: 0, right: 0, left: 30, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#2A303C" />
              <XAxis type="number" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value/1000}k`} />
              <YAxis dataKey="name" type="category" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} width={100} />
              <Tooltip 
                cursor={{ fill: '#2A303C', opacity: 0.4 }}
                contentStyle={{ backgroundColor: '#1C212B', borderColor: '#374151', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                itemStyle={{ color: '#818CF8', fontWeight: 'bold' }}
                formatter={(value: any) => [`R$ ${Number(value).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`, 'Consumido']}
              />
              <Bar dataKey="spend" radius={[0, 4, 4, 0]} barSize={24}>
                {departmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#6366F1' : index === 1 ? '#8B5CF6' : '#64748B'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

    </motion.div>
  );
}