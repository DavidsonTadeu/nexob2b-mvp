"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  Building2, UserCircle, ShieldCheck, ArrowRight, 
  Terminal, Lock, CheckCircle2, Factory
} from "lucide-react";

type Role = "buyer" | "vendor" | null;

export default function EnterpriseLoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [cnpj, setCnpj] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [role, setRole] = useState<Role>(null);

  // Máscara simples de CNPJ para dar sensação de realismo
  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 14) value = value.slice(0, 14);
    
    // Formatação visual: 00.000.000/0000-00
    if (value.length > 12) {
      value = value.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
    } else if (value.length > 8) {
      value = value.replace(/^(\d{2})(\d{3})(\d{3})(\d{0,4})/, "$1.$2.$3/$4");
    } else if (value.length > 5) {
      value = value.replace(/^(\d{2})(\d{3})(\d{0,3})/, "$1.$2.$3");
    } else if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d{0,3})/, "$1.$2");
    }
    setCnpj(value);
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (cnpj.length < 18) return; // Exige CNPJ formatado
    
    setIsValidating(true);
    // Simula uma busca no banco de dados da Receita Federal / Sintegra
    setTimeout(() => {
      setIsValidating(false);
      setStep(2);
    }, 1200);
  };

  const handleLogin = () => {
    if (!role) return;
    
    // Roteamento inteligente baseado na hierarquia escolhida
    if (role === "buyer") {
      router.push("/dashboard/buyer");
    } else {
      router.push("/dashboard/vendor");
    }
  };

  return (
    <div className="min-h-screen w-full bg-brand-dark flex">
      
      {/* Lado Esquerdo: Branding & Value Proposition (Oculto em Mobile) */}
      <div className="hidden lg:flex w-1/2 bg-brand-surface relative overflow-hidden flex-col justify-between p-12 border-r border-brand-border">
        {/* Efeito Glow */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand-primary/10 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand-accent/10 rounded-full blur-[120px] pointer-events-none translate-x-1/4 translate-y-1/4" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 text-white mb-16">
            <div className="w-10 h-10 rounded-lg bg-brand-primary flex items-center justify-center shadow-glow">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">NexoB2B</span>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-6 max-w-lg">
            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight tracking-tight">
              O Ponto Único da <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-accent">Cadeia de Suprimentos.</span>
            </h1>
            <p className="text-brand-muted text-lg leading-relaxed">
              Governança em tempo real, aprovação Dual-Gate e liquidação financeira integrada para operações de alto volume.
            </p>
          </motion.div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 text-sm font-medium text-brand-muted">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            Auditoria Contínua (AES-256)
          </div>
        </div>
      </div>

      {/* Lado Direito: Formulário de Onboarding Enterprise */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md">
          
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Acesso Corporativo</h2>
                  <p className="text-brand-muted">Insira o CNPJ da sua organização para iniciar a sessão segura.</p>
                </div>

                <form onSubmit={handleNextStep} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider font-semibold text-brand-muted">
                      CNPJ da Empresa
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Building2 className="w-5 h-5 text-brand-muted" />
                      </div>
                      <input 
                        type="text" 
                        required
                        value={cnpj}
                        onChange={handleCnpjChange}
                        placeholder="00.000.000/0000-00"
                        className="w-full bg-brand-surface border border-brand-border rounded-xl pl-12 pr-4 py-4 text-white font-mono text-lg focus:outline-none focus:border-brand-primary transition-colors shadow-inner"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={cnpj.length < 18 || isValidating}
                    className="w-full h-14 rounded-xl bg-brand-primary text-white font-semibold flex items-center justify-center gap-2 hover:bg-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-glow"
                  >
                    {isValidating ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        Validando Cadastro...
                      </>
                    ) : (
                      <>
                        Continuar <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>

                <div className="flex items-center justify-center gap-2 text-xs text-brand-muted/70 pt-8 border-t border-brand-border/50">
                  <Lock className="w-3 h-3" /> Ambiente restrito a entidades homologadas.
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                    <CheckCircle2 className="w-4 h-4" /> CNPJ Validado
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">Selecione seu Perfil</h2>
                  <p className="text-brand-muted">Detectamos múltiplos acessos. Escolha o ambiente de trabalho.</p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {/* Opção: Comprador */}
                  <div 
                    onClick={() => setRole("buyer")}
                    className={`p-5 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-4 ${role === "buyer" ? "bg-indigo-500/10 border-brand-primary shadow-[0_0_20px_rgba(79,70,229,0.15)]" : "bg-brand-surface border-brand-border hover:border-brand-muted"}`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${role === "buyer" ? "bg-brand-primary/20 text-brand-primary" : "bg-brand-dark text-brand-muted"}`}>
                      <UserCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className={`font-semibold mb-1 ${role === "buyer" ? "text-white" : "text-brand-muted"}`}>Diretoria de Compras</h3>
                      <p className="text-xs text-brand-muted leading-relaxed">
                        Acesso ao Spend Management, aprovação de orçamento (Gate 2) e catálogo de produtos.
                      </p>
                    </div>
                  </div>

                  {/* Opção: Fornecedor */}
                  <div 
                    onClick={() => setRole("vendor")}
                    className={`p-5 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-4 ${role === "vendor" ? "bg-emerald-500/10 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)]" : "bg-brand-surface border-brand-border hover:border-brand-muted"}`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${role === "vendor" ? "bg-emerald-400/20 text-emerald-400" : "bg-brand-dark text-brand-muted"}`}>
                      <Factory className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className={`font-semibold mb-1 ${role === "vendor" ? "text-white" : "text-brand-muted"}`}>Gestão Comercial (Fornecedor)</h3>
                      <p className="text-xs text-brand-muted leading-relaxed">
                        Acesso ao Financial Hub, propostas RFQ e garantia de SLA de entrega (Gate 1).
                      </p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleLogin}
                  disabled={!role}
                  className="w-full h-14 rounded-xl bg-white text-brand-dark font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Entrar no Sistema
                </button>
                
                <div className="text-center">
                  <button onClick={() => setStep(1)} className="text-xs text-brand-muted hover:text-white transition-colors underline underline-offset-4">
                    Voltar e alterar CNPJ
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}