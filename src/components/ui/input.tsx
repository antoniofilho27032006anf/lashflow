// Componente Input — copiado da estratégia ShadCN/UI
// Input unificado com estilo consistente em todo o projeto
import * as React from "react";

import { cn } from "@/lib/utils";

// Herda todos os atributos nativos do input HTML
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

// Componente Input com forwardRef para suporte a referências externas
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Classes base: layout e tipografia
          "flex w-full rounded-2xl border border-pink-200 bg-pink-50/50 px-4 py-3",
          "text-sm text-gray-900 placeholder:text-gray-400",
          // Estados de foco com anel da marca
          "transition focus:border-pink-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-200",
          // Estado desabilitado
          "disabled:cursor-not-allowed disabled:opacity-50",
          // Classes adicionais passadas pelo consumidor
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
