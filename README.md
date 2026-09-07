# Fitnexx

Monorepo for the Fitnexx fitness tracker: a marketing/web app (Next.js) and a mobile app (Expo).

| Workspace       | Package         | Description                                    |
| --------------- | --------------- | ---------------------------------------------- |
| `apps/web`      | `fitnexx-web`   | Next.js site and `/app` dashboard              |
| `apps/mobile`   | `fitnexx-mobile`| Expo (React Native) app                        |
| `packages/shared-ui` | `@fitnexx/ui` | Shared Tamagui components and theme config   |
| `packages/database`  |               | Generated Prisma client                        |

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

Runs the Next.js app on [http://localhost:3000](http://localhost:3000). The `build`
script runs `prisma generate` before `next build`, so `FITNEXX_PRISMA_DATABASE_URL`
(or `FITNEXX_POSTGRES_URL`) must be set.

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
- `FITNEXX_PRISMA_DATABASE_URL` (or `FITNEXX_POSTGRES_URL`) set as an environment
  variable
