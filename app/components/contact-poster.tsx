import { ContactActions } from "@/app/components/contact-actions";

export function ContactPoster() {
  return (
    <section id="contact" className="contact" data-tone="light">
      <p className="mono">Contact</p>
      <h2>Let&rsquo;s build something people feel.</h2>
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
