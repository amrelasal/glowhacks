import Link from "next/link";
import { Lock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-glow-peach/70 bg-white/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-lg font-bold">GlowHacks</p>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-glow-muted">
            <Lock className="h-3.5 w-3.5" aria-hidden />
            100% client-side. Your data stays on your device.
          </p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-glow-muted">
          <Link href="/about" className="hover:text-glow-ink">About Us</Link>
          <Link href="/contact" className="hover:text-glow-ink">Contact Us</Link>
          <Link href="/privacy" className="hover:text-glow-ink">Privacy Policy</Link>
        </nav>
      </div>
      <p className="pb-8 text-center text-xs text-glow-muted">
        © {new Date().getFullYear()} GlowHacks. All rights reserved.
      </p>
    </footer>
  );
}
