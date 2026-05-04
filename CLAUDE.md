# CLAUDE.md — Shisa Web

## Project Overview

Frontend for the Shisa prediction market platform. Two independently deployable Next.js apps:
- **Main App** (`/apps/main`) — Market browser, trading UI, portfolio, deposits/withdrawals, referrals
- **Admin App** (`/apps/admin`) — Market creation, resolution, user management, analytics

## Tech Stack

- Next.js 14+ (App Router), React 18, TypeScript (strict mode)
- TailwindCSS (dark mode first, `class` strategy)
- wagmi v2 + viem (wallet connection — MetaMask, WalletConnect, Coinbase Wallet)
- lightweight-charts by TradingView (open source charting)
- WebSocket client for real-time updates
- pnpm + Turbo (monorepo)

## Essential Commands

```bash
pnpm install          # Install all dependencies
pnpm dev              # Start both apps in dev mode
pnpm dev:main         # Start main app only (port 3000)
pnpm dev:admin        # Start admin app only (port 3001)
pnpm build            # Build all apps
pnpm lint             # ESLint
pnpm type-check       # TypeScript checking
pnpm test             # Run tests
pnpm format           # Prettier
```

## Project Structure (FSD)

Each app uses [Feature-Sliced Design](https://feature-sliced.design/) with 6 layers inside `src/`:

```
apps/{main,admin}/
  src/
  ├── app/           # Next.js App Router — routing only (thin page.tsx/layout.tsx)
  ├── pages/         # FSD: page-level composition (assembles widgets/features)
  ├── widgets/       # FSD: self-contained UI blocks (Sidebar, DataTable, Header)
  ├── features/      # FSD: user scenarios (CreateMarket, PlaceOrder, ResolveMarket)
  ├── entities/      # FSD: business entities (Market, User, Category, Order)
  └── shared/        # FSD: shared utilities, UI kit, api client, config
      ├── ui/
      ├── lib/
      ├── api/
      └── config/
packages/
  └── shared/        # Cross-app shared types, utils, API client (@shisa/shared)
      └── src/
          ├── types/
          ├── utils/
          └── api/
```

## FSD Rules

### Layers (top → bottom)
`app` → `pages` → `widgets` → `features` → `entities` → `shared`

### Import rules
- Imports go **only downward**: a layer can import from lower layers, never from higher ones
- `feature` **cannot** import from `widget` or `page`
- Cross-import between slices of the **same layer is forbidden**
- Exception: `entities` can reference other entities' types (not UI) via `@x` cross-imports when needed

### Slice structure
Each slice is a folder with `index.ts` (public API). Internal segments:
- `ui/` — React components
- `model/` — state, stores, hooks
- `api/` — data fetching
- `lib/` — utils, helpers
- `config/` — constants, config

Not every segment is required — create only what the slice needs.

### `src/app/` vs `src/pages/`
- `src/app/` — Next.js App Router files only: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`. These are thin wrappers that import from `src/pages/`.
- `src/pages/` — FSD composition layer. Each page assembles widgets and features into a full page UI.

## Key Conventions

### TypeScript
- Strict mode, no `any` (use `unknown` and narrow)
- Prefer `interface` for object shapes, `type` for unions/intersections
- PascalCase for types: `Market`, `Order`, `UserPosition`
- Co-locate types with their FSD slice

### Components
- Server Components by default, `'use client'` only when needed
- PascalCase files: `OrderBook.tsx`, `MarketCard.tsx`
- One component per file, named export matching filename
- Props: `{Component}Props`
- Place components in the `ui/` segment of their FSD slice

### Styling
- TailwindCSS only — no CSS modules, no styled-components
- Dark mode first
- `cn()` utility for conditional classes (clsx + tailwind-merge)
- Mobile-first responsive breakpoints

### State Management
- Server state: TanStack Query (React Query) for REST API data
- WebSocket state: custom hooks with React context
- Local UI state: useState/useReducer
- No global state library for MVP

### API Integration
- Shared API client in `packages/shared`
- Type-safe with Zod validation on responses
- Mutations through React Query
- WebSocket singleton client

### Wallet Integration
- wagmi v2 for wallet connection and signing
- EIP-712 typed data signing for orders (viem)
- Gnosis Safe detection + proxy wallet derivation
- Magic Link for email users (deferred)

### Testing
- Vitest for unit tests
- React Testing Library for components
- Playwright for E2E (deferred, structure ready)
- Co-located: `Component.test.tsx` next to `Component.tsx`

## Main App Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage: featured, trending, categories |
| `/markets` | Browse with search/filter/sort |
| `/market/[slug]` | Chart, order book, trading widget |
| `/event/[slug]` | Multi-outcome event with all outcomes |
| `/portfolio` | Positions, orders, history, P&L |
| `/deposit` | Proxy wallet address + QR code |
| `/withdraw` | Withdrawal flow (2FA required) |
| `/settings` | Display currency, 2FA, API keys |
| `/referral` | Affiliate dashboard |

## Admin App Pages

| Route | Description |
|-------|-------------|
| `/markets` | Create/edit/pause markets |
| `/resolution` | Trigger/review resolution |
| `/categories` | Manage categories |
| `/users` | View users, balances, positions |
| `/config` | Fees, affiliate %, settings |
| `/analytics` | Volume, users, revenue |

## Display Currency

- Trading in USDC, display converted to user's currency (default ZAR)
- Exchange rates from CoinGecko, refresh every 30-60s
- Stored in localStorage, applied via context

## Real-Time (WebSocket)

Public channels (no auth): `book:{market_id}`, `trades:{market_id}`, `prices:{market_id}`, `event:{event_id}`, `market:{market_id}`

Private channels (auth required): `user:{address}` — fills, cancellations, balance changes

Client-side P&L: backend serves positions (size, entry price), frontend calculates from WebSocket prices.

## Key Design Decisions

1. **No cross-repo dependencies** — API contracts via REST spec, ABIs copied from contracts repo
2. **Dark mode first** — light mode deferred
3. **Client-side P&L** — no backend work for real-time updates
4. **Polymarket API compatible** — their order-utils SDK used for signing

## Git Conventions

- Branch format: `{issue#}-{short-description}`
- PRs required, main is protected
- **No `Co-Authored-By: Claude` in commits**
- **Never commit** `.env`, `node_modules/`, `.next/`

## Backend API

- Trading Service (`:8080`) — orders, book, auth, WebSocket
- Platform Service (`:8081`) — markets, user data, admin, affiliate
- REST only from frontend (no gRPC)
