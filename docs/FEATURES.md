# Nuevas funcionalidades añadidas (esqueleto)

He añadido los siguientes componentes/esqueletos para completar funcionalidades faltantes:

- `password_resets` DB table: `sql/schema.sql`.
- API endpoints: `app/api/auth/forgot-password/route.ts` y `app/api/auth/reset-password/route.ts`.
- Middleware helper: `lib/middleware/requireRole.ts` para comprobación de roles en servidores.
- Docker + docker-compose: `Dockerfile` y `docker-compose.yml` para desarrollo local con Postgres.
- CI básico: `.github/workflows/ci.yml` para instalar dependencias y compilar.
- Test script: `scripts/test-auth.js` para probar registro y flujo de olvido de contraseña localmente.

- Invitaciones a equipo (`team_invites`): tabla y endpoints `POST /api/teams/invite` y `POST /api/teams/respond-invite`. Ahora el proyecto soporta crear invitaciones con token y aceptar/rechazar.

Notas y siguientes pasos:

- Los endpoints de email (envío) son un stub: actualmente el token se devuelve en la respuesta para tests locales. Integra un proveedor de correo (SendGrid, SES) para envío real.
- Integra `requireRole` desde páginas o API server-side donde necesites proteger rutas por rol.
- Añade comprobaciones y validaciones adicionales (rate limiting, reCAPTCHA, validación de emails).
