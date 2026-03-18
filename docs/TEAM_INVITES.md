# Invitaciones a equipo

Endpoints añadidos:
- `POST /api/teams/invite` — Crea una invitación. Body: `{ teamId, inviteeEmail, role }`.
- `POST /api/teams/respond-invite` — Responde a invitación. Body: `{ token, action }` donde `action` es `accept` o `reject`.
- `GET /api/teams/invites?teamId=...` — Lista invitaciones del equipo (requiere sesión y pertenecer al equipo o ser manager/president).

Comportamiento:
- Al invitar, se crea un token en `team_invites` y se envía un email con enlace de aceptación.
 - Solo `president` o `manager` del equipo pueden crear invitaciones (autenticado).
- Al invitar, se crea un token en `team_invites` y se envía un email con enlace de aceptación.
- Al aceptar, si el usuario ya existe (por email) se le asigna `users.team_id` y el invite se marca `accepted`.
- Si el usuario no está registrado, el invite queda en `pending` hasta que se registre; se puede implementar lógica adicional para auto-unir al registrarse.

Auto-aceptación al registrar:
- El endpoint de registro ahora comprueba `team_invites` pendientes para el email registrado. Si existe una invitación válida, el nuevo usuario recibe `team_id` automáticamente y la invitación se marca `accepted`.

Siguientes mejoras:
- Proteger `POST /api/teams/invite` para que solo `president` o `manager` del equipo puedan invitar.
- Añadir flujo de registro que compruebe `team_invites` por email y token, y una vez registrado acepte automáticamente la invitación.
- Añadir UI para enviar/aceptar invitaciones.
