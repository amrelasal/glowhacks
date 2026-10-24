/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef, useState } from "react";
import { Download, ImagePlus, Trash2, Type } from "lucide-react";
import { clamp, downloadCanvas, uid } from "@/lib/util";
import Note from "./Note";

type Kind = "color" | "emoji" | "text" | "image";
interface BItem {
  id: string;
  kind: Kind;
  x: number; // % of board width (center)
  y: number; // % of board height (center)
  scale: number;
  value: string;
  aspect?: number; // height / width for images
}

const COLOR_SIZE = 96;
const EMOJI_SIZE = 64;
const TEXT_SIZE = 22;
const IMAGE_W = 180;
const STICKERS = ["🌸", "✨", "🍓", "🎀", "🦋", "🌙", "☕", "🌿", "💌", "🫧", "🍑", "💗"];
const SWATCHES = ["#ffb6b9", "#fae3d9", "#bbded6", "#f9d5e5", "#d7d2f0", "#fff1b8"];

export default function MoodboardCreator() {
  const boardRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ id: string; ox: number; oy: number } | null>(null);
  const [items, setItems] = useState<BItem[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [bg, setBg] = useState("#fff8f3");
  const [color, setColor] = useState("#ffb6b9");
  const [text, setText] = useState("");

  const add = (partial: Omit<BItem, "id" | "x" | "y" | "scale">) => {
    const it: BItem = { id: uid(), x: 30 + Math.random() * 40, y: 30 + Math.random() * 40, scale: 1, ...partial };
    setItems((p) => [...p, it]);
    setSelected(it.id);
  };

  const update = (id: string, patch: Partial<BItem>) => setItems((p) => p.map((i) => (i.id === id ? { ...i, ...patch } : i)));

  const pct = (e: React.PointerEvent) => {
    const r = boardRef.current!.getBoundingClientRect();
    return { px: ((e.clientX - r.left) / r.width) * 100, py: ((e.clientY - r.top) / r.height) * 100 };
  };

  const onDown = (e: React.PointerEvent, it: BItem) => {
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    const { px, py } = pct(e);
    drag.current = { id: it.id, ox: it.x - px, oy: it.y - py };
    setSelected(it.id);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const { px, py } = pct(e);
    update(drag.current.id, { x: clamp(px + drag.current.ox, 0, 100), y: clamp(py + drag.current.oy, 0, 100) });
  };
  const onUp = () => { drag.current = null; };

  const addImages = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((f) => {
      const url = URL.createObjectURL(f);
      const img = new Image();
      img.onload = () => add({ kind: "image", value: url, aspect: img.naturalHeight / img.naturalWidth });
      img.src = url;
    });
  };

  const sel = items.find((i) => i.id === selected) ?? null;

  const exportPng = async () => {
    const board = boardRef.current;
    if (!board) return;
    const W = 1200, H = 900;
    const k = W / board.getBoundingClientRect().width;
    const canvas = document.createElement("canvas");
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    for (const it of items) {
      const cx = (it.x / 100) * W, cy = (it.y / 100) * H, s = it.scale * k;
      if (it.kind === "color") {
        const size = COLOR_SIZE * s;
        ctx.fillStyle = it.value;
        ctx.beginPath();
        ctx.roundRect(cx - size / 2, cy - size / 2, size, size, 14 * s);
        ctx.fill();
      } else if (it.kind === "emoji") {
        ctx.font = `${EMOJI_SIZE * s}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`;
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(it.value, cx, cy);
      } else if (it.kind === "text") {
        ctx.font = `600 ${TEXT_SIZE * s}px system-ui, sans-serif`;
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        const w = ctx.measureText(it.value).width + 20 * s;
        ctx.fillStyle = "rgba(255,255,255,0.75)";
        ctx.beginPath();
        ctx.roundRect(cx - w / 2, cy - 18 * s, w, 36 * s, 8 * s);
        ctx.fill();
        ctx.fillStyle = "#3b3447";
        ctx.fillText(it.value, cx, cy);
      } else {
        await new Promise<void>((res) => {
          const img = new Image();
          img.onload = () => {
            const w = IMAGE_W * s, h = w * (it.aspect ?? 1);
            ctx.save();
            ctx.beginPath();
            ctx.roundRect(cx - w / 2, cy - h / 2, w, h, 10 * s);
            ctx.clip();
            ctx.drawImage(img, cx - w / 2, cy - h / 2, w, h);
            ctx.restore();
            res();
          };
          img.onerror = () => res();
          img.src = it.value;
        });
      }
    }
    downloadCanvas(canvas, "glowhacks-moodboard.png");
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 rounded-full bg-glow-bg p-1.5">
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} aria-label="Pick a color" className="h-8 w-9 cursor-pointer rounded-full border-0 bg-transparent p-0" />
          <button type="button" className="btn-soft px-3 py-1.5" onClick={() => add({ kind: "color", value: color })}>Add color</button>
        </div>
        <div className="flex gap-1.5">
          {SWATCHES.map((c) => (
            <button key={c} type="button" aria-label={`Add ${c}`} onClick={() => add({ kind: "color", value: c })} className="h-8 w-8 rounded-full border-2 border-white shadow" style={{ background: c }} />
          ))}
        </div>
        <label className="btn-mint cursor-pointer">
          <ImagePlus className="h-4 w-4" aria-hidden /> Add images
          <input type="file" accept="image/*" multiple className="sr-only" onChange={(e) => { addImages(e.target.files); e.target.value = ""; }} />
        </label>
        <button type="button" className="btn-primary ml-auto" onClick={exportPng} disabled={!items.length}>
          <Download className="h-4 w-4" aria-hidden /> Download PNG
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {STICKERS.map((s) => (
          <button key={s} type="button" aria-label={`Add ${s}`} onClick={() => add({ kind: "emoji", value: s })} className="rounded-xl bg-glow-bg px-2.5 py-1.5 text-xl transition hover:bg-glow-peach">{s}</button>
        ))}
        <div className="ml-auto flex min-w-48 flex-1 gap-2 sm:flex-none">
          <input className="input" value={text} maxLength={40} placeholder="Add a caption" onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && text.trim()) { add({ kind: "text", value: text.trim() }); setText(""); } }} />
          <button type="button" className="btn-soft shrink-0" onClick={() => { if (text.trim()) { add({ kind: "text", value: text.trim() }); setText(""); } }} aria-label="Add caption">
            <Type className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>

      <div
        ref={boardRef}
        onPointerDown={() => setSelected(null)}
        className="relative aspect-[4/3] w-full touch-none select-none overflow-hidden rounded-3xl border border-glow-peach"
        style={{ background: bg }}
      >
        {items.length === 0 && (
          <p className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-glow-muted">Add colors, images, stickers, and captions, then drag them around your board.</p>
        )}
        {items.map((it) => (
          <div
            key={it.id}
            onPointerDown={(e) => onDown(e, it)}
            onPointerMove={onMove}
            onPointerUp={onUp}
            className={`absolute cursor-grab touch-none active:cursor-grabbing ${selected === it.id ? "outline outline-2 outline-offset-4 outline-glow-ink/60" : ""}`}
            style={{ left: `${it.x}%`, top: `${it.y}%`, transform: `translate(-50%, -50%) scale(${it.scale})` }}
          >
            {it.kind === "color" && <div className="rounded-xl shadow-sm" style={{ width: COLOR_SIZE, height: COLOR_SIZE, background: it.value }} />}
            {it.kind === "emoji" && <span style={{ fontSize: EMOJI_SIZE, lineHeight: 1 }} className="block">{it.value}</span>}
            {it.kind === "text" && <span className="block whitespace-nowrap rounded-lg bg-white/75 px-2.5 py-1.5 font-semibold" style={{ fontSize: TEXT_SIZE }}>{it.value}</span>}
            {it.kind === "image" && <img src={it.value} alt="" draggable={false} className="pointer-events-none block rounded-xl" style={{ width: IMAGE_W }} />}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-4 rounded-2xl bg-glow-bg p-3 text-sm">
        <label className="flex items-center gap-2 font-medium">
          Board color <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="h-8 w-9 cursor-pointer rounded border-0 bg-transparent p-0" />
        </label>
        {sel ? (
          <>
            <label className="flex flex-1 items-center gap-2 font-medium">
              Size
              <input type="range" min={0.4} max={3} step={0.05} value={sel.scale} onChange={(e) => update(sel.id, { scale: Number(e.target.value) })} className="w-full min-w-24 accent-[#ffb6b9]" />
            </label>
            <button type="button" className="btn-ghost px-4 py-1.5" onClick={() => setItems((p) => [...p.filter((i) => i.id !== sel.id), sel])}>Bring to front</button>
            <button type="button" className="btn-ghost px-4 py-1.5" onClick={() => { setItems((p) => p.filter((i) => i.id !== sel.id)); setSelected(null); }}>
              <Trash2 className="h-4 w-4" aria-hidden /> Delete
            </button>
          </>
        ) : (
          <span className="text-glow-muted">Select an item to resize or delete it.</span>
        )}
      </div>
      <Note>Everything is made in your browser and images are never uploaded. Boards are not saved, so download your PNG before leaving the page.</Note>
    </div>
  );
}
