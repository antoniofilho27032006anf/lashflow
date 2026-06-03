// Página inicial pública do LashFlow
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";

// Benefícios exibidos na seção abaixo do hero
const benefits = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
    title: "Agenda premium",
    description:
      "Organização elegante para cada atendimento, com controle total de horários e serviços.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: "Experiência diferenciada",
    description:
      "Interface pensada para clínicas sofisticadas e clientes que exigem o melhor.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
    title: "Gestão rápida",
    description:
      "Acesse os dados mais importantes em um painel limpo, intuitivo e moderno.",
  },
];

// Serviços em destaque exibidos na home
const serviceHighlights = [
  {
    icon: "✦",
    title: "Alongamento clássico",
    description: "Fios individuais para um olhar natural e sofisticado.",
    price: "R$ 120",
    duration: "60 min",
    badge: "Popular",
  },
  {
    icon: "✦",
    title: "Volume suave",
    description: "Técnica russa para um volume delicado e duradouro.",
    price: "R$ 180",
    duration: "75 min",
    badge: "Premium",
  },
  {
    icon: "✦",
    title: "Design de sobrancelhas",
    description: "Moldagem precisa que realça o olhar com elegância.",
    price: "R$ 90",
    duration: "45 min",
    badge: null,
  },
];

// Diferenciais exibidos na seção de features
const features = [
  {
    title: "Agendamento online",
    description: "Clientes reservam horários diretamente pelo sistema, sem ligações ou mensagens.",
  },
  {
    title: "Painel administrativo",
    description: "Controle total sobre serviços, agendamentos e status em um único lugar.",
  },
  {
    title: "Notificações de status",
    description: "Confirme ou cancele atendimentos com um clique e mantenha tudo organizado.",
  },
];

export default function Home() {
  return (
    <>
      {/* Barra de navegação fixada no topo */}
      <Navbar />

      <main className="min-h-screen">

        {/* ── Hero Section ── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-pink-50 via-white to-rose-50 px-6 py-16 lg:px-8 lg:py-24">

          {/* Ornamento de fundo */}
          <div className="pointer-events-none absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-pink-100/50 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 bottom-0 h-[300px] w-[300px] rounded-full bg-rose-100/40 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">

            {/* Coluna esquerda: texto e CTAs */}
            <div className="space-y-7 animate-fade-in-up">
              {/* Chip de identificação */}
              <div className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white px-4 py-2 text-sm font-semibold text-pink-700 shadow-sm">
                <span className="inline-block h-2 w-2 rounded-full bg-pink-500" />
                Plataforma premium para clínicas de beleza
              </div>

              {/* Headline principal */}
              <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-[3.25rem]">
                Agendamentos que{" "}
                <span className="relative">
                  <span className="relative z-10 text-pink-600">elevam</span>
                  <span className="absolute -bottom-1 left-0 right-0 z-0 h-3 rounded-full bg-pink-100" />
                </span>{" "}
                sua clínica a outro nível
              </h1>

              <p className="max-w-xl text-lg leading-relaxed text-gray-600">
                Gerencie serviços, confirme atendimentos e ofereça uma experiência de alto padrão com interface suave, moderna e confiável.
              </p>

              {/* Botões de ação */}
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/booking"
                  className="inline-flex items-center gap-2 rounded-full bg-pink-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-pink-200 transition hover:bg-pink-700 hover:shadow-pink-300 active:scale-95"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  Agendar Atendimento
                </Link>
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white px-7 py-3.5 text-base font-semibold text-pink-700 shadow-sm transition hover:border-pink-300 hover:bg-pink-50 active:scale-95"
                >
                  Entrar na conta
                </Link>
              </div>

              {/* Métricas resumidas */}
              <div className="flex flex-wrap gap-6 pt-2">
                {[
                  { value: "100%", label: "Digital" },
                  { value: "24h", label: "Disponível" },
                  { value: "SaaS", label: "Moderno" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="text-2xl font-bold text-pink-600">{stat.value}</p>
                    <p className="text-xs font-medium uppercase tracking-widest text-gray-500">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Coluna direita: imagem/mockup */}
            <div className="relative animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
              <div className="absolute inset-0 -z-10 scale-95 rounded-[2.5rem] bg-pink-200/30 blur-2xl" />
              <div className="overflow-hidden rounded-[2.5rem] border border-pink-100 bg-white p-4 shadow-[0_30px_80px_rgba(201,73,122,0.15)]">
                <Image
                  src="/logo.png"
                  alt="LashFlow — Sistema premium de agendamentos"
                  width={820}
                  height={600}
                  className="h-auto w-full rounded-[2rem] object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── Benefícios ── */}
        <section className="bg-white px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-pink-600">Por que LashFlow?</p>
              <h2 className="mt-3 text-3xl font-bold text-gray-900">Tudo que sua clínica precisa</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              {benefits.map((benefit) => (
                <div
                  key={benefit.title}
                  className="group rounded-2xl border border-pink-100 bg-gradient-to-b from-white to-pink-50/50 p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md hover:shadow-pink-100"
                >
                  {/* Ícone com fundo colorido */}
                  <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-pink-100 text-pink-600 transition group-hover:bg-pink-600 group-hover:text-white">
                    {benefit.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{benefit.title}</h3>
                  <p className="mt-2 leading-relaxed text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Serviços em destaque ── */}
        <section className="bg-gradient-to-br from-pink-50 to-rose-50/50 px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-pink-600">Catálogo</p>
                <h2 className="mt-2 text-3xl font-bold text-gray-900">Serviços em destaque</h2>
              </div>
              <Link
                href="/booking"
                className="self-start rounded-full border border-pink-200 bg-white px-5 py-2.5 text-sm font-semibold text-pink-700 shadow-sm transition hover:bg-pink-50"
              >
                Ver todos →
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {serviceHighlights.map((service) => (
                <div
                  key={service.title}
                  className="group relative overflow-hidden rounded-2xl border border-pink-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md hover:shadow-pink-100"
                >
                  {/* Badge opcional */}
                  {service.badge && (
                    <span className="absolute right-4 top-4 rounded-full bg-pink-600 px-3 py-1 text-xs font-bold text-white shadow">
                      {service.badge}
                    </span>
                  )}

                  <p className="mb-3 text-pink-400">{service.icon}</p>
                  <h3 className="text-xl font-semibold text-gray-900">{service.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">{service.description}</p>

                  {/* Rodapé do card: preço e duração */}
                  <div className="mt-6 flex items-center justify-between border-t border-pink-50 pt-4">
                    <span className="text-xl font-bold text-pink-700">{service.price}</span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-pink-50 px-3 py-1 text-sm font-medium text-pink-600">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                      {service.duration}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Diferenciais / Features ── */}
        <section className="bg-white px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">

              {/* Texto esquerdo */}
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-pink-600">Funcionalidades</p>
                <h2 className="mt-3 text-3xl font-bold leading-snug text-gray-900">
                  Sistema completo para gestão de beleza
                </h2>
                <p className="mt-4 text-gray-600 leading-relaxed">
                  Do agendamento online ao painel administrativo, o LashFlow reúne tudo que uma clínica de alto padrão precisa para funcionar com excelência.
                </p>
                <Link
                  href="/register"
                  className="mt-7 inline-flex items-center gap-2 rounded-full bg-pink-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-pink-200 transition hover:bg-pink-700 active:scale-95"
                >
                  Criar conta gratuita
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </Link>
              </div>

              {/* Lista de features */}
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div
                    key={feature.title}
                    className="flex gap-4 rounded-2xl border border-pink-100 bg-gradient-to-r from-white to-pink-50/30 p-5 shadow-sm"
                  >
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-pink-100 text-sm font-bold text-pink-700">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA Banner ── */}
        <section className="px-6 py-14 lg:px-8">
          <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl bg-gradient-to-br from-pink-600 to-rose-500 p-10 text-center shadow-[0_20px_60px_rgba(201,73,122,0.3)]">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-pink-100">Pronto para começar?</p>
            <h2 className="mt-3 text-3xl font-bold text-white">Agende seu atendimento agora</h2>
            <p className="mx-auto mt-4 max-w-md text-pink-100">
              Experiência premium com apenas alguns cliques. Rápido, simples e elegante.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/booking"
                className="rounded-full bg-white px-7 py-3 text-base font-semibold text-pink-700 shadow transition hover:shadow-lg active:scale-95"
              >
                Agendar agora
              </Link>
              <Link
                href="/register"
                className="rounded-full border-2 border-white/30 bg-white/10 px-7 py-3 text-base font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 active:scale-95"
              >
                Criar conta
              </Link>
            </div>
          </div>
        </section>

        {/* ── Rodapé ── */}
        <footer className="border-t border-pink-100 bg-white px-6 py-10 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 md:grid-cols-3">

              {/* Marca */}
              <div>
                <div className="flex items-center gap-2">
                  <Image src="/logo-icon.png" alt="LashFlow" width={32} height={32} className="rounded-lg" />
                  <span className="font-bold text-gray-900">Lash<span className="text-pink-600">Flow</span></span>
                </div>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-gray-500">
                  Sistema premium para gerenciamento de agendamentos de extensão de cílios e serviços de beleza.
                </p>
              </div>

              {/* Links rápidos */}
              <div>
                <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-900">Navegação</p>
                <ul className="space-y-2">
                  {[
                    { label: "Início", href: "/" },
                    { label: "Agendar", href: "/booking" },
                    { label: "Entrar", href: "/auth/signin" },
                    { label: "Cadastro", href: "/register" },
                  ].map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="text-sm text-gray-500 transition hover:text-pink-600">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contato */}
              <div>
                <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-900">Contato</p>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li>atendimento@lashflow.com</li>
                  <li>(11) 99999-9999</li>
                </ul>
              </div>
            </div>

            {/* Linha final */}
            <div className="mt-8 border-t border-pink-100 pt-6 text-center">
              <p className="text-xs text-gray-400">
                © {new Date().getFullYear()} LashFlow. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
