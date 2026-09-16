# Contributing to Fitnexx

Thanks for your interest in contributing. This guide covers everything you need to set up, build, test, and submit changes.

## Table of contents

1. [Prerequisites](#prerequisites)
2. [Getting started](#getting-started)
3. [Environment variables](#environment-variables)
4. [Architecture overview](#architecture-overview)
5. [Development workflow](#development-workflow)
6. [Code style](#code-style)
7. [Testing](#testing)
8. [Branching and commits](#branching-and-commits)
9. [Pull requests](#pull-requests)
10. [Issues](#issues)
11. [Security](#security)

## Prerequisites

- Node.js 20+
- Bun (the lockfile at the repo root is `bun.lock`)
- For mobile native builds: Xcode (iOS) or Android Studio (Android)
- For full backend features: a Supabase project, RevenueCat account, and at least one AI provider key

## Getting started

1. Fork the repository and clone your fork:

```bash
git clone https://github.com/<your-username>/fitnexx.git
cd fitnexx
```

2. Add the upstream remote to keep your fork in sync:

```bash
git remote add upstream https://github.com/<owner>/fitnexx.git
git fetch upstream
```

3. Install dependencies once from the repo root:

```bash
bun install
```

4. Copy the example env files:

```bash
cp apps/web/.env.example apps/web/.env
cp apps/mobile/.env.example apps/mobile/.env
```

5. Start developing:

```bash
bun run dev      # web app on http://localhost:3000
bun run mobile   # Expo with tunnel
```

Most features work without API keys. Auth, AI Pro, and subscriptions need the setup in [`docs/ai-setup.md`](docs/ai-setup.md).

## Environment variables

### Web (`apps/web/.env`)

| Variable | Required for | Notes |
|---|---|---|
| `SUPABASE_URL`, `SUPABASE_ANON_KEY` | Auth, dashboard | From Supabase API settings |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side DB access | Bypasses RLS, never expose to clients |
| `RESEND_API_KEY`, `FITNEXX_EMAIL_FROM`, `FITNEXX_NOTIFY_EMAIL` | Contact and bug-report emails | Resend |
| `FITNEXX_ADMIN_PASSWORD` | Admin dashboard login | Change from the default |
| `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GOOGLE_AI_API_KEY`, `OPENROUTER_API_KEY` | Pro AI proxy | At least one for Pro features |
| `FITNEXX_AI_MODELS` | Model allowlist | Comma-separated `provider:model` pairs |
| `REVENUECAT_WEBHOOK_SECRET`, `REVENUECAT_SECRET_API_KEY`, `REVENUECAT_PRO_ENTITLEMENT` | Pro subscription webhooks | See `docs/ai-setup.md` |

### Mobile (`apps/mobile/.env`)

| Variable | Notes |
|---|---|
| `EXPO_PUBLIC_API_URL` | Deployed web origin. Use a LAN-reachable URL for on-device testing, not `localhost` |
| `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Same Supabase project as web |
| `EXPO_PUBLIC_REVENUECAT_IOS_KEY`, `EXPO_PUBLIC_REVENUECAT_ANDROID_KEY` | RevenueCat public SDK keys |
| `EXPO_PUBLIC_REVENUECAT_PRO_ENTITLEMENT` | `pro` |

Never commit `.env` files. They are git-ignored; only `.env.example` files belong in version control.

## Architecture overview

```
apps/web/              Next.js site, dashboard, API routes
  src/app/             App Router pages and API endpoints
  src/actions/         Server actions (contact, bug-report, interest-list)
  src/components/      Marketing, dashboard, and shadcn/ui components
  src/lib/             Auth, Supabase, email, RevenueCat, AI proxy helpers
  supabase/init.sql    Auth, interest-list, and rate-limit SQL

apps/mobile/           Expo app (expo-router file-based routing)
  app/                 Routes: tabs, auth, workout and exercise screens
  components/          Dashboard cards, logging, gyms, settings, sync UI
  lib/                 Store (zustand), sync, food scan, payments,
                       geofencing, notifications, export, templates
  lib/analysis/        20+ training analytics modules (1RM, PRs,
                       plateaus, volume trends, muscle balance, etc.)
  constants/           Exercise and muscle catalogs

packages/ai/           @fitnexx/ai: provider client, chat, model listing
packages/shared-ui/    @fitnexx/ui: shared Tamagui components and theme

supabase/migrations/   SQL migrations (applied to Supabase)
.github/workflows/     Android release CI (builds AAB/APK on v* tags)
```

Design principles:

- **Local-first**: workout data lives on-device (zustand store, local storage). Cloud is optional, not required.
- **Smallest effective change**: match existing patterns, reuse helpers and shared packages before adding new ones.
- **No new dependencies without justification**: prefer stdlib, platform APIs, or already-installed packages.

> Note: this repo uses a custom Next.js 16 build with breaking changes. Before writing web code, check `node_modules/next/dist/docs/` and heed deprecation notices.

## Development workflow

### Web

```bash
bun run dev      # dev server on http://localhost:3000
bun run build    # production build
bun run start    # serve the production build
```

Vercel deployment needs Root Directory `apps/web` with "Include source files outside of the Root Directory" enabled (the web app imports `@fitnexx/ui`).

### Mobile

```bash
bun run mobile   # Expo start with tunnel (from repo root)
# or, from apps/mobile
bun start
bun ios
bun android
```

The food-photo scanner (`lib/foodScan.ts`) uses native modules, so it requires a **development build**, not Expo Go. Build once with `bun ios` / `bun android` (or EAS), then iterate with `bun start`.

### Full backend (auth, AI Pro, subscriptions)

Follow [`docs/ai-setup.md`](docs/ai-setup.md): run `apps/web/supabase/init.sql` in the Supabase SQL editor, configure RevenueCat with a `pro` entitlement, set at least one server-side AI key, and point `EXPO_PUBLIC_API_URL` at your deployed web origin.

## Code style

- **Formatter and linter**: Biome (`biome.json`). Run `bun run lint` before pushing, `bun run format` to fix formatting. Import organization is automatic.
- **TypeScript**: strict mode. New code must typecheck cleanly:
  ```bash
  bunx tsc --noEmit -p apps/mobile/tsconfig.json
  bunx tsc --noEmit -p apps/web/tsconfig.json
  ```
- **Conventions**:
  - Match the style of surrounding code (2-space indent, double quotes).
  - Keep functions focused on a single responsibility.
  - Reuse existing modules and shared packages instead of duplicating logic.
  - Keep diffs small and focused; avoid unrelated refactors in the same PR.
  - Do not use em dashes in code, comments, or docs. Use commas, colons, or parentheses instead.

## Testing

Tests are colocated next to the code as `*.test.ts` and run with the Bun test runner (no Jest or Vitest config).

```bash
bun test                                    # whole repo
bun test apps/mobile/lib/streak.test.ts     # single file
```

Guidelines:

- Add or update tests for behavior changes (analytics, sync protocol, export, API routes).
- Verify edge cases and error handling, not just the happy path.
- Do not modify tests just to make failures disappear. Fix the code or discuss in the PR.
- Run the relevant typecheck plus `bun test` before requesting review. For web changes, also run `bun run build`.

Existing coverage includes mobile sync, export, food DB, gyms, streaks, and plateau/PR detection, plus web AI proxy, RevenueCat, and HTTP helpers.

## Branching and commits

- Sync with upstream before starting work:
  ```bash
  git fetch upstream
  git checkout -b <type>/<short-description> main
  git merge upstream/main
  ```
- Branch names: `feat/workout-export-csv`, `fix/streak-off-by-one`, `docs/setup-guide`, `chore/bump-expo-sdk`.
- Commit messages: short imperative summary (under 72 chars), blank line, then details if needed.
  ```
  Add CSV export for workout history

  Includes date, exercise, sets, reps, and weight columns.
  Handles empty history with a header-only file.
  ```
- One logical change per commit. Do not mix refactors with feature work.

## Pull requests

1. Push your branch to your fork and open a PR against `main`.
2. Keep the PR focused: one feature or fix, minimal diff, no unrelated changes.
3. Fill in the description with:
   - What changed and why
   - How you tested it (commands run, devices or browsers checked)
   - Screenshots or screen recordings for UI changes
   - Linked issue number, if any (`Fixes #123`)
4. Checklist before requesting review:
   - `bun run lint` passes
   - `bun test` passes
   - Typecheck passes for touched workspaces
   - `bun run build` passes for web changes
   - Docs updated if behavior changed (`README.md`, `docs/`, `.env.example`)
5. Be responsive to review feedback. Resolve threads rather than force-pushing over them mid-review; a final rebase is fine once approved.

Reviewers will check for correctness, test coverage, scope discipline, and adherence to the local-first architecture.

## Issues

- Search existing issues before opening a new one.
- Bug reports should include: what you expected, what happened, steps to reproduce, app version, and platform (web browser, iOS, Android, Expo dev build).
- Feature requests should describe the problem first, then the proposed solution. Keep the local-first principle in mind: features that require cloud accounts for basic use need strong justification.

## Security

Do not open public issues for vulnerabilities. Report them privately to the maintainers. Never commit secrets, API keys, or keystores. If you accidentally push a secret, rotate it immediately and notify a maintainer.
