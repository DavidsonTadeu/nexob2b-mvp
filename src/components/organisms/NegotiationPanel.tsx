"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, MessageSquare, AlertCircle, Clock, X, CheckCircle2 } from "lucide-react";
import { PriceTicker } from "@/components/atoms/PriceTicker";
import { useRouter } from "next/navigation";
import { useNexoStore } from "@/store/useNexoStore";
import { showToast } from "@/components/molecules/PremiumToast";

// Configurações do Motor de Regras (Simulando dados do Prisma/PostgreSQL)
const RULES = {
  tier1: { max: 100, price: 10.00 },
  tier2: { max: 1000, price: 8.00 },
  physicalStock: 500,
  extendedSlaDays: 15,
};

export function NegotiationPanel() {
  const router = useRouter();
  const createOrder = useNexoStore(state => state.createOrder);

  const [volume, setVolume] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [proposalSent, setProposalSent] = useState(false);
  const [targetPrice, setTargetPrice] = useState(""); // Captura o input do modal

  // Lógica de cálculo de estado
  const currentPrice = volume <= RULES.tier1.max ? RULES.tier1.price : RULES.tier2.price;
  const isBackToBack = volume > RULES.physicalStock && volume <= RULES.tier2.max;
  const requiresNegotiation = volume > RULES.tier2.max;

  const handleVolumeChange = (increment: number) => {
    setVolume((prev) => Math.max(10, prev + increment));
    setProposalSent(false); // Reseta o status se o usuário mudar de ideia
  };

  // Fiação 1: Caminho de Compra Direta
  const handleDirectOrder = () => {
    const isJIT = volume > RULES.physicalStock;
    const newOrderId = `PO-${Math.floor(1000 + Math.random() * 9000)}`;
    const totalAmount = currentPrice * volume; // Calcula o valor bruto da ordem

    // Salva no Zustand
    createOrder({
      id: newOrderId,
      sku: "PAR-TIT-M8", // SKU fixo do nosso simulador
      amount: totalAmount,
      volume: volume,
      isJIT
    });

    showToast({
      type: isJIT ? "alert" : "success",
      title: isJIT ? "Produção JIT" : "Ordem Gerada",
      message: isJIT 
        ? `A Ordem ${newOrderId} foi gerada com SLA estendido.` 
        : `Ordem ${newOrderId} enviada para o pipeline de aprovação.`
    });

    // Rota direta para o Documento Final
    router.push(`/checkout/${newOrderId}`);
  };

  // Fiação 2: Caminho de Negociação (RFQ -> War Room)
  const handleSendProposal = (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(false);
    setProposalSent(true);

    const isJIT = volume > RULES.physicalStock;
    const newOrderId = `PO-${Math.floor(1000 + Math.random() * 9000)}`;
    const requestedTotal = Number(targetPrice) || (currentPrice * volume);

    // Salva no Zustand com o valor sugerido pelo usuário
    createOrder({
      id: newOrderId,
      sku: "PAR-TIT-M8",
      amount: requestedTotal,
      volume: volume,
      isJIT
    });

    showToast({
      type: "success",
      title: "War Room Aberta",
      message: `Redirecionando para negociação ativa da Ordem ${newOrderId}...`
    });

    // Joga o usuário para o terminal de chat dinâmico
    setTimeout(() => {
        router.push(`/negotiation/${newOrderId}`);
    }, 600);
  };

  return (
    <div className="w-full max-w-2xl p-10 bg-brand-surface border border-brand-border rounded-2xl shadow-glass flex flex-col items-center gap-8 relative z-10">
      
      {/* Cabeçalho */}
      <div className="text-center space-y-2 w-full">
        <h2 className="text-2xl font-semibold tracking-tight text-white">
          Configurar Ordem (PO)
        </h2>
        <p className="text-brand-muted text-sm">SKU: PAR-TIT-M8 • Parafuso de Titânio</p>
      </div>

      {/* Alerta Inteligente de Back-to-Back (Virtual Stock) */}
      <AnimatePresence>
        {isBackToBack && !requiresNegotiation && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            className="w-full bg-feedback-warning/10 border border-feedback-warning/30 text-feedback-warning rounded-lg p-4 flex items-start gap-3"
          >
            <Clock className="w-5 h-5 mt-0.5 shrink-0" />
            <div className="text-sm">
              <strong className="block font-medium mb-1">Produção Just-in-Time Ativada</strong>
              O volume excede nosso estoque físico de {RULES.physicalStock} un. 
              Garantimos o pedido via Back-to-Back com SLA estendido para +{RULES.extendedSlaDays} dias úteis.
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Alerta de Status: Proposta Enviada */}
      <AnimatePresence>
        {proposalSent && requiresNegotiation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full bg-brand-primary/10 border border-brand-primary/40 text-brand-primary rounded-lg p-4 flex items-center gap-3"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-sm font-medium">Conectando terminal ao banco de dados...</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Odômetro de Preço Animado */}
      <div className="py-6 w-full flex flex-col items-center">
        <PriceTicker 
          value={requiresNegotiation ? 0 : currentPrice} 
          isDiscounted={volume > RULES.tier1.max && !requiresNegotiation}
        />
        {requiresNegotiation && (
          <span className="text-brand-accent text-sm mt-2 font-medium tracking-wide">
            Volume customizado. Sujeito a cotação.
          </span>
        )}
      </div>

      {/* Controles e Botão Principal */}
      <div className="flex flex-col sm:flex-row items-center gap-6 w-full justify-center">
        
        <div className="flex items-center gap-4 bg-brand-dark p-2 rounded-lg border border-brand-border">
          <button 
            onClick={() => handleVolumeChange(-100)}
            className="w-10 h-10 rounded-md bg-brand-surface text-white hover:bg-brand-border transition-colors"
          >-</button>
          <div className="flex flex-col items-center min-w-[80px]">
            <span className="font-mono text-xl font-medium">{volume}</span>
            <span className="text-[10px] text-brand-muted uppercase">Unid.</span>
          </div>
          <button 
            onClick={() => handleVolumeChange(100)}
            className="w-10 h-10 rounded-md bg-brand-surface text-white hover:bg-brand-border transition-colors"
          >+</button>
        </div>

        {/* Morphing Button com Shared Layout */}
        <div className="relative flex-1 flex justify-center w-full">
          <AnimatePresence mode="wait">
            {!requiresNegotiation ? (
              <motion.button
                key="buy-direct"
                layoutId="action-button"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onClick={handleDirectOrder}
                className="flex items-center justify-center gap-2 w-full max-w-[280px] h-14 rounded-lg bg-brand-primary text-white hover:bg-indigo-500 transition-colors shadow-glow font-medium"
              >
                <ShoppingCart className="w-5 h-5" />
                Gerar Ordem Direta
              </motion.button>
            ) : (
              <motion.button
                key="request-quote"
                layoutId="action-button"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onClick={() => setIsModalOpen(true)}
                disabled={proposalSent}
                className="flex items-center justify-center gap-2 w-full max-w-[280px] h-14 rounded-lg bg-transparent border-2 border-brand-accent text-brand-accent hover:bg-brand-accent/10 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MessageSquare className="w-5 h-5" />
                {proposalSent ? "Redirecionando..." : "Solicitar Cotação"}
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* O Modal Glassmorphism de RFQ */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-brand-dark/80 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-brand-surface border border-brand-border rounded-xl shadow-2xl p-6"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-brand-muted hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-xl font-semibold mb-2">Proposta Comercial (RFQ)</h3>
              <p className="text-brand-muted text-sm mb-6">
                Você está solicitando {volume} unidades. Envie sua proposta de preço global para análise do fornecedor.
              </p>

              <form onSubmit={handleSendProposal} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-brand-muted mb-1">Preço Global Alvo (R$)</label>
                  <input 
                    type="number" 
                    required
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    placeholder="Ex: 7500.00"
                    className="w-full bg-brand-dark border border-brand-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-primary transition-colors font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-muted mb-1">Mensagem ao Fornecedor</label>
                  <textarea 
                    rows={3}
                    placeholder="Justifique seu volume ou exija condições de entrega..."
                    className="w-full bg-brand-dark border border-brand-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-primary transition-colors resize-none"
                  />
                </div>
                <div className="pt-2 flex justify-end">
                  <button 
                    type="submit"
                    className="px-6 py-3 rounded-lg bg-brand-accent text-brand-dark font-semibold hover:bg-cyan-400 transition-colors"
                  >
                    Abrir Sala de Guerra
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}