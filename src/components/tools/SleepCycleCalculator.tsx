"use client";

import { useState } from "react";
import { BedDouble, Info, Moon, Sun } from "lucide-react";

const CYCLE = 90; // minutes
const FALL_ASLEEP = 15; // minutes to drift off

const fmt = (total: number) => {
  const m = ((total % 1440) + 1440) % 1440;
  const h = Math.floor(m / 60);
  const ap = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m % 60).padStart(2, "0")} ${ap}`;
};

const parse = (v: string) => {
  const [h, m] = v.split(":").map(Number);
  return h * 60 + m;
};

const quality = (cycles: number) =>
  cycles >= 6
    ? { label: "Ideal", tone: "bg-glow-mint text-teal-900" }
    : cycles === 5
    ? { label: "Great", tone: "bg-glow-mint/60 text-teal-900" }
    : cycles === 4
    ? { label: "Okay", tone: "bg-glow-peach text-orange-900" }
    : { label: "Short", tone: "bg-amber-100 text-amber-900" };

export default function SleepCycleCalculator() {
  const [mode, setMode] = useState<"wake" | "bed">("wake");
  const [wakeTime, setWakeTime] = useState("07:00");
  const [bedTime, setBedTime] = useState("23:00");

  const results =
    mode === "wake"
      ? [6, 5, 4, 3].map((n) => ({ n, time: fmt(parse(wakeTime) - n * CYCLE - FALL_ASLEEP) }))
      : [3, 4, 5, 6].map((n) => ({ n, time: fmt(parse(bedTime) + FALL_ASLEEP + n * CYCLE) }));

  const sleepNow = () => {
    const now = new Date();
    setBedTime(`${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`);
    setMode("bed");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-2 rounded-full bg-glow-bg p-1" role="group" aria-label="Calculation mode">
        <button
          type="button"
          aria-pressed={mode === "wake"}
          onClick={() => setMode("wake")}
          className={`flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition ${mode === "wake" ? "bg-glow-pink shadow-soft" : "text-glow-muted"}`}
        >
          <Sun className="h-4 w-4" aria-hidden /> I want to wake up at
        </button>
        <button
          type="button"
          aria-pressed={mode === "bed"}
          onClick={() => setMode("bed")}
          className={`flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition ${mode === "bed" ? "bg-glow-pink shadow-soft" : "text-glow-muted"}`}
        >
          <Moon className="h-4 w-4" aria-hidden /> I am going to bed at
        </button>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div className="w-full sm:w-56">
          <label htmlFor="time" className="label">{mode === "wake" ? "Wake-up time" : "Bedtime"}</label>
          <input
            id="time"
            type="time"
            value={mode === "wake" ? wakeTime : bedTime}
            onChange={(e) => (mode === "wake" ? setWakeTime(e.target.value) : setBedTime(e.target.value))}
            className="input"
          />
        </div>
        <button type="button" onClick={sleepNow} className="btn-soft">
          <BedDouble className="h-4 w-4" aria-hidden /> Sleep right now
        </button>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold">
          {mode === "wake" ? "Fall asleep at one of these times:" : "Set your alarm for one of these times:"}
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {results.map(({ n, time }) => {
            const q = quality(n);
            return (
              <div key={n} className="rounded-2xl bg-gradient-to-br from-glow-peach/60 to-glow-pink/20 p-4 text-center">
                <p className="text-2xl font-bold">{time}</p>
                <p className="mt-1 text-xs text-glow-muted">{n} cycles · {n * 1.5} hours</p>
                <span className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${q.tone}`}>{q.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <p className="flex items-start gap-2 text-xs leading-relaxed text-glow-muted">
        <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
        Based on 90-minute sleep cycles and about 15 minutes to fall asleep. Waking at the end of a cycle often feels
        easier than waking mid-cycle. Everyone is different, and most adults need 7–9 hours. This is not medical advice.
      </p>
    </div>
  );
}
