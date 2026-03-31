import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Organismos Globais (Devem ter "use client" internamente)
import { CommandPalette } from "@/components/organisms/CommandPalette";
// Importamos o componente Autônomo
import { GlobalToaster } from "@/components/molecules/PremiumToast";

// 1. Tipografia de Interface (Leitura e Textos Globais)
const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  display: 'swap',
});

// 2. Tipografia de Dados (Preços, SKUs, Volumes)
const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"], 
  variable: "--font-jetbrains-mono",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "NexoB2B | Enterprise E-Procurement",
  description: "Ecossistema de compras B2B de alta performance e negociação inteligente.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${jetbrainsMono.variable} scroll-smooth`}>
      <body className="bg-brand-dark text-white antialiased selection:bg-brand-primary selection:text-white min-h-screen flex flex-col relative">
        
        {/* Glow de Fundo Global (Direção de Arte) */}
        <div className="fixed top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none z-0" />
        <div className="fixed bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-brand-accent/5 rounded-full blur-[120px] pointer-events-none z-0" />

        {/* Ferramentas Omnipresentes */}
        <CommandPalette />
        
        {/* O Toaster global agora opera de forma independente no Client-Side */}
        <GlobalToaster />

        {/* Conteúdo da Página */}
        <div className="relative z-10 flex-1 flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}