// Componente Badge — copiado da estratégia ShadCN/UI com variantes via cva()
// Exibe etiquetas de status com cores semânticas para agendamentos
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Define as variantes visuais do badge usando class-variance-authority
const badgeVariants = cva(
  // Classes base aplicadas em todas as variantes
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        // Variante padrão — fundo primário
        default:
          "border-transparent bg-pink-600 text-white hover:bg-pink-700",

        // Variante secundária — fundo suave
        secondary:
          "border-transparent bg-pink-100 text-pink-800 hover:bg-pink-200",

        // Variante de destaque (outline)
        outline:
          "border-pink-200 bg-white text-pink-700",

        // Status: pendente — âmbar
        pending:
          "border-amber-200 bg-amber-50 text-amber-700",

        // Status: confirmado — verde
        confirmed:
          "border-emerald-200 bg-emerald-50 text-emerald-700",

        // Status: cancelado — vermelho
        canceled:
          "border-rose-200 bg-rose-50 text-rose-700",
      },
    },
    // Variante padrão quando nenhuma é especificada
    defaultVariants: {
      variant: "default",
    },
  }
);

// Tipagem que combina props HTML com as variantes do cva
export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

// Componente Badge — aceita variant para controlar a aparência
function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
