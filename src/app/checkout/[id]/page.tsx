"use client";

import { useNexoStore } from "@/store/useNexoStore";
import { useParams, useRouter } from "next/navigation";
import { FileText, ShieldAlert, ArrowLeft, Printer, Activity, CheckCircle2, Clock, ShieldCheck, UserCircle, Building2 } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function POSummaryPage() {
  const params = useParams();
  const router = useRouter();
  const orders = useNexoStore((state) => state.orders);
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"document" | "audit">("document");

  // Evita erros de hidratação do Zustand
  useEffect(() => setIsMounted(true), []);

  if (!isMounted) return null;

  const order = orders.find((o) => o.id === params.id);

  if (!order) {
    return (
      <div className="flex h-screen items-center justify-center text-brand-muted bg-brand-dark">
        <div className="text-center space-y-4">
          <FileText className="w-12 h-12 text-brand-muted mx-auto" />
          <p>Ordem não encontrada ou sessão expirada.</p>
        </div>
      </div>
    );
  }

  // Helpers para o Rastro de Auditoria baseado no Estado do Zustand
  const getProgressWidth = () => {
    switch(order.state) {
      case "provider": return "25%";
      case "manager": return "50%";
      case "payment": return "75%";
      case "completed": return "100%";
      default: return "0%";
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark p-6 md:p-12 flex justify-center">
      <div className="w-full max-w-4xl flex flex-col gap-6">
        
        {/* Controles e Navegação de Abas */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-brand-muted hover:text-white transition-colors w-full md:w-auto">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </button>
          
          <div className="flex bg-brand-surface border border-brand-border rounded-lg p-1 w-full md:w-auto">
            <button 
              onClick={() => setActiveTab("document")}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${activeTab === "document" ? "bg-brand-border text-white shadow-sm" : "text-brand-muted hover:text-white"}`}
            >
              <FileText className="w-4 h-4" /> Documento Oficial
            </button>
            <button 
              onClick={() => setActiveTab("audit")}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${activeTab === "audit" ? "bg-brand-border text-white shadow-sm" : "text-brand-muted hover:text-white"}`}
            >
              <Activity className="w-4 h-4" /> Rastro de Auditoria
            </button>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-surface border border-brand-border text-brand-muted hover:text-white transition-colors w-full md:w-auto justify-center">
            <Printer className="w-4 h-4" /> Exportar PDF
          </button>
        </div>

        {/* --- Renderização Condicional das Abas --- */}
        {activeTab === "document" ? (
          
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#1C212B] border border-brand-border/80 rounded-sm p-10 md:p-16 shadow-2xl relative overflow-hidden">
            {/* Marca d'água de Status */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-30deg] opacity-5 pointer-events-none">
              <span className="text-8xl font-black uppercase tracking-widest text-white">
                {order.state === 'provider' ? 'Pendente' : order.state === 'completed' ? 'Liquidado' : 'Processando'}
              </span>
            </div>

            {/* Cabeçalho do Documento */}
            <div className="flex justify-between items-start border-b border-brand-border/50 pb-8 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                  <FileText className="text-brand-primary" /> Purchase Order
                </h1>
                <p className="text-brand-muted mt-2 font-mono uppercase tracking-wider text-sm">ID: {order.id}</p>
              </div>
              <div className="text-right">
                <p className="text-brand-muted text-xs uppercase font-bold mb-1">Status de Aprovação</p>
                {order.state === "completed" ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-feedback-success/10 border border-feedback-success/20 text-feedback-success rounded text-sm font-medium">
                    <ShieldCheck className="w-4 h-4" /> Pagamento Liberado
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-feedback-warning/10 border border-feedback-warning/20 text-feedback-warning rounded text-sm font-medium">
                    <ShieldAlert className="w-4 h-4" /> Aguardando Assinaturas
                  </div>
                )}
              </div>
            </div>

            {/* Dados do Pedido */}
            <div className="grid grid-cols-2 gap-8 mb-12 relative z-10">
              <div>
                <p className="text-brand-muted text-xs uppercase mb-1">Comprador</p>
                <p className="text-white font-medium">Departamento de Suprimentos</p>
                <p className="text-brand-muted text-sm mt-1">NexoB2B Corporate Account</p>
              </div>
              <div>
                <p className="text-brand-muted text-xs uppercase mb-1">Data de Emissão</p>
                <p className="text-white font-mono">{new Date(order.createdAt).toLocaleDateString('pt-BR')}</p>
              </div>
            </div>

            {/* Tabela de Itens */}
            <div className="w-full mb-8 relative z-10">
              <div className="grid grid-cols-12 gap-4 border-b border-brand-border/50 pb-2 text-brand-muted text-xs uppercase font-bold">
                <div className="col-span-6">Descrição / SKU</div>
                <div className="col-span-2 text-center">Volume</div>
                <div className="col-span-4 text-right">Total Bruto</div>
              </div>
              <div className="grid grid-cols-12 gap-4 py-4 items-center border-b border-brand-border/20">
                <div className="col-span-6">
                  <p className="text-white font-medium">{order.sku}</p>
                  {order.isJIT && (
                    <span className="inline-block mt-1 bg-feedback-warning/10 text-feedback-warning text-[10px] px-1.5 py-0.5 rounded uppercase font-bold">
                      Regime JIT (SLA Estendido)
                    </span>
                  )}
                </div>
                <div className="col-span-2 text-center font-mono text-white">{order.volume}</div>
                <div className="col-span-4 text-right font-mono text-lg text-white font-semibold">
                  R$ {order.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>

            <p className="text-brand-muted text-xs text-center mt-12 relative z-10">
              Este documento é gerado automaticamente pelo motor NexoB2B e registrado em sistema distribuído.
            </p>
          </motion.div>
          
        ) : (

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-brand-surface border border-brand-border rounded-xl p-8 shadow-glass h-full">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" /> Compliance Log
            </h2>
            <p className="text-brand-muted text-sm mb-8">Rastro de auditoria imutável do contrato <span className="font-mono text-brand-primary">{order.id}</span>.</p>
            
            {/* Barra de Progresso Master */}
            <div className="w-full h-2 bg-brand-dark rounded-full mb-10 overflow-hidden border border-brand-border/50 relative">
              <motion.div 
                initial={{ width: 0 }} animate={{ width: getProgressWidth() }} transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-brand-primary to-emerald-400 rounded-full"
              />
            </div>

            {/* Linha do Tempo B2B (Vertical) */}
            <div className="relative pl-6 space-y-8 border-l-2 border-brand-border/50 ml-4">
              
              {/* Event 1: Criação (Sempre true se o objeto existe) */}
              <div className="relative">
                <div className="absolute -left-[35px] w-6 h-6 rounded-full bg-emerald-400/20 border-2 border-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-white font-medium text-sm">Ordem de Compra Emitida</h4>
                  <p className="text-brand-muted text-xs mt-1">Gerada via NexoB2B Engine. Volume: {order.volume} un.</p>
                  <p className="text-brand-muted text-[10px] font-mono mt-1 opacity-70">Timestamp: {new Date(order.createdAt).toISOString()}</p>
                </div>
              </div>

              {/* Event 2: Fornecedor (Gate 1) */}
              <div className="relative">
                <div className={`absolute -left-[35px] w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${order.providerAuth ? "bg-emerald-400/20 border-emerald-400" : "bg-brand-dark border-brand-border"}`}>
                  {order.providerAuth ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Building2 className="w-3 h-3 text-brand-muted" />}
                </div>
                <div className={order.providerAuth ? "opacity-100" : "opacity-40"}>
                  <h4 className="text-white font-medium text-sm">Gate 1: Aceite do Fornecedor</h4>
                  <p className="text-brand-muted text-xs mt-1">Garantia de SLA e confirmação de estoque.</p>
                  {order.providerAuth && <p className="text-emerald-400 text-[10px] font-mono mt-1 uppercase font-bold">Selo de Autenticidade Registrado</p>}
                </div>
              </div>

              {/* Event 3: Comprador/Gestor (Gate 2) */}
              <div className="relative">
                <div className={`absolute -left-[35px] w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${order.managerAuth ? "bg-emerald-400/20 border-emerald-400" : "bg-brand-dark border-brand-border"}`}>
                  {order.managerAuth ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <UserCircle className="w-3 h-3 text-brand-muted" />}
                </div>
                <div className={order.managerAuth ? "opacity-100" : "opacity-40"}>
                  <h4 className="text-white font-medium text-sm">Gate 2: Empenho Financeiro (Gestor)</h4>
                  <p className="text-brand-muted text-xs mt-1">Aprovação de orçamento do Departamento de Suprimentos.</p>
                  {order.managerAuth && <p className="text-emerald-400 text-[10px] font-mono mt-1 uppercase font-bold">Orçamento Reservado</p>}
                </div>
              </div>

              {/* Event 4: Liquidação */}
              <div className="relative">
                <div className={`absolute -left-[35px] w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${order.state === "completed" ? "bg-brand-primary/20 border-brand-primary" : "bg-brand-dark border-brand-border"}`}>
                  {order.state === "completed" ? <Activity className="w-3 h-3 text-brand-primary" /> : <Clock className="w-3 h-3 text-brand-muted" />}
                </div>
                <div className={order.state === "completed" ? "opacity-100" : "opacity-40"}>
                  <h4 className="text-white font-medium text-sm">Contrato Liquidado</h4>
                  <p className="text-brand-muted text-xs mt-1">Transação processada com Split de Pagamento (NexoB2B 7%).</p>
                  {order.state === "completed" && <p className="text-brand-primary text-[10px] font-mono mt-1 uppercase font-bold">Transação Finalizada</p>}
                </div>
              </div>

            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}