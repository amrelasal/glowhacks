"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, Download, Heart, RefreshCw, Share2 } from "lucide-react";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { copyText, downloadCanvas } from "@/lib/util";
import { todayNum } from "@/lib/date";
import Note from "./Note";

const AFFIRMATIONS = [
  "I am allowed to take up space.", "My glow comes from within.", "I choose progress over perfection.", "I am worthy of rest and joy.",
  "I grow at my own beautiful pace.", "My skin, my body, my story. I love all of it.", "I attract kindness and good energy.", "Today I choose gentleness with myself.",
  "I am enough, exactly as I am.", "I trust the timing of my life.", "Small steps still move me forward.", "I deserve the love I give to others.",
  "I release what I cannot control.", "My dreams are valid and within reach.", "I am proud of how far I have come.", "Soft does not mean weak.",
  "I bloom in my own season.", "I make space for what lights me up.", "My voice matters and deserves to be heard.", "I am calm, confident, and capable.",
  "Every day is a fresh start.", "I treat myself like someone I love.", "I am becoming the person I want to be.", "Good things are on their way to me.",
  "I let go of comparison and celebrate my own journey.", "I am grateful for my body and all it does for me.", "I give myself permission to rest.", "I am creating a life I love.",
  "Mistakes help me grow.", "I choose peace over pressure.", "I am radiant, resilient, and ready.", "Joy is my natural state.",
  "I honor my boundaries.", "I am surrounded by love and support.", "My potential is limitless.", "I shine without dimming anyone else.",
  "I forgive myself and move forward lightly.", "I am proud to be me.", "Today is full of beautiful possibilities.", "I deserve good things, and I welcome them.",
];

const THEMES = [
  { name: "Blush", from: "#ffd1dc", to: "#fae3d9" },
  { name: "Sorbet", from: "#fae3d9", to: "#ffb6b9" },
  { name: "Mint", from: "#bbded6", to: "#e6f4f1" },
  { name: "Lilac", from: "#e0d4f7", to: "#ffd1dc" },
  { name: "Sky", from: "#cfe8f7", to: "#e6f4f1" },
  { name: "Butter", from: "#fff1b8", to: "#ffd6a5" },
];

function wrap(ctx: CanvasRenderingContext2D, text: string, maxW: number) {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = w; } else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

export default function DailyAffirmations() {
  const [idx, setIdx] = useState<number | null>(null);
  const [themeIdx, setThemeIdx] = useState(0);
  const [favs, setFavs, loaded] = useLocalStorage<{ items: string[] }>("glowhacks:affirmations", { items: [] });
  const [copied, setCopied] = useState(false);
  const canShare = useRef(false);

  useEffect(() => {
    setIdx(todayNum() % AFFIRMATIONS.length);
    canShare.current = typeof navigator !== "undefined" && "share" in navigator;
  }, []);

  if (idx === null || !loaded) return <div className="h-80 animate-pulse rounded-2xl bg-glow-peach/40" aria-label="Loading" />;

  const text = AFFIRMATIONS[idx];
  const theme = THEMES[themeIdx];
  const isFav = favs.items.includes(text);

  const next = () => {
    let n = idx;
    while (n === idx) n = Math.floor(Math.random() * AFFIRMATIONS.length);
    setIdx(n);
  };

  const saveImage = () => {
    const W = 1080, H = 1350;
    const canvas = document.createElement("canvas");
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext("2d")!;
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, theme.from); g.addColorStop(1, theme.to);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#3b3447";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.font = "600 76px ui-rounded, system-ui, sans-serif";
    const lines = wrap(ctx, text, W - 240);
    const lh = 104;
    const top = H / 2 - ((lines.length - 1) * lh) / 2;
    lines.forEach((l, i) => ctx.fillText(l, W / 2, top + i * lh));
    ctx.font = "500 34px ui-rounded, system-ui, sans-serif";
    ctx.globalAlpha = 0.55;
    ctx.fillText("✧ GlowHacks ✧", W / 2, H - 100);
    downloadCanvas(canvas, "glowhacks-affirmation.png");
  };

  return (
    <div className="grid items-start gap-8 md:grid-cols-2">
      <div
        className="flex aspect-[4/5] flex-col items-center justify-center rounded-3xl p-8 text-center shadow-lift"
        style={{ background: `linear-gradient(135deg, ${theme.from}, ${theme.to})` }}
      >
        <p className="text-2xl font-semibold leading-snug sm:text-3xl" aria-live="polite">{text}</p>
        <p className="mt-8 text-xs font-medium opacity-50">✧ GlowHacks ✧</p>
      </div>

      <div className="space-y-5">
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-primary" onClick={next}><RefreshCw className="h-4 w-4" aria-hidden /> New affirmation</button>
          <button type="button" className={isFav ? "btn-mint" : "btn-ghost"} aria-pressed={isFav} onClick={() => setFavs((p) => ({ items: isFav ? p.items.filter((x) => x !== text) : [...p.items, text] }))}>
            <Heart className={`h-4 w-4 ${isFav ? "fill-current" : ""}`} aria-hidden /> {isFav ? "Saved" : "Save"}
          </button>
          <button type="button" className="btn-soft" onClick={() => { copyText(text); setCopied(true); setTimeout(() => setCopied(false), 1200); }}>
            {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />} {copied ? "Copied" : "Copy"}
          </button>
          <button type="button" className="btn-soft" onClick={saveImage}><Download className="h-4 w-4" aria-hidden /> Save image</button>
          {canShare.current && (
            <button type="button" className="btn-ghost" onClick={() => navigator.share({ text }).catch(() => undefined)}><Share2 className="h-4 w-4" aria-hidden /> Share</button>
          )}
        </div>

        <div>
          <p className="label">Background</p>
          <div className="flex flex-wrap gap-2">
            {THEMES.map((t, i) => (
              <button key={t.name} type="button" aria-label={t.name} aria-pressed={themeIdx === i} onClick={() => setThemeIdx(i)}
                className={`h-10 w-10 rounded-full border-2 ${themeIdx === i ? "border-glow-ink" : "border-white"} shadow`} style={{ background: `linear-gradient(135deg, ${t.from}, ${t.to})` }} />
            ))}
          </div>
        </div>

        {favs.items.length > 0 && (
          <div>
            <p className="label">Your saved affirmations</p>
            <ul className="space-y-2">
              {favs.items.map((f) => (
                <li key={f} className="flex items-center justify-between gap-2 rounded-xl bg-glow-bg px-3 py-2 text-sm">
                  <button type="button" className="flex-1 text-left" onClick={() => { const i = AFFIRMATIONS.indexOf(f); if (i >= 0) setIdx(i); }}>{f}</button>
                  <button type="button" aria-label="Remove from saved" onClick={() => setFavs((p) => ({ items: p.items.filter((x) => x !== f) }))} className="text-glow-muted hover:text-glow-ink"><Heart className="h-4 w-4 fill-current" aria-hidden /></button>
                </li>
              ))}
            </ul>
          </div>
        )}
        <Note>Today&apos;s affirmation changes every day. Say it out loud or write it down. Your saved favorites stay in this browser.</Note>
      </div>
    </div>
  );
}
