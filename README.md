# Fitnexx

Monorepo for the Fitnexx fitness tracker: a marketing/web app (Next.js) and a mobile app (Expo).

| Workspace         | Package         | Description                                    |
| ----------------- | --------------- | ---------------------------------------------- |
| `apps/web`        | `fitnexx-web`   | Next.js site and `/app` dashboard              |
| `apps/mobile`     | `fitnexx-mobile`| Expo (React Native) app                        |
| `packages/ai`     | `@fitnexx/ai`   | Shared AI provider client and request types    |
| `packages/shared-ui` | `@fitnexx/ui` | Shared Tamagui components and theme config   |

## Requirements

- Node.js 20+
- Bun (the lockfile at the repo root is `bun.lock`)

## Getting started

Install dependencies once from the repo root:

```bash
bun install
```

### Web app

```bash
bun run dev
```

Runs the Next.js app on [http://localhost:3000](http://localhost:3000). Set
`SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` in the
environment.

### Mobile app

```bash
bun run mobile        # starts Expo with a tunnel
# or, from apps/mobile
bun start
bun ios
bun android
```

The food-photo scanner (`lib/foodScan.ts`) uses `onnxruntime-react-native` and
`expo-gl` (native modules), so it needs a **development build**, not Expo Go.
Build once with `bun ios` / `bun android` (or EAS), then keep going with `bun
start`.

Tests live next to the code and run with `bun test` from `apps/mobile`.

AI, authentication, and Pro subscription setup is documented in
[`docs/ai-setup.md`](docs/ai-setup.md).

## Scripts

From the repo root:

| Script           | Description                        |
| ---------------- | ---------------------------------- |
| `bun run dev`    | Start the web dev server           |
| `bun run build`  | Build the web app                  |
| `bun run start`  | Serve the production web build     |
| `bun run mobile` | Start Expo for the mobile app      |
| `bun run lint`   | Biome check across the repo        |
| `bun run format` | Biome format across the repo       |

## Deployment (Vercel)

The web app lives in `apps/web`, so the Vercel project needs:

- **Root Directory**: `apps/web`
- **Include source files outside of the Root Directory**: enabled, because
  `apps/web` imports `@fitnexx/ui` from `packages/shared-ui`
- `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` set as
  environment variables
