"use client";

import { useState } from "react";
import { hslToHex, readableText } from "@/lib/color";
import { copyText } from "@/lib/util";
import Note from "./Note";

const HUE_NAMES = ["Red", "Orange", "Yellow", "Lime", "Green", "Mint", "Aqua", "Sky", "Blue", "Violet", "Magenta", "Rose"];
const TONES = [
  { name: "Bold", s: 75, l: 50 },
  { name: "Pastel", s: 70, l: 82 },
  { name: "Deep", s: 60, l: 32 },
  { name: "Muted", s: 30, l: 55 },
];

const SCHEMES: { name: string; offsets: number[]; tip: string }[] = [
  { name: "Complementary", offsets: [0, 180], tip: "High energy. Pair a top in one color with trousers or a skirt in its opposite." },
  { name: "Analogous", offsets: [-30, 0, 30], tip: "Soft and harmonious. Layer neighboring shades from head to toe." },
  { name: "Triadic", offsets: [0, 120, 240], tip: "Playful. Let one color star and use the other two as accents like bag and shoes." },
  { name: "Split-complementary", offsets: [0, 150, 210], tip: "Bold but balanced, and easier to wear than a straight complement." },
  { name: "Tetradic", offsets: [0, 90, 180, 270], tip: "Maximalist. Keep one dominant color and use the others in small doses." },
];

const R_OUT = 96;
const R_IN = 50;
const pt = (deg: number, r: number) => {
  const a = (deg * Math.PI) / 180;
  return `${(r * Math.sin(a)).toFixed(2)} ${(-r * Math.cos(a)).toFixed(2)}`;
};

export default function ColorBlockingGuide() {
  const [hue, setHue] = useState(0);
  const [tone, setTone] = useState(0);
  const [copied, setCopied] = useState<string | null>(null);
  const t = TONES[tone];

  return (
    <div className="space-y-8">
      <div className="grid items-center gap-8 md:grid-cols-[18rem_1fr]">
        <div className="mx-auto w-72">
          <svg viewBox="-100 -100 200 200" className="h-72 w-72" role="group" aria-label="Color wheel">
            {HUE_NAMES.map((name, i) => {
              const a0 = i * 30 - 15;
              const a1 = a0 + 30;
              const selected = hue === i * 30;
              return (
                <path
                  key={name}
                  d={`M${pt(a0, R_IN)} L${pt(a0, R_OUT)} A${R_OUT} ${R_OUT} 0 0 1 ${pt(a1, R_OUT)} L${pt(a1, R_IN)} A${R_IN} ${R_IN} 0 0 0 ${pt(a0, R_IN)} Z`}
                  fill={hslToHex(i * 30, t.s, t.l)}
                  stroke={selected ? "#3b3447" : "#fff"}
                  strokeWidth={selected ? 3 : 1.5}
                  className="cursor-pointer transition hover:opacity-80"
                  tabIndex={0}
                  role="button"
                  aria-label={`${name} ${tone === 0 ? "" : TONES[tone].name}`}
                  aria-pressed={selected}
                  onClick={() => setHue(i * 30)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setHue(i * 30); } }}
                />
              );
            })}
            <circle r={R_IN - 6} fill={hslToHex(hue, t.s, t.l)} />
            <text textAnchor="middle" y="3" fontSize="9" fontWeight="700" fill={readableText(hslToHex(hue, t.s, t.l))}>{HUE_NAMES[hue / 30]}</text>
          </svg>
        </div>
        <div className="space-y-4">
          <div>
            <p className="label">Tone</p>
            <div className="flex flex-wrap gap-2">
              {TONES.map((x, i) => (
                <button
                  key={x.name}
                  type="button"
                  aria-pressed={tone === i}
                  onClick={() => setTone(i)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${tone === i ? "bg-glow-pink shadow-soft" : "bg-glow-bg text-glow-muted hover:bg-glow-peach/60"}`}
                >
                  {x.name}
                </button>
              ))}
            </div>
          </div>
          <p className="text-sm text-glow-muted">Tap a color on the wheel to choose your starting shade, then explore the combinations below. Tap any swatch to copy its code.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {SCHEMES.map((s) => (
          <div key={s.name} className="rounded-2xl border border-glow-peach p-4">
            <p className="font-semibold">{s.name}</p>
            <div className="mt-3 flex overflow-hidden rounded-xl">
              {s.offsets.map((o) => {
                const hex = hslToHex(hue + o, t.s, t.l);
                return (
                  <button
                    key={o}
                    type="button"
                    onClick={() => {
                      copyText(hex);
                      setCopied(hex);
                      setTimeout(() => setCopied(null), 1200);
                    }}
                    className="flex h-20 flex-1 items-end justify-center pb-1.5 text-[11px] font-medium"
                    style={{ background: hex, color: readableText(hex) }}
                    aria-label={`Copy ${hex}`}
                  >
                    {copied === hex ? "Copied" : hex}
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-sm text-glow-ink/80">{s.tip}</p>
          </div>
        ))}
      </div>
      <Note>Color blocking pairs solid, contrasting blocks of color. Balance a bold combination with neutrals like white, camel, or black, and repeat one shade in an accessory to tie the look together.</Note>
    </div>
  );
}
