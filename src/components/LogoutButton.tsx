"use client";

// Botão de logout do sistema – encerra a sessão e redireciona para a home
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="inline-flex items-center gap-1.5 rounded-full border border-pink-200 bg-white px-4 py-2.5 text-sm font-semibold text-pink-700 shadow-sm transition hover:border-pink-300 hover:bg-pink-50 active:scale-95"
    >
      {/* Ícone de sair */}
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
        <polyline points="16 17 21 12 16 7"/>
        <line x1="21" y1="12" x2="9" y2="12"/>
      </svg>
      Sair
    </button>
  );
}
