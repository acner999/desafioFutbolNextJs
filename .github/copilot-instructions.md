# Copilot Instructions for TorneoApp

## Project Overview
TorneoApp is a Next.js (App Router) web application that manages amateur team challenges, tournaments, and player rosters. It uses Postgres as the primary datastore and provides both username/password and social login (Google/Twitter) via `next-auth`.

The repository is structured as a typical Next.js app with `app/` for routes, `components/` for UI, `lib/` for utilities/contexts, and `sql/` + `scripts/` for database schema and seeding.

---

## Key Commands

### Run in development
```bash
# start Next.js dev server
node node_modules/next/dist/bin/next dev
```

### Build
```bash
node node_modules/next/dist/bin/next build
```

### Database
```bash
node scripts/run-migrations.js
node scripts/seed-db.js
node scripts/test-db.js
```

> Note: On Windows, `npm` wrapper scripts can be blocked by PowerShell execution policy, so the dev workflow uses `node node_modules/next/dist/bin/next ...`.

---

## Architecture Notes
- **Auth**: Powered by `next-auth` with JWT sessions.
  - Email/password login uses `credentials` provider and compares against `users.password_hash`.
  - Google/Twitter providers are enabled if the corresponding env vars are present.
- **Data**: PostgreSQL with a schema in `sql/schema.sql`.
  - IDs are `BIGSERIAL` (auto-increment integer).
  - Example tables: `users`, `teams`, `players`, `challenges`, `tournaments`, `notifications`.
- **API**: The app provides RESTful JSON endpoints under `app/api/*`.
- **UI**: Uses Tailwind + Radix UI primitives.

---

## Common Pitfalls
- **PowerShell `npm` script blocking**: Use `node node_modules/next/dist/bin/next ...` instead of `npm run ...`.
- **DB connection**: Ensure `.env.local` has a valid `DATABASE_URL`.
- **Data seeding**: The seed script expects the schema to be applied first via `run-migrations.js`.

---

## When Editing the Codebase
- Keep frontend components as small, reusable pieces under `components/`.
- Keep API logic in `app/api/*/route.ts` and avoid putting business logic in UI layers.
- When adding DB columns or altering schema, update `sql/schema.sql` and adjust seed + queries accordingly.

---

## Useful Files
- `app/(auth)/login/page.tsx` — login UI
- `app/(auth)/register/page.tsx` — registration UI
- `app/api/auth/[...nextauth]/route.ts` — `next-auth` configuration
- `lib/contexts/auth-context.tsx` — React auth context (wraps `SessionProvider`)
- `sql/schema.sql` — DB schema
- `scripts/seed-db.js` — seed data script

---

## Recommended Next Steps (if unsure)
1. Run the dev server.
2. Open http://localhost:3000 and test login/registration.
3. If something fails, check the terminal for errors and inspect the relevant `app/api` route.

---

### Tips for Copilot Chat
When asked to modify behavior, prioritize:
1. Changing API route logic (server-side)
2. Ensuring schema and seeding scripts match (IDs are integers)
3. Keeping UI changes minimal and aligned with Tailwind/Radix patterns

---

## Modelo de Negocio (Propuesta de Monetización)

TorneoApp está pensado para servir a equipos amateurs (especialmente en la frontera PJC/Ponta Porã) con un enfoque de suscripción por equipo y herramientas de gestión de torneos y desafíos.

### Resumen Ejecutivo
TorneoApp es una plataforma integral para gestión de torneos y desafíos deportivos amateur, enfocada en la frontera Paraguay-Brasil. El modelo principal de monetización es una **suscripción por equipo** gestionada por el presidente, complementada con canales adicionales de ingresos.

### Problema y Oportunidad
En el deporte amateur, la gestión suele ser manual (WhatsApp, papel), lo que genera errores y fricción. Hay una oportunidad clara en la frontera PJC-Ponta Porã, con cientos de equipos buscando una solución digital.

### La Solución
La plataforma ofrece:
- **Gestión de Torneos** (fixtures, tablas, estadísticas)
- **Sistema de Desafíos** entre equipos con agenda y resultados
- **Módulo Financiero** (inscripciones, pagos, multas)
- **Comunicación integrada** (notificaciones / mensajes)
- **Perfiles de jugadores y equipos**
- **Soporte bilingüe ES/PT**

### Modelo de Monetización (Revisado)
- **Suscripción por Equipo (Presidentes)**: cuota mensual/anual por equipo.
- **Comisiones por transacción**: % sobre pagos de inscripciones/multas.
- **Publicidad segmentada**: anuncios para negocios locales.
- **Patrocinios**: espacios premiun y acuerdos con marcas.
- **Servicios Premium**: análisis de rendimiento, scouting, personalización de equipos.

### Roadmap (4 fases)
1. MVP y validación (beta en PJC)
2. Lanzamiento oficial y monetización
3. Expansión nacional/regional
4. Consolidación y búsqueda de inversión
5. Respondeme en español todo

---

(La propuesta está diseñada para ayudar a priorizar funcionalidades y aclarar cómo se monetizará la plataforma mientras se desarrolla el producto.)

todo esto es responsive, con un diseño moderno y limpio, y con una experiencia de usuario fluida tanto en desktop como en mobile. por que es PWA
