"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utilitário padrão para merge de classes Tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface PriceTickerProps {
  /** O valor numérico bruto do preço */
  value: number;
  /** Símbolo da moeda (Padrão: R$) */
  currency?: string;
  /** Força o estado de desconto (Glow effect) */
  isDiscounted?: boolean;
  className?: string;
}

export function PriceTicker({
  value,
  currency = "R$",
  isDiscounted = false,
  className,
}: PriceTickerProps) {
  const [isDecreasing, setIsDecreasing] = useState(false);
  const prevValue = useRef(value);

  // Efeito para detectar queda de preço e acionar o "Soft Glow" temporário
  useEffect(() => {
    if (value < prevValue.current) {
      setIsDecreasing(true);
      const timer = setTimeout(() => setIsDecreasing(false), 1200);
      prevValue.current = value;
      return () => clearTimeout(timer);
    }
    prevValue.current = value;
  }, [value]);

  // Formatação padrão B2B (ex: 1.250,00)
  const formattedValue = value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const shouldGlow = isDiscounted || isDecreasing;

  return (
    <div
      className={cn(
        "flex items-baseline font-mono text-5xl font-bold tracking-tight text-white transition-all duration-700",
        // Soft Glow ativado com a cor de Inovação (Cyan)
        shouldGlow && "text-brand-accent drop-shadow-[0_0_15px_rgba(6,182,212,0.6)]",
        className
      )}
    >
      <span className="mr-3 text-2xl text-brand-muted">{currency}</span>
      <div className="flex overflow-hidden h-[1em] leading-none">
        {formattedValue.split("").map((char, index) => {
          const isNumber = !isNaN(parseInt(char));

          if (isNumber) {
            // Usamos o index no key apenas porque a estrutura da string formatada mantém posições relativas estáveis
            return <Digit key={`digit-${index}`} digit={char} />;
          }

          // Caracteres especiais (pontos, vírgulas) renderizados estaticamente
          return (
            <span
              key={`char-${index}`}
              className="flex h-[1em] items-center text-brand-muted opacity-80"
            >
              {char}
            </span>
          );
        })}
      </div>
    </div>
  );
}

// Sub-componente isolado para a coluna de números (O Odômetro)
function Digit({ digit }: { digit: string }) {
  const num = parseInt(digit);

  return (
    <div className="relative flex flex-col justify-start h-[1em] w-[1ch] overflow-hidden">
      <motion.div
        initial={false}
        // Move a coluna para cima com base no número atual (ex: 5 = -50% do eixo Y)
        animate={{ y: `-${num * 10}%` }}
        transition={{
          type: "spring",
          stiffness: 150, // Força da mola
          damping: 15,    // Suavidade do freio
          mass: 0.8,      // Peso mecânico
        }}
        className="absolute top-0 left-0 flex flex-col w-full"
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <span
            key={n}
            className="flex h-[1em] w-full items-center justify-center leading-none"
          >
            {n}
          </span>
        ))}
      </motion.div>
    </div>
  );
}