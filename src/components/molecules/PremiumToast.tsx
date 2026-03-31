"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertTriangle, ShieldCheck, X } from "lucide-react";
import { useEffect, useState } from "react";

// Tipagem do Toast
export type ToastType = "success" | "negotiation" | "alert";

export interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  onClose: (id: string) => void;
}

// Dicionário de Estilos e Ícones (Direção de Arte)
const TOAST_VARIANTS = {
  success: {
    border: "border-emerald-500/50",
    bg: "bg-emerald-950/40",
    icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
    glow: "shadow-[0_0_20px_rgba(16,185,129,0.15)]",
  },
  negotiation: {
    border: "border-indigo-500/50",
    bg: "bg-indigo-950/40",
    icon: <ShieldCheck className="w-5 h-5 text-indigo-400" />,
    glow: "shadow-[0_0_20px_rgba(79,70,229,0.15)]",
  },
  alert: {
    border: "border-orange-500/50",
    bg: "bg-orange-950/40",
    icon: <AlertTriangle className="w-5 h-5 text-orange-400" />,
    glow: "shadow-[0_0_20px_rgba(249,115,22,0.15)]",
  },
};

export function PremiumToast({ id, type, title, message, onClose }: ToastProps) {
  const variant = TOAST_VARIANTS[type];

  // Auto-dismiss após 5 segundos
  useEffect(() => {
    const timer = setTimeout(() => onClose(id), 5000);
    return () => clearTimeout(timer);
  }, [id, onClose]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.8, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.9, filter: "blur(5px)", transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`relative w-full max-w-sm p-4 rounded-xl border backdrop-blur-xl flex items-start gap-4 ${variant.bg} ${variant.border} ${variant.glow}`}
    >
      <div className="shrink-0 mt-0.5">{variant.icon}</div>
      <div className="flex-1">
        <h4 className="text-white text-sm font-semibold tracking-wide">{title}</h4>
        <p className="text-brand-muted text-xs mt-1 leading-relaxed">{message}</p>
      </div>
      <button 
        onClick={() => onClose(id)}
        className="shrink-0 text-brand-muted hover:text-white transition-colors p-1"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

// Container interno para renderizar múltiplos Toasts empilhados
export function ToastContainer({ toasts, removeToast }: { toasts: ToastProps[], removeToast: (id: string) => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <PremiumToast {...toast} onClose={removeToast} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// --- NOVO CÓDIGO AQUI ---
// O Gerenciador Global que resolve o erro do Next.js
export function GlobalToaster() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  useEffect(() => {
    const handleAddToast = (event: CustomEvent<ToastProps>) => {
      setToasts((prev) => [...prev, event.detail]);
    };
    
    window.addEventListener("nexoToast", handleAddToast as EventListener);
    return () => window.removeEventListener("nexoToast", handleAddToast as EventListener);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return <ToastContainer toasts={toasts} removeToast={removeToast} />;
}

// Função utilitária para chamar um Toast de qualquer lugar do sistema
export const showToast = (toastData: Omit<ToastProps, "id" | "onClose">) => {
  const id = Math.random().toString(36).substring(2, 9);
  window.dispatchEvent(new CustomEvent("nexoToast", { detail: { ...toastData, id } }));
};