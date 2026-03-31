"use client";

import { motion } from "framer-motion";
import { MarketplaceFeed } from "@/components/organisms/MarketplaceFeed";

export default function CatalogPage() {
  return (
    <motion.main
      // Transição de página fluida (Page Transition)
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      className="min-h-screen w-full pt-12 pb-24"
    >
      {/* O Organismo assume o controle a partir daqui.
        Toda a lógica de Dual-View, Skeletons e Carrinho JIT vive lá dentro.
      */}
      <MarketplaceFeed />
      
    </motion.main>
  );
}