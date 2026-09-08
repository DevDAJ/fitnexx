# AI and Pro setup

BYOK works without an account. Fitnexx Pro requires Supabase authentication,
RevenueCat, the web API, and at least one server-side AI provider key.

## Supabase authentication

1. Create a Supabase project.
2. In Authentication, enable the Email provider. Decide whether email
   confirmation is required before testing sign-in.
3. Copy `apps/mobile/.env.example` to `apps/mobile/.env` and set
   `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` from the
   Supabase API settings.
4. Copy `apps/web/.env.example` to `apps/web/.env` and set `SUPABASE_URL` and
   `SUPABASE_ANON_KEY` to the same project values.

Fitnexx uses Supabase only for account authentication. Pro entitlement is held
in the existing Prisma database. Deploy its migrations from `apps/web`:

```bash
bunx prisma migrate deploy
```

## RevenueCat subscription

1. Create a RevenueCat project and add iOS and Android apps with identifier
   `com.fitnexx.app`.
2. Connect App Store Connect and Google Play, then create a monthly subscription
   priced at $3.99 USD in each store.
3. Create an entitlement named `pro` and attach both store products.
4. Create an offering, make it current, and add the monthly package. The app
   purchases the first package in the current offering.
5. Put the public Apple and Google SDK keys in
   `EXPO_PUBLIC_REVENUECAT_IOS_KEY` and
   `EXPO_PUBLIC_REVENUECAT_ANDROID_KEY`. Keep
   `EXPO_PUBLIC_REVENUECAT_PRO_ENTITLEMENT=pro`.
6. Add an HTTPS webhook pointing to
   `https://YOUR_WEB_HOST/api/webhooks/revenuecat`.
7. Enable HMAC webhook signing. Store the signing secret as
   `REVENUECAT_WEBHOOK_SECRET` in the web deployment and set
   `REVENUECAT_PRO_ENTITLEMENT=pro`.
8. Send a test webhook from RevenueCat after deploying.

Use Supabase user UUIDs as RevenueCat App User IDs. The mobile integration does
this automatically after sign-in. Real purchases need an Expo development
build; Expo Go only provides RevenueCat preview behavior.

## AI providers

Set at least one key in the web deployment:

- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`
- `GOOGLE_AI_API_KEY`
- `OPENROUTER_API_KEY`

`FITNEXX_AI_MODELS` is a comma-separated allowlist of `provider:model` values.
Only allowlisted models appear to Pro users and pass the proxy. The default is:

```text
openai:gpt-4.1-mini,anthropic:claude-sonnet-4-20250514,google:gemini-2.5-flash,openrouter:openai/gpt-4.1-mini
```

Set `EXPO_PUBLIC_API_URL` in the mobile environment to the deployed web origin.
For local device testing, use a URL reachable from the device rather than
`localhost`.

BYOK keys never use these server variables. The app stores each key in Expo
SecureStore and calls the selected provider directly.

## Checks

```bash
bun test
bunx tsc --noEmit -p apps/mobile/tsconfig.json
bunx tsc --noEmit -p apps/web/tsconfig.json
bun run build
```
