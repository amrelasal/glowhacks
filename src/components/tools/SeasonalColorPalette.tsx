"use client";

import { useState } from "react";
import { copyText } from "@/lib/util";
import { readableText } from "@/lib/color";
import Note from "./Note";

type Season = "Spring" | "Summer" | "Autumn" | "Winter";

const SEASONS: Record<Season, { desc: string; colors: [string, string][]; avoid: string[]; metals: string; makeup: string }> = {
  Spring: {
    desc: "Warm, fresh and clear. Your best colors look sunny and bright.",
    colors: [["Coral", "#ff7f6b"], ["Peach", "#ffb88c"], ["Buttercup", "#ffd66b"], ["Fresh green", "#9bd36a"], ["Turquoise", "#3fc1b8"], ["Warm pink", "#ff8fa3"], ["Camel", "#d9a574"], ["Ivory", "#fff4d6"]],
    avoid: ["Stark black", "Cool grey", "Dusty mauve", "Deep burgundy"],
    metals: "Gold and light yellow gold",
    makeup: "Peach blush, coral lips, golden bronzer",
  },
  Summer: {
    desc: "Cool, soft and muted. Your best colors look gentle and dusty.",
    colors: [["Soft rose", "#e79bb0"], ["Lavender", "#b7a6d9"], ["Powder blue", "#9cc3e6"], ["Sage", "#a9c4a6"], ["Dusty mauve", "#b78aa0"], ["Cool grey", "#aeb6c1"], ["Raspberry", "#c8567c"], ["Soft white", "#f4f1f7"]],
    avoid: ["Orange", "Mustard", "Warm brown", "Pure black"],
    metals: "Silver, white gold and rose gold",
    makeup: "Rosy blush, berry lips, taupe eyeshadow",
  },
  Autumn: {
    desc: "Warm, rich and earthy. Your best colors look golden and deep.",
    colors: [["Terracotta", "#c8643c"], ["Mustard", "#d9a21b"], ["Olive", "#7a7a2e"], ["Rust", "#b5482a"], ["Forest", "#2f5d3a"], ["Warm brown", "#7a4a2b"], ["Teal", "#1f7a7a"], ["Cream", "#f3e3c3"]],
    avoid: ["Icy pastels", "Fuchsia", "Stark white", "Silver grey"],
    metals: "Gold, copper and bronze",
    makeup: "Bronze eyeshadow, brick or terracotta lips, warm blush",
  },
  Winter: {
    desc: "Cool, deep and high contrast. Your best colors look crisp and bold.",
    colors: [["Black", "#1a1a1f"], ["Royal blue", "#2f4bd6"], ["Emerald", "#0f9d6a"], ["Fuchsia", "#d4237a"], ["Icy pink", "#f4c2d7"], ["True red", "#c8102e"], ["Charcoal", "#3c3f4a"], ["Deep purple", "#5b2a86"]],
    avoid: ["Orange", "Beige", "Mustard", "Warm brown"],
    metals: "Silver, platinum and white gold",
    makeup: "Cool red lips, smoky charcoal eyes, icy highlighter",
  },
};

type Pick = "cool" | "warm" | "neutral" | null;

function Choice<T extends string>({ label, hint, value, options, onChange }: { label: string; hint: string; value: T | null; options: { id: T; text: string }[]; onChange: (v: T) => void }) {
  return (
    <div>
      <p className="label">{label}</p>
      <p className="-mt-1 mb-2 text-xs text-glow-muted">{hint}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            aria-pressed={value === o.id}
            onClick={() => onChange(o.id)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${value === o.id ? "bg-glow-pink shadow-soft" : "bg-glow-bg text-glow-muted hover:bg-glow-peach/60"}`}
          >
            {o.text}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function SeasonalColorPalette() {
  const [under, setUnder] = useState<Pick>(null);
  const [depth, setDepth] = useState<"light" | "deep" | null>(null);
  const [feat, setFeat] = useState<"soft" | "bright" | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  let season: Season | null = null;
  if (under && depth && (under !== "neutral" || feat)) {
    if (under === "warm") season = depth === "light" ? "Spring" : "Autumn";
    else if (under === "cool") season = depth === "light" ? "Summer" : "Winter";
    else if (depth === "light") season = feat === "soft" ? "Summer" : "Spring";
    else season = feat === "soft" ? "Autumn" : "Winter";
  }
  const data = season ? SEASONS[season] : null;

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <Choice
          label="Your skin undertone"
          hint="Blue or purple veins and silver jewelry flattering = cool. Green veins and gold flattering = warm. Mixed = neutral."
          value={under}
          onChange={setUnder}
          options={[{ id: "cool", text: "Cool" }, { id: "warm", text: "Warm" }, { id: "neutral", text: "Neutral" }]}
        />
        <Choice
          label="Your overall depth"
          hint="Think about your natural hair, eyes and skin together."
          value={depth}
          onChange={setDepth}
          options={[{ id: "light", text: "Light" }, { id: "deep", text: "Medium to deep" }]}
        />
        {under === "neutral" && (
          <Choice
            label="Your natural features look"
            hint="Soft and blended, or clear and high contrast?"
            value={feat}
            onChange={setFeat}
            options={[{ id: "soft", text: "Soft and muted" }, { id: "bright", text: "Clear and bright" }]}
          />
        )}
      </div>

      {data && season ? (
        <div className="space-y-5">
          <div className="rounded-3xl bg-gradient-to-br from-glow-pink/30 to-glow-peach/50 p-6">
            <p className="text-sm text-glow-muted">Your season</p>
            <h3 className="text-3xl font-bold">{season}</h3>
            <p className="mt-1 text-sm">{data.desc}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {data.colors.map(([name, hex]) => (
              <button
                key={hex}
                type="button"
                onClick={() => {
                  copyText(hex);
                  setCopied(hex);
                  setTimeout(() => setCopied(null), 1200);
                }}
                className="flex h-24 flex-col justify-end rounded-2xl border border-glow-peach p-3 text-left text-xs font-medium shadow-sm transition hover:-translate-y-0.5"
                style={{ background: hex, color: readableText(hex) }}
              >
                <span className="text-sm font-semibold">{name}</span>
                {copied === hex ? "Copied!" : hex}
              </button>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-glow-pink/20 p-4 text-sm"><p className="font-semibold">Go lighter on</p><p className="mt-1 text-glow-ink/80">{data.avoid.join(", ")}</p></div>
            <div className="rounded-2xl bg-glow-peach/50 p-4 text-sm"><p className="font-semibold">Best metals</p><p className="mt-1 text-glow-ink/80">{data.metals}</p></div>
            <div className="rounded-2xl bg-glow-mint/40 p-4 text-sm"><p className="font-semibold">Makeup ideas</p><p className="mt-1 text-glow-ink/80">{data.makeup}</p></div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-glow-peach/40 p-5 text-sm text-glow-muted">Choose an option in each group above to reveal your palette.</div>
      )}
      <Note>Seasonal color analysis is a fun styling guide, not a rule. Wear any color you love, and use your palette to find the shades that make your skin glow.</Note>
    </div>
  );
}
