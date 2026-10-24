import Link from "next/link";
import { Sparkles } from "lucide-react";

const links = [
  { href: "/#tools", label: "Tools" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-glow-peach/60 bg-glow-bg/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-glow-pink">
            <Sparkles className="h-5 w-5" aria-hidden />
          </span>
          GlowHacks
        </Link>
        <nav aria-label="Main" className="flex items-center gap-1 text-sm font-medium sm:gap-2">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full px-3 py-1.5 text-glow-muted transition hover:bg-glow-peach/60 hover:text-glow-ink"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
