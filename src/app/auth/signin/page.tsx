"use client";

// Página de login do LashFlow
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  // Faz o login do usuário via NextAuth
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setLoading(true);
      setFeedback({ type: "", message: "" });

      // Normaliza o email removendo espaços e convertendo para minúsculas
      const normalizedEmail = email.toLowerCase().trim();

      const response = await signIn("credentials", {
        redirect: false,
        email: normalizedEmail,
        password,
        callbackUrl: "/dashboard",
      });

      // Verifica se ocorreu erro no login
      if (response?.error) {
        setFeedback({
          type: "error",
          message: "Email ou senha inválidos. Verifique e tente novamente.",
        });
        return;
      }

      // Redireciona ao dashboard em caso de sucesso
      setFeedback({
        type: "success",
        message: "Login realizado com sucesso! Redirecionando...",
      });

      router.push(response?.url ?? "/dashboard");
    } catch {
      setFeedback({
        type: "error",
        message: "Erro ao efetuar login. Tente novamente mais tarde.",
      });
    } finally {
      setLoading(false);
    }
  }

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
            href="/register"
            className="text-sm font-medium text-gray-600 transition hover:text-pink-600"
          >
            Não tem conta?{" "}
            <span className="font-semibold text-pink-600">Cadastre-se</span>
          </Link>
        </div>
      </header>

      {/* Conteúdo principal */}
      <div className="mx-auto flex min-h-[calc(100vh-65px)] max-w-6xl items-center px-6 py-12">
        <div className="grid w-full gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">

          {/* Painel esquerdo: identidade da marca */}
          <div className="hidden space-y-8 lg:block animate-fade-in-up">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-pink-600">
                Bem-vinda ao LashFlow
              </p>
              <h1 className="mt-4 text-4xl font-bold leading-tight text-gray-900">
                Acesso premium para{" "}
                <span className="text-pink-600">sua agenda</span>
              </h1>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Entre com sua conta e gerencie agendamentos de maneira elegante, rápida e segura.
              </p>
            </div>

            {/* Cards de características */}
            <div className="space-y-4">
              {[
                {
                  title: "Login seguro",
                  description: "Autenticação JWT com NextAuth para proteção total.",
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  ),
                },
                {
                  title: "Controle de acesso",
                  description: "Perfis de cliente e administrador com áreas distintas.",
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                  ),
                },
                {
                  title: "Dados protegidos",
                  description: "Sessões criptografadas e tokens de segurança renovados.",
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                  ),
                },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4 rounded-2xl border border-pink-100 bg-white p-5 shadow-sm">
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
          </div>

          {/* Formulário de login */}
          <div className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-pink-100 bg-white p-8 shadow-[0_20px_60px_rgba(201,73,122,0.12)]"
            >
              {/* Título do formulário */}
              <div className="mb-7">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-pink-600">Acesso</p>
                <h2 className="mt-2 text-3xl font-bold text-gray-900">Entre na sua conta</h2>
              </div>

              {/* Campo de email */}
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

              {/* Campo de senha com toggle de visibilidade */}
              <div className="mb-6">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Senha
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
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

              {/* Botão de login */}
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
                    Conectando...
                  </span>
                ) : (
                  "Entrar"
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

              {/* Link para cadastro */}
              <p className="mt-6 text-center text-sm text-gray-500">
                Não tem uma conta?{" "}
                <Link href="/register" className="font-semibold text-pink-600 transition hover:text-pink-700">
                  Cadastre-se grátis
                </Link>
              </p>

              {/* Divisor de acesso rápido */}
              <div className="mt-6 flex items-center gap-3">
                <div className="flex-1 border-t border-pink-100" />
                <span className="text-xs font-medium text-gray-400">acesso rápido</span>
                <div className="flex-1 border-t border-pink-100" />
              </div>

              {/* Botão de acesso ao Painel Administrador — preenche o email automaticamente */}
              <button
                type="button"
                onClick={() => {
                  setEmail("admin@lashflow.com");
                  setFeedback({ type: "", message: "" });
                }}
                className="mt-4 w-full rounded-2xl border border-pink-200 bg-gradient-to-r from-pink-50 to-rose-50 px-5 py-3.5 text-left transition hover:border-pink-300 hover:shadow-sm active:scale-95"
              >
                <div className="flex items-center gap-3">
                  {/* Ícone de escudo/admin */}
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-pink-600 text-white shadow-sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Painel Administrador</p>
                    <p className="text-xs text-gray-500">Clique para preencher o email admin</p>
                  </div>
                  {/* Seta indicativa */}
                  <svg className="ml-auto text-pink-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </div>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
