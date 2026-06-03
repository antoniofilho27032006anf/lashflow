// Store Zustand para gerenciamento do estado de UI dos agendamentos
// Centraliza filtros e pesquisa — evita prop drilling e useState espalhados
import { create } from "zustand";

// Tipagem do estado e das ações do store
interface AppointmentStoreState {
  // Termo de pesquisa por cliente ou serviço
  search: string;
  // Filtro de status: ALL | PENDING | CONFIRMED | CANCELED
  statusFilter: string;

  // Ações para atualizar o estado
  setSearch: (search: string) => void;
  setStatusFilter: (status: string) => void;

  // Reinicia os filtros para o estado padrão
  resetFilters: () => void;
}

// Cria o store com estado inicial e ações
export const useAppointmentStore = create<AppointmentStoreState>((set) => ({
  // Estado inicial: sem filtros aplicados
  search: "",
  statusFilter: "ALL",

  // Atualiza o termo de pesquisa
  setSearch: (search) => set({ search }),

  // Atualiza o filtro de status
  setStatusFilter: (statusFilter) => set({ statusFilter }),

  // Reseta os dois filtros simultaneamente
  resetFilters: () => set({ search: "", statusFilter: "ALL" }),
}));
