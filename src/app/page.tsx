import Link from "next/link";
import { Lock, ShieldCheck, Sparkles, WandSparkles } from "lucide-react";
import ToolsExplorer from "@/components/ToolsExplorer";

export default function HomePage() {
  return (
    <main>
      <section className="relative overflow-hidden bg-gradient-to-br from-glow-pink/40 via-glow-peach/60 to-glow-mint/40">
        <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-glow-pink/40 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -bottom-20 right-0 h-72 w-72 rounded-full bg-glow-mint/50 blur-3xl" aria-hidden />
        <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:py-28">
          <p className="mx-auto mb-5 flex w-fit items-center gap-2 rounded-full bg-white/70 px-4 py-1.5 text-sm font-medium">
            <Sparkles className="h-4 w-4" aria-hidden /> Free tools for skincare, style &amp; wellness
          </p>
          <h1 className="text-4xl font-bold leading-tight sm:text-6xl">
            Small hacks, <br className="hidden sm:block" />
            big glow.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-glow-ink/80">
            30 pretty, practical tools for your skin, wardrobe, feed, health, and everyday life. No sign-up. No
            tracking. Everything runs privately in your browser.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/#tools" className="btn-primary px-7 py-3 text-base shadow-soft">
              <WandSparkles className="h-4 w-4" aria-hidden /> Browse tools
            </Link>
            <Link href="/about" className="btn-ghost px-7 py-3 text-base">
              About GlowHacks
            </Link>
          </div>
          <ul className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm font-medium text-glow-ink/80">
            <li className="flex items-center gap-2"><Lock className="h-4 w-4" aria-hidden /> 100% client-side</li>
            <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" aria-hidden /> No account needed</li>
            <li className="flex items-center gap-2"><Sparkles className="h-4 w-4" aria-hidden /> Always free</li>
          </ul>
        </div>
      </section>

      <ToolsExplorer />
    </main>
  );
}
