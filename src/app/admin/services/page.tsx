"use client";

// Página de gerenciamento de serviços — usa React Query e componentes ShadCN
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Link from "next/link";

// Componentes ShadCN/UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Tipagem do serviço
type Service = {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
};

// ── Funções de requisição à API ──────────────────────────────

// Busca todos os serviços cadastrados
async function fetchServices(): Promise<Service[]> {
  const res = await fetch("/api/services");
  const data = await res.json();
  if (!data.success) throw new Error("Erro ao buscar serviços");
  return data.services;
}

// Cria um novo serviço
async function createService(service: Omit<Service, "_id">) {
  const res = await fetch("/api/services", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(service),
  });
  if (!res.ok) throw new Error("Erro ao criar serviço");
  return res.json();
}

// Atualiza o nome de um serviço existente
async function updateService(id: string, name: string) {
  const res = await fetch(`/api/services/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error("Erro ao atualizar serviço");
  return res.json();
}

// Remove um serviço pelo ID
async function deleteService(id: string) {
  const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Erro ao excluir serviço");
  return res.json();
}

// ── Componente principal ──────────────────────────────────────

export default function ServicesPage() {
  // Cliente do React Query para invalidar cache manualmente após mutations
  const queryClient = useQueryClient();

  // Estado do formulário de criação
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");

  // Estado local de pesquisa
  const [search, setSearch] = useState("");

  // Estado do toast de notificação
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  // Exibe notificação temporária
  function showToast(message: string, type: "success" | "error") {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3500);
  }

  // Busca os serviços com React Query — dados ficam em cache e revalidam ao invalidar
  const {
    data: services = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["services"],
    queryFn: fetchServices,
  });

  // Mutation para criar serviço — invalida o cache após sucesso
  const createMutation = useMutation({
    mutationFn: createService,
    onSuccess: () => {
      // Invalida a lista de serviços para rebuscar do servidor
      queryClient.invalidateQueries({ queryKey: ["services"] });
      // Limpa os campos do formulário
      setName("");
      setDescription("");
      setPrice("");
      setDuration("");
      showToast("Serviço criado com sucesso!", "success");
    },
    onError: () => showToast("Erro ao criar serviço.", "error"),
  });

  // Mutation para atualizar serviço — invalida o cache após sucesso
  const updateMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      updateService(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      showToast("Serviço atualizado!", "success");
    },
    onError: () => showToast("Erro ao atualizar serviço.", "error"),
  });

  // Mutation para excluir serviço — invalida o cache após sucesso
  const deleteMutation = useMutation({
    mutationFn: deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      showToast("Serviço excluído.", "success");
    },
    onError: () => showToast("Erro ao excluir serviço.", "error"),
  });

  // Valida e dispara a mutation de criação
  function handleCreate() {
    if (!name || !price || !duration) {
      showToast("Preencha nome, preço e duração.", "error");
      return;
    }
    createMutation.mutate({
      name,
      description,
      price: Number(price),
      duration: Number(duration),
    });
  }

  // Abre prompt e dispara a mutation de atualização
  function handleUpdate(id: string, currentName: string) {
    const newName = window.prompt("Novo nome do serviço:", currentName);
    if (!newName) return;
    updateMutation.mutate({ id, name: newName });
  }

  // Confirma e dispara a mutation de exclusão
  function handleDelete(id: string) {
    if (!window.confirm("Deseja realmente excluir este serviço?")) return;
    deleteMutation.mutate(id);
  }

  // Aplica filtro de pesquisa sobre os dados do React Query
  const filteredServices = services.filter((s) => {
    const term = search.toLowerCase();
    return (
      s.name.toLowerCase().includes(term) ||
      s.description.toLowerCase().includes(term)
    );
  });

  // Verifica se alguma mutation está em andamento para desabilitar ações
  const isMutating =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

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

        {/* Cabeçalho */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between animate-fade-in-up">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              {/* Botão de voltar usando componente Button do ShadCN */}
              <Button variant="outline" size="icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </Button>
            </Link>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-pink-600">Administração</p>
              <h1 className="text-2xl font-bold text-gray-900">Serviços</h1>
            </div>
          </div>

          {/* Campo de pesquisa usando componente Input do ShadCN */}
          <div className="relative">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <Input
              type="search"
              placeholder="Pesquisar serviços..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 sm:w-64"
            />
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[380px_1fr]">

          {/* Formulário de criação com componentes ShadCN */}
          <div className="animate-fade-in-up" style={{ animationDelay: "0.05s" }}>
            <div className="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm">
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-gray-900">Novo serviço</h2>
                <p className="mt-0.5 text-sm text-gray-500">Preencha os dados para cadastrar.</p>
              </div>

              <div className="space-y-4">
                {/* Campo nome */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Nome do serviço</label>
                  <Input
                    type="text"
                    placeholder="Ex: Alongamento clássico"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                {/* Campo descrição */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Descrição</label>
                  <textarea
                    placeholder="Descreva brevemente o serviço..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    className="w-full resize-none rounded-2xl border border-pink-200 bg-pink-50/40 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition focus:border-pink-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-200"
                  />
                </div>

                {/* Preço e duração lado a lado */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Preço (R$)</label>
                    <Input
                      type="number"
                      placeholder="0,00"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Duração (min)</label>
                    <Input
                      type="number"
                      placeholder="60"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      min="0"
                    />
                  </div>
                </div>

                {/* Botão de criação — componente Button do ShadCN */}
                <Button
                  onClick={handleCreate}
                  disabled={createMutation.isPending}
                  className="w-full"
                >
                  {createMutation.isPending ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                      Criando...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      Criar serviço
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Lista de serviços */}
          <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>

            {/* Estado de carregamento do React Query */}
            {isLoading && (
              <div className="flex items-center justify-center gap-3 rounded-2xl border border-pink-100 bg-white p-12 shadow-sm">
                <svg className="animate-spin text-pink-500" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                <span className="text-sm text-gray-500">Carregando serviços...</span>
              </div>
            )}

            {/* Estado de erro do React Query */}
            {isError && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-sm text-rose-700">
                Erro ao carregar serviços. Verifique sua conexão.
              </div>
            )}

            {/* Contador de resultados */}
            {!isLoading && !isError && (
              <p className="px-1 text-sm text-gray-500">
                {filteredServices.length} serviço{filteredServices.length !== 1 ? "s" : ""} encontrado{filteredServices.length !== 1 ? "s" : ""}
              </p>
            )}

            {/* Cards de cada serviço */}
            {!isLoading && !isError && filteredServices.length === 0 && (
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-pink-200 bg-white p-12 text-center shadow-sm">
                <p className="font-medium text-gray-900">Nenhum serviço encontrado</p>
                <p className="text-sm text-gray-500">Cadastre um novo serviço no formulário ao lado.</p>
              </div>
            )}

            {!isLoading && !isError &&
              filteredServices.map((service) => (
                <div
                  key={service._id}
                  className="group rounded-2xl border border-pink-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-semibold text-gray-900">{service.name}</h3>
                        {/* Badge de duração */}
                        <span className="inline-flex items-center gap-1 rounded-full bg-pink-50 px-2.5 py-0.5 text-xs font-medium text-pink-600">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                          </svg>
                          {service.duration} min
                        </span>
                      </div>
                      {service.description && (
                        <p className="mt-1.5 text-sm text-gray-500">{service.description}</p>
                      )}
                    </div>

                    {/* Preço em destaque */}
                    <p className="flex-shrink-0 text-2xl font-bold text-pink-700">
                      R$ {service.price.toFixed(2).replace(".", ",")}
                    </p>
                  </div>

                  {/* Ações — botões ShadCN */}
                  <div className="mt-4 flex items-center gap-2 border-t border-pink-50 pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdate(service._id, service.name)}
                      disabled={isMutating}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                      Editar nome
                    </Button>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(service._id)}
                      disabled={isMutating}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                      </svg>
                      Excluir
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
