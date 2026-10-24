"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Shuffle } from "lucide-react";
import { downloadCanvas } from "@/lib/util";
import Note from "./Note";

const DEVICES = {
  phone: { label: "Phone", w: 1080, h: 1920 },
  tablet: { label: "Tablet", w: 1620, h: 2160 },
  desktop: { label: "Desktop", w: 1920, h: 1080 },
} as const;

type Layout = "grid" | "brick" | "scatter";

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function splitEmojis(text: string): string[] {
  const Seg = (Intl as unknown as { Segmenter?: new (l?: string, o?: { granularity: string }) => { segment: (s: string) => Iterable<{ segment: string }> } }).Segmenter;
  const parts = Seg ? Array.from(new Seg(undefined, { granularity: "grapheme" }).segment(text), (s) => s.segment) : Array.from(text);
  return parts.filter((p) => p.trim() && p !== ",");
}

export default function WallpaperMaker() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [emojis, setEmojis] = useState("🌸 ✨ 🍓 🎀");
  const [c1, setC1] = useState("#ffd6e0");
  const [c2, setC2] = useState("#fff1e6");
  const [mode, setMode] = useState<"solid" | "gradient">("gradient");
  const [device, setDevice] = useState<keyof typeof DEVICES>("phone");
  const [layout, setLayout] = useState<Layout>("brick");
  const [size, setSize] = useState(90);
  const [gap, setGap] = useState(50);
  const [tilt, setTilt] = useState(12);
  const [seed, setSeed] = useState(7);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { w, h } = DEVICES[device];
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (mode === "gradient") {
      const g = ctx.createLinearGradient(0, 0, w * 0.6, h);
      g.addColorStop(0, c1);
      g.addColorStop(1, c2);
      ctx.fillStyle = g;
    } else {
      ctx.fillStyle = c1;
    }
    ctx.fillRect(0, 0, w, h);

    const list = splitEmojis(emojis);
    if (!list.length) return;
    const rand = rng(seed);
    const step = size + gap;
    ctx.font = `${size}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const draw = (x: number, y: number, i: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((((rand() * 2 - 1) * tilt) * Math.PI) / 180);
      ctx.fillText(list[i % list.length], 0, 0);
      ctx.restore();
    };

    if (layout === "scatter") {
      const count = Math.round((w * h) / (step * step) * 1.1);
      for (let i = 0; i < count; i++) draw(rand() * w, rand() * h, i);
    } else {
      let i = 0;
      for (let row = -1, y = step / 2; y < h + step; row++, y += step) {
        const offset = layout === "brick" && row % 2 !== 0 ? step / 2 : 0;
        for (let x = step / 2 - offset; x < w + step; x += step) draw(x, y, i++);
      }
    }
  }, [emojis, c1, c2, mode, device, layout, size, gap, tilt, seed]);

  const { w, h } = DEVICES[device];

  return (
    <div className="grid gap-8 md:grid-cols-[1fr_18rem]">
      <div className="space-y-5 md:order-1">
        <div>
          <label htmlFor="emojis" className="label">Emojis (paste or type any)</label>
          <input id="emojis" className="input text-lg" value={emojis} onChange={(e) => setEmojis(e.target.value)} placeholder="🌸 ✨ 🍓" />
        </div>
        <div className="flex flex-wrap items-end gap-5">
          <div>
            <p className="label">Background</p>
            <div className="flex items-center gap-2">
              <input type="color" value={c1} onChange={(e) => setC1(e.target.value)} aria-label="Color 1" className="h-10 w-12 cursor-pointer rounded-xl border border-glow-peach bg-white p-1" />
              {mode === "gradient" && <input type="color" value={c2} onChange={(e) => setC2(e.target.value)} aria-label="Color 2" className="h-10 w-12 cursor-pointer rounded-xl border border-glow-peach bg-white p-1" />}
              <div className="flex overflow-hidden rounded-full border border-glow-peach text-sm">
                {(["solid", "gradient"] as const).map((m) => (
                  <button key={m} type="button" aria-pressed={mode === m} onClick={() => setMode(m)} className={`px-3.5 py-2 font-medium capitalize ${mode === m ? "bg-glow-pink" : "bg-white text-glow-muted"}`}>{m}</button>
                ))}
              </div>
            </div>
          </div>
          <div>
            <p className="label">Layout</p>
            <div className="flex overflow-hidden rounded-full border border-glow-peach text-sm">
              {(["grid", "brick", "scatter"] as const).map((l) => (
                <button key={l} type="button" aria-pressed={layout === l} onClick={() => setLayout(l)} className={`px-3.5 py-2 font-medium capitalize ${layout === l ? "bg-glow-pink" : "bg-white text-glow-muted"}`}>{l}</button>
              ))}
            </div>
          </div>
          <div>
            <p className="label">Device</p>
            <select className="input" value={device} onChange={(e) => setDevice(e.target.value as keyof typeof DEVICES)} aria-label="Device size">
              {Object.entries(DEVICES).map(([k, d]) => <option key={k} value={k}>{d.label} ({d.w}×{d.h})</option>)}
            </select>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {([["Emoji size", size, 40, 220, setSize], ["Spacing", gap, 0, 200, setGap], ["Tilt", tilt, 0, 45, setTilt]] as const).map(([label, val, min, max, set]) => (
            <div key={label}>
              <label className="label">{label}: <span className="font-semibold">{val}</span></label>
              <input type="range" min={min} max={max} value={val} onChange={(e) => set(Number(e.target.value))} className="w-full accent-[#ffb6b9]" />
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="button" className="btn-soft" onClick={() => setSeed(Math.floor(Math.random() * 100000))}><Shuffle className="h-4 w-4" aria-hidden /> Shuffle tilt and scatter</button>
          <button type="button" className="btn-primary" onClick={() => canvasRef.current && downloadCanvas(canvasRef.current, `glowhacks-wallpaper-${device}.png`)}>
            <Download className="h-4 w-4" aria-hidden /> Download PNG
          </button>
        </div>
        <Note>Emoji look different on each device, and the downloaded image uses your device&apos;s emoji style. Everything is created in your browser.</Note>
      </div>

      <div className="mx-auto w-full max-w-72 md:order-2">
        <canvas
          ref={canvasRef}
          className="w-full rounded-3xl border border-glow-peach shadow-lift"
          style={{ aspectRatio: `${w} / ${h}` }}
          aria-label="Wallpaper preview"
        />
      </div>
    </div>
  );
}
