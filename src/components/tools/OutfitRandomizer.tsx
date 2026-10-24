"use client";

import { useRef, useState } from "react";
import { Shuffle, Sparkles } from "lucide-react";
import { useLocalStorage } from "@/lib/useLocalStorage";
import Note from "./Note";

const CATS = ["Tops", "Bottoms", "Shoes"] as const;
type Cat = (typeof CATS)[number];

const DEFAULTS: Record<Cat, string> = {
  Tops: "White tee\nStriped shirt\nSilk blouse\nCozy sweater\nBlack tank",
  Bottoms: "Straight jeans\nBlack trousers\nMidi skirt\nDenim shorts",
  Shoes: "White sneakers\nAnkle boots\nBallet flats\nSandals",
};

const COLORS = ["#ffb6b9", "#fae3d9", "#bbded6", "#f9d5e5", "#cdeac0", "#ffe0b2", "#d7d2f0", "#c8e7f4"];
const SPIN_MS = 4000;

const parse = (t: string) => t.split("\n").map((s) => s.trim()).filter(Boolean);
const point = (deg: number, r: number) => {
  const a = (deg * Math.PI) / 180;
  return [r * Math.sin(a), -r * Math.cos(a)] as const;
};

export default function OutfitRandomizer() {
  const [lists, setLists, loaded] = useLocalStorage<Record<Cat, string>>("glowhacks:outfits", DEFAULTS);
  const [active, setActive] = useState<Cat>("Tops");
  const [picks, setPicks] = useState<Partial<Record<Cat, string>>>({});
  const [rot, setRot] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const rotRef = useRef(0);

  if (!loaded) return <div className="h-64 animate-pulse rounded-2xl bg-glow-peach/40" aria-label="Loading" />;

  const items = parse(lists[active]);
  const n = items.length;
  const slice = n ? 360 / n : 360;

  const spin = () => {
    if (spinning || n < 2) return;
    const winner = Math.floor(Math.random() * n);
    const center = (winner + 0.5) * slice;
    const current = ((rotRef.current % 360) + 360) % 360;
    const target = (360 - center) % 360;
    const delta = (target - current + 360) % 360;
    rotRef.current += 360 * 5 + delta;
    setRot(rotRef.current);
    setSpinning(true);
    setTimeout(() => {
      setPicks((p) => ({ ...p, [active]: items[winner] }));
      setSpinning(false);
    }, SPIN_MS + 100);
  };

  const spinAll = () => {
    const next: Partial<Record<Cat, string>> = {};
    CATS.forEach((c) => {
      const l = parse(lists[c]);
      if (l.length) next[c] = l[Math.floor(Math.random() * l.length)];
    });
    setPicks(next);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Wardrobe category">
        {CATS.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={active === c}
            onClick={() => setActive(c)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${active === c ? "bg-glow-pink shadow-soft" : "bg-glow-bg text-glow-muted hover:bg-glow-peach/60"}`}
          >
            {c} ({parse(lists[c]).length})
          </button>
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-72 w-72">
            <div className="absolute -top-1 left-1/2 z-10 h-0 w-0 -translate-x-1/2 border-x-[12px] border-t-[22px] border-x-transparent border-t-glow-ink" aria-hidden />
            {n >= 2 ? (
              <svg
                viewBox="-100 -100 200 200"
                className="h-full w-full drop-shadow-md"
                style={{ transform: `rotate(${rot}deg)`, transition: `transform ${SPIN_MS}ms cubic-bezier(.17,.67,.12,1)` }}
                role="img"
                aria-label={`Wheel of ${active.toLowerCase()}`}
              >
                {items.map((item, i) => {
                  const a0 = i * slice;
                  const a1 = (i + 1) * slice;
                  const [x0, y0] = point(a0, 96);
                  const [x1, y1] = point(a1, 96);
                  return (
                    <g key={`${item}-${i}`}>
                      <path d={`M0 0 L${x0} ${y0} A96 96 0 ${slice > 180 ? 1 : 0} 1 ${x1} ${y1} Z`} fill={COLORS[i % COLORS.length]} stroke="#fff" strokeWidth="1.5" />
                      <text transform={`rotate(${a0 + slice / 2 - 90})`} x="88" y="2.5" textAnchor="end" fontSize={n > 8 ? 6 : 7.5} fill="#3b3447" fontWeight="600">
                        {item.length > 14 ? `${item.slice(0, 13)}…` : item}
                      </text>
                    </g>
                  );
                })}
                <circle r="9" fill="#fff" />
              </svg>
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-full bg-glow-peach/50 p-8 text-center text-sm text-glow-muted">Add at least 2 items to spin the wheel.</div>
            )}
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={spin} disabled={spinning || n < 2} className="btn-primary px-7 py-3 shadow-soft">
              <Sparkles className="h-4 w-4" aria-hidden /> {spinning ? "Spinning..." : `Spin ${active.toLowerCase()}`}
            </button>
            <button type="button" onClick={spinAll} className="btn-mint px-5 py-3">
              <Shuffle className="h-4 w-4" aria-hidden /> Random outfit
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="list" className="label">{active}: one per line</label>
            <textarea id="list" rows={7} className="input resize-y" value={lists[active]} onChange={(e) => setLists((p) => ({ ...p, [active]: e.target.value }))} />
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-glow-pink/30 to-glow-mint/30 p-5">
            <p className="text-sm font-semibold">Today&apos;s outfit</p>
            <ul className="mt-2 space-y-1.5 text-sm">
              {CATS.map((c) => (
                <li key={c} className="flex justify-between gap-3 rounded-xl bg-white/70 px-3 py-2">
                  <span className="text-glow-muted">{c}</span>
                  <span className="font-semibold">{picks[c] ?? "–"}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <Note>Your wardrobe lists are saved only in this browser. Edit them any time to match what you really own.</Note>
    </div>
  );
}
