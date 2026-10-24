"use client";

import { useMemo } from "react";
import { Droplet, Minus, Plus, RotateCcw, Info } from "lucide-react";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { numToKey, todayNum } from "@/lib/date";

interface State {
  weight: string;
  unit: "kg" | "lb";
  exercise: number;
  hot: boolean;
  glassMl: number;
  /** date key -> ml drunk */
  log: Record<string, number>;
}

const INITIAL: State = { weight: "", unit: "kg", exercise: 0, hot: false, glassMl: 250, log: {} };

export default function WaterTracker() {
  const [data, setData, loaded] = useLocalStorage<State>("glowhacks:water", INITIAL);

  const today = todayNum();
  const key = numToKey(today);

  const goalMl = useMemo(() => {
    const w = parseFloat(data.weight);
    if (!w || w <= 0) return null;
    const kg = data.unit === "kg" ? w : w * 0.45359237;
    if (kg < 20 || kg > 300) return null;
    const raw = kg * 35 + data.exercise * 12 + (data.hot ? 500 : 0);
    return Math.round(raw / 50) * 50;
  }, [data.weight, data.unit, data.exercise, data.hot]);

  if (!loaded) {
    return <div className="h-64 animate-pulse rounded-2xl bg-glow-peach/40" aria-label="Loading" />;
  }

  const drunk = data.log[key] ?? 0;
  const pct = goalMl ? Math.min(100, Math.round((drunk / goalMl) * 100)) : 0;
  const glassesLeft = goalMl ? Math.max(0, Math.ceil((goalMl - drunk) / data.glassMl)) : null;

  const setDrunk = (ml: number) =>
    setData((prev) => ({ ...prev, log: { ...prev.log, [key]: Math.max(0, ml) } }));

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const n = today - (6 - i);
    const d = new Date(n * 86400000);
    return {
      label: d.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" }),
      ml: data.log[numToKey(n)] ?? 0,
      isToday: n === today,
    };
  });
  const barMax = Math.max(goalMl ?? 0, ...last7.map((d) => d.ml), 1);

  const R = 56;
  const C = 2 * Math.PI * R;

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {/* Settings */}
      <div className="space-y-5">
        <div>
          <label htmlFor="weight" className="label">Body weight</label>
          <div className="flex gap-2">
            <input
              id="weight"
              type="number"
              min={20}
              inputMode="decimal"
              value={data.weight}
              onChange={(e) => setData((p) => ({ ...p, weight: e.target.value }))}
              placeholder={data.unit === "kg" ? "e.g. 60" : "e.g. 132"}
              className="input"
            />
            <div className="flex overflow-hidden rounded-2xl border border-glow-peach" role="group" aria-label="Weight unit">
              {(["kg", "lb"] as const).map((u) => (
                <button
                  key={u}
                  type="button"
                  aria-pressed={data.unit === u}
                  onClick={() => setData((p) => ({ ...p, unit: u }))}
                  className={`px-4 text-sm font-semibold transition ${data.unit === u ? "bg-glow-pink" : "bg-white text-glow-muted"}`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="exercise" className="label">
            Exercise today: <span className="font-semibold">{data.exercise} min</span>
          </label>
          <input
            id="exercise"
            type="range"
            min={0}
            max={180}
            step={5}
            value={data.exercise}
            onChange={(e) => setData((p) => ({ ...p, exercise: Number(e.target.value) }))}
            className="w-full accent-[#ffb6b9]"
          />
        </div>

        <label className="flex cursor-pointer items-center gap-3 text-sm font-medium">
          <input
            type="checkbox"
            checked={data.hot}
            onChange={(e) => setData((p) => ({ ...p, hot: e.target.checked }))}
            className="h-5 w-5 rounded accent-[#ffb6b9]"
          />
          It is a hot day (+500 ml)
        </label>

        <div>
          <label htmlFor="glass" className="label">My glass size</label>
          <select
            id="glass"
            value={data.glassMl}
            onChange={(e) => setData((p) => ({ ...p, glassMl: Number(e.target.value) }))}
            className="input"
          >
            {[150, 200, 250, 330, 500].map((ml) => (
              <option key={ml} value={ml}>{ml} ml</option>
            ))}
          </select>
        </div>

        <p className="flex items-start gap-2 text-xs leading-relaxed text-glow-muted">
          <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          Goal = about 35 ml per kg of body weight, plus extra for exercise and heat. It is a general guideline. Needs
          vary with health, pregnancy, and medication, so ask your doctor if unsure.
        </p>
      </div>

      {/* Progress */}
      <div className="flex flex-col items-center gap-5 rounded-3xl bg-gradient-to-b from-glow-mint/30 to-glow-peach/30 p-6">
        <div className="relative h-44 w-44">
          <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90" role="img" aria-label={`${pct}% of daily goal`}>
            <circle cx="64" cy="64" r={R} fill="none" stroke="#ffffff" strokeWidth="12" />
            <circle
              cx="64" cy="64" r={R} fill="none" stroke="#7fc4b4" strokeWidth="12" strokeLinecap="round"
              strokeDasharray={C} strokeDashoffset={C - (C * pct) / 100}
              style={{ transition: "stroke-dashoffset .5s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Droplet className="h-5 w-5 text-teal-600" aria-hidden />
            <span className="text-3xl font-bold">{pct}%</span>
            <span className="text-xs text-glow-muted">of today&apos;s goal</span>
          </div>
        </div>

        {goalMl ? (
          <p className="text-center text-sm">
            <span className="text-lg font-semibold">{(drunk / 1000).toFixed(2)} L</span> of{" "}
            <span className="font-semibold">{(goalMl / 1000).toFixed(2)} L</span>
            <br />
            <span className="text-glow-muted">
              {glassesLeft === 0 ? "Goal reached. Great job!" : `${glassesLeft} glass${glassesLeft === 1 ? "" : "es"} to go`}
            </span>
          </p>
        ) : (
          <p className="text-center text-sm text-glow-muted">Enter your weight to see your daily goal.</p>
        )}

        <div className="flex flex-wrap justify-center gap-2">
          <button type="button" onClick={() => setDrunk(drunk - data.glassMl)} disabled={drunk === 0} className="btn-ghost" aria-label="Remove one glass">
            <Minus className="h-4 w-4" aria-hidden />
          </button>
          <button type="button" onClick={() => setDrunk(drunk + data.glassMl)} className="btn-primary">
            <Plus className="h-4 w-4" aria-hidden /> Add a glass ({data.glassMl} ml)
          </button>
          <button type="button" onClick={() => setDrunk(drunk + 500)} className="btn-mint">+ 500 ml bottle</button>
        </div>
        <button type="button" onClick={() => setDrunk(0)} disabled={drunk === 0} className="flex items-center gap-1.5 text-xs font-medium text-glow-muted hover:text-glow-ink disabled:opacity-40">
          <RotateCcw className="h-3.5 w-3.5" aria-hidden /> Reset today
        </button>
      </div>

      {/* Last 7 days */}
      <div className="md:col-span-2">
        <h3 className="mb-3 text-sm font-semibold">Last 7 days</h3>
        <div className="flex h-32 items-end gap-2 sm:gap-4">
          {last7.map((d) => (
            <div key={d.label + d.ml + d.isToday} className="flex flex-1 flex-col items-center gap-1.5">
              <div className="flex h-24 w-full items-end overflow-hidden rounded-xl bg-glow-bg">
                <div
                  className={`w-full rounded-xl ${d.isToday ? "bg-glow-pink" : "bg-glow-mint"}`}
                  style={{ height: `${(d.ml / barMax) * 100}%`, transition: "height .4s ease" }}
                  title={`${d.ml} ml`}
                />
              </div>
              <span className={`text-xs ${d.isToday ? "font-semibold" : "text-glow-muted"}`}>{d.label}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-glow-muted">Saved only in this browser. Nothing is sent anywhere.</p>
      </div>
    </div>
  );
}
