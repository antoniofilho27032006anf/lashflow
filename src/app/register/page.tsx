"use client";

// Página de cadastro de novos usuários
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  // Calcula a força da senha para exibição visual
  function getPasswordStrength(pwd: string): { level: number; label: string; color: string } {
    if (pwd.length === 0) return { level: 0, label: "", color: "" };
    if (pwd.length < 6) return { level: 1, label: "Fraca", color: "bg-red-400" };
    if (pwd.length < 10) return { level: 2, label: "Média", color: "bg-amber-400" };
    return { level: 3, label: "Forte", color: "bg-emerald-500" };
  }

  // Envia o formulário de cadastro para a API
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setLoading(true);
      setFeedback({ type: "", message: "" });

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      // Exibe mensagem de erro retornada pela API
      if (!response.ok) {
        setFeedback({
          type: "error",
          message: data.message || "Erro ao cadastrar.",
        });
        return;
      }

      // Redireciona para login após cadastro bem-sucedido
      setFeedback({
        type: "success",
        message: "Cadastro realizado! Redirecionando para o login...",
      });

      setName("");
      setEmail("");
      setPassword("");

      setTimeout(() => {
        router.push("/auth/signin");
      }, 2000);
    } catch {
      setFeedback({
        type: "error",
        message: "Erro ao cadastrar. Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  }

  const strength = getPasswordStrength(password);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">

      {/* Cabeçalho minimalista */}
      <header className="border-b border-pink-100 bg-white/80 backdrop-blur-sm px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo-icon.png" alt="LashFlow" width={32} height={32} className="rounded-lg" />
            <span className="font-bold text-gray-900">Lash<span className="text-pink-600">Flow</span></span>
          </Link>
          <Link
            href="/auth/signin"
            className="text-sm font-medium text-gray-600 transition hover:text-pink-600"
          >
            Já tem conta?{" "}
            <span className="font-semibold text-pink-600">Entrar</span>
          </Link>
        </div>
      </header>

      {/* Conteúdo principal */}
      <div className="mx-auto grid max-w-6xl min-h-[calc(100vh-65px)] items-center gap-10 px-6 py-12 lg:grid-cols-[1fr_1fr]">

        {/* Formulário de cadastro */}
        <div className="animate-fade-in-up">
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-pink-100 bg-white p-8 shadow-[0_20px_60px_rgba(201,73,122,0.12)]"
          >
            {/* Título */}
            <div className="mb-7">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-pink-600">Registro</p>
              <h1 className="mt-2 text-3xl font-bold text-gray-900">Crie sua conta</h1>
              <p className="mt-2 text-sm text-gray-500">
                Acesso rápido ao sistema de agendamentos LashFlow.
              </p>
            </div>

            {/* Campo nome */}
            <div className="mb-4">
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Nome completo
              </label>
              <input
                type="text"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-2xl border border-pink-200 bg-pink-50/50 px-4 py-3.5 text-gray-900 placeholder-gray-400 transition focus:border-pink-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-200"
                required
              />
            </div>

            {/* Campo email */}
            <div className="mb-4">
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-pink-200 bg-pink-50/50 px-4 py-3.5 text-gray-900 placeholder-gray-400 transition focus:border-pink-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-200"
                required
              />
            </div>

            {/* Campo senha com toggle de visibilidade */}
            <div className="mb-2">
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-pink-200 bg-pink-50/50 px-4 py-3.5 pr-12 text-gray-900 placeholder-gray-400 transition focus:border-pink-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-200"
                  required
                />
                {/* Botão mostrar/ocultar senha */}
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-pink-600"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Indicador visual de força da senha */}
            {password.length > 0 && (
              <div className="mb-5">
                <div className="flex gap-1.5">
                  {[1, 2, 3].map((bar) => (
                    <div
                      key={bar}
                      className={`h-1.5 flex-1 rounded-full transition-all ${
                        bar <= strength.level ? strength.color : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <p className={`mt-1 text-xs font-medium ${
                  strength.level === 1 ? "text-red-500" :
                  strength.level === 2 ? "text-amber-500" : "text-emerald-600"
                }`}>
                  Senha {strength.label}
                </p>
              </div>
            )}

            {/* Botão de cadastro */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-pink-600 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-pink-200 transition hover:bg-pink-700 hover:shadow-pink-300 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                  Criando conta...
                </span>
              ) : (
                "Criar minha conta"
              )}
            </button>

            {/* Feedback de sucesso ou erro */}
            {feedback.message && (
              <div
                className={`mt-5 flex items-start gap-3 rounded-2xl border px-4 py-3.5 text-sm ${
                  feedback.type === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-rose-200 bg-rose-50 text-rose-700"
                }`}
              >
                {feedback.type === "success" ? (
                  <svg className="mt-0.5 flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                ) : (
                  <svg className="mt-0.5 flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                )}
                {feedback.message}
              </div>
            )}

            {/* Link para login */}
            <p className="mt-6 text-center text-sm text-gray-500">
              Já possui conta?{" "}
              <Link href="/auth/signin" className="font-semibold text-pink-600 transition hover:text-pink-700">
                Fazer login
              </Link>
            </p>
          </form>
        </div>

        {/* Painel lateral direito: vantagens */}
        <aside className="hidden space-y-6 lg:block animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-pink-600">
              Por que escolher LashFlow?
            </p>
            <h2 className="mt-4 text-3xl font-bold leading-tight text-gray-900">
              Gestão elegante e prática
            </h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              A ferramenta ideal para estúdios de beleza que desejam uma presença digital sofisticada e organizada.
            </p>
          </div>

          {/* Cards de vantagens */}
          <div className="space-y-4">
            {[
              {
                title: "Agenda centralizada",
                description: "Controle serviços, agendamentos e histórico em um só lugar.",
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                ),
              },
              {
                title: "Visual premium",
                description: "Interface com estilo suave, componentes modernos e responsivos.",
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <circle cx="12" cy="12" r="4"/>
                    <line x1="21.17" y1="8" x2="12" y2="8"/>
                    <line x1="3.95" y1="6.06" x2="8.54" y2="14"/>
                    <line x1="10.88" y1="21.94" x2="15.46" y2="14"/>
                  </svg>
                ),
              },
              {
                title: "Pronto para apresentação",
                description: "Interface refinada para demonstrações acadêmicas e profissionais.",
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                ),
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4 rounded-2xl border border-pink-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-pink-100 text-pink-600">
                  {item.icon}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{item.title}</p>
                  <p className="mt-1 text-sm text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
