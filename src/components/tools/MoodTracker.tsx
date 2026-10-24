"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { numToKey, pad, todayNum } from "@/lib/date";
import Note from "./Note";

const MOODS = [
  { label: "Amazing", emoji: "😄", color: "#ff9aa2" },
  { label: "Good", emoji: "🙂", color: "#ffd6a5" },
  { label: "Okay", emoji: "😐", color: "#fdf5a6" },
  { label: "Low", emoji: "😔", color: "#b5ead7" },
  { label: "Rough", emoji: "😢", color: "#c7b8ff" },
];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function MoodTracker() {
  const [log, setLog, loaded] = useLocalStorage<Record<string, number>>("glowhacks:moods", {});
  const [brush, setBrush] = useState(0);
  const [year, setYear] = useState<number | null>(null);

  if (!loaded) return <div className="h-64 animate-pulse rounded-2xl bg-glow-peach/40" aria-label="Loading" />;

  const today = todayNum();
  const todayKey = numToKey(today);
  const y = year ?? Number(todayKey.slice(0, 4));

  const setMood = (key: string, mood: number | null) =>
    setLog((p) => {
      const n = { ...p };
      if (mood === null || n[key] === mood) delete n[key];
      else n[key] = mood;
      return n;
    });

  const counts = MOODS.map((_, i) => Object.entries(log).filter(([k, v]) => k.startsWith(`${y}-`) && v === i).length);
  const total = counts.reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-glow-bg p-4">
        <p className="mb-3 text-sm font-semibold">How are you feeling today?</p>
        <div className="flex flex-wrap gap-2">
          {MOODS.map((m, i) => (
            <button key={m.label} type="button" onClick={() => { setBrush(i); setMood(todayKey, i); }}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium shadow-sm transition active:scale-95 ${log[todayKey] === i ? "ring-2 ring-glow-ink" : ""}`} style={{ background: m.color }}>
              <span aria-hidden>{m.emoji}</span> {m.label}
            </button>
          ))}
        </div>
        <p className="mt-4 text-xs text-glow-muted">
          To fill in other days, choose a paint color, then tap a square. Tap the same color again to erase it.
        </p>
        <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Paint color">
          {MOODS.map((m, i) => (
            <button key={m.label} type="button" aria-pressed={brush === i} aria-label={`Paint ${m.label}`} onClick={() => setBrush(i)}
              className={`h-8 w-8 rounded-lg border-2 ${brush === i ? "border-glow-ink" : "border-white"} shadow`} style={{ background: m.color }} />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button type="button" className="rounded-full p-2 hover:bg-glow-peach/60" onClick={() => setYear(y - 1)} aria-label="Previous year"><ChevronLeft className="h-5 w-5" aria-hidden /></button>
        <h3 className="text-xl font-semibold">{y}</h3>
        <button type="button" className="rounded-full p-2 hover:bg-glow-peach/60" onClick={() => setYear(y + 1)} aria-label="Next year"><ChevronRight className="h-5 w-5" aria-hidden /></button>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="min-w-[640px] space-y-1">
          {MONTHS.map((mn, mi) => {
            const dim = new Date(Date.UTC(y, mi + 1, 0)).getUTCDate();
            return (
              <div key={mn} className="flex items-center gap-1">
                <span className="w-8 shrink-0 text-xs text-glow-muted">{mn}</span>
                {Array.from({ length: 31 }, (_, d) => {
                  if (d >= dim) return <span key={d} className="h-5 flex-1" />;
                  const key = `${y}-${pad(mi + 1)}-${pad(d + 1)}`;
                  const v = log[key];
                  const isToday = key === todayKey;
                  return (
                    <button key={d} type="button" onClick={() => setMood(key, brush)} title={`${key}${v !== undefined ? ` · ${MOODS[v].label}` : ""}`}
                      aria-label={`${key}${v !== undefined ? `, ${MOODS[v].label}` : ", no mood logged"}`}
                      className={`h-5 flex-1 rounded-[5px] border transition hover:scale-110 ${isToday ? "border-glow-ink" : "border-white"}`}
                      style={{ background: v !== undefined ? MOODS[v].color : "#f1eef3" }} />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {MOODS.map((m, i) => (
          <div key={m.label} className="flex items-center gap-2 rounded-full bg-glow-bg px-3 py-1.5 text-sm">
            <span className="h-4 w-4 rounded" style={{ background: m.color }} />
            {m.emoji} {m.label}: <strong>{counts[i]}</strong>
            {total > 0 && <span className="text-xs text-glow-muted">({Math.round((counts[i] / total) * 100)}%)</span>}
          </div>
        ))}
      </div>
      <Note>Your moods are saved only in this browser. This tracker is for self-reflection and is not a diagnostic tool. If low moods last or feel overwhelming, please reach out to a healthcare professional or someone you trust.</Note>
    </div>
  );
}
