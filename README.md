# La Forno — Sistema de Gestão de Pizzaria

Sistema web para gerenciamento de cardápio da La Forno Pizzaria Artesanal. Inclui um catálogo público de pizzas e um painel administrativo com CRUD completo, autenticação por e-mail e senha.

## Tecnologias

- **Next.js 15** (App Router) com TypeScript
- **Tailwind CSS v4** + **shadcn/ui** para interface
- **Prisma** como ORM
- **PostgreSQL** via Docker
- **NextAuth.js v5** para autenticação (JWT + Credentials)
- **Server Actions** para todas as mutações (sem API REST separado)
- **react-hook-form** + **zod** para formulários e validação

## Pré-requisitos

- Node.js 20+
- Docker e Docker Compose

## Como rodar

### 1. Suba o banco de dados

```bash
docker compose up -d
```

Isso inicia um container PostgreSQL na porta `5432` com as credenciais definidas no `docker-compose.yml`.

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

O arquivo `.env` já vem pré-configurado para desenvolvimento local:

```env
DATABASE_URL="postgresql://pizzaria:pizzaria@localhost:5432/pizzaria"
AUTH_SECRET="super-secret-pizzaria-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Execute as migrations e popule o banco

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

O seed cria:
- Usuário admin: `admin@laforno.com` / `admin123`
- 8 pizzas de exemplo distribuídas pelas categorias

### 5. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

Acesse em [http://localhost:3000](http://localhost:3000).

---

## Estrutura do projeto

```
pizzaria/
├── docker-compose.yml       # PostgreSQL
├── prisma/
│   ├── schema.prisma        # Modelos User e Pizza
│   └── seed.ts              # Dados iniciais
└── src/
    ├── middleware.ts         # Proteção das rotas /admin/*
    ├── app/
    │   ├── layout.tsx        # Layout raiz (fonte Geist, Toaster)
    │   ├── page.tsx          # Catálogo público (Server Component)
    │   ├── login/
    │   │   └── page.tsx      # Página de login
    │   ├── admin/
    │   │   ├── layout.tsx    # Layout do painel admin (navbar)
    │   │   └── pizzas/
    │   │       └── page.tsx  # CRUD de pizzas (Server Component)
    │   └── api/auth/
    │       └── [...nextauth]/route.ts
    ├── actions/
    │   ├── auth.ts           # loginAction
    │   └── pizzas.ts         # createPizzaAction, updatePizzaAction, deletePizzaAction
    ├── components/
    │   ├── ui/               # Componentes shadcn (Button, Input, Dialog, etc.)
    │   ├── catalog/
    │   │   └── CatalogClient.tsx   # Grid de pizzas + filtros + modal de detalhe
    │   ├── auth/
    │   │   └── LoginForm.tsx        # Formulário de login
    │   └── admin/
    │       ├── AdminNav.tsx          # Header do painel com botão de logout
    │       ├── PizzasTable.tsx       # Tabela de pizzas com ações de editar/excluir
    │       └── PizzaFormDialog.tsx   # Dialog compartilhado de criação e edição
    └── lib/
        ├── auth.ts           # Configuração do NextAuth (Credentials provider + bcrypt)
        ├── db.ts             # Singleton do Prisma Client
        └── utils.ts          # cn() e formatPrice()
```

## Rotas

| Rota | Acesso | Descrição |
|---|---|---|
| `/` | Público | Catálogo de pizzas com filtro por categoria e modal de detalhe |
| `/login` | Público | Formulário de autenticação; redireciona para `/admin/pizzas` após login |
| `/admin/pizzas` | Autenticado | Tabela com CRUD completo das pizzas |

## Modelo de dados

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // bcrypt hash
  createdAt DateTime @default(now())
}

model Pizza {
  id          String   @id @default(cuid())
  name        String
  description String
  price       Float
  category    String   // "Tradicionais" | "Especiais" | "Vegetarianas" | "Doces"
  imageUrl    String   // URL externa — sem upload de arquivos
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## Como funciona

### Autenticação

O fluxo usa NextAuth v5 com a estratégia `credentials`. Ao submeter o formulário de login, a Server Action `loginAction` chama `signIn("credentials", ...)`, que valida o e-mail e compara a senha com o hash bcrypt armazenado. A sessão é mantida via JWT (sem banco de sessões). O middleware protege todas as rotas `/admin/*` e redireciona para `/login` se não houver sessão ativa.

### CRUD de pizzas

Todas as operações de escrita passam por Server Actions (`src/actions/pizzas.ts`). Cada action valida os dados com zod antes de tocar o banco, e chama `revalidatePath` tanto em `/admin/pizzas` quanto em `/` para manter o catálogo público sincronizado após qualquer alteração.

### Catálogo público

A página `/` é um Server Component que busca todas as pizzas diretamente via Prisma. O componente `CatalogClient` recebe os dados e gerencia o estado de filtro por categoria e o modal de detalhe no cliente, sem nenhuma requisição adicional.

## Comandos úteis

```bash
# Abrir o Prisma Studio (visualizar/editar dados no browser)
npx prisma studio

# Derrubar o banco
docker compose down

# Derrubar e apagar o volume (reset completo)
docker compose down -v
```
