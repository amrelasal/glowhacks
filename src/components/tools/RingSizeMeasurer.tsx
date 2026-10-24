"use client";

import { useMemo, useState } from "react";
import Note from "./Note";

const CARD_MM = 85.6; // credit card width
const diameterForUS = (us: number) => 11.63 + 0.8128 * us;

function fromCircumference(circ: number) {
  const dia = circ / Math.PI;
  const usRaw = (dia - 11.63) / 0.8128;
  const us = Math.round(usRaw * 2) / 2;
  const idx = Math.round(us * 2);
  return { dia, us, uk: `${String.fromCharCode(64 + Math.max(1, Math.min(26, idx)))}½`, eu: Math.round(circ) };
}

export default function RingSizeMeasurer() {
  const [mode, setMode] = useState<"circ" | "dia">("circ");
  const [value, setValue] = useState("");
  const [ppm, setPpm] = useState(3.78);
  const [previewUS, setPreviewUS] = useState<number | null>(null);

  const result = useMemo(() => {
    const v = parseFloat(value);
    if (!v || v <= 0) return null;
    const circ = mode === "circ" ? v : v * Math.PI;
    if (circ < 38 || circ > 80) return { error: true as const };
    return { error: false as const, ...fromCircumference(circ) };
  }, [value, mode]);

  const shownUS = previewUS ?? (result && !result.error ? result.us : 6);
  const ringDia = diameterForUS(shownUS);
  const sizes = Array.from({ length: 21 }, (_, i) => 3 + i * 0.5);

  return (
    <div className="space-y-8">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <h3 className="font-semibold">1. Measure your finger</h3>
          <ol className="list-decimal space-y-1 pl-5 text-sm text-glow-muted marker:text-glow-pink">
            <li>Wrap a thin strip of paper or string around the base of your finger.</li>
            <li>Mark where it overlaps, then lay it flat against a ruler.</li>
            <li>Measure in millimeters and enter it below.</li>
          </ol>
          <div className="grid grid-cols-2 gap-2">
            {([["circ", "Circumference"], ["dia", "Inner diameter"]] as const).map(([k, t]) => (
              <button
                key={k}
                type="button"
                aria-pressed={mode === k}
                onClick={() => setMode(k)}
                className={`rounded-2xl border px-3 py-2.5 text-sm font-medium ${mode === k ? "border-glow-pink bg-glow-pink/20" : "border-glow-peach bg-white"}`}
              >
                {t}
              </button>
            ))}
          </div>
          <div>
            <label htmlFor="mm" className="label">{mode === "circ" ? "Circumference" : "Inner diameter of a ring that fits"} (mm)</label>
            <input id="mm" type="number" inputMode="decimal" step="0.1" className="input" value={value} onChange={(e) => setValue(e.target.value)} placeholder={mode === "circ" ? "e.g. 52" : "e.g. 16.5"} />
          </div>
          {result && result.error && <p className="text-sm text-rose-600">That looks outside the normal range. Please check your measurement.</p>}
          {result && !result.error && (
            <div className="grid grid-cols-3 gap-3">
              {[["US", String(result.us)], ["UK", result.uk], ["EU", String(result.eu)]].map(([k, v]) => (
                <div key={k} className="rounded-2xl bg-glow-pink/30 p-3 text-center">
                  <p className="text-xs text-glow-muted">{k}</p>
                  <p className="text-2xl font-bold">{v}</p>
                </div>
              ))}
              <p className="col-span-3 text-xs text-glow-muted">Inner diameter about {result.dia.toFixed(1)} mm.</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">2. Compare a ring on your screen</h3>
          <p className="text-sm text-glow-muted">
            Hold a bank card against the bar and drag the slider until the bar matches the card&apos;s width exactly.
          </p>
          <div className="overflow-x-auto pb-1">
            <div className="flex h-8 items-center justify-center rounded-lg bg-glow-peach text-xs font-medium" style={{ width: CARD_MM * ppm }}>
              Card width · 85.6 mm
            </div>
          </div>
          <input type="range" min={2.5} max={7} step={0.01} value={ppm} onChange={(e) => setPpm(Number(e.target.value))} className="w-full accent-[#ffb6b9]" aria-label="Calibrate screen scale" />

          <div className="flex items-center gap-3">
            <label htmlFor="us" className="text-sm font-medium">Ring size (US)</label>
            <select id="us" className="input max-w-28" value={shownUS} onChange={(e) => setPreviewUS(Number(e.target.value))}>
              {sizes.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex min-h-48 items-center justify-center overflow-hidden rounded-2xl bg-glow-bg p-4">
            <div
              className="rounded-full border-[3px] border-glow-pink bg-white/60"
              style={{ width: ringDia * ppm, height: ringDia * ppm }}
              role="img"
              aria-label={`Inner circle of a US size ${shownUS} ring`}
            />
          </div>
          <p className="text-center text-xs text-glow-muted">Place your ring on the circle. The inside edge should line up with it.</p>
        </div>
      </div>
      <Note>Measure at the end of the day when fingers are warmest and largest, and avoid cold hands. A wide band fits tighter than a thin one, so consider going up half a size. For an exact fit, ask a jeweler.</Note>
    </div>
  );
}
