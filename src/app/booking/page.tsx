"use client";

// Página pública de agendamento — usa React Query para buscar serviços e ShadCN para formulário
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// Componentes ShadCN/UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Tipagem do serviço exibido no select
type Service = {
  _id: string;
  name: string;
};

// Tipagem do alerta de feedback
type AlertType = {
  type: "success" | "error" | "";
  message: string;
};

// ── Funções de requisição à API ──────────────────────────────

// Busca os serviços disponíveis para exibir no select
async function fetchServices(): Promise<Service[]> {
  const res = await fetch("/api/services");
  const data = await res.json();
  if (!data.success) throw new Error("Erro ao buscar serviços");
  return data.services;
}

// Cria um novo agendamento com os dados do formulário
async function createAppointment(payload: {
  clientName: string;
  clientPhone: string;
  service: string;
  appointmentDate: string;
}) {
  const res = await fetch("/api/appointments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Erro ao criar agendamento");
  return res.json();
}

// ── Componente principal ──────────────────────────────────────

export default function BookingPage() {
  // Estado dos campos do formulário
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [service, setService] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");

  // Alerta de sucesso ou erro exibido ao usuário
  const [alert, setAlert] = useState<AlertType>({ type: "", message: "" });

  // Exibe um alerta temporário e oculta após 6 segundos
  function showAlert(type: AlertType["type"], message: string) {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: "", message: "" }), 6000);
  }

  // Busca os serviços com React Query — dados em cache por 60 segundos
  const { data: services = [], isLoading: loadingServices } = useQuery({
    queryKey: ["services"],
    queryFn: fetchServices,
  });

  // Mutation para criar o agendamento — limpa o formulário e exibe feedback
  const bookingMutation = useMutation({
    mutationFn: createAppointment,

    onSuccess: () => {
      // Limpa todos os campos após agendamento bem-sucedido
      showAlert("success", "Agendamento realizado com sucesso! Aguarde a confirmação da equipe.");
      setClientName("");
      setClientPhone("");
      setService("");
      setAppointmentDate("");
    },

    onError: () => {
      showAlert("error", "Erro ao criar agendamento. Tente novamente.");
    },
  });

  // Valida e dispara a mutation de criação do agendamento
  function handleSubmit() {
    if (!clientName || !clientPhone || !service || !appointmentDate) {
      showAlert("error", "Por favor, preencha todos os campos antes de agendar.");
      return;
    }
    bookingMutation.mutate({ clientName, clientPhone, service, appointmentDate });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">

      {/* Cabeçalho minimalista com logo */}
      <header className="border-b border-pink-100 bg-white/80 backdrop-blur-sm px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo-icon.png" alt="LashFlow" width={32} height={32} className="rounded-lg" />
            <span className="font-bold text-gray-900">Lash<span className="text-pink-600">Flow</span></span>
          </Link>
          <Link href="/auth/signin" className="text-sm font-medium text-gray-500 transition hover:text-pink-600">
            Já tenho conta
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:items-start">

          {/* Formulário de agendamento */}
          <div className="animate-fade-in-up">
            <div className="rounded-3xl border border-pink-100 bg-white p-8 shadow-[0_20px_60px_rgba(201,73,122,0.10)]">

              {/* Cabeçalho do card */}
              <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-100 text-pink-600">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-pink-600">Agendamento</p>
                <h1 className="mt-2 text-3xl font-bold text-gray-900">Reserve seu horário</h1>
                <p className="mt-2 text-gray-500">Escolha um serviço e cadastre seu atendimento com conforto.</p>
              </div>

              {/* Alerta de feedback — sucesso ou erro */}
              {alert.message && (
                <div
                  className={`mb-6 flex items-start gap-3 rounded-2xl border px-4 py-4 text-sm animate-fade-in-up ${
                    alert.type === "success"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-rose-200 bg-rose-50 text-rose-700"
                  }`}
                >
                  {alert.type === "success" ? (
                    <svg className="mt-0.5 flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <svg className="mt-0.5 flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  )}
                  <span>{alert.message}</span>
                </div>
              )}

              <div className="space-y-5">

                {/* Campo: Nome completo — Input ShadCN */}
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                    </svg>
                    Nome completo
                  </label>
                  <Input
                    type="text"
                    placeholder="Seu nome"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                  />
                </div>

                {/* Campo: Telefone — Input ShadCN */}
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5 19.79 19.79 0 0 1 1.61 4.9 2 2 0 0 1 3.6 2.68h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l.81-.81a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.73 17z" />
                    </svg>
                    Telefone / WhatsApp
                  </label>
                  <Input
                    type="text"
                    placeholder="(11) 99999-9999"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                  />
                </div>

                {/* Campo: Serviço — dados do React Query */}
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="3" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 19.07a10 10 0 0 1 0-14.14" />
                    </svg>
                    Serviço desejado
                  </label>
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full rounded-2xl border border-pink-200 bg-pink-50/50 px-4 py-3 text-sm text-gray-900 transition focus:border-pink-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-200"
                    disabled={loadingServices}
                  >
                    <option value="">
                      {loadingServices ? "Carregando serviços..." : "Selecione um serviço"}
                    </option>
                    {/* Opções vindas do React Query */}
                    {services.map((serviceItem) => (
                      <option key={serviceItem._id} value={serviceItem.name}>
                        {serviceItem.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Campo: Data e hora — Input ShadCN */}
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                    </svg>
                    Data e horário
                  </label>
                  <Input
                    type="datetime-local"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                  />
                </div>

                {/* Botão de envio — Button ShadCN com estado de loading da mutation */}
                <Button
                  onClick={handleSubmit}
                  disabled={bookingMutation.isPending}
                  size="lg"
                  className="w-full"
                >
                  {bookingMutation.isPending ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                      Enviando agendamento...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      Agendar Atendimento
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Painel lateral com informações */}
          <aside className="space-y-5 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>

            {/* Card de boas-vindas */}
            <div className="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-100 text-pink-600">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </div>
                <h2 className="font-semibold text-gray-900">Bem-vinda ao LashFlow</h2>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Agende seu atendimento de extensão de cílios com praticidade e receba confirmação da equipe.
              </p>
            </div>

            {/* Card de dica */}
            <div className="rounded-2xl border border-pink-100 bg-gradient-to-b from-pink-50 to-white p-6 shadow-sm">
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-900">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-500">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                Dica de atendimento
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Confirme seus dados e o serviço escolhido antes de enviar. O status do agendamento aparece no seu dashboard.
              </p>
            </div>

            {/* Etapas do processo */}
            <div className="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-semibold text-gray-900">Como funciona?</h3>
              <ol className="space-y-3">
                {[
                  "Preencha seus dados e escolha o serviço",
                  "Selecione a data e horário desejados",
                  "Aguarde a confirmação da equipe",
                  "Compareça no horário agendado",
                ].map((step, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-pink-600 text-xs font-bold text-white">
                      {index + 1}
                    </span>
                    <span className="text-sm text-gray-600">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
