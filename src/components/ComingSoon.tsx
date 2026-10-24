import Link from "next/link";
import { ArrowLeft, Hourglass } from "lucide-react";
import ToolIcon from "./ToolIcon";
import type { Tool } from "@/lib/toolsData";

export default function ComingSoon({ tool }: { tool: Tool }) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-glow-peach via-white to-glow-mint/50 px-6 py-14 text-center">
      <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-glow-pink/40 blur-2xl" aria-hidden />
      <div className="pointer-events-none absolute -bottom-12 -right-8 h-44 w-44 rounded-full bg-glow-mint/60 blur-2xl" aria-hidden />
      <div className="relative">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-soft">
          <ToolIcon name={tool.icon} className="h-9 w-9" />
        </span>
        <p className="mx-auto mt-5 flex w-fit items-center gap-2 rounded-full bg-white/80 px-4 py-1.5 text-sm font-semibold">
          <Hourglass className="h-4 w-4" aria-hidden /> Coming soon
        </p>
        <h2 className="mt-4 text-2xl font-bold">The {tool.name} is almost ready</h2>
        <p className="mx-auto mt-2 max-w-md text-glow-muted">
          We are polishing this tool right now. In the meantime, try one of the live tools below.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/tools/skincare-checker" className="btn-primary">Skincare Checker</Link>
          <Link href="/tools/water-tracker" className="btn-mint">Water Tracker</Link>
          <Link href="/tools/period-calculator" className="btn-soft">Period Calculator</Link>
        </div>
        <Link href="/#tools" className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-glow-muted hover:text-glow-ink">
          <ArrowLeft className="h-4 w-4" aria-hidden /> Back to all tools
        </Link>
      </div>
    </div>
  );
}
