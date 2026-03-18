# TorneoApp

Plataforma digital para la gestión integral de torneos y desafíos de fútbol amateur. Permite a presidentes, managers y jugadores organizar, participar y seguimiento de torneos con autenticación segura y roles personalizados.

## Resumen
- Aplicación Next.js (App Router) para gestión de torneos y desafíos amateur.
- Auth: email/password + Google/Twitter (next-auth). Roles: `president`, `manager`, `player`, `normal`.

## Requisitos
- Node.js 18+ (o la versión usada en el repositorio)
- PostgreSQL

## Variables de entorno
Consulta `.env.example` (creado en este repo) para las variables necesarias.

## Desarrollo
Instalar dependencias y arrancar en modo desarrollo:

```bash
# desde la raíz del proyecto
npm install
# o pnpm install
node node_modules/next/dist/bin/next dev
```

## Migraciones y seed
Ejecuta las migraciones y el seed (ver scripts en `scripts/`):

```bash
node scripts/run-migrations.js
node scripts/seed-db.js
node scripts/test-db.js
```

## Autenticación
- Registro: [app/api/auth/register/route.ts](app/api/auth/register/route.ts) (email + password, opcional `cedula`).
- Login: [app/(auth)/login/page.tsx](app/(auth)/login/page.tsx) (credentials + botones sociales si config env).
- Asegúrate de configurar `NEXTAUTH_SECRET` y, para proveedores sociales, `GOOGLE_CLIENT_ID/SECRET` y `TWITTER_CLIENT_ID/SECRET` en `.env.local`.

## Build y producción
```bash
node node_modules/next/dist/bin/next build
node node_modules/next/dist/bin/next start
```

