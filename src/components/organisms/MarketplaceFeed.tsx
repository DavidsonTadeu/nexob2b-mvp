"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  Grid3X3, Building2, Search, Filter, Box, Star, 
  ArrowRight, X, Layers3, CheckCircle2, Factory,
  ShoppingCart 
} from "lucide-react";
import { PriceTicker } from "@/components/atoms/PriceTicker";
import { useNexoStore } from "@/store/useNexoStore";
import { showToast } from "@/components/molecules/PremiumToast";

// --- Tipagem e Mock Data ---
type ViewMode = 'suppliers' | 'products';

interface Supplier { id: string; name: string; type: ViewMode; rating: number; categories: string[]; logo: string; homologated: boolean; }
interface Product { id: string; name: string; type: ViewMode; sku: string; supplier: string; category: string; basePrice: number; physicalStock: number; specs: string[]; virtualStock: boolean; }

// Catálogo Expandido B2B
const MOCK_SUPPLIERS: Supplier[] = [
  { id: 's1', name: 'BMG Tech Solutions', type: 'suppliers', rating: 4.8, categories: ['TI Hardware', 'Segurança'], logo: 'B', homologated: true },
  { id: 's2', name: 'MGS Estruturas', type: 'suppliers', rating: 4.5, categories: ['Construção', 'Aço'], logo: 'M', homologated: true },
  { id: 's3', name: 'ProDesk Office', type: 'suppliers', rating: 4.9, categories: ['Mobiliário'], logo: 'P', homologated: true },
  { id: 's4', name: 'Ceasa Infra', type: 'suppliers', rating: 4.2, categories: ['Construção', 'Insumos'], logo: 'C', homologated: false },
  { id: 's5', name: 'PetroChem BR', type: 'suppliers', rating: 4.7, categories: ['Química'], logo: 'P', homologated: true },
];

const MOCK_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Servidor Rack Dell 1U', category: 'TI Hardware', type: 'products', sku: 'DELL-R1U-G15', supplier: 'BMG Tech Solutions', basePrice: 42300.50, physicalStock: 15, specs: ['Xeon Gold', '128GB RAM', '2TB NVMe'], virtualStock: true },
  { id: 'p2', name: 'Parafuso Titânio M8', category: 'Construção', type: 'products', sku: 'PAR-TIT-M8', supplier: 'MGS Estruturas', basePrice: 15.40, physicalStock: 1500, specs: ['Grade 5', 'DIN 933', 'Caixa c/ 100'], virtualStock: false },
  { id: 'p3', name: 'Cimento CP-IV Lote', category: 'Construção', type: 'products', sku: 'CIM-CPIV', supplier: 'Ceasa Infra', basePrice: 38.90, physicalStock: 0, specs: ['Lote 50 sacos', 'SLA 15 dias'], virtualStock: true },
  { id: 'p4', name: 'Switch Cisco Catalyst 48p', category: 'TI Hardware', type: 'products', sku: 'CIS-CAT-48', supplier: 'BMG Tech Solutions', basePrice: 18500.00, physicalStock: 4, specs: ['PoE+', 'Layer 3', 'GigaBit'], virtualStock: true },
  { id: 'p5', name: 'Cadeira Ergonômica Flex', category: 'Mobiliário', type: 'products', sku: 'CAD-ERG-F', supplier: 'ProDesk Office', basePrice: 1250.00, physicalStock: 45, specs: ['Ajuste Lombar', 'NR17', 'Tela Mesh'], virtualStock: false },
  { id: 'p6', name: 'Viga de Aço I W200', category: 'Aço', type: 'products', sku: 'VIG-ACO-W2', supplier: 'MGS Estruturas', basePrice: 450.00, physicalStock: 120, specs: ['Aço ASTM A572', 'Barra 6m'], virtualStock: true },
  { id: 'p7', name: 'Mesa Diretoria em L', category: 'Mobiliário', type: 'products', sku: 'MES-DIR-L', supplier: 'ProDesk Office', basePrice: 2800.00, physicalStock: 0, specs: ['MDF 25mm', 'Caixa Conectividade'], virtualStock: true },
  { id: 'p8', name: 'Solvente Industrial 50L', category: 'Química', type: 'products', sku: 'SOLV-IND-50', supplier: 'PetroChem BR', basePrice: 890.00, physicalStock: 30, specs: ['Grau Industrial', 'Tambor 50L'], virtualStock: false },
  { id: 'p9', name: 'Câmera Intelbras IP 4K', category: 'Segurança', type: 'products', sku: 'CAM-INT-4K', supplier: 'BMG Tech Solutions', basePrice: 1450.00, physicalStock: 80, specs: ['Visão Noturna', 'IP66', 'PoE'], virtualStock: false },
];

const ALL_CATEGORIES = Array.from(new Set([...MOCK_SUPPLIERS.flatMap(s => s.categories), ...MOCK_PRODUCTS.map(p => p.category)])).sort();

// --- Sub-componentes (Atoms/Molecules) ---

const SkeletonCard = () => (
  <div className="bg-brand-surface border border-brand-border rounded-xl p-5 md:p-6 flex flex-col gap-4 animate-pulse">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-brand-border rounded-lg shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-brand-border rounded w-1/2" />
        <div className="h-3 bg-brand-border rounded w-1/4" />
      </div>
    </div>
    <div className="h-3 bg-brand-border rounded w-full" />
    <div className="h-3 bg-brand-border rounded w-2/3" />
    <div className="h-10 bg-brand-border rounded-lg mt-2" />
  </div>
);

function SupplierCard({ supplier }: { supplier: Supplier }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [10, -10]); 
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    x.set(mouseX - width / 2);
    y.set(mouseY - height / 2);
  }

  return (
    <motion.div
      style={{ rotateX, rotateY, perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      className="bg-brand-surface border border-brand-border rounded-xl p-5 md:p-6 shadow-glass flex flex-col gap-4 transition-colors hover:border-brand-primary/50 relative overflow-hidden group"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-brand-dark rounded-lg flex items-center justify-center font-bold text-xl text-brand-primary border border-brand-border shrink-0">
          {supplier.logo}
        </div>
        <div className="min-w-0">
          <h3 className="text-white font-semibold flex items-center gap-2 truncate">
            <span className="truncate">{supplier.name}</span>
            {supplier.homologated && (
              <span title="Fornecedor Homologado NexoB2B" className="flex shrink-0">
                <CheckCircle2 className="w-4 h-4 text-feedback-success" />
              </span>
            )}
          </h3>
          <div className="flex items-center gap-1 text-feedback-warning text-sm font-medium mt-0.5">
            <Star className="w-3.5 h-3.5 fill-feedback-warning" />
            {supplier.rating.toFixed(1)}
          </div>
        </div>
      </div>
      
      <p className="text-brand-muted text-xs uppercase tracking-wider line-clamp-1">
        {supplier.categories.join(' • ')}
      </p>

      <button className="flex items-center justify-center gap-2 w-full mt-2 px-4 py-2.5 rounded-lg bg-brand-border text-white hover:bg-brand-primary transition-colors text-sm font-medium">
        Ver Portfólio <ArrowRight className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

function ProductCard({ product, onQuickView }: { product: Product; onQuickView: (id: string) => void }) {
  return (
    <motion.div className="bg-brand-surface border border-brand-border rounded-xl p-5 md:p-6 shadow-glass flex flex-col gap-4 transition-colors hover:border-brand-accent/50">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-0">
        <div className="w-12 h-12 bg-brand-dark rounded-lg flex items-center justify-center border border-brand-border text-brand-muted shrink-0">
          <Layers3 className="w-6 h-6" />
        </div>
        
        {product.physicalStock > 0 ? (
          <span className="bg-feedback-success/10 text-feedback-success text-[10px] px-2 py-1 rounded uppercase font-bold flex items-center gap-1 self-start sm:self-auto">
            {product.physicalStock} un. em Estoque
          </span>
        ) : product.virtualStock ? (
          <span className="bg-feedback-warning/10 text-feedback-warning text-[10px] px-2 py-1 rounded uppercase font-bold flex items-center gap-1 self-start sm:self-auto">
            <Factory className="w-3 h-3" /> On-Demand
          </span>
        ) : (
          <span className="bg-danger/10 text-danger text-[10px] px-2 py-1 rounded uppercase font-bold flex items-center gap-1 self-start sm:self-auto">
            Indisponível
          </span>
        )}
      </div>

      <div className="space-y-1 flex-1">
        <h3 className="text-white font-medium text-sm leading-snug line-clamp-2">{product.name}</h3>
        <p className="text-brand-muted text-xs font-mono uppercase truncate">SKU: {product.sku}</p>
      </div>
      
      <div className="flex flex-col items-start pt-3 border-t border-brand-border/50">
          <p className="text-brand-muted text-[10px] sm:text-xs uppercase mb-1">A partir de (Tier 1)</p>
          <PriceTicker value={product.basePrice} className="text-2xl sm:text-3xl" />
      </div>

      <button 
        onClick={() => onQuickView(product.id)}
        className="flex items-center justify-center gap-2 w-full mt-2 px-4 py-2.5 rounded-lg bg-brand-border/60 text-white hover:bg-brand-dark transition-colors text-sm font-medium"
      >
        Quick View (Volume)
      </button>
    </motion.div>
  );
}

// --- Componente Principal ---

export function MarketplaceFeed() {
  const router = useRouter();
  const createOrder = useNexoStore(state => state.createOrder);

  // Estados de UI
  const [viewMode, setViewMode] = useState<ViewMode>('products');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [quickViewProductId, setQuickViewProductId] = useState<string | null>(null);
  const [orderVolume, setOrderVolume] = useState<number>(1);

  // Estado do Filtro por Área
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    setOrderVolume(1);
  }, [quickViewProductId]);

  // Efeito de Skeleton Loading ao mudar filtros
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, [viewMode, selectedCategories]);

  // --- MOTOR DE FILTROS POR ÁREA ---
  const filteredSuppliers = useMemo(() => {
    return MOCK_SUPPLIERS.filter(s => {
      return selectedCategories.length === 0 || s.categories.some(c => selectedCategories.includes(c));
    });
  }, [selectedCategories]);

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(p => {
      return selectedCategories.length === 0 || selectedCategories.includes(p.category);
    });
  }, [selectedCategories]);

  const handleCategoryToggle = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  // --- GATILHO DA COMMAND PALETTE ---
  const triggerGlobalSearch = () => {
    window.dispatchEvent(new CustomEvent('open-command-palette'));
  };

  const selectedProduct = useMemo(() => {
    if (!quickViewProductId) return null;
    return MOCK_PRODUCTS.find(p => p.id === quickViewProductId);
  }, [quickViewProductId]);

  const calculatedTotal = useMemo(() => {
    if (!selectedProduct) return 0;
    let price = selectedProduct.basePrice;
    if (orderVolume > 100 && orderVolume <= 1000) price = selectedProduct.basePrice * 0.95;
    if (orderVolume > 1000) price = selectedProduct.basePrice * 0.90;
    return price * orderVolume;
  }, [selectedProduct, orderVolume]);

  const handleAddOrder = () => {
    if (!selectedProduct || orderVolume < 1) return;

    const isJIT = orderVolume > selectedProduct.physicalStock;
    const newOrderId = `PO-${Math.floor(1000 + Math.random() * 9000)}`;

    createOrder({
      id: newOrderId,
      sku: selectedProduct.sku,
      amount: calculatedTotal,
      volume: orderVolume,
      isJIT
    });

    setQuickViewProductId(null);

    if (isJIT) {
      showToast({ type: "alert", title: "Produção Just-in-Time", message: `Volume excede estoque físico. A ordem ${newOrderId} foi gerada com SLA estendido.` });
    } else {
      showToast({ type: "success", title: "Ordem Gerada", message: `A Ordem ${newOrderId} foi enviada para o Kanban de aprovação.` });
    }

    router.push(`/checkout/${newOrderId}`);
  };

  return (
    <div className="w-full mx-auto relative z-10 flex flex-col px-4 sm:px-6 md:px-8 py-6">
      
      {/* Header Responsivo */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
        <div className="w-full lg:w-auto">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <ShoppingCart className="text-brand-accent w-6 h-6 sm:w-8 sm:h-8" />
            Marketplace
          </h1>
          <p className="text-brand-muted mt-1 text-sm sm:text-base">Busque produtos ou homologue fornecedores industriais.</p>
        </div>

        {/* Controles de Topo: Gatilho Global, Switcher e Botão Filtro */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          
          <button 
            onClick={triggerGlobalSearch} 
            className="flex items-center gap-2 bg-brand-dark border border-brand-border hover:border-brand-primary rounded-lg px-4 py-2.5 sm:py-2 text-brand-muted hover:text-white transition-colors text-left w-full sm:w-[260px] group"
          >
            <Search className="w-4 h-4 shrink-0 group-hover:text-brand-primary transition-colors" />
            <span className="text-sm truncate flex-1">Busque por propostas...</span>
            <kbd className="hidden sm:flex items-center gap-1 font-mono text-[10px] bg-brand-surface px-1.5 py-0.5 rounded border border-brand-border uppercase">
              ⌘K
            </kbd>
          </button>

          {/* Switcher Produtos/Fornecedores */}
          <div className="flex bg-brand-surface border border-brand-border rounded-lg p-1 relative w-full sm:w-auto shrink-0">
            <motion.div
              layout
              className="absolute bg-brand-border rounded-md shadow-md z-0"
              style={{
                width: "calc(50% - 4px)",
                height: "calc(100% - 8px)",
                left: viewMode === 'products' ? 4 : "calc(50%)"
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
            <button onClick={() => setViewMode('products')} className={`flex-1 sm:flex-none relative z-10 px-4 py-2.5 sm:py-2 rounded-md text-sm font-medium transition-colors flex justify-center items-center gap-2 ${viewMode === 'products' ? "text-brand-accent" : "text-brand-muted hover:text-white"}`}>
              <Box className="w-4 h-4" /> Produtos
            </button>
            <button onClick={() => setViewMode('suppliers')} className={`flex-1 sm:flex-none relative z-10 px-4 py-2.5 sm:py-2 rounded-md text-sm font-medium transition-colors flex justify-center items-center gap-2 ${viewMode === 'suppliers' ? "text-white" : "text-brand-muted hover:text-white"}`}>
              <Building2 className="w-4 h-4" /> Fornecedores
            </button>
          </div>
          
          {/* Toggle da Barra de Filtros Laterais */}
          <button 
            onClick={() => setSidebarOpen(prev => !prev)}
            className={`px-4 py-3 sm:py-2 rounded-lg border transition-colors flex items-center justify-center gap-2 shrink-0 ${sidebarOpen ? 'bg-brand-primary text-white border-brand-primary' : 'bg-brand-surface text-brand-muted border-brand-border hover:text-white'}`}
          >
            <Filter className="w-5 h-5 sm:w-4 h-4" />
            <span className="sm:hidden font-medium text-sm">Filtros</span>
          </button>
        </div>
      </div>

      {/* Grid e Sidebar responsivos */}
      <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8 relative">
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              className="w-full lg:w-[260px] lg:sticky lg:top-10 flex flex-col gap-6 p-5 md:p-6 bg-brand-surface border border-brand-border rounded-2xl shrink-0 z-20"
            >
              <div className="flex justify-between items-center pb-4 border-b border-brand-border/50">
                  <h2 className="text-white font-semibold">Filtros do Catálogo</h2>
              </div>

              {/* FILTRO DE CATEGORIAS REAIS */}
              <div className="space-y-4">
                  <p className="text-brand-muted text-sm uppercase font-bold tracking-wider">Área de Atuação</p>
                  <div className="space-y-1 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                    {ALL_CATEGORIES.map(cat => (
                        <label key={cat} className="flex items-center gap-3 text-sm text-brand-muted hover:text-white cursor-pointer transition-colors py-2 group">
                            <div className="relative flex items-center justify-center">
                              <input 
                                type="checkbox" 
                                checked={selectedCategories.includes(cat)}
                                onChange={() => handleCategoryToggle(cat)}
                                className="peer appearance-none w-4 h-4 border border-brand-border rounded bg-brand-dark checked:bg-brand-primary checked:border-brand-primary transition-colors cursor-pointer" 
                              />
                              <CheckCircle2 className="w-3 h-3 text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                            </div>
                            <span className={selectedCategories.includes(cat) ? "text-white font-medium" : ""}>{cat}</span>
                        </label>
                    ))}
                  </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        <main className="flex-1 w-full min-w-0">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="loading" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={`skeleton-${i}`} />)}
              </motion.div>
            ) : viewMode === 'suppliers' ? (
              filteredSuppliers.length === 0 ? (
                <div key="empty" className="py-20 text-center text-brand-muted border border-dashed border-brand-border rounded-xl">Nenhum fornecedor encontrado nesta categoria.</div>
              ) : (
                <motion.div key="suppliers-feed" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6" variants={staggerContainer} initial="hidden" animate="show">
                  {filteredSuppliers.map(sup => <motion.div key={sup.id} variants={staggerItem}><SupplierCard supplier={sup} /></motion.div>)}
                </motion.div>
              )
            ) : (
              filteredProducts.length === 0 ? (
                <div key="empty" className="py-20 text-center text-brand-muted border border-dashed border-brand-border rounded-xl">Nenhum produto encontrado nesta categoria.</div>
              ) : (
                <motion.div key="products-feed" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6" variants={staggerContainer} initial="hidden" animate="show">
                  {filteredProducts.map(prod => <motion.div key={prod.id} variants={staggerItem}><ProductCard product={prod} onQuickView={setQuickViewProductId} /></motion.div>)}
                </motion.div>
              )
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Quick View Modal/Drawer */}
      <AnimatePresence>
        {selectedProduct && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setQuickViewProductId(null)} className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm" />
            
            <motion.div 
              initial={{ x: "100%" }} 
              animate={{ x: 0 }} 
              exit={{ x: "100%" }} 
              transition={{ type: "spring", stiffness: 200, damping: 25 }} 
              className="fixed right-0 top-0 bottom-0 z-[90] w-full max-w-[500px] bg-brand-surface/95 backdrop-blur-xl border-l border-brand-border p-5 sm:p-8 flex flex-col shadow-2xl"
            >
              <button onClick={() => setQuickViewProductId(null)} className="absolute top-5 right-5 sm:top-6 sm:right-6 text-brand-muted hover:text-white transition-colors bg-brand-dark/50 p-2 rounded-full backdrop-blur-md">
                <X className="w-5 h-5" />
              </button>
              
              <div className="space-y-1 mb-6 sm:mb-8 pr-10">
                  <p className="text-brand-muted text-[10px] sm:text-xs uppercase font-mono truncate">SKU: {selectedProduct.sku}</p>
                  <h3 className="text-white text-lg sm:text-xl font-bold leading-snug">{selectedProduct.name}</h3>
                  <p className="text-brand-accent text-xs sm:text-sm font-medium flex items-center gap-1.5"><Building2 className="w-3 h-3 sm:w-4 sm:h-4" /> {selectedProduct.supplier}</p>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-5 sm:space-y-6 custom-scrollbar pr-1 sm:pr-2">
                
                <div className="p-5 sm:p-6 bg-brand-dark rounded-xl border border-brand-border flex flex-col items-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/10 rounded-full blur-3xl pointer-events-none" />
                    <p className="text-brand-muted text-[10px] sm:text-xs uppercase mb-1">Custo Total Projetado</p>
                    <PriceTicker value={calculatedTotal} className="text-3xl sm:text-4xl" />
                </div>

                <div className="space-y-2">
                    <label className="text-white font-medium text-xs sm:text-sm tracking-wide flex justify-between items-center">
                      Volume Desejado
                      {orderVolume > selectedProduct.physicalStock && (
                        <span className="text-feedback-warning text-[9px] sm:text-[10px] uppercase font-bold animate-pulse text-right max-w-[50%]">Estoque Insuficiente (JIT)</span>
                      )}
                    </label>
                    <input 
                      type="number" 
                      min="1"
                      value={orderVolume}
                      onChange={(e) => setOrderVolume(Number(e.target.value) || 1)}
                      className="w-full bg-brand-dark border border-brand-border focus:border-brand-primary rounded-lg px-4 py-3 sm:py-4 text-white font-mono text-base sm:text-lg transition-colors outline-none"
                    />
                </div>

                <div className="space-y-3">
                    <h4 className="text-white font-medium text-xs sm:text-sm tracking-wide">Desconto por Volume (Tiered Pricing)</h4>
                    <div className="bg-brand-dark rounded-lg border border-brand-border divide-y divide-brand-border/50">
                        {[{tier: '1-100 un.', price: selectedProduct.basePrice, discount: 'Preço Cheio'},
                          {tier: '101-1k un.', price: selectedProduct.basePrice * 0.95, discount: '5% Desc.'},
                          {tier: '1001+ un.', price: selectedProduct.basePrice * 0.9, discount: '10% Desc.'}].map(t => (
                            <div key={t.tier} className="flex justify-between items-center px-3 sm:px-4 py-3 text-[11px] sm:text-sm">
                                <span className="text-white font-mono">{t.tier}</span>
                                <div className="flex items-center gap-2 sm:gap-3 text-right">
                                    <span className="text-brand-muted text-[9px] sm:text-xs uppercase hidden sm:inline">{t.discount}</span>
                                    <span className="text-white font-bold">R$ {t.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-3 pb-4">
                    <h4 className="text-white font-medium text-xs sm:text-sm tracking-wide">Ficha Técnica</h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-brand-muted text-xs sm:text-sm list-disc list-inside">
                        {selectedProduct.specs.map(spec => <li key={spec} className="truncate">{spec}</li>)}
                    </ul>
                </div>
              </div>

              <button 
                onClick={handleAddOrder}
                className="flex items-center justify-center gap-2 w-full mt-4 sm:mt-6 px-4 sm:px-6 py-3.5 sm:py-4 rounded-lg bg-brand-primary text-white hover:bg-indigo-500 transition-colors shadow-glow font-medium text-sm sm:text-base shrink-0"
              >
                <Layers3 className="w-4 h-4 sm:w-5 sm:h-5" /> Adicionar à PO
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// CORREÇÃO: "as const" no final do arquivo
const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 150, damping: 20 } },
};