// Utilitário padrão do ShadCN/UI para mesclar classes Tailwind sem conflitos
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// cn() combina classes condicionais (clsx) e resolve conflitos do Tailwind (twMerge)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
