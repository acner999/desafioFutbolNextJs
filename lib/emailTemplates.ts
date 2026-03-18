type WelcomeData = {
  name?: string;
  intro?: string;
  ctaText?: string;
  ctaUrl?: string;
  footer?: string;
};

export function renderWelcome(data: WelcomeData = {}) {
  const name = data.name || "Jugador";
  const intro = data.intro || "Gracias por unirte a TorneoApp. Estamos felices de tenerte.";
  const ctaText = data.ctaText || "Ir a mi equipo";
  const ctaUrl = data.ctaUrl || "https://torneo.example.com/dashboard";
  const footer = data.footer || "© 2026 TorneoApp. Todos los derechos reservados.";

  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Bienvenido a TorneoApp</title>
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; background:#f6f9fc; margin:0; padding:0; }
      .container { max-width:600px; margin:32px auto; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 6px 18px rgba(32,33,36,0.08); }
      .header { background:linear-gradient(90deg,#0ea5e9,#7c3aed); color:#fff; padding:24px; text-align:center }
      .header h1 { margin:0; font-size:20px; }
      .content { padding:24px; color:#0f172a; }
      .greeting { font-size:18px; margin-bottom:12px; }
      .text { font-size:15px; line-height:1.6; color:#334155; }
      .cta { display:block; width:max-content; margin:20px 0; padding:12px 18px; background:#0ea5e9; color:white; border-radius:8px; text-decoration:none; }
      .footer { padding:16px 24px; font-size:13px; color:#94a3b8; background:#f8fafc; }
      @media (max-width:520px){ .container{margin:16px} .header h1{font-size:18px} }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Bienvenido a TorneoApp</h1>
      </div>
      <div class="content">
        <div class="greeting">Hola ${escapeHtml(name)},</div>
        <div class="text">${escapeHtml(intro)}</div>
        <a class="cta" href="${escapeAttr(ctaUrl)}">${escapeHtml(ctaText)}</a>
        <div class="text">Si tienes preguntas, responde este correo y te ayudamos.</div>
      </div>
      <div class="footer">${escapeHtml(footer)}</div>
    </div>
  </body>
</html>`;
}

type InviteData = {
  inviterName?: string;
  teamName?: string;
  acceptUrl: string;
  message?: string;
};

export function renderInvite(data: InviteData) {
  const inviter = data.inviterName || 'Un miembro del equipo';
  const team = data.teamName || 'tu equipo';
  const msg = data.message || 'Has sido invitado a unirte al equipo.';
  const acceptUrl = data.acceptUrl;

  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Invitación a unirte</title>
    <style>
      body { font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial; background:#f6f9fc; margin:0; }
      .card { max-width:600px; margin:28px auto; background:#fff; border-radius:8px; overflow:hidden; box-shadow:0 6px 18px rgba(32,33,36,0.08); }
      .head { background:linear-gradient(90deg,#06b6d4,#6366f1); color:#fff; padding:20px; text-align:center }
      .body { padding:22px; color:#0f172a }
      .cta { display:inline-block; padding:12px 18px; background:#06b6d4; color:#fff; border-radius:8px; text-decoration:none; margin-top:18px }
      .meta { margin-top:12px; color:#64748b; font-size:13px }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="head"><h2>Invitación para unirte a ${escapeHtml(team)}</h2></div>
      <div class="body">
        <p>Hola,</p>
        <p>${escapeHtml(inviter)} te ha invitado a unirte a <strong>${escapeHtml(team)}</strong>.</p>
        <p>${escapeHtml(msg)}</p>
        <a class="cta" href="${escapeAttr(acceptUrl)}">Aceptar invitación</a>
        <div class="meta">Si no solicitaste esto, puedes ignorar este correo.</div>
      </div>
    </div>
  </body>
</html>`;
}

function escapeHtml(s: string) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttr(s: string) {
  return escapeHtml(s).replace(/\n/g, "");
}

export function renderTemplate(name: string, data?: any) {
  if (name === "welcome") return renderWelcome(data);
  if (name === "invite") return renderInvite(data);
  throw new Error(`Unknown template: ${name}`);
}

export default renderTemplate;
