/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import Note from "./Note";

type Shape = "Oval" | "Round" | "Square" | "Heart" | "Diamond" | "Oblong" | "Triangle";

const SHAPES: Record<Shape, { desc: string; cuts: string[]; glasses: string; tip: string }> = {
  Oval: {
    desc: "Balanced proportions with a slightly narrower jaw and a gently rounded chin. Almost any style works.",
    cuts: ["Long layers", "Blunt bob", "Side-swept bangs or a sleek ponytail"],
    glasses: "Most frames suit you. Try geometric or oversized styles.",
    tip: "Experiment freely. Avoid heavy bangs that hide your balanced forehead.",
  },
  Round: {
    desc: "Face length and width are similar, with soft curves and a rounded jaw.",
    cuts: ["Long layers below the chin", "Asymmetrical lob", "Side part with height at the crown"],
    glasses: "Angular or rectangular frames add definition.",
    tip: "Add length and angles. Avoid chin-length bobs that stop at the widest part of your face.",
  },
  Square: {
    desc: "A strong, defined jawline with forehead and jaw of similar width.",
    cuts: ["Soft waves and curls", "Side-swept bangs", "Long layers that start at the chin"],
    glasses: "Round or oval frames soften angles.",
    tip: "Soft texture balances a strong jaw. Avoid sharp, blunt lines at jaw level.",
  },
  Heart: {
    desc: "A wider forehead and cheekbones that narrow to a delicate chin.",
    cuts: ["Chin-length bob", "Side-swept bangs", "Layers that add volume near the jaw"],
    glasses: "Bottom-heavy, round, or aviator frames balance the chin.",
    tip: "Add fullness lower down. Avoid volume at the crown.",
  },
  Diamond: {
    desc: "Wide, high cheekbones with a narrower forehead and jaw.",
    cuts: ["Side-swept fringe", "Chin-length cuts with volume", "Face-framing layers"],
    glasses: "Oval or cat-eye frames highlight your cheekbones.",
    tip: "Add width at the forehead and jaw. Avoid slicked-back styles.",
  },
  Oblong: {
    desc: "Longer than it is wide, with a fairly straight cheek line.",
    cuts: ["Full bangs", "Waves with volume at the sides", "Chin or shoulder-length bob"],
    glasses: "Oversized or decorative frames add width.",
    tip: "Add width, not height. Avoid very long, flat styles and tall top-knots.",
  },
  Triangle: {
    desc: "A jaw wider than the forehead, with a narrower top half.",
    cuts: ["Layers with volume at the crown", "Side-swept bangs", "Textured lob"],
    glasses: "Frames with detail at the top balance the jaw.",
    tip: "Build volume up top. Avoid fullness at the jawline.",
  },
};

function classify(len: number, cheek: number, fore: number, jaw: number, angular: boolean): Shape {
  const ratio = len / cheek;
  const maxOther = Math.max(fore, jaw);
  if (cheek > maxOther * 1.08) return "Diamond";
  if (fore > jaw * 1.1) return "Heart";
  if (jaw > fore * 1.1) return "Triangle";
  if (ratio >= 1.5) return "Oblong";
  if (ratio <= 1.25) return angular ? "Square" : "Round";
  return angular && ratio < 1.4 ? "Square" : "Oval";
}

export default function FaceShapeAnalyzer() {
  const [vals, setVals] = useState({ len: "", cheek: "", fore: "", jaw: "" });
  const [angular, setAngular] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);

  useEffect(() => () => { if (photo) URL.revokeObjectURL(photo); }, [photo]);

  const result = useMemo(() => {
    const [len, cheek, fore, jaw] = [vals.len, vals.cheek, vals.fore, vals.jaw].map(parseFloat);
    if (![len, cheek, fore, jaw].every((n) => n > 0)) return null;
    return classify(len, cheek, fore, jaw, angular);
  }, [vals, angular]);

  const fields: { key: keyof typeof vals; label: string; hint: string }[] = [
    { key: "len", label: "Face length", hint: "Hairline to chin tip" },
    { key: "cheek", label: "Cheekbone width", hint: "Widest part across cheekbones" },
    { key: "fore", label: "Forehead width", hint: "Across the middle of your forehead" },
    { key: "jaw", label: "Jaw width", hint: "Corner of the jaw to the other corner" },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <p className="text-sm text-glow-muted">
            Measure in a mirror with a soft tape or ruler (any unit works, just use the same one). Pull your hair back first.
          </p>
          {fields.map((f) => (
            <div key={f.key}>
              <label htmlFor={f.key} className="label">{f.label} <span className="font-normal text-glow-muted">· {f.hint}</span></label>
              <input
                id={f.key}
                type="number"
                min={1}
                step="0.1"
                inputMode="decimal"
                className="input"
                value={vals[f.key]}
                onChange={(e) => setVals((v) => ({ ...v, [f.key]: e.target.value }))}
                placeholder="e.g. 18"
              />
            </div>
          ))}
          <div>
            <p className="label">Jawline</p>
            <div className="grid grid-cols-2 gap-2">
              {[false, true].map((a) => (
                <button
                  key={String(a)}
                  type="button"
                  aria-pressed={angular === a}
                  onClick={() => setAngular(a)}
                  className={`rounded-2xl border px-3 py-2.5 text-sm font-medium ${angular === a ? "border-glow-pink bg-glow-pink/20" : "border-glow-peach bg-white"}`}
                >
                  {a ? "Angular and defined" : "Soft and rounded"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-dashed border-glow-pink p-4">
            <p className="label">Optional: preview a photo (stays on your device)</p>
            {photo ? (
              <div className="relative mx-auto w-full max-w-xs overflow-hidden rounded-2xl">
                <img src={photo} alt="Your uploaded photo with guide lines" className="w-full" />
                {[16, 38, 62, 86].map((top) => (
                  <span key={top} className="absolute left-0 right-0 border-t border-dashed border-white/90 shadow" style={{ top: `${top}%` }} />
                ))}
                <span className="absolute bottom-0 top-0 left-1/2 border-l border-dashed border-white/90" />
                <button type="button" onClick={() => setPhoto(null)} className="absolute right-2 top-2 rounded-full bg-white p-1.5 shadow" aria-label="Remove photo">
                  <X className="h-4 w-4" aria-hidden />
                </button>
              </div>
            ) : (
              <label className="btn-soft cursor-pointer">
                <ImagePlus className="h-4 w-4" aria-hidden /> Choose a photo
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setPhoto(URL.createObjectURL(f));
                  }}
                />
              </label>
            )}
            <p className="mt-2 text-xs text-glow-muted">
              Use the guide lines to find your hairline, brows, nose base, and chin. The photo is never uploaded.
            </p>
          </div>

          {result ? (
            <div className="rounded-3xl bg-gradient-to-br from-glow-pink/30 to-glow-peach/50 p-5">
              <p className="text-sm text-glow-muted">Your face shape</p>
              <p className="text-3xl font-bold">{result}</p>
              <p className="mt-2 text-sm leading-relaxed">{SHAPES[result].desc}</p>
              <p className="mt-4 text-sm font-semibold">Flattering haircuts</p>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-sm marker:text-glow-pink">
                {SHAPES[result].cuts.map((c) => <li key={c}>{c}</li>)}
              </ul>
              <p className="mt-3 text-sm"><strong>Glasses:</strong> {SHAPES[result].glasses}</p>
              <p className="mt-1 text-sm"><strong>Tip:</strong> {SHAPES[result].tip}</p>
            </div>
          ) : (
            <div className="rounded-2xl bg-glow-peach/40 p-5 text-sm text-glow-muted">Fill in all four measurements to see your face shape and style ideas.</div>
          )}
        </div>
      </div>
      <Note>Face shapes sit on a spectrum, and these are style suggestions, not rules. Wear what makes you feel good.</Note>
    </div>
  );
}
