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

Verificación de email
- Endpoint para solicitar verificación: `POST /api/auth/send-verification` con JSON `{ "email": "user@example.com" }`.
	- Crea un token en `email_verifications` y por ahora lo devuelve en la respuesta para pruebas locales.
	- Integra un envío real de correo (SendGrid/SES) para producción.
- Endpoint para verificar: `POST /api/auth/verify-email` con JSON `{ "token": "..." }`.
	- Marca `users.email_verified = true` y borra tokens usados.

Integración recomendada:
- Llamar a `send-verification` cuando el usuario se registre y mostrar instrucciones para comprobar correo.
- Bloquear ciertas acciones hasta `email_verified = true` (ej. crear torneos) según la política de negocio.
