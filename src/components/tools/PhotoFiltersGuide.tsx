/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Copy, ImagePlus, RotateCcw } from "lucide-react";
import { copyText } from "@/lib/util";
import Note from "./Note";

interface F { brightness: number; contrast: number; saturate: number; sepia: number; grayscale: number; hue: number; blur: number }
const BASE: F = { brightness: 100, contrast: 100, saturate: 100, sepia: 0, grayscale: 0, hue: 0, blur: 0 };

const PRESETS: { name: string; use: string; f: Partial<F> }[] = [
  { name: "Original", use: "No filter applied.", f: {} },
  { name: "Warm glow", use: "Golden hour feel for selfies and sunsets.", f: { brightness: 108, contrast: 95, saturate: 120, sepia: 25, hue: -8 } },
  { name: "Cool breeze", use: "Fresh and airy for sky, water, and minimal looks.", f: { brightness: 105, contrast: 100, saturate: 90, hue: 12 } },
  { name: "Vintage", use: "Soft nostalgic film look.", f: { brightness: 105, contrast: 90, saturate: 85, sepia: 45 } },
  { name: "Faded film", use: "Low contrast, dreamy tones.", f: { brightness: 112, contrast: 80, saturate: 80 } },
  { name: "Vivid", use: "Punchy colors for food and travel.", f: { contrast: 115, saturate: 150 } },
  { name: "Noir", use: "Dramatic black and white portraits.", f: { contrast: 125, grayscale: 100, brightness: 95 } },
  { name: "Dreamy", use: "Soft glow for pastel aesthetics.", f: { brightness: 112, contrast: 90, saturate: 110, blur: 1 } },
];

const SLIDERS: { key: keyof F; label: string; min: number; max: number; unit: string; note: string }[] = [
  { key: "brightness", label: "Brightness", min: 50, max: 150, unit: "%", note: "Lightens or darkens the whole photo." },
  { key: "contrast", label: "Contrast", min: 50, max: 150, unit: "%", note: "Separates lights from darks." },
  { key: "saturate", label: "Saturation", min: 0, max: 200, unit: "%", note: "Strength of the colors." },
  { key: "sepia", label: "Sepia", min: 0, max: 100, unit: "%", note: "Adds a warm brown vintage tint." },
  { key: "grayscale", label: "Grayscale", min: 0, max: 100, unit: "%", note: "Removes color." },
  { key: "hue", label: "Hue shift", min: -180, max: 180, unit: "deg", note: "Rotates every color around the wheel." },
  { key: "blur", label: "Blur", min: 0, max: 6, unit: "px", note: "Softens detail for a dreamy look." },
];

function toCss(f: F) {
  const parts: string[] = [];
  if (f.brightness !== 100) parts.push(`brightness(${f.brightness}%)`);
  if (f.contrast !== 100) parts.push(`contrast(${f.contrast}%)`);
  if (f.saturate !== 100) parts.push(`saturate(${f.saturate}%)`);
  if (f.sepia) parts.push(`sepia(${f.sepia}%)`);
  if (f.grayscale) parts.push(`grayscale(${f.grayscale}%)`);
  if (f.hue) parts.push(`hue-rotate(${f.hue}deg)`);
  if (f.blur) parts.push(`blur(${f.blur}px)`);
  return parts.join(" ") || "none";
}

export default function PhotoFiltersGuide() {
  const [f, setF] = useState<F>(BASE);
  const [preset, setPreset] = useState("Original");
  const [photo, setPhoto] = useState<string | null>(null);
  const [showOriginal, setShowOriginal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => () => { if (photo) URL.revokeObjectURL(photo); }, [photo]);

  const css = useMemo(() => toCss(f), [f]);
  const current = PRESETS.find((p) => p.name === preset);

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="space-y-4">
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-glow-bg">
          <div className="h-full w-full" style={{ filter: showOriginal ? "none" : css, transition: "filter .25s" }}>
            {photo ? (
              <img src={photo} alt="Your photo with the filter applied" className="h-full w-full object-cover" />
            ) : (
              <div className="relative h-full w-full" style={{ background: "linear-gradient(160deg,#ffd1dc 0%,#ffe9c7 45%,#bfe8dc 100%)" }} aria-label="Sample image">
                <span className="absolute left-[12%] top-[10%] h-24 w-24 rounded-full bg-[#ff9aa2]" />
                <span className="absolute right-[10%] top-[28%] h-32 w-32 rounded-full bg-[#a6d8ff]" />
                <span className="absolute bottom-[14%] left-[22%] h-28 w-28 rounded-full bg-[#ffe066]" />
                <span className="absolute bottom-[8%] right-[14%] h-16 w-16 rounded-full bg-[#7bc4a6]" />
                <span className="absolute left-[40%] top-[44%] h-20 w-20 rounded-full bg-[#c3a6ff]" />
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <label className="btn-soft cursor-pointer">
            <ImagePlus className="h-4 w-4" aria-hidden /> Use my photo
            <input type="file" accept="image/*" className="sr-only" onChange={(e) => { const file = e.target.files?.[0]; if (file) setPhoto(URL.createObjectURL(file)); }} />
          </label>
          <button
            type="button"
            className="btn-ghost select-none"
            onPointerDown={() => setShowOriginal(true)}
            onPointerUp={() => setShowOriginal(false)}
            onPointerLeave={() => setShowOriginal(false)}
          >
            Hold to compare
          </button>
          <button type="button" className="btn-ghost" onClick={() => { setF(BASE); setPreset("Original"); }}>
            <RotateCcw className="h-4 w-4" aria-hidden /> Reset
          </button>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <p className="label">Presets</p>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.name}
                type="button"
                aria-pressed={preset === p.name}
                onClick={() => { setPreset(p.name); setF({ ...BASE, ...p.f }); }}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${preset === p.name ? "bg-glow-pink shadow-soft" : "bg-glow-bg text-glow-muted hover:bg-glow-peach/60"}`}
              >
                {p.name}
              </button>
            ))}
          </div>
          {current && <p className="mt-2 text-xs text-glow-muted">{current.use}</p>}
        </div>

        <div className="space-y-3">
          {SLIDERS.map((s) => (
            <div key={s.key}>
              <label htmlFor={s.key} className="flex justify-between text-sm font-medium">
                <span>{s.label}</span>
                <span className="tabular-nums text-glow-muted">{f[s.key]}{s.unit}</span>
              </label>
              <input
                id={s.key}
                type="range"
                min={s.min}
                max={s.max}
                step={s.key === "blur" ? 0.5 : 1}
                value={f[s.key]}
                onChange={(e) => { setPreset("Custom"); setF((p) => ({ ...p, [s.key]: Number(e.target.value) })); }}
                className="w-full accent-[#ffb6b9]"
                aria-describedby={`${s.key}-note`}
              />
              <p id={`${s.key}-note`} className="text-xs text-glow-muted">{s.note}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-glow-bg p-4">
          <p className="mb-1 text-xs font-semibold">CSS filter</p>
          <code className="block break-words text-xs">filter: {css};</code>
          <button type="button" className="btn-soft mt-3 px-4 py-1.5" onClick={() => { copyText(`filter: ${css};`); setCopied(true); setTimeout(() => setCopied(false), 1200); }}>
            {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />} {copied ? "Copied" : "Copy CSS"}
          </button>
        </div>
      </div>
      <div className="md:col-span-2">
        <Note>This simulator shows how filter settings look using CSS. Your photo is displayed on your device only and is never uploaded. Use these values as a recipe when editing in your favorite photo app.</Note>
      </div>
    </div>
  );
}
