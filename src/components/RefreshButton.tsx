"use client";

// Botão que força a re-busca dos dados do servidor sem recarregar a página inteira
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RefreshButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleRefresh() {
    setLoading(true);
    // Invalida o cache do servidor e rebusca os dados da rota atual
    router.refresh();
    // Aguarda um curto momento para dar feedback visual
    setTimeout(() => setLoading(false), 800);
  }

  return (
    <button
      onClick={handleRefresh}
      disabled={loading}
      className="inline-flex items-center gap-1.5 rounded-full border border-pink-200 bg-white px-4 py-2 text-sm font-semibold text-pink-700 shadow-sm transition hover:border-pink-300 hover:bg-pink-50 active:scale-95 disabled:opacity-70"
    >
      {/* Ícone de atualizar */}
      <svg
        className={loading ? "animate-spin" : ""}
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="23 4 23 10 17 10"/>
        <polyline points="1 20 1 14 7 14"/>
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
      </svg>
      {loading ? "Atualizando..." : "Atualizar status"}
    </button>
  );
}
