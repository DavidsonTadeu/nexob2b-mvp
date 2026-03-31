import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type OrderState = "provider" | "manager" | "payment" | "completed";

export interface Order {
  id: string;
  sku: string;
  amount: number;
  volume: number;
  isJIT: boolean; // Flag de Just-in-Time
  state: OrderState;
  providerAuth: boolean;
  managerAuth: boolean;
  createdAt: string;
}

// Carga inicial de dados para garantir que os dashboards não fiquem vazios no primeiro acesso
const INITIAL_ORDERS: Order[] = [
  { id: "PO-2094", sku: "Parafuso de Titânio M8", amount: 15400.00, volume: 1000, isJIT: false, state: "provider", providerAuth: false, managerAuth: false, createdAt: new Date().toISOString() },
  { id: "PO-2095", sku: "Servidor Rack Dell 1U", amount: 42300.50, volume: 1, isJIT: false, state: "manager", providerAuth: true, managerAuth: false, createdAt: new Date(Date.now() - 86400000).toISOString() }, // Ontem
  { id: "PO-2091", sku: "Lote de Cimento CP-IV", amount: 8900.00, volume: 50, isJIT: true, state: "payment", providerAuth: true, managerAuth: true, createdAt: new Date(Date.now() - 172800000).toISOString() }, // Anteontem
];

interface NexoStore {
  orders: Order[];
  createOrder: (order: Omit<Order, "state" | "providerAuth" | "managerAuth" | "createdAt">) => void;
  updateOrderState: (id: string, actionRole: "provider" | "manager" | "pay") => void;
  acceptProposal: (id: string, newAmount: number) => void; // NOVO: Gatilho do Chat RFQ
  getFinancialMetrics: () => {
    pendingPipeline: number;
    clearedGross: number;
    clearedNet: number;
    platformFee: number;
  };
  resetStore: () => void; // Utilitário essencial para ambiente de desenvolvimento
}

// O middleware 'persist' injeta o estado no LocalStorage automaticamente
export const useNexoStore = create<NexoStore>()(
  persist(
    (set, get) => ({
      // Inicia com os dados simulados caso o LocalStorage esteja vazio
      orders: INITIAL_ORDERS,

      // Cria a PO já no estágio inicial aguardando o Fornecedor
      createOrder: (orderData) => set((state) => ({ 
        orders: [...state.orders, { 
          ...orderData, 
          state: "provider", 
          providerAuth: false, 
          managerAuth: false,
          createdAt: new Date().toISOString()
        }] 
      })),

      updateOrderState: (id, actionRole) => set((state) => ({
        orders: state.orders.map((order) => {
          if (order.id !== id) return order;
          const updated = { ...order };
          if (actionRole === "provider" && order.state === "provider") {
            updated.providerAuth = true; updated.state = "manager";
          } else if (actionRole === "manager" && order.state === "manager") {
            updated.managerAuth = true; updated.state = "payment";
          } else if (actionRole === "pay" && order.state === "payment") {
            updated.state = "completed";
          }
          return updated;
        })
      })),

      // NOVO: Função que consolida o contrato após o aperto de mãos no Chat
      acceptProposal: (id, newAmount) => set((state) => ({
        orders: state.orders.map((order) => {
          if (order.id !== id) return order;
          return { ...order, amount: newAmount }; // Atualiza o valor bruto imutável
        })
      })),

      getFinancialMetrics: () => {
        const orders = get().orders;
        let pending = 0; let clearedGross = 0;

        orders.forEach(order => {
          if (order.state === "provider" || order.state === "manager") pending += order.amount;
          if (order.state === "payment" || order.state === "completed") clearedGross += order.amount;
        });

        // Cálculos cirúrgicos em centavos para evitar erros de ponto flutuante no JS
        const grossInCents = Math.round(clearedGross * 100);
        const feeInCents = Math.round(grossInCents * 0.07);
        const netInCents = grossInCents - feeInCents;

        return {
          pendingPipeline: pending,
          clearedGross: clearedGross,
          clearedNet: netInCents / 100,
          platformFee: feeInCents / 100,
        };
      },

      // Ação para limpar o LocalStorage durante os testes
      resetStore: () => set({ orders: [] })
    }),
    {
      name: 'nexob2b-storage', // Nome da chave no LocalStorage do navegador
    }
  )
);