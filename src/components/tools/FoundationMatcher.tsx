"use client";

import { useMemo, useState } from "react";
import { hexToRgb, isHex, mixHex, normHex, readableText, rgbToLab } from "@/lib/color";
import { copyText } from "@/lib/util";
import Note from "./Note";

const PRESETS = ["#f8dcc8", "#f1c9a8", "#e8b894", "#d9a577", "#c68b5c", "#a8714a", "#8a5a3c", "#6b432d", "#4e3022", "#3a2419"];

function analyse(hex: string) {
  const [r, g, b] = hexToRgb(hex);
  const [L, a, bb] = rgbToLab(r, g, b);
  const depthNames = ["Fair", "Light", "Light-medium", "Medium", "Tan", "Deep", "Rich"];
  const depthIdx = L >= 80 ? 0 : L >= 72 ? 1 : L >= 64 ? 2 : L >= 55 ? 3 : L >= 45 ? 4 : L >= 35 ? 5 : 6;
  const hue = (Math.atan2(bb, a) * 180) / Math.PI;
  let undertone: { name: string; code: string; tip: string };
  if (hue >= 66 && a < 9) {
    undertone = { name: "Olive", code: "O", tip: "Look for shades labeled olive or neutral-warm with a hint of green or gold. Avoid very pink bases, which can look ashy." };
  } else if (hue < 52) {
    undertone = { name: "Cool", code: "C", tip: "Look for shades labeled cool, rosy, or pink. They keep skin looking fresh instead of yellow." };
  } else if (hue < 62) {
    undertone = { name: "Neutral", code: "N", tip: "You can wear most ranges. Look for shades labeled neutral, or choose between a cool and warm option based on how it looks along the jaw." };
  } else {
    undertone = { name: "Warm", code: "W", tip: "Look for shades labeled warm, golden, or yellow. They blend into skin with a natural glow." };
  }
  return { depthName: depthNames[depthIdx], depthNum: depthIdx + 1, undertone, L };
}

export default function FoundationMatcher() {
  const [text, setText] = useState("#e8b894");
  const valid = isHex(text);
  const hex = valid ? normHex(text) : "#e8b894";
  const res = useMemo(() => analyse(hex), [hex]);
  const [copied, setCopied] = useState<string | null>(null);

  const swatches = [
    { label: "Highlight (a bit lighter)", color: mixHex(hex, "#ffffff", 0.14) },
    { label: "Your match", color: hex },
    { label: "Contour (a bit deeper)", color: mixHex(mixHex(hex, "#8a4b2a", 0.12), "#000000", 0.1) },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label htmlFor="skin" className="label">Skin tone hex code</label>
            <div className="flex gap-2">
              <input
                type="color"
                aria-label="Pick a skin tone"
                value={hex}
                onChange={(e) => setText(e.target.value)}
                className="h-11 w-14 cursor-pointer rounded-xl border border-glow-peach bg-white p-1"
              />
              <input id="skin" className="input" value={text} onChange={(e) => setText(e.target.value)} placeholder="#e8b894" spellCheck={false} />
            </div>
            {!valid && <p className="mt-1 text-xs text-rose-600">Enter a valid hex code like #e8b894 or #eb9.</p>}
          </div>
          <div>
            <p className="label">Or pick the closest tone</p>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setText(c)}
                  aria-label={`Use ${c}`}
                  className={`h-9 w-9 rounded-full border-2 transition ${hex === c ? "border-glow-ink scale-110" : "border-white"} shadow-sm`}
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-3xl p-5 text-center" style={{ background: hex, color: readableText(hex) }}>
          <p className="text-sm opacity-80">Your estimated shade</p>
          <p className="mt-1 text-3xl font-bold">{res.depthNum}{res.undertone.code}</p>
          <p className="mt-1 text-sm font-medium">{res.depthName} · {res.undertone.name} undertone</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {swatches.map((s) => (
          <button
            key={s.label}
            type="button"
            onClick={() => {
              copyText(s.color);
              setCopied(s.color);
              setTimeout(() => setCopied(null), 1200);
            }}
            className="rounded-2xl border border-glow-peach p-3 text-left transition hover:shadow-soft"
          >
            <span className="block h-16 rounded-xl" style={{ background: s.color }} />
            <span className="mt-2 block text-xs text-glow-muted">{s.label}</span>
            <span className="block text-sm font-semibold">{copied === s.color ? "Copied!" : s.color}</span>
          </button>
        ))}
      </div>

      <div className="rounded-2xl bg-glow-peach/40 p-5 text-sm leading-relaxed">
        <p className="font-semibold">How to shop for it</p>
        <p className="mt-1">{res.undertone.tip}</p>
        <p className="mt-2">
          Brands number their shades differently, so use <strong>{res.depthName.toLowerCase()}</strong> depth and{" "}
          <strong>{res.undertone.name.toLowerCase()}</strong> undertone as your search words, then swatch along the jawline in daylight.
        </p>
      </div>

      <Note>
        This is an estimate from a single color. Phone cameras and screens change color, so for best results sample your skin from a photo taken in natural daylight with no filters.
      </Note>
    </div>
  );
}
