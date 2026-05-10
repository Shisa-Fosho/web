# CLAUDE.md — Admin App

Admin-specific rules. Shared conventions are in `/CLAUDE.md`.

## Admin Stack

- **UI components**: shadcn/ui (install as needed)
- **Tables**: TanStack Table v8
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **Notifications**: Sonner (toast)

## Pages

| Route | Purpose | Key features |
|-------|---------|--------------|
| `/` | Dashboard | Summary: volumes, active markets, users |
| `/markets` | Market management | CRUD, pause/resume, search/filters |
| `/resolution` | Market resolution | Trigger, review, confirmation |
| `/categories` | Categories | CRUD, drag-n-drop sorting |
| `/users` | Users | View, balances, positions, ban |
| `/config` | Platform settings | Fees, referral %, limits |
| `/analytics` | Analytics | Volume, users, revenue charts |

## UI Patterns

### Layout
- Sidebar navigation — always visible, collapses to icons
- Top bar: breadcrumbs, search, admin profile
- Content area centered with `max-w-7xl`

### Tables
- Server-side pagination and sorting
- Search with 300ms debounce
- Filters via dropdown/popover
- Bulk actions via checkboxes

### Forms
- Validation via Zod schemas (shared with backend where possible)
- Inline errors below fields
- Submit button with loading state
- Dangerous actions require confirmation dialog

### Modals/Dialogs
- shadcn Dialog for create/edit forms
- AlertDialog for delete/resolution confirmations

## Authorization

- JWT from cookie (httpOnly)
- Roles: `super_admin`, `admin`, `moderator`
- Middleware checks role at route group level
- Insufficient permissions → redirect to `/`

## API

- All requests go to Platform Service (`:8081`)
- Prefix: `/api/admin/...`
- React Query for caching and mutations
- Optimistic updates for statuses (market pause, user ban)

## Naming

- FSD pages: `MarketsPage`, `UsersPage`, `ResolutionPage`
- Widgets: `Sidebar`, `MarketsTable`, `UserDetailsCard`
- Features: `CreateMarket`, `ResolveMarket`, `ManageCategories`
- Entities: `Market`, `User`, `Category`, `Resolution`
