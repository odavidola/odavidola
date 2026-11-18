"use client";
import { useState } from "react";

/** The address is assembled on click, so it is never sitting in the page for scrapers to harvest. */
const USER = "odavidolagunju";
const HOST = "gmail.com";

export function ContactActions() {
  const [shown, setShown] = useState(false);
  const address = `${USER}@${HOST}`;
  return (
    <div className="contact-actions">
      <a className="btn solid" href="https://www.linkedin.com/in/david-olagunju-143aa8a7/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
      <a className="btn" href="https://github.com/odavidola" target="_blank" rel="noopener noreferrer">GitHub</a>
      {shown ? (
        <a className="btn" href={`mailto:${address}?subject=${encodeURIComponent("Hello from odavidola.com")}`}>{address}</a>
      ) : (
        <button className="btn" type="button" onClick={() => setShown(true)}>Show email</button>
      )}
      {shown && (
        <a className="btn" href={`mailto:${address}?subject=${encodeURIComponent("CV request")}&body=${encodeURIComponent("Hi David, could you send me your CV?")}`}>Ask for my CV</a>
      )}
    </div>
  );
}
