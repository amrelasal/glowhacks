/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef, useState } from "react";
import { ArrowLeftRight, Eraser, ImagePlus } from "lucide-react";
import Note from "./Note";

interface Cell { kind: "empty" | "color" | "image"; value: string }
const EMPTY: Cell = { kind: "empty", value: "" };
const SWATCHES = ["#ffb6b9", "#fae3d9", "#bbded6", "#f9d5e5", "#d7d2f0", "#fff1b8", "#ffffff", "#3b3447"];

export default function InstaGridMaker() {
  const [cells, setCells] = useState<Cell[]>(() => Array.from({ length: 12 }, () => EMPTY));
  const [count, setCount] = useState<9 | 12>(9);
  const [ratio, setRatio] = useState<"sq" | "tall">("tall");
  const [sel, setSel] = useState<number | null>(null);
  const [swap, setSwap] = useState(false);
  const [name, setName] = useState("@yourname");
  const dragFrom = useRef<number | null>(null);
  const replaceInput = useRef<HTMLInputElement>(null);

  const swapCells = (a: number, b: number) =>
    setCells((p) => {
      const n = [...p];
      [n[a], n[b]] = [n[b], n[a]];
      return n;
    });

  const setCell = (i: number, c: Cell) => setCells((p) => p.map((x, j) => (j === i ? c : x)));

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const urls = Array.from(files).map((f) => URL.createObjectURL(f));
    setCells((p) => {
      const n = [...p];
      urls.forEach((u) => {
        const free = n.slice(0, count).findIndex((c) => c.kind === "empty");
        if (free >= 0) n[free] = { kind: "image", value: u };
      });
      return n;
    });
  };

  const tap = (i: number) => {
    if (swap && sel !== null && sel !== i) {
      swapCells(sel, i);
      setSel(null);
    } else {
      setSel(sel === i ? null : i);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <label className="btn-primary cursor-pointer">
          <ImagePlus className="h-4 w-4" aria-hidden /> Add photos
          <input type="file" accept="image/*" multiple className="sr-only" onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} />
        </label>
        <button type="button" aria-pressed={swap} onClick={() => { setSwap(!swap); setSel(null); }} className={swap ? "btn-mint" : "btn-ghost"}>
          <ArrowLeftRight className="h-4 w-4" aria-hidden /> Swap mode {swap ? "on" : "off"}
        </button>
        <div className="ml-auto flex gap-2 text-sm">
          {([9, 12] as const).map((c) => (
            <button key={c} type="button" aria-pressed={count === c} onClick={() => { setCount(c); setSel(null); }} className={`rounded-full px-3.5 py-1.5 font-medium ${count === c ? "bg-glow-pink" : "bg-glow-bg text-glow-muted"}`}>{c} posts</button>
          ))}
          <button type="button" onClick={() => setRatio(ratio === "sq" ? "tall" : "sq")} className="rounded-full bg-glow-bg px-3.5 py-1.5 font-medium text-glow-muted">
            Tiles: {ratio === "sq" ? "1:1" : "3:4"}
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-sm rounded-3xl border border-glow-peach bg-white p-4">
        <div className="mb-4 flex items-center gap-4">
          <div className="h-16 w-16 shrink-0 rounded-full bg-gradient-to-br from-glow-pink via-glow-peach to-glow-mint ring-2 ring-white" aria-hidden />
          <div className="min-w-0 flex-1">
            <input aria-label="Username" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg bg-transparent px-1 font-semibold outline-none focus:bg-glow-bg" />
            <p className="px-1 text-xs text-glow-muted">{count} posts · plan your aesthetic</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-0.5">
          {cells.slice(0, count).map((c, i) => (
            <div
              key={i}
              role="button"
              tabIndex={0}
              draggable={c.kind !== "empty"}
              onDragStart={() => { dragFrom.current = i; }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => { if (dragFrom.current !== null && dragFrom.current !== i) swapCells(dragFrom.current, i); dragFrom.current = null; }}
              onClick={() => tap(i)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); tap(i); } }}
              aria-label={`Grid tile ${i + 1}`}
              className={`relative overflow-hidden ${ratio === "sq" ? "aspect-square" : "aspect-[3/4]"} cursor-pointer bg-glow-bg ${sel === i ? "ring-4 ring-inset ring-glow-pink" : ""}`}
              style={c.kind === "color" ? { background: c.value } : undefined}
            >
              {c.kind === "image" && <img src={c.value} alt="" draggable={false} className="h-full w-full object-cover" />}
              {c.kind === "empty" && <span className="flex h-full items-center justify-center text-xs text-glow-muted">{i + 1}</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-glow-bg p-4">
        {sel === null ? (
          <p className="text-sm text-glow-muted">
            {swap ? "Swap mode: tap one tile, then another to switch them." : "Tap a tile to edit it, or drag tiles onto each other to rearrange."}
          </p>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold">Tile {sel + 1}</span>
            <button type="button" className="btn-soft px-4 py-1.5" onClick={() => replaceInput.current?.click()}>Choose photo</button>
            <input
              ref={replaceInput}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f && sel !== null) setCell(sel, { kind: "image", value: URL.createObjectURL(f) });
                e.target.value = "";
              }}
            />
            <div className="flex gap-1.5">
              {SWATCHES.map((c) => (
                <button key={c} type="button" aria-label={`Fill ${c}`} onClick={() => setCell(sel, { kind: "color", value: c })} className="h-7 w-7 rounded-full border-2 border-white shadow" style={{ background: c }} />
              ))}
            </div>
            <button type="button" className="btn-ghost px-4 py-1.5" onClick={() => setCell(sel, EMPTY)}>
              <Eraser className="h-4 w-4" aria-hidden /> Clear
            </button>
          </div>
        )}
      </div>
      <Note>Photos stay on your device and are not saved when you leave. Take a screenshot of your grid to keep or share your plan. Newest posts appear at the top left on Instagram.</Note>
    </div>
  );
}
