"use client";

import { useState } from "react";
import { Plus, RotateCcw, X } from "lucide-react";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { uid } from "@/lib/util";
import Note from "./Note";

const CATS = ["Tops", "Bottoms", "Dresses", "Outerwear", "Shoes", "Accessories"] as const;
type Cat = (typeof CATS)[number];

interface Piece { id: string; name: string; home: Cat; zone: Cat | null }

const PRESETS: [string, Cat][] = [
  ["White tee", "Tops"], ["Striped long-sleeve", "Tops"], ["Silk blouse", "Tops"], ["Cozy knit sweater", "Tops"], ["Black tank", "Tops"],
  ["Straight jeans", "Bottoms"], ["Black trousers", "Bottoms"], ["Midi skirt", "Bottoms"], ["Tailored shorts", "Bottoms"],
  ["Little black dress", "Dresses"], ["Wrap dress", "Dresses"],
  ["Denim jacket", "Outerwear"], ["Trench coat", "Outerwear"], ["Blazer", "Outerwear"], ["Cardigan", "Outerwear"],
  ["White sneakers", "Shoes"], ["Ankle boots", "Shoes"], ["Ballet flats", "Shoes"], ["Sandals", "Shoes"],
  ["Leather tote", "Accessories"], ["Gold hoops", "Accessories"], ["Silk scarf", "Accessories"], ["Belt", "Accessories"], ["Sunglasses", "Accessories"],
];

const initial = (): Piece[] => PRESETS.map(([name, home], i) => ({ id: `p-${i}`, name, home, zone: null }));

const ZONE_TONES: Record<Cat, string> = {
  Tops: "bg-glow-pink/25", Bottoms: "bg-glow-peach/60", Dresses: "bg-glow-mint/40",
  Outerwear: "bg-sky-100", Shoes: "bg-amber-100", Accessories: "bg-purple-100",
};

export default function CapsuleWardrobeBuilder() {
  const [data, setData, loaded] = useLocalStorage<{ pieces: Piece[] }>("glowhacks:capsule", { pieces: initial() });
  const [name, setName] = useState("");
  const [cat, setCat] = useState<Cat>("Tops");
  const [over, setOver] = useState<string | null>(null);

  if (!loaded) return <div className="h-64 animate-pulse rounded-2xl bg-glow-peach/40" aria-label="Loading" />;

  const move = (id: string, zone: Cat | null) =>
    setData((p) => ({ pieces: p.pieces.map((x) => (x.id === id ? { ...x, zone } : x)) }));

  const addPiece = () => {
    if (!name.trim()) return;
    setData((p) => ({ pieces: [...p.pieces, { id: uid(), name: name.trim(), home: cat, zone: cat }] }));
    setName("");
  };

  const bank = data.pieces.filter((p) => p.zone === null);
  const chosen = data.pieces.filter((p) => p.zone !== null).length;

  const onDrop = (e: React.DragEvent, zone: Cat | null) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    if (id) move(id, zone);
    setOver(null);
  };

  const dragProps = (id: string) => ({
    draggable: true,
    onDragStart: (e: React.DragEvent) => e.dataTransfer.setData("text/plain", id),
  });

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-1 flex justify-between text-sm">
          <span className="font-semibold">{chosen} pieces in your capsule</span>
          <span className="text-glow-muted">Goal: 25 to 35</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-glow-bg">
          <div className="h-full rounded-full bg-glow-pink transition-all" style={{ width: `${Math.min(100, (chosen / 30) * 100)}%` }} />
        </div>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setOver("bank"); }}
        onDragLeave={() => setOver(null)}
        onDrop={(e) => onDrop(e, null)}
        className={`rounded-2xl border-2 border-dashed p-4 transition ${over === "bank" ? "border-glow-pink bg-glow-pink/10" : "border-glow-peach"}`}
      >
        <p className="mb-3 text-sm font-semibold">Ideas <span className="font-normal text-glow-muted">· drag to a category below, or tap to add</span></p>
        <div className="flex flex-wrap gap-2">
          {bank.length === 0 && <p className="text-sm text-glow-muted">All ideas are in your capsule. Add your own below.</p>}
          {bank.map((p) => (
            <button
              key={p.id}
              type="button"
              {...dragProps(p.id)}
              onClick={() => move(p.id, p.home)}
              className="cursor-grab rounded-full bg-white px-3.5 py-1.5 text-sm shadow-sm ring-1 ring-glow-peach transition hover:ring-glow-pink active:cursor-grabbing"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CATS.map((c) => {
          const items = data.pieces.filter((p) => p.zone === c);
          return (
            <div
              key={c}
              onDragOver={(e) => { e.preventDefault(); setOver(c); }}
              onDragLeave={() => setOver(null)}
              onDrop={(e) => onDrop(e, c)}
              className={`min-h-32 rounded-2xl p-4 transition ${ZONE_TONES[c]} ${over === c ? "ring-2 ring-glow-pink" : ""}`}
            >
              <p className="mb-2 text-sm font-semibold">{c} <span className="font-normal text-glow-muted">({items.length})</span></p>
              <div className="flex flex-wrap gap-2">
                {items.map((p) => (
                  <span key={p.id} {...dragProps(p.id)} className="flex cursor-grab items-center gap-1 rounded-full bg-white py-1 pl-3 pr-1.5 text-sm shadow-sm">
                    {p.name}
                    <button type="button" onClick={() => move(p.id, null)} className="rounded-full p-0.5 text-glow-muted hover:bg-glow-pink/40" aria-label={`Remove ${p.name}`}>
                      <X className="h-3.5 w-3.5" aria-hidden />
                    </button>
                  </span>
                ))}
                {items.length === 0 && <span className="text-xs text-glow-muted">Drop pieces here</span>}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-48 flex-1">
          <label htmlFor="piece" className="label">Add your own piece</label>
          <input
            id="piece"
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") addPiece(); }}
            placeholder="e.g. Cream linen shirt"
          />
        </div>
        <select aria-label="Category" className="input w-40" value={cat} onChange={(e) => setCat(e.target.value as Cat)}>
          {CATS.map((c) => <option key={c}>{c}</option>)}
        </select>
        <button type="button" className="btn-primary" onClick={addPiece}>
          <Plus className="h-4 w-4" aria-hidden /> Add
        </button>
        <button type="button" className="btn-ghost" onClick={() => { if (window.confirm("Reset your capsule to the starter ideas?")) setData({ pieces: initial() }); }}>
          <RotateCcw className="h-4 w-4" aria-hidden /> Reset
        </button>
      </div>
      <Note>A capsule wardrobe is a small set of versatile pieces that mix and match. Pick neutrals as a base, then add a few accent colors. Your plan is saved only in this browser.</Note>
    </div>
  );
}
