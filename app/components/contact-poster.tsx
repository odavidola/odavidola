import { ContactActions } from "@/app/components/contact-actions";

export function ContactPoster() {
  return (
    <section id="contact" className="contact" data-tone="light">
      <p className="mono">Contact</p>
      <h2><span style={{ display: "block" }}>I got curious.</span> <span style={{ display: "block" }}>It got out of hand.</span></h2>
      <div className="contact-foot">
        <ContactActions />
        <div className="contact-meta">
          <p className="mono">London · open to a good conversation</p>
          <p className="mono credit">Piano: Salamander Grand Piano by Alexander Holm, CC BY 3.0</p>
        </div>
      </div>
    </section>
  );
}
