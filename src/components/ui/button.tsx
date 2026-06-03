// Componente Button — copiado da estratégia ShadCN/UI com variantes via cva()
// Unifica todos os botões do projeto com estilo consistente
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Define as variantes e tamanhos do botão usando class-variance-authority
const buttonVariants = cva(
  // Classes base: layout, transições e estados disabled
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all active:scale-95 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      // Variantes de aparência
      variant: {
        // Botão primário — fundo rosa
        default:
          "bg-pink-600 text-white shadow-lg shadow-pink-200 hover:bg-pink-700 hover:shadow-pink-300",

        // Botão de ação destrutiva — fundo vermelho suave
        destructive:
          "bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100",

        // Botão contornado — borda rosa, fundo branco
        outline:
          "border border-pink-200 bg-white text-pink-700 shadow-sm hover:border-pink-300 hover:bg-pink-50",

        // Botão fantasma — sem borda, fundo transparente
        ghost:
          "text-pink-700 hover:bg-pink-50",

        // Botão de ação secundária — fundo suave
        secondary:
          "bg-pink-100 text-pink-800 hover:bg-pink-200",

        // Botão de sucesso — verde suave
        success:
          "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100",
      },
      // Variantes de tamanho
      size: {
        default: "h-10 px-5 py-2.5",
        sm: "h-8 px-3.5 py-1.5 text-xs",
        lg: "h-12 px-7 py-3 text-base",
        icon: "h-9 w-9",
      },
    },
    // Padrões quando nenhuma variante/tamanho é especificado
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// Tipagem que combina props nativas do botão com as variantes do cva
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

// Componente Button com forwardRef para suporte a referências externas
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
