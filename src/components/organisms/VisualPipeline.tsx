"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Clock, ShieldCheck, DollarSign, Building2, UserCircle } from "lucide-react";

// Importação da Store Global (A Fiação)
import { useNexoStore, Order } from "@/store/useNexoStore";

export function VisualPipeline() {
  // Puxando os dados REAIS do Zustand (persistidos no LocalStorage)
  const { orders, updateOrderState } = useNexoStore();
  
  // Simulador de Papel (Mantido para demonstrar o controle de acesso)
  const [currentUserRole, setCurrentUserRole] = useState<"provider" | "manager">("provider");

  // Renderizador das Colunas responsivas
  const Column = ({ title, stateKey, icon: Icon }: { title: string; stateKey: Order["state"]; icon: any }) => {
    const columnOrders = orders.filter((o) => o.state === stateKey);

    return (
      <div className="flex flex-col bg-black/20 rounded-xl border border-white/5 p-4 min-h-[500px] sm:min-h-[600px] w-[85vw] sm:w-[320px] lg:w-auto shrink-0 snap-center lg:flex-1">
        <div className="flex items-center gap-2 mb-5 sm:mb-6 text-brand-muted font-medium text-xs sm:text-sm uppercase tracking-wider pb-3 sm:pb-4 border-b border-brand-border/50">
          <Icon className="w-4 h-4 shrink-0" />
          <span className="truncate">{title}</span>
          <span className="ml-auto bg-brand-surface px-2 py-0.5 rounded-full text-[10px] sm:text-xs shrink-0">
            {columnOrders.length}
          </span>
        </div>

        <div className="flex flex-col gap-3 sm:gap-4 overflow-y-auto custom-scrollbar pr-1 pb-4">
          <AnimatePresence>
            {columnOrders.map((order) => (
              <OrderCard 
                key={order.id} 
                order={order} 
                currentUserRole={currentUserRole}
                // Dispara a atualização global no Zustand
                onAction={updateOrderState} 
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 py-6 relative z-10">
      
      {/* Header e Toggle de Contexto Responsivos */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 sm:mb-8 gap-4 sm:gap-6">
        <div className="w-full md:w-auto">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <ShieldCheck className="text-brand-primary w-6 h-6 sm:w-8 sm:h-8 shrink-0" />
            Aprovação Dual-Gate
          </h1>
          <p className="text-brand-muted mt-1 text-sm sm:text-base">
            Nenhuma transação é liquidada sem a garantia de entrega e a autorização de orçamento.
          </p>
        </div>

        {/* Simulador de Visão (Ocupa 100% no mobile para facilitar o toque) */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 bg-brand-surface border border-brand-border rounded-lg p-1.5 w-full sm:w-auto">
          <span className="text-[10px] sm:text-xs text-brand-muted uppercase font-medium ml-2 w-full sm:w-auto mb-1 sm:mb-0">Simular Visão:</span>
          <button 
            onClick={() => setCurrentUserRole("provider")}
            className={`flex-1 sm:flex-none px-3 py-2 sm:py-1.5 rounded text-xs sm:text-sm transition-colors font-medium ${currentUserRole === "provider" ? "bg-brand-primary text-white shadow-sm" : "text-brand-muted hover:text-white bg-brand-dark/50 sm:bg-transparent"}`}
          >
            Fornecedor
          </button>
          <button 
            onClick={() => setCurrentUserRole("manager")}
            className={`flex-1 sm:flex-none px-3 py-2 sm:py-1.5 rounded text-xs sm:text-sm transition-colors font-medium ${currentUserRole === "manager" ? "bg-brand-primary text-white shadow-sm" : "text-brand-muted hover:text-white bg-brand-dark/50 sm:bg-transparent"}`}
          >
            Comprador
          </button>
        </div>
      </div>

      {/* Kanban Board: Flex com Snap no Mobile, Grid no Desktop */}
      <div className="flex lg:grid lg:grid-cols-4 gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory pb-8 custom-scrollbar">
        <Column title="Gate 1: Fornecedor" stateKey="provider" icon={Building2} />
        <Column title="Gate 2: Financeiro" stateKey="manager" icon={UserCircle} />
        <Column title="Pronto p/ Pagamento" stateKey="payment" icon={DollarSign} />
        <Column title="Concluído" stateKey="completed" icon={CheckCircle2} />
      </div>
    </div>
  );
}

// Card Individual B2B (Organismo Interno)
function OrderCard({ 
  order, 
  currentUserRole,
  onAction 
}: { 
  order: Order; 
  currentUserRole: string;
  onAction: (id: string, actionRole: "provider" | "manager" | "pay") => void 
}) {
  
  // Cálculo do Take Rate (7%) para visão administrativa
  const fee = order.amount * 0.07;
  
  // Lógica Visual: O card exige ação do usuário logado agora?
  const requiresMyAction = 
    (order.state === "provider" && currentUserRole === "provider") || 
    (order.state === "manager" && currentUserRole === "manager");

  return (
    <motion.div
      layout
      layoutId={order.id}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
      className={`bg-brand-surface/80 backdrop-blur-md border rounded-xl p-4 sm:p-5 shadow-glass flex flex-col gap-3 sm:gap-4 relative overflow-hidden transition-colors ${
        requiresMyAction ? "border-brand-accent shadow-[0_0_15px_rgba(6,182,212,0.15)]" : "border-brand-border/50"
      }`}
    >
      {/* Efeito Pulsante para Cards de Ação Imediata */}
      {requiresMyAction && (
        <div className="absolute top-0 left-0 w-1 h-full bg-brand-accent animate-pulse" />
      )}

      {/* ID e Badge Responsivos */}
      <div className="flex justify-between items-start gap-2">
        <span className="font-mono text-[10px] sm:text-xs text-brand-muted">{order.id}</span>
        {order.providerAuth && order.managerAuth ? (
          <span className="bg-feedback-success/10 text-feedback-success text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 sm:py-1 rounded uppercase font-bold flex items-center gap-1 shrink-0">
            <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Aprovado
          </span>
        ) : (
          <span className="bg-feedback-warning/10 text-feedback-warning text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 sm:py-1 rounded uppercase font-bold flex items-center gap-1 shrink-0">
            <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Pendente
          </span>
        )}
      </div>

      {/* Resumo do Pedido */}
      <div>
        <h3 className="text-white text-xs sm:text-sm font-medium leading-snug truncate">{order.sku}</h3>
        {order.isJIT && (
          <span className="inline-block mt-1 bg-feedback-warning/10 text-feedback-warning text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded uppercase font-bold">
            JIT Ativo
          </span>
        )}
        <p className="font-mono text-base sm:text-lg font-semibold text-white mt-1">
          R$ {order.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </p>
        
        {/* Visão de Fee Oculta */}
        <p className="text-[9px] sm:text-[10px] text-brand-muted mt-1 uppercase font-mono truncate">
          Take Rate (7%): R$ {fee.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </p>
      </div>

      {/* Botões de Ação Dinâmicos (O "Gate") */}
      <div className="pt-3 border-t border-brand-border/50 flex items-center justify-between gap-2">
        
        {/* Avatar Placeholder */}
        <div className="flex -space-x-2 shrink-0">
          {order.state === "provider" && <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-brand-primary/20 flex items-center justify-center border border-brand-surface z-10" title="Aguardando Fornecedor"><Building2 className="w-3 h-3 text-brand-primary" /></div>}
          {order.state === "manager" && <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-feedback-warning/20 flex items-center justify-center border border-brand-surface z-10" title="Aguardando Gestor"><UserCircle className="w-3 h-3 text-feedback-warning" /></div>}
        </div>

        {/* Lógica de Botões */}
        {order.state === "provider" && currentUserRole === "provider" && (
           <button onClick={() => onAction(order.id, "provider")} className="text-[10px] sm:text-xs bg-brand-accent/10 hover:bg-brand-accent/20 text-brand-accent px-2 sm:px-3 py-1.5 rounded transition-colors font-medium shrink-0">Garantir SLA</button>
        )}
        {order.state === "manager" && currentUserRole === "manager" && (
           <button onClick={() => onAction(order.id, "manager")} className="text-[10px] sm:text-xs bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary px-2 sm:px-3 py-1.5 rounded transition-colors font-medium shrink-0">Aprovar Orçamento</button>
        )}
        {order.state === "payment" && (
           <button onClick={() => onAction(order.id, "pay")} className="text-[10px] sm:text-xs bg-feedback-success hover:bg-green-500 text-white px-2 sm:px-3 py-1.5 rounded transition-colors font-medium shadow-glow shrink-0">Liquidar</button>
        )}
        
      </div>
    </motion.div>
  );
}