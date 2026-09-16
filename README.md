# Fitnexx

Train smarter. Eat with intention. Own your data.

Fitnexx is a privacy-first, local-first fitness tracker. Log workouts, track meals, monitor body metrics, and get AI-powered training insights. Your workout data lives on your device first, with optional cloud sync and Pro features.

## Features

- **Workout logging**: templates, streaks, history, export
- **20+ training analytics**: 1RM estimates, PR detection, plateau detection, volume and intensity trends, muscle balance, injury risk signals
- **Meal tracking**: food database plus on-device photo scanning (ONNX)
- **Body metrics**: weight, measurements, water intake
- **Gym detection**: location-based check-ins via geofencing
- **AI coaching**: bring-your-own-key chat, or Fitnexx Pro with a server-side proxy (OpenAI, Anthropic, Google, OpenRouter)
- **Local device sync**: sync between your own devices over TCP, no cloud required

## Tech stack

| Layer | Technology |
|---|---|
| Monorepo | Bun workspaces (`apps/*`, `packages/*`) |
| Web | Next.js 16, React 19, Tailwind CSS v4, Tamagui, shadcn/ui |
| Mobile | Expo SDK 57, React Native, expo-router, Tamagui, zustand |
| Backend | Supabase (auth, Postgres, RLS) |
| AI | `@fitnexx/ai` shared client, Next.js proxy routes |
| Payments | RevenueCat (Pro subscription) |
| Lint and format | Biome |
| Language | TypeScript (strict) |

## Monorepo layout

| Workspace | Package | Description |
|---|---|---|
| `apps/web` | `fitnexx-web` | Marketing site, dashboard, API routes, webhooks |
| `apps/mobile` | `fitnexx-mobile` | Expo mobile app |
| `packages/ai` | `@fitnexx/ai` | Shared AI provider client and request types |
| `packages/shared-ui` | `@fitnexx/ui` | Shared Tamagui components and theme |

Key docs: [`CONTRIBUTING.md`](CONTRIBUTING.md) for the full contributor guide, [`docs/ai-setup.md`](docs/ai-setup.md) for Supabase, RevenueCat, and AI setup.

## Quick start

Requirements: Node.js 20+, Bun.

```bash
bun install
bun run dev      # web app on http://localhost:3000
bun run mobile   # Expo with tunnel
```

Copy the example env files to get going:

```bash
cp apps/web/.env.example apps/web/.env
cp apps/mobile/.env.example apps/mobile/.env
```

Most features work without keys. AI Pro features, auth, and subscriptions need the setup in [`docs/ai-setup.md`](docs/ai-setup.md).

### Mobile note

The food-photo scanner uses native modules (`onnxruntime-react-native`, `expo-gl`), so it needs a **development build**, not Expo Go. Build once with `bun ios` or `bun android` (or EAS), then keep iterating with `bun start`.

## Scripts

From the repo root:

| Script | Description |
|---|---|
| `bun run dev` | Start the web dev server |
| `bun run build` | Build the web app |
| `bun run start` | Serve the production web build |
| `bun run mobile` | Start Expo for the mobile app |
| `bun run lint` | Biome check across the repo |
| `bun run format` | Biome format across the repo |
| `bun test` | Run tests (colocated `*.test.ts` files) |

## Contributing

Contributions are welcome. Please read [`CONTRIBUTING.md`](CONTRIBUTING.md) before opening a PR. It covers environment setup, architecture, code style, testing, branching, and the review process.

## Deployment

The web app lives in `apps/web`, so the Vercel project needs:

- **Root Directory**: `apps/web`
- **Include source files outside of the Root Directory**: enabled (imports `@fitnexx/ui` from `packages/shared-ui`)
- Supabase and AI env vars set (see [`docs/ai-setup.md`](docs/ai-setup.md))

Android releases are built by [`.github/workflows/android-release.yml`](.github/workflows/android-release.yml) on `v*` tags.
