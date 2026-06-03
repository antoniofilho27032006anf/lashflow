"use client";

// Página de gerenciamento de agendamentos — usa React Query, Zustand e ShadCN
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

// Store Zustand para filtros de UI (pesquisa e status)
import { useAppointmentStore } from "@/store/useAppointmentStore";

// Componentes ShadCN/UI
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Tipagem do agendamento
type Appointment = {
  _id: string;
  clientName: string;
  clientPhone: string;
  service: string;
  appointmentDate: string;
  status: string;
};

// ── Funções de requisição à API ──────────────────────────────

// Busca todos os agendamentos do servidor
async function fetchAppointments(): Promise<Appointment[]> {
  const res = await fetch("/api/appointments");
  const data = await res.json();
  if (!data.success) throw new Error("Erro ao buscar agendamentos");
  return data.appointments;
}

// Atualiza o status de um agendamento específico
async function updateAppointmentStatus(id: string, status: string) {
  const res = await fetch(`/api/appointments/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Erro ao atualizar status");
  return res.json();
}

// ── Componente principal ──────────────────────────────────────

export default function AppointmentsPage() {
  // Acessa o cliente do React Query para invalidar cache manualmente
  const queryClient = useQueryClient();

  // Estado de UI dos filtros — gerenciado pelo Zustand (não por useState local)
  const { search, statusFilter, setSearch, setStatusFilter } = useAppointmentStore();

  // Estado local apenas para toast de notificação
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "",
  });

  // Exibe uma notificação temporária na tela
  function showToast(message: string, type: "success" | "error") {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3500);
  }

  // Busca os agendamentos com React Query — revalida automaticamente ao invalidar
  const {
    data: appointments = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["appointments"],
    queryFn: fetchAppointments,
  });

  // Mutation para atualizar o status — invalida a query após sucesso
  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateAppointmentStatus(id, status),

    // Ao confirmar ou cancelar, rebusca os agendamentos automaticamente
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      showToast(
        status === "CONFIRMED"
          ? "Agendamento confirmado!"
          : "Agendamento cancelado.",
        status === "CONFIRMED" ? "success" : "error"
      );
    },

    onError: () => {
      showToast("Erro ao atualizar status.", "error");
    },
  });

  // Retorna a variante do Badge conforme o status do agendamento
  function getStatusVariant(status: string): "pending" | "confirmed" | "canceled" {
    switch (status) {
      case "CONFIRMED": return "confirmed";
      case "CANCELED":  return "canceled";
      default:          return "pending";
    }
  }

  // Retorna o rótulo traduzido do status
  function getStatusLabel(status: string) {
    switch (status) {
      case "CONFIRMED": return "Confirmado";
      case "CANCELED":  return "Cancelado";
      default:          return "Pendente";
    }
  }

  // Retorna ícone SVG conforme o status
  function getStatusIcon(status: string) {
    if (status === "CONFIRMED")
      return (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      );
    if (status === "CANCELED")
      return (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      );
    return (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    );
  }

  // Formata data para exibição legível
  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }) +
      " às " +
      date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    );
  }

  // Aplica os filtros do Zustand sobre os dados do React Query
  const filteredAppointments = appointments.filter((a) => {
    const term = search.toLowerCase();
    const matchesSearch =
      a.clientName.toLowerCase().includes(term) ||
      a.service.toLowerCase().includes(term) ||
      a.clientPhone.includes(term);
    const matchesStatus = statusFilter === "ALL" || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Contadores de cada status para os chips de filtro
  const counts = {
    ALL:       appointments.length,
    PENDING:   appointments.filter((a) => a.status === "PENDING").length,
    CONFIRMED: appointments.filter((a) => a.status === "CONFIRMED").length,
    CANCELED:  appointments.filter((a) => a.status === "CANCELED").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">

      {/* Toast de notificação */}
      {toast.show && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border px-5 py-4 shadow-lg animate-fade-in-up ${
            toast.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-rose-200 bg-rose-50 text-rose-700"
          }`}
        >
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      <div className="mx-auto max-w-6xl p-6 lg:p-8">

        {/* Cabeçalho com botão de voltar e campo de pesquisa */}
        <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between animate-fade-in-up">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="outline" size="icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </Button>
            </Link>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-pink-600">Administração</p>
              <h1 className="text-2xl font-bold text-gray-900">Agendamentos</h1>
            </div>
          </div>

          {/* Campo de pesquisa — componente Input do ShadCN */}
          <div className="relative">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <Input
              type="search"
              placeholder="Buscar cliente ou serviço..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 sm:w-72"
            />
          </div>
        </div>

        {/* Chips de filtro por status — estado gerenciado pelo Zustand */}
        <div className="mb-6 flex flex-wrap gap-2 animate-fade-in-up" style={{ animationDelay: "0.05s" }}>
          {(["ALL", "PENDING", "CONFIRMED", "CANCELED"] as const).map((status) => {
            const labels: Record<string, string> = {
              ALL: "Todos", PENDING: "Pendentes", CONFIRMED: "Confirmados", CANCELED: "Cancelados",
            };
            const activeClass: Record<string, string> = {
              ALL:       "bg-pink-600 text-white border-pink-600",
              PENDING:   "bg-amber-500 text-white border-amber-500",
              CONFIRMED: "bg-emerald-600 text-white border-emerald-600",
              CANCELED:  "bg-rose-500 text-white border-rose-500",
            };
            const inactiveClass = "border-gray-200 bg-white text-gray-600 hover:border-pink-200 hover:text-pink-600";

            return (
              <button
                key={status}
                // Atualiza o filtro no store Zustand ao clicar
                onClick={() => setStatusFilter(status)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-semibold shadow-sm transition ${
                  statusFilter === status ? activeClass[status] : inactiveClass
                }`}
              >
                {labels[status]}
                <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                  statusFilter === status ? "bg-white/25 text-white" : "bg-gray-100 text-gray-600"
                }`}>
                  {counts[status]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Estado de carregamento do React Query */}
        {isLoading && (
          <div className="flex items-center justify-center gap-3 rounded-2xl border border-pink-100 bg-white p-12 shadow-sm">
            <svg className="animate-spin text-pink-500" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            <span className="text-sm text-gray-500">Carregando agendamentos...</span>
          </div>
        )}

        {/* Estado de erro do React Query */}
        {isError && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-sm text-rose-700">
            Erro ao carregar agendamentos. Verifique sua conexão e tente novamente.
          </div>
        )}

        {/* Lista de agendamentos filtrados */}
        {!isLoading && !isError && (
          <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>

            {filteredAppointments.length === 0 ? (
              // Estado vazio
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-pink-200 bg-white p-12 text-center shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-100 text-pink-400">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <p className="font-medium text-gray-900">Nenhum agendamento encontrado</p>
                <p className="text-sm text-gray-500">Tente ajustar os filtros ou o termo de pesquisa.</p>
              </div>
            ) : (
              // Renderiza cada card de agendamento
              filteredAppointments.map((appointment) => (
                <div
                  key={appointment._id}
                  className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

                    {/* Dados do cliente */}
                    <div className="flex gap-4">
                      {/* Avatar com inicial do nome */}
                      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-pink-100 text-base font-bold text-pink-700">
                        {appointment.clientName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h2 className="text-base font-semibold text-gray-900">{appointment.clientName}</h2>
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                          <span className="flex items-center gap-1.5">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5 19.79 19.79 0 0 1 1.61 4.9 2 2 0 0 1 3.6 2.68h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l.81-.81a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.73 17z" />
                            </svg>
                            {appointment.clientPhone}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                            </svg>
                            {formatDate(appointment.appointmentDate)}
                          </span>
                          <span className="flex items-center gap-1.5 font-medium text-gray-700">
                            {appointment.service}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Badge de status — componente ShadCN com variante semântica */}
                    <Badge variant={getStatusVariant(appointment.status)}>
                      {getStatusIcon(appointment.status)}
                      {getStatusLabel(appointment.status)}
                    </Badge>
                  </div>

                  {/* Botões de ação — componente Button do ShadCN */}
                  <div className="mt-4 flex items-center gap-2 border-t border-pink-50 pt-4">
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() =>
                        statusMutation.mutate({ id: appointment._id, status: "CONFIRMED" })
                      }
                      disabled={
                        statusMutation.isPending || appointment.status === "CONFIRMED"
                      }
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Confirmar
                    </Button>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        statusMutation.mutate({ id: appointment._id, status: "CANCELED" })
                      }
                      disabled={
                        statusMutation.isPending || appointment.status === "CANCELED"
                      }
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                      Cancelar
                    </Button>

                    {/* Spinner de carregamento durante a mutation */}
                    {statusMutation.isPending && (
                      <svg className="animate-spin text-pink-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
