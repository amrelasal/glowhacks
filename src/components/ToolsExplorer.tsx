"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import ToolCard from "./ToolCard";
import { categories, tools } from "@/lib/toolsData";

export default function ToolsExplorer() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tools.filter(
      (t) =>
        (category === "All" || t.category === category) &&
        (!q || t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))
    );
  }, [query, category]);

  return (
    <section id="tools" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-14">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-bold sm:text-3xl">All 30 tools</h2>
          <p className="mt-1 text-glow-muted">Pick one and start glowing.</p>
        </div>
        <label className="relative block w-full md:w-72">
          <span className="sr-only">Search tools</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-glow-muted" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools..."
            className="input pl-10"
          />
        </label>
      </div>

      <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        {["All", ...categories].map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            aria-pressed={category === c}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              category === c ? "bg-glow-pink text-glow-ink shadow-soft" : "bg-white text-glow-muted hover:bg-glow-peach/60"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered.length ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((t) => (
            <ToolCard key={t.slug} tool={t} />
          ))}
        </div>
      ) : (
        <p className="mt-12 text-center text-glow-muted">
          No tools match your search. Try a different word or choose another category.
        </p>
      )}
    </section>
  );
}
