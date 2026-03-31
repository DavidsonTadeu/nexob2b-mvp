"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, FileSignature, Clock, CheckCircle2, XCircle, ArrowRight, MessageSquare } from "lucide-react";

type MessageType = "text" | "proposal";
type ProposalStatus = "pending" | "accepted" | "rejected";

interface ChatMessage {
  id: string;
  sender: "me" | "counterpart";
  type: MessageType;
  text?: string;
  suggestedPrice?: number;
  suggestedSLA?: number;
  status?: ProposalStatus;
  timestamp: string;
}

interface NegotiationChatProps {
  orderId: string;
  currentAmount: number;
  onProposalAccepted: (newAmount: number) => void;
}

export function NegotiationChat({ orderId, currentAmount, onProposalAccepted }: NegotiationChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1", sender: "counterpart", type: "text", 
      text: "Olá! Recebemos sua RFQ. Para este volume, podemos negociar o SLA?",
      timestamp: "10:30 AM"
    }
  ]);
  
  const [inputMode, setInputMode] = useState<MessageType>("text");
  const [textInput, setTextInput] = useState("");
  const [priceInput, setPriceInput] = useState(currentAmount);
  const [slaInput, setSlaInput] = useState(15);
  const [isTyping, setIsTyping] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (inputMode === "text" && !textInput.trim()) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "me",
      type: inputMode,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ...(inputMode === "text" ? { text: textInput } : { suggestedPrice: priceInput, suggestedSLA: slaInput, status: "pending" })
    };

    setMessages((prev) => [...prev, newMessage]);
    setTextInput("");
    setInputMode("text");

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      if (newMessage.type === "proposal") {
        setMessages((prev) => [...prev, {
          id: `msg-${Date.now() + 1}`, sender: "counterpart", type: "proposal",
          suggestedPrice: newMessage.suggestedPrice! * 0.98,
          suggestedSLA: newMessage.suggestedSLA! + 5,
          status: "pending", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } else {
        setMessages((prev) => [...prev, {
          id: `msg-${Date.now() + 1}`, sender: "counterpart", type: "text",
          text: "Entendido. Vou analisar as condições com a diretoria.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }
    }, 2500);
  };

  const handleAction = (msgId: string, action: "accept" | "reject") => {
    setMessages((prev) => prev.map(msg => {
      if (msg.id !== msgId) return msg;
      if (action === "accept" && msg.suggestedPrice) {
        onProposalAccepted(msg.suggestedPrice);
      }
      return { ...msg, status: action === "accept" ? "accepted" : "rejected" };
    }));
  };

  return (
    <div className="flex flex-col h-[500px] sm:h-[600px] w-full bg-brand-dark/80 backdrop-blur-md border border-brand-border rounded-2xl overflow-hidden shadow-2xl relative">
      
      {/* Header da Sala de Guerra */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-brand-border/50 bg-brand-surface/90 flex justify-between items-center z-10 shrink-0">
        <div>
          <h3 className="text-white font-semibold flex items-center gap-2 text-sm sm:text-base">
            <MessageSquare className="w-4 h-4 text-brand-primary" /> War Room
          </h3>
          <p className="text-brand-muted text-[10px] sm:text-xs font-mono mt-0.5">PO: {orderId}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] sm:text-xs text-brand-muted uppercase tracking-wider">Online</span>
        </div>
      </div>

      {/* Histórico de Mensagens */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6 custom-scrollbar">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className={`flex flex-col max-w-[90%] sm:max-w-[85%] ${msg.sender === "me" ? "ml-auto items-end" : "mr-auto items-start"}`}
            >
              {msg.type === "text" ? (
                // Mensagem de Texto Comum
                <div className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm ${msg.sender === "me" ? "bg-brand-border text-white rounded-br-sm" : "bg-brand-surface border border-brand-border/50 text-white rounded-bl-sm"}`}>
                  {msg.text}
                </div>
              ) : (
                // Official Proposal Card (A Arte Híbrida)
                <div className={`flex flex-col w-full min-w-[240px] sm:min-w-[280px] p-4 sm:p-5 rounded-2xl shadow-glass ${
                  msg.sender === "me" 
                    ? "bg-gradient-to-br from-brand-primary/90 to-indigo-600/90 text-white rounded-br-sm border border-indigo-400/30" 
                    : "bg-brand-surface border border-brand-accent/40 rounded-bl-sm shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                }`}>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs uppercase font-bold tracking-wider mb-3 sm:mb-4 opacity-80">
                    <FileSignature className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Proposta Oficial
                  </div>
                  
                  <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-5">
                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                      <span className="text-xs sm:text-sm opacity-80">Valor Total</span>
                      <span className="font-mono text-base sm:text-lg font-bold">R$ {msg.suggestedPrice?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm opacity-80 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5"/> SLA (Dias)</span>
                      <span className="font-mono text-sm sm:text-base font-bold">{msg.suggestedSLA}</span>
                    </div>
                  </div>

                  {/* Botões de Ação para propostas recebidas e pendentes */}
                  {msg.sender === "counterpart" && msg.status === "pending" && (
                    <div className="grid grid-cols-2 gap-2 mt-1 sm:mt-2">
                      <button onClick={() => handleAction(msg.id, "reject")} className="py-1.5 sm:py-2 rounded-lg bg-danger/10 text-danger hover:bg-danger/20 transition-colors text-[10px] sm:text-xs font-bold flex justify-center items-center gap-1 sm:gap-1.5 border border-danger/20">
                        <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Recusar
                      </button>
                      <button onClick={() => handleAction(msg.id, "accept")} className="py-1.5 sm:py-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors text-[10px] sm:text-xs font-bold flex justify-center items-center gap-1 sm:gap-1.5 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                        <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Aceitar
                      </button>
                    </div>
                  )}

                  {/* Status Final */}
                  {msg.status === "accepted" && <div className="mt-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Acordo Selado</div>}
                  {msg.status === "rejected" && <div className="mt-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-danger flex items-center gap-1.5"><XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Proposta Recusada</div>}
                </div>
              )}
              <span className="text-[9px] sm:text-[10px] text-brand-muted mt-1 sm:mt-1.5 px-1 font-mono">{msg.timestamp}</span>
            </motion.div>
          ))}
          
          {/* Typing Indicator do Creative Dev */}
          {isTyping && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-1 bg-brand-surface border border-brand-border/50 px-3 sm:px-4 py-2 sm:py-3 rounded-2xl rounded-bl-sm w-fit">
              <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-brand-muted rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-brand-muted rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-brand-muted rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area Dual-Mode */}
      <div className="p-3 sm:p-4 bg-brand-surface/90 border-t border-brand-border/50 z-10 relative shrink-0">
        
        {/* Toggle Mode */}
        <div className="flex gap-2 mb-2 sm:mb-3">
          <button onClick={() => setInputMode("text")} className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md text-[10px] sm:text-xs font-medium transition-colors ${inputMode === "text" ? "bg-brand-border text-white" : "text-brand-muted hover:text-white"}`}>
            Mensagem
          </button>
          <button onClick={() => setInputMode("proposal")} className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md text-[10px] sm:text-xs font-medium transition-colors flex items-center gap-1 sm:gap-1.5 ${inputMode === "proposal" ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30" : "text-brand-muted hover:text-white"}`}>
            <FileSignature className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Enviar Proposta
          </button>
        </div>

        {/* Dynamic Input */}
        <div className="flex items-end gap-2 sm:gap-3">
          {inputMode === "text" ? (
            <textarea 
              value={textInput} onChange={(e) => setTextInput(e.target.value)} onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="Digite sua mensagem..."
              className="flex-1 bg-brand-dark border border-brand-border rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-brand-primary transition-colors resize-none h-10 sm:h-12 custom-scrollbar"
            />
          ) : (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="flex-1 flex gap-2 sm:gap-3">
              <div className="flex-1 min-w-0">
                <label className="block text-[9px] sm:text-[10px] uppercase text-brand-muted mb-1 font-bold truncate">Novo Valor (R$)</label>
                <input type="number" value={priceInput} onChange={(e) => setPriceInput(Number(e.target.value))} className="w-full bg-brand-dark border border-brand-border rounded-xl px-2 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-400 font-mono" />
              </div>
              <div className="w-16 sm:w-24 shrink-0">
                <label className="block text-[9px] sm:text-[10px] uppercase text-brand-muted mb-1 font-bold truncate">SLA</label>
                <input type="number" value={slaInput} onChange={(e) => setSlaInput(Number(e.target.value))} className="w-full bg-brand-dark border border-brand-border rounded-xl px-2 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-400 font-mono text-center" />
              </div>
            </motion.div>
          )}

          <button onClick={handleSend} className={`w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-xl flex items-center justify-center transition-all ${inputMode === "proposal" ? "bg-indigo-600 hover:bg-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.4)] text-white" : "bg-brand-primary hover:bg-brand-primary/80 text-white"}`}>
            {inputMode === "proposal" ? <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" /> : <Send className="w-4 h-4 sm:w-5 sm:h-5 ml-0.5 sm:ml-1" />}
          </button>
        </div>
      </div>
    </div>
  );
}