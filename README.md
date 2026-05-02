# Fitnexx Codebase

Fitnexx is a Next.js app for gym performance and macro tracking (marketing site plus signed-in app shell).

---

## Architecture

### Stack

- **Framework**: Next.js (App Router), React 19, TypeScript (strict).
- **Styling**: Tailwind CSS v4, `tw-animate-css`; composition helpers via `clsx`, `tailwind-merge`, `class-variance-authority`.
- **UI primitives**: Radix-based components under `src/components/ui/` (shadcn-style patterns).
- **Theming**: `next-themes` (configured in root layout).
- **Data**: PostgreSQL via Prisma 7 with the `@prisma/adapter-pg` driver adapter; client generated into `src/generated/prisma/` (see `prisma/schema.prisma`).
- **Tooling**: Biome (lint + format), React Compiler enabled in `next.config.ts`.

### High-level layout

```
src/app/
  layout.tsx              # Root: fonts, ThemeProvider, TooltipProvider, globals
  (homepage)/             # Public marketing/legal routes (shared navbar + footer)
  app/                    # Authenticated-style shell (sidebar, mobile nav)
src/actions/              # Server Actions ("use server")
src/components/
  ui/                     # Low-level primitives (buttons, sidebar, dialogs, …)
  homepage/               # Marketing-only sections
  app/                    # In-app chrome (sidebar, mobile nav)
  shared/                 # Used across surfaces (e.g. forms, mode toggle)
src/hooks/
src/lib/                  # DB singleton, utilities, static/feature content
prisma/                   # Schema & migrations
```

### Routing

- **Route groups** (parentheses) organize URLs without affecting the path: e.g. `(homepage)` wraps public pages with `HomepageNavbar` + `SiteFooter` in `(homepage)/layout.tsx`.
- **`src/app/app/`** is the product UI shell (sidebar layout), distinct from the marketing tree.

### Data access

- Use `getPrisma()` from `src/lib/prisma.ts` inside Server Actions, Route Handlers, or Server Components—never import Prisma into client components.
- Env: `FITNEXX_PRISMA_DATABASE_URL` or `FITNEXX_POSTGRES_URL` must be set at runtime for DB usage.
- After schema changes: migrate/update Prisma and run `bun run build` or `prisma generate` so `src/generated/prisma` stays in sync.

### Next.js expectations

This repo targets a **recent Next.js major** with breaking changes versus older docs. Before relying on APIs or file conventions, check `node_modules/next/dist/docs/` for the version you are on.

---

## Code guidelines

### Imports and paths

- Alias: `@/` → `src/` (see `tsconfig.json`).
- Prefer absolute `@/…` imports for anything outside the current folder.

### Components

- **`src/components/ui/`**: reusable primitives; extend here rather than copying patterns.
- **`homepage/`**, **`app/`**, **`shared/`**: feature-level grouping—place new UI where it is primarily used; promote to `shared/` when two surfaces need it.
- Use `cn()` from `src/lib/utils.ts` for conditional Tailwind classes.

### Server vs client

- Server Actions live in `src/actions/` with `"use server"` at the top of the file.
- Form handlers that call DB or secrets must stay on the server; pass results to clients via action return types (e.g. discriminated unions like `{ status: "success" } | { status: "error"; message: string }`).
- Add `"use client"` only on components that need hooks, browser APIs, or event handlers that cannot be modeled as server-first.

### Server Actions style

- Validate `FormData` explicitly; normalize with `String(…).trim()`.
- Keep honeypot checks (e.g. hidden `company_website`) consistent across public forms that accept submissions.
- Map validation failures to user-visible messages; log unexpected errors server-side without leaking internals to the client.

### Types and errors

- Prefer explicit action state types exported next to the action.
- Use `try/catch` around DB and external I/O; return friendly error states instead of throwing across the server action boundary when the UI expects a structured result.

### Lint and format

- Run `bun run lint` (Biome check) before pushing; use `bun run format` to apply formatting.
- Respect Biome’s organize-imports assist where applicable.

### Content and configuration

- Static marketing copy or feature tables can live in `src/lib/` (e.g. `*-content.ts`, `*-pricing.ts`) to keep pages thin.

---

## Scripts

| Command           | Purpose                                       |
| ----------------- | --------------------------------------------- |
| `bun run dev`     | Development server                            |
| `bun run build`   | `prisma generate` + production Next.js build |
| `bun run start`   | Production server                             |
| `bun run lint`    | Biome check                                   |
| `bun run format`  | Biome format (write)                          |

(`npm run …` works the same if you use npm.)
