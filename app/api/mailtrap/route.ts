import { NextResponse } from "next/server";
import { sendMail } from "../../../lib/mailtrap";
import { renderTemplate } from "../../../lib/emailTemplates";

export async function POST(req: Request) {
  const body = await req.json();
  let { to, subject, text, html, template, templateData } = body;

  if (!to || !subject || (!text && !html && !template)) {
    return NextResponse.json(
      { ok: false, error: "Missing required fields: to, subject, text/html" },
      { status: 400 }
    );
  }

  // If a template is requested and html not provided, render it
  if (template && !html) {
    try {
      html = renderTemplate(template, templateData || {});
    } catch (e) {
      return NextResponse.json({ ok: false, error: String(e) }, { status: 400 });
    }
  }

  try {
    const result = await sendMail({
      from: { name: "TorneoApp", email: "no-reply@example.com" },
      to,
      subject,
      text,
      html,
    });

    return NextResponse.json({ ok: true, result });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
