"use client";
import { useState } from "react";

type State = "idle" | "sending" | "done" | "error";

/** Beta sign-up. Posts to /api/beta, which emails David. The extra "website" field is a trap for bots. */
export function BetaForm() {
  const [state, setState] = useState<State>("idle");
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setState("sending");
    try {
      const r = await fetch("/api/beta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: f.get("email"), note: f.get("note"), website: f.get("website") }),
      });
      const j = await r.json().catch(() => ({}));
      if (r.ok && j.ok) { setState("done"); return; }
      setMsg(j.error === "email" ? "That email doesn’t look right." : "Couldn’t send that. Try again in a moment.");
      setState("error");
    } catch {
      setMsg("Couldn’t send that. Try again in a moment.");
      setState("error");
    }
  }

  if (state === "done") {
    return <div className="beta" role="status"><p className="beta-done">Thanks. I will email you when there is a build to try.</p></div>;
  }

  return (
    <form className="beta" onSubmit={submit} noValidate>
      <p className="mono">Join the beta</p>
      <div className="beta-row">
        <label className="sr" htmlFor="beta-email">Email</label>
        <input id="beta-email" name="email" type="email" inputMode="email" autoComplete="email" placeholder="you@email.com" required />
        <button type="submit" disabled={state === "sending"}>{state === "sending" ? "Sending" : "Ask for a TestFlight invite"}</button>
      </div>
      <label className="sr" htmlFor="beta-note">Anything you want me to know (optional)</label>
      <input id="beta-note" name="note" type="text" maxLength={500} placeholder="Optional: why you want to try it" />
      <input className="hp" name="website" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      {state === "error" && <p className="beta-err" role="alert">{msg}</p>}
    </form>
  );
}
