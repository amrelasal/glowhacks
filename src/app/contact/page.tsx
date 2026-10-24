import type { Metadata } from "next";
import { Clock, Lightbulb, Mail } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Questions, feedback, or ideas for a new tool? Get in touch with the GlowHacks team.",
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="text-3xl font-bold sm:text-4xl">Contact Us</h1>
      <p className="mt-4 text-lg leading-relaxed text-glow-ink/85">
        Questions, feedback, a bug to report, or an idea for a new tool? We read every message and would love to hear
        from you.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        <div className="card p-5">
          <Mail className="h-5 w-5" aria-hidden />
          <h2 className="mt-3 font-semibold">Email</h2>
          <a href={`mailto:${siteConfig.email}`} className="mt-1 block break-all text-sm text-glow-muted underline decoration-glow-pink underline-offset-4">
            {siteConfig.email}
          </a>
        </div>
        <div className="card p-5">
          <Clock className="h-5 w-5" aria-hidden />
          <h2 className="mt-3 font-semibold">Response time</h2>
          <p className="mt-1 text-sm text-glow-muted">We usually reply within 2–3 business days.</p>
        </div>
        <div className="card p-5">
          <Lightbulb className="h-5 w-5" aria-hidden />
          <h2 className="mt-3 font-semibold">Tool ideas</h2>
          <p className="mt-1 text-sm text-glow-muted">Tell us what would make your routine easier.</p>
        </div>
      </div>

      <div className="mt-8">
        <ContactForm />
      </div>

      <p className="mt-6 text-sm text-glow-muted">
        Please do not include sensitive personal or medical information in your message.
      </p>
    </main>
  );
}
