"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  Search, FileText, ShoppingCart, Kanban, 
  PieChart, PlusCircle, Briefcase, CornerDownLeft, HomeIcon, Target
} from "lucide-react";

// Dados simulados atualizados com a NOVA ROTA DO COMPRADOR
const MOCK_DB = [
  { id: 'p0', category: 'Páginas', title: 'Home (Ambiente de Operações)', icon: HomeIcon, shortcut: 'G H', href: '/' },
  { id: 'p3', category: 'Páginas', title: 'Spend Management (Comprador)', icon: Target, shortcut: 'G C', href: '/dashboard/buyer' }, // <-- Rota Adicionada
  { id: 'p1', category: 'Páginas', title: 'Dashboard do Fornecedor', icon: PieChart, shortcut: 'G V', href: '/dashboard/vendor' },
  { id: 'p2', category: 'Páginas', title: 'Pipeline de Aprovação', icon: Kanban, shortcut: 'G P', href: '/dashboard/approvals' },
  { id: 'a1', category: 'Ações Rápidas', title: 'Acessar Catálogo', icon: ShoppingCart, shortcut: 'C N', href: '/catalog' },
  { id: 'a2', category: 'Ações Rápidas', title: 'Gerar Relatório de Take Rate', icon: FileText, href: '/dashboard/vendor' },
  { id: 'c1', category: 'Contratos & Clientes', title: 'Painel de Negociação BMG', icon: Briefcase, href: '/dashboard/approvals' },
];

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Roteador nativo do Next.js
  const router = useRouter();

  // Listener Global para Ctrl+K / Cmd+K e fechamento com Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filtro Dinâmico
  const filteredResults = MOCK_DB.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  // Função centralizada para executar a ação e fechar o modal
  const executeAction = (item: typeof MOCK_DB[0]) => {
    if (item.href) {
      router.push(item.href); // Navegação instantânea
    }
    setIsOpen(false);
    setSearch(""); // Limpa a busca para o próximo uso
  };

  // Navegação por teclado (Setas e Enter)
  useEffect(() => {
    const handleArrowNavigation = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredResults.length);
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredResults.length) % filteredResults.length);
      }
      if (e.key === "Enter" && filteredResults[selectedIndex]) {
        e.preventDefault();
        executeAction(filteredResults[selectedIndex]);
      }
    };

    window.addEventListener("keydown", handleArrowNavigation);
    return () => window.removeEventListener("keydown", handleArrowNavigation);
  }, [isOpen, filteredResults, selectedIndex]);

  // Reseta o índice se a busca mudar
  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  // Foca no input automaticamente ao abrir
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearch("");
    }
  }, [isOpen]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
            
            {/* Overlay Escuro com Glassmorphism */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-brand-dark/60 backdrop-blur-sm"
            />

            {/* Modal Principal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative w-full max-w-2xl bg-brand-surface border border-brand-border rounded-xl shadow-2xl overflow-hidden flex flex-col"
            >
              
              {/* Header / Input de Busca */}
              <div className="flex items-center px-4 py-4 border-b border-brand-border/50">
                <Search className="w-5 h-5 text-brand-muted mr-3" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Busque por páginas, aprovações ou relatórios..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 bg-transparent text-white text-lg placeholder:text-brand-muted/70 focus:outline-none"
                />
                <kbd className="hidden sm:inline-flex items-center gap-1 bg-brand-dark border border-brand-border rounded px-2 py-1 text-[10px] font-mono text-brand-muted uppercase">
                  ESC para fechar
                </kbd>
              </div>

              {/* Área de Resultados com Reordenação Animada */}
              <div className="max-h-[60vh] overflow-y-auto p-2 custom-scrollbar">
                {filteredResults.length === 0 ? (
                  <div className="py-14 text-center text-brand-muted">
                    <p>Nenhum resultado encontrado para "{search}".</p>
                  </div>
                ) : (
                  <ul className="flex flex-col gap-1">
                    <AnimatePresence>
                      {filteredResults.map((item, index) => {
                        const isSelected = index === selectedIndex;
                        const Icon = item.icon;

                        return (
                          <motion.li
                            layout // Magia da reordenação suave
                            key={item.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className={`group flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-colors ${
                              isSelected 
                                ? "bg-brand-primary/10 border-brand-accent shadow-[inset_2px_0_0_0_#06B6D4]" 
                                : "hover:bg-brand-dark text-brand-muted hover:text-white"
                            }`}
                            onMouseEnter={() => setSelectedIndex(index)}
                            onClick={() => executeAction(item)}
                          >
                            <div className="flex items-center gap-3">
                              <Icon className={`w-4 h-4 ${isSelected ? "text-brand-accent" : "text-brand-muted"}`} />
                              <div className="flex flex-col">
                                <span className={`text-sm font-medium ${isSelected ? "text-white" : ""}`}>
                                  {item.title}
                                </span>
                                <span className="text-[10px] uppercase tracking-wider text-brand-muted/70">
                                  {item.category}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {item.shortcut && (
                                <kbd className={`text-[10px] font-mono px-2 py-1 rounded bg-brand-dark border ${isSelected ? "border-brand-accent/30 text-brand-accent" : "border-brand-border text-brand-muted"}`}>
                                  {item.shortcut}
                                </kbd>
                              )}
                              {isSelected && (
                                <motion.div 
                                  initial={{ opacity: 0, x: -10 }} 
                                  animate={{ opacity: 1, x: 0 }}
                                  className="text-brand-accent"
                                >
                                  <CornerDownLeft className="w-4 h-4" />
                                </motion.div>
                              )}
                            </div>
                          </motion.li>
                        );
                      })}
                    </AnimatePresence>
                  </ul>
                )}
              </div>
              
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}