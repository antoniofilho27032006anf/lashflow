"use client";

// Barra de navegação principal das páginas públicas
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  // Controla a abertura do menu mobile
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-pink-100/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 lg:px-8">

        {/* Logotipo */}
        <Link href="/" className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 rounded-xl">
          <Image
            src="/logo-icon.png"
            alt="LashFlow"
            width={36}
            height={36}
            className="rounded-lg"
          />
          <span className="text-lg font-bold tracking-tight text-gray-900">
            Lash<span className="text-pink-600">Flow</span>
          </span>
        </Link>

        {/* Links de navegação desktop */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-gray-600 transition hover:text-pink-600"
          >
            Início
          </Link>
          <Link
            href="/booking"
            className="text-sm font-medium text-gray-600 transition hover:text-pink-600"
          >
            Agendar
          </Link>
          <Link
            href="/auth/signin"
            className="text-sm font-medium text-gray-600 transition hover:text-pink-600"
          >
            Entrar
          </Link>
        </nav>

        {/* Botão CTA desktop */}
        <div className="hidden md:block">
          <Link
            href="/booking"
            className="inline-flex items-center gap-2 rounded-full bg-pink-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-pink-200 transition hover:bg-pink-700 hover:shadow-pink-300 active:scale-95"
          >
            {/* Ícone de calendário */}
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            Agendar agora
          </Link>
        </div>

        {/* Botão hamburguer mobile */}
        <button
          className="flex items-center justify-center rounded-xl p-2 text-gray-600 transition hover:bg-pink-50 md:hidden"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Abrir menu"
        >
          {menuOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          )}
        </button>
      </div>

      {/* Menu dropdown mobile */}
      {menuOpen && (
        <div className="border-t border-pink-100 bg-white px-6 py-4 md:hidden animate-fade-in">
          <nav className="flex flex-col gap-3">
            <Link href="/" className="rounded-xl px-3 py-2 text-sm font-medium text-gray-700 hover:bg-pink-50 hover:text-pink-600" onClick={() => setMenuOpen(false)}>
              Início
            </Link>
            <Link href="/booking" className="rounded-xl px-3 py-2 text-sm font-medium text-gray-700 hover:bg-pink-50 hover:text-pink-600" onClick={() => setMenuOpen(false)}>
              Agendar
            </Link>
            <Link href="/auth/signin" className="rounded-xl px-3 py-2 text-sm font-medium text-gray-700 hover:bg-pink-50 hover:text-pink-600" onClick={() => setMenuOpen(false)}>
              Entrar
            </Link>
            <Link href="/register" className="mt-1 rounded-full bg-pink-600 py-2.5 text-center text-sm font-semibold text-white" onClick={() => setMenuOpen(false)}>
              Criar conta
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
