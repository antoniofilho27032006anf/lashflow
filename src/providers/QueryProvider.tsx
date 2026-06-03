"use client";

// Provider do React Query (TanStack Query) — envolve toda a aplicação
// Permite que qualquer componente client use useQuery e useMutation
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

type QueryProviderProps = {
  children: ReactNode;
};

export default function QueryProvider({ children }: QueryProviderProps) {
  // QueryClient é criado uma única vez por instância do provider
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Dados ficam "frescos" por 60 segundos antes de revalidar
            staleTime: 60 * 1000,
            // Tenta novamente apenas 1 vez em caso de erro de rede
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
