# Autenticación — TorneoApp

Resumen de comportamiento y pruebas para autenticación.

Roles
- `president`: acceso administrativo por equipo.
- `manager`: permisos operativos sobre torneos y desafíos.
- `player`: perfil jugador.
- `normal`: usuario sin permisos especiales.

Registro (email/password)
- Endpoint: [app/api/auth/register/route.ts](app/api/auth/register/route.ts).
- Campos: `email`, `password`, `name` (opcional), `cedula` (opcional), `teamName` (opcional).
- El password se guarda hasheado (bcrypt).

Login
- UI: [app/(auth)/login/page.tsx](app/(auth)/login/page.tsx).
- Provider credentials: usa `next-auth` credentials provider; también hay botones sociales si se configuran variables.

Social Login
- Requiere configurar `GOOGLE_CLIENT_ID/SECRET` y `TWITTER_CLIENT_ID/SECRET` en `.env.local`.
- Los inicios sociales harán upsert del usuario en la base de datos.

Sesión
- `next-auth` gestiona la sesión; callbacks incluyen `role`, `teamId` y `cedula` en el token y la sesión.

Pruebas rápidas local
1. Asegúrate de tener `DATABASE_URL` y `NEXTAUTH_SECRET` en `.env.local`.
2. Ejecuta migraciones y seed.
3. Regístrate con email y contraseña. Luego haz login.
4. Para probar social, añade las credenciales del proveedor y usa los botones sociales en la UI.
