// Layout raiz da aplicação — envolve todas as páginas com providers globais
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Provider do React Query — habilita useQuery e useMutation em toda a aplicação
import QueryProvider from "@/providers/QueryProvider";

// Fontes Geist carregadas via next/font para otimização automática
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadados da aplicação — título, descrição e favicon
export const metadata: Metadata = {
  title: "LashFlow | Agendamentos de Extensão de Cílios",
  description:
    "LashFlow é um sistema premium para gerenciamento de agendamentos e serviços de extensão de cílios.",
  icons: {
    icon: "/logo-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* QueryProvider envolve toda a árvore para disponibilizar o React Query */}
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
