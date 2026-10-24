"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { siteConfig } from "@/lib/site";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`GlowHacks message from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:${siteConfig.email}?subject=${subject}&body=${body}`;
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4 p-6">
      <div>
        <label htmlFor="name" className="label">Your name</label>
        <input id="name" required value={name} onChange={(e) => setName(e.target.value)} className="input" placeholder="Jane Doe" />
      </div>
      <div>
        <label htmlFor="email" className="label">Email address</label>
        <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input" placeholder="you@example.com" />
      </div>
      <div>
        <label htmlFor="message" className="label">Message</label>
        <textarea id="message" required rows={5} value={message} onChange={(e) => setMessage(e.target.value)} className="input resize-y" placeholder="Tell us what's on your mind..." />
      </div>
      <button type="submit" className="btn-primary w-full">
        <Send className="h-4 w-4" aria-hidden /> Send message
      </button>
      <p className="text-xs text-glow-muted">
        This opens your email app with the message ready to send. Nothing is stored on our site.
      </p>
    </form>
  );
}
