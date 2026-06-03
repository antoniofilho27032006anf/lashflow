// Dashboard principal — exibe visão do admin ou do cliente conforme o perfil
// force-dynamic garante que os dados sejam sempre buscados do banco ao carregar a página
export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import RefreshButton from "@/components/RefreshButton";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import Service from "@/models/Service";
import Appointment from "@/models/Appointment";
import LogoutButton from "@/components/LogoutButton";

// ──────────────────────────────────────────
// Componente: dashboard do administrador
// ──────────────────────────────────────────
async function AdminDashboard({ session }: { session: any }) {
  await connectDB();

  // Carrega métricas do banco para os cards
  const totalServices = await Service.countDocuments();
  const totalAppointments = await Appointment.countDocuments();
  const confirmedCount = await Appointment.countDocuments({ status: "CONFIRMED" });
  const pendingCount = await Appointment.countDocuments({ status: "PENDING" });

  // Calcula a ocupação com base nos agendamentos confirmados vs total
  const utilization = totalAppointments === 0
    ? 0
    : Math.round((confirmedCount / totalAppointments) * 100);

  // Busca todos os agendamentos para calcular a distribuição semanal real
  const allAppointments = await Appointment.find({}, { appointmentDate: 1 });

  // Conta quantos agendamentos existem em cada dia da semana (0=Dom, 1=Seg, ..., 6=Sáb)
  const dayCounts = [0, 0, 0, 0, 0, 0, 0];
  for (const appt of allAppointments) {
    const dayIndex = new Date(appt.appointmentDate).getDay();
    dayCounts[dayIndex]++;
  }

  // Calcula o máximo para normalizar as barras em porcentagem
  const maxCount = Math.max(...dayCounts, 1);

  // Monta os dados do gráfico com valores reais do banco
  const weeklyData = [
    { day: "Seg", count: dayCounts[1], value: Math.round((dayCounts[1] / maxCount) * 100) },
    { day: "Ter", count: dayCounts[2], value: Math.round((dayCounts[2] / maxCount) * 100) },
    { day: "Qua", count: dayCounts[3], value: Math.round((dayCounts[3] / maxCount) * 100) },
    { day: "Qui", count: dayCounts[4], value: Math.round((dayCounts[4] / maxCount) * 100) },
    { day: "Sex", count: dayCounts[5], value: Math.round((dayCounts[5] / maxCount) * 100) },
    { day: "Sáb", count: dayCounts[6], value: Math.round((dayCounts[6] / maxCount) * 100) },
    { day: "Dom", count: dayCounts[0], value: Math.round((dayCounts[0] / maxCount) * 100) },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">

      {/* Barra superior do admin */}
      <header className="sticky top-0 z-40 border-b border-pink-100 bg-white/90 backdrop-blur-md px-6 py-4 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Image src="/logo-icon.png" alt="LashFlow" width={32} height={32} className="rounded-lg" />
              <span className="font-bold text-gray-900">Lash<span className="text-pink-600">Flow</span></span>
            </Link>
            {/* Badge identificador do painel administrativo */}
            <span className="hidden items-center gap-1.5 rounded-full bg-pink-600 px-3 py-1 text-xs font-bold text-white shadow-sm sm:inline-flex">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              Painel Administrador
            </span>
          </div>
          <nav className="hidden items-center gap-2 md:flex">
            <Link href="/dashboard" className="rounded-xl bg-pink-50 px-4 py-2 text-sm font-semibold text-pink-700">
              Dashboard
            </Link>
            <Link href="/admin/services" className="rounded-xl px-4 py-2 text-sm font-medium text-gray-600 hover:bg-pink-50 hover:text-pink-700 transition">
              Serviços
            </Link>
            <Link href="/admin/appointments" className="rounded-xl px-4 py-2 text-sm font-medium text-gray-600 hover:bg-pink-50 hover:text-pink-700 transition">
              Agendamentos
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-xs text-gray-500">Bem-vinda,</p>
              <p className="text-sm font-semibold text-gray-900">{session.user?.name ?? "Admin"}</p>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-6 lg:p-8">
        <div className="mb-8 animate-fade-in-up">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-pink-600">Painel Administrador</p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">Visão geral</h1>
          <p className="mt-1 text-gray-500">Acompanhe os indicadores do LashFlow em tempo real.</p>
        </div>

        {/* Cards de métricas */}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4 animate-fade-in-up">
          {[
            {
              label: "Serviços",
              value: totalServices,
              sub: "cadastrados",
              color: "bg-pink-100 text-pink-600",
              bar: "from-pink-400 to-rose-400",
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 19.07a10 10 0 0 1 0-14.14"/>
                </svg>
              ),
            },
            {
              label: "Agendamentos",
              value: totalAppointments,
              sub: "no total",
              color: "bg-violet-100 text-violet-600",
              bar: "from-violet-400 to-purple-400",
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              ),
            },
            {
              label: "Confirmados",
              value: confirmedCount,
              sub: "atendimentos",
              color: "bg-emerald-100 text-emerald-600",
              bar: "from-emerald-400 to-teal-400",
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              ),
            },
            {
              label: "Ocupação",
              value: `${utilization}%`,
              sub: "estimada",
              color: "bg-amber-100 text-amber-600",
              bar: "from-amber-400 to-orange-400",
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
                </svg>
              ),
            },
          ].map((card) => (
            <div key={card.label} className="relative overflow-hidden rounded-2xl border border-pink-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{card.label}</p>
                  <p className="mt-2 text-4xl font-bold text-gray-900">{card.value}</p>
                  <p className="mt-1 text-sm text-gray-500">{card.sub}</p>
                </div>
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.color}`}>
                  {card.icon}
                </div>
              </div>
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${card.bar}`} />
            </div>
          ))}
        </div>

        {/* Gráfico de atividade + ações rápidas */}
        <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr] animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <div className="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Agendamentos por dia</h2>
                <p className="mt-0.5 text-sm text-gray-500">Distribuição real dos atendimentos cadastrados</p>
              </div>
              <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-medium text-pink-600">
                {totalAppointments} total
              </span>
            </div>

            {/* Estado vazio quando não há agendamentos */}
            {totalAppointments === 0 ? (
              <p className="text-center text-sm text-gray-400 py-6">Nenhum agendamento cadastrado ainda.</p>
            ) : (
              <div className="space-y-3">
                {weeklyData.map((item) => (
                  <div key={item.day} className="flex items-center gap-4">
                    <span className="w-8 text-xs font-medium text-gray-500">{item.day}</span>
                    <div className="flex-1 overflow-hidden rounded-full bg-pink-50">
                      <div
                        className="h-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 transition-all duration-500"
                        style={{ width: item.count === 0 ? "2px" : `${item.value}%` }}
                      />
                    </div>
                    {/* Exibe o número real de agendamentos naquele dia */}
                    <span className="w-6 text-right text-xs font-semibold text-gray-600">{item.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-5">
            <div className="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Ações rápidas</h2>
              <div className="space-y-3">
                {[
                  { href: "/admin/appointments", label: "Ver agendamentos", sub: `${pendingCount} pendentes`, iconColor: "bg-pink-100 text-pink-600", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
                  { href: "/admin/services", label: "Gerenciar serviços", sub: `${totalServices} serviços ativos`, iconColor: "bg-violet-100 text-violet-600", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 19.07a10 10 0 0 1 0-14.14"/></svg> },
                ].map((action) => (
                  <Link key={action.href} href={action.href} className="flex items-center gap-3 rounded-xl border border-pink-100 bg-pink-50/60 p-4 transition hover:bg-pink-100">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${action.iconColor}`}>{action.icon}</div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{action.label}</p>
                      <p className="text-xs text-gray-500">{action.sub}</p>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><polyline points="9 18 15 12 9 6"/></svg>
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Status dos agendamentos</h2>
              <div className="space-y-3">
                {[
                  { label: "Pendentes", count: pendingCount, dot: "bg-amber-400", badge: "bg-amber-50 text-amber-700" },
                  { label: "Confirmados", count: confirmedCount, dot: "bg-emerald-400", badge: "bg-emerald-50 text-emerald-700" },
                  { label: "Total", count: totalAppointments, dot: "bg-gray-300", badge: "bg-gray-100 text-gray-600" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${item.dot}`} />
                      <span className="text-sm text-gray-700">{item.label}</span>
                    </div>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${item.badge}`}>{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// ──────────────────────────────────────────
// Componente: dashboard do cliente
// ──────────────────────────────────────────
async function ClientDashboard({ session }: { session: any }) {
  await connectDB();

  // Escapa caracteres especiais do nome para uso seguro em regex
  const escapedName = session.user.name
    .trim()
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // Carrega os agendamentos do cliente logado filtrando pelo nome (case-insensitive, trim)
  const appointments = await Appointment.find({
    clientName: { $regex: new RegExp(`^\\s*${escapedName}\\s*$`, "i") },
  }).sort({ appointmentDate: -1 });

  // Retorna o rótulo traduzido do status
  function getStatusLabel(status: string) {
    switch (status) {
      case "CONFIRMED": return "Confirmado";
      case "CANCELED":  return "Cancelado";
      default:          return "Pendente";
    }
  }

  // Retorna classes de cor do badge conforme o status
  function getStatusClass(status: string) {
    switch (status) {
      case "CONFIRMED": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "CANCELED":  return "bg-rose-50 text-rose-700 border-rose-200";
      default:          return "bg-amber-50 text-amber-700 border-amber-200";
    }
  }

  // Formata a data para exibição amigável
  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      weekday: "short", day: "2-digit", month: "short", year: "numeric",
    }) + " às " + date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  }

  const confirmed = appointments.filter((a: any) => a.status === "CONFIRMED").length;
  const pending   = appointments.filter((a: any) => a.status === "PENDING").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">

      {/* Barra superior do cliente */}
      <header className="sticky top-0 z-40 border-b border-pink-100 bg-white/90 backdrop-blur-md px-6 py-4 shadow-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image src="/logo-icon.png" alt="LashFlow" width={32} height={32} className="rounded-lg" />
            <span className="font-bold text-gray-900">Lash<span className="text-pink-600">Flow</span></span>
          </Link>
          <div className="flex items-center gap-2">
            {/* Botão de atualizar status dos agendamentos */}
            <RefreshButton />
            <Link
              href="/booking"
              className="hidden items-center gap-1.5 rounded-full bg-pink-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-pink-200 transition hover:bg-pink-700 sm:inline-flex"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Novo agendamento
            </Link>
            <div className="hidden text-right sm:block">
              <p className="text-xs text-gray-500">Olá,</p>
              <p className="text-sm font-semibold text-gray-900">{session.user?.name}</p>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl p-6 lg:p-8">

        {/* Cabeçalho e boas-vindas */}
        <div className="mb-8 animate-fade-in-up">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-pink-600">Minha área</p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Olá, {session.user?.name?.split(" ")[0]}! 👋
          </h1>
          <p className="mt-1 text-gray-500">Acompanhe seus agendamentos e o status de cada atendimento.</p>
        </div>

        {/* Cards de resumo do cliente */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3 animate-fade-in-up">
          {[
            { label: "Total de agendamentos", value: appointments.length, color: "bg-pink-100 text-pink-600", bar: "from-pink-400 to-rose-400" },
            { label: "Confirmados", value: confirmed, color: "bg-emerald-100 text-emerald-600", bar: "from-emerald-400 to-teal-400" },
            { label: "Aguardando", value: pending, color: "bg-amber-100 text-amber-600", bar: "from-amber-400 to-orange-400" },
          ].map((card) => (
            <div key={card.label} className="relative overflow-hidden rounded-2xl border border-pink-100 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{card.label}</p>
              <p className="mt-2 text-4xl font-bold text-gray-900">{card.value}</p>
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${card.bar}`} />
            </div>
          ))}
        </div>

        {/* Aviso explicativo: como ver o status atualizado */}
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 animate-fade-in-up">
          <svg className="mt-0.5 flex-shrink-0 text-amber-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <p className="text-sm text-amber-800">
            Os agendamentos <strong>Pendentes</strong> aguardam confirmação da equipe.
            Para ver o status mais recente, clique em{" "}
            <strong>Atualizar status</strong> no canto superior direito.
          </p>
        </div>

        {/* Lista de agendamentos */}
        <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center justify-between px-1">
            <h2 className="text-lg font-semibold text-gray-900">Meus agendamentos</h2>
            <Link
              href="/booking"
              className="inline-flex items-center gap-1 text-sm font-semibold text-pink-600 transition hover:text-pink-700"
            >
              + Novo agendamento
            </Link>
          </div>

          {appointments.length === 0 ? (
            // Estado vazio
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-pink-200 bg-white p-12 text-center shadow-sm">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-100 text-pink-400">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Nenhum agendamento encontrado</p>
                <p className="mt-1 text-sm text-gray-500">
                  Ao agendar, use exatamente o nome <strong>{session.user?.name}</strong> para que apareça aqui.
                </p>
              </div>
              <Link
                href="/booking"
                className="mt-2 inline-flex items-center gap-2 rounded-full bg-pink-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-pink-200 transition hover:bg-pink-700"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Agendar agora
              </Link>
            </div>
          ) : (
            // Lista dos agendamentos encontrados
            appointments.map((appointment: any) => (
              <div
                key={appointment._id.toString()}
                className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                  {/* Dados do agendamento */}
                  <div className="flex gap-4">
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-pink-100 text-pink-700 font-bold text-base">
                      {appointment.clientName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{appointment.service}</p>
                      <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1.5">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                          </svg>
                          {formatDate(appointment.appointmentDate)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5 19.79 19.79 0 0 1 1.61 4.9 2 2 0 0 1 3.6 2.68h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l.81-.81a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.73 17z"/>
                          </svg>
                          {appointment.clientPhone}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Badge de status com ícone */}
                  <div className="flex-shrink-0">
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold ${getStatusClass(appointment.status)}`}>
                      {appointment.status === "CONFIRMED" && (
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      )}
                      {appointment.status === "CANCELED" && (
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      )}
                      {appointment.status === "PENDING" && (
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                        </svg>
                      )}
                      {getStatusLabel(appointment.status)}
                    </span>
                  </div>
                </div>

                {/* Mensagem de orientação por status */}
                {appointment.status === "PENDING" && (
                  <p className="mt-3 rounded-xl bg-amber-50 px-4 py-2.5 text-xs text-amber-700">
                    ⏳ Seu agendamento está aguardando confirmação da equipe LashFlow.
                  </p>
                )}
                {appointment.status === "CONFIRMED" && (
                  <p className="mt-3 rounded-xl bg-emerald-50 px-4 py-2.5 text-xs text-emerald-700">
                    ✓ Agendamento confirmado! Compareça no horário marcado.
                  </p>
                )}
                {appointment.status === "CANCELED" && (
                  <p className="mt-3 rounded-xl bg-rose-50 px-4 py-2.5 text-xs text-rose-700">
                    ✕ Este agendamento foi cancelado. Agende novamente se desejar.
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

// ──────────────────────────────────────────
// Componente principal — decide qual dashboard renderizar
// ──────────────────────────────────────────
export default async function Dashboard() {
  // Verifica se o usuário está autenticado
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  // Permite acesso apenas ao admin
  if (session.user.role === "ADMIN") {
    return <AdminDashboard session={session} />;
  }

  // Exibe o dashboard do cliente para usuários com role CLIENT
  return <ClientDashboard session={session} />;
}
