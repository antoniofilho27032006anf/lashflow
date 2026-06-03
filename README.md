# LashFlow 💅

Sistema web premium para gerenciamento de agendamentos de extensão de cílios, desenvolvido com Next.js, MongoDB Atlas e NextAuth.

**Disciplina:** Desenvolvimento Web 2
**Autores:** Antonio Angelo e Guilherme Paulino

---

## 🎯 Objetivo

O LashFlow facilita o gerenciamento de atendimentos de extensão de cílios. Clientes realizam agendamentos online e administradores gerenciam serviços, acompanham atendimentos e atualizam status — tudo em uma interface premium e responsiva.

---

## ✨ Funcionalidades

### Área do Cliente
- ✅ Cadastro e login com JWT
- ✅ Agendamento de atendimentos online
- ✅ Dashboard do cliente com status dos agendamentos (Pendente / Confirmado / Cancelado)
- ✅ Atualização de status em tempo real (botão "Atualizar status")

### Área Administrativa
- ✅ Dashboard com métricas e gráfico de atividade semanal
- ✅ CRUD completo de serviços (criar, listar, editar, excluir)
- ✅ Listagem, confirmação e cancelamento de agendamentos
- ✅ Filtros por status e pesquisa por cliente/serviço
- ✅ Controle de acesso por perfil (ADMIN / CLIENT)
- ✅ Logout do sistema

---

## 🛠️ Tecnologias

### Frontend
| Tecnologia | Uso |
|---|---|
| Next.js 16 (App Router) | Framework principal |
| TypeScript | Tipagem estática |
| Tailwind CSS v4 | Estilização |
| ShadCN/UI | Componentes (Badge, Button, Input) |
| TanStack React Query | Gerenciamento de dados assíncronos |
| Zustand | Gerenciamento de estado de UI |

### Backend
| Tecnologia | Uso |
|---|---|
| Next.js Route Handlers | API REST |
| NextAuth.js | Autenticação com JWT |
| MongoDB Atlas | Banco de dados |
| Mongoose | ODM e Singleton de conexão |
| Bcrypt | Hash de senhas |
| Zod | Validação de dados |

---

## 📦 Pré-requisitos

- Node.js 18 ou superior
- Conta no [MongoDB Atlas](https://cloud.mongodb.com)

---

## 🚀 Como rodar localmente

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/lashflow.git
cd lashflow
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/lashflow
NEXTAUTH_SECRET=uma_string_secreta_qualquer
NEXTAUTH_URL=http://localhost:3000
```

### 4. Rode o projeto

```bash
npm run dev
```

Acesse: **http://localhost:3000**

---

## 👤 Usuário Administrador padrão

> Criado via rota `/api/seed-admin` ou manualmente no MongoDB Atlas

```
Email: admin@lashflow.com
Senha: (definida no seed)
```

---

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── admin/
│   │   ├── appointments/   # Gerenciar agendamentos (React Query + Zustand)
│   │   ├── services/       # Gerenciar serviços (React Query)
│   │   └── layout.tsx      # Proteção de rota admin (getServerSession)
│   ├── api/
│   │   ├── auth/           # NextAuth + registro
│   │   ├── appointments/   # CRUD de agendamentos
│   │   └── services/       # CRUD de serviços
│   ├── auth/signin/        # Página de login
│   ├── booking/            # Agendamento público (React Query)
│   ├── dashboard/          # Dashboard admin + cliente
│   ├── register/           # Cadastro de usuários
│   ├── layout.tsx          # Layout raiz com QueryProvider
│   ├── loading.tsx         # Tela de carregamento global
│   └── error.tsx           # Tela de erro global
│
├── components/
│   ├── ui/                 # Componentes ShadCN/UI
│   │   ├── badge.tsx       # Badge com variantes de status
│   │   ├── button.tsx      # Button com variantes
│   │   └── input.tsx       # Input padronizado
│   ├── Navbar.tsx
│   ├── LogoutButton.tsx
│   └── RefreshButton.tsx
│
├── lib/
│   ├── mongodb.ts          # Singleton de conexão MongoDB
│   └── utils.ts            # Helper cn() do ShadCN
│
├── models/
│   ├── User.ts
│   ├── Service.ts
│   └── Appointment.ts
│
├── providers/
│   └── QueryProvider.tsx   # Provider do TanStack React Query
│
├── store/
│   └── useAppointmentStore.ts  # Store Zustand para filtros de UI
│
└── types/
    ├── user.ts
    ├── service.ts
    ├── appointment.ts
    └── next-auth.d.ts
```

---

## 🔐 Variáveis de Ambiente

| Variável | Descrição |
|---|---|
| `MONGODB_URI` | String de conexão do MongoDB Atlas |
| `NEXTAUTH_SECRET` | Chave secreta para assinar os tokens JWT |
| `NEXTAUTH_URL` | URL base da aplicação (ex: `https://lashflow.vercel.app`) |

---

## 🏗️ Arquitetura

- **Server Components** para páginas que precisam de dados do servidor (dashboard, layouts de proteção)
- **Client Components** (`"use client"`) apenas onde há interatividade
- **React Query** substitui `useEffect + fetch` nas páginas cliente, com cache inteligente e revalidação automática
- **Zustand** gerencia estado de UI (filtros, pesquisa) fora dos componentes
- **Padrão Singleton** na conexão MongoDB evita estouro de conexões no ambiente serverless

---

## 🎓 Projeto Acadêmico

Desenvolvido para a disciplina de Desenvolvimento Web 2, demonstrando conceitos de desenvolvimento fullstack moderno com Next.js, autenticação JWT, persistência em nuvem e boas práticas de arquitetura.
