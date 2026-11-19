import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// Best-effort throttle: one sign-up per address per minute, per server instance.
const recent = new Map<string, number>();
const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,}$/;

export async function POST(req: NextRequest) {
  let body: { email?: unknown; note?: unknown; website?: unknown };
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false }, { status: 400 }); }

  // Hidden field only bots fill in. Pretend it worked.
  if (typeof body.website === "string" && body.website) return NextResponse.json({ ok: true });

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const note = typeof body.note === "string" ? body.note.trim().slice(0, 500) : "";
  if (!EMAIL.test(email)) return NextResponse.json({ ok: false, error: "email" }, { status: 400 });

  const now = Date.now();
  if (now - (recent.get(email) ?? 0) < 60_000) return NextResponse.json({ ok: true });
  recent.set(email, now);
  if (recent.size > 500) recent.clear();

  const key = process.env.RESEND_API_KEY;
  if (!key) return NextResponse.json({ ok: false, error: "not-configured" }, { status: 503 });

  const to = process.env.BETA_TO_EMAIL ?? ["odavidolagunju", "gmail.com"].join("@");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.BETA_FROM_EMAIL ?? "Ebb beta <onboarding@resend.dev>",
      to: [to],
      reply_to: email,
      subject: `Ebb beta request: ${email}`,
      text: `${email} would like to join the Ebb beta.\n\n${note ? `Note: ${note}\n\n` : ""}Reply to this email to answer them.`,
    }),
  });
  if (!res.ok) return NextResponse.json({ ok: false, error: "send" }, { status: 502 });
  return NextResponse.json({ ok: true });
}
