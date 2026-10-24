"use client";

import { useState } from "react";
import { Flame, Plus, Trash2 } from "lucide-react";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { numToKey, todayNum } from "@/lib/date";
import { uid } from "@/lib/util";
import Note from "./Note";

interface Habit { id: string; name: string; emoji: string; done: string[] }

const EMOJIS = ["💧", "🧘‍♀️", "📚", "🏃‍♀️", "🥗", "😴", "✍️", "🧴", "🎨", "🌿"];
const TONES = ["#ffb6b9", "#bbded6", "#fae3d9", "#d7d2f0", "#fff1b8"];
const DAYS = 28;

function streaks(done: string[], today: number) {
  const set = new Set(done);
  let current = 0;
  let n = set.has(numToKey(today)) ? today : today - 1;
  while (set.has(numToKey(n))) { current++; n--; }
  const keys = [...done].sort();
  let best = 0, run = 0, prev = "";
  for (const k of keys) {
    const t = Date.UTC(+k.slice(0, 4), +k.slice(5, 7) - 1, +k.slice(8, 10)) / 86400000;
    run = prev && t - Number(prev) === 1 ? run + 1 : 1;
    prev = String(t);
    best = Math.max(best, run);
  }
  return { current, best };
}

export default function HabitStreaks() {
  const [data, setData, loaded] = useLocalStorage<{ habits: Habit[] }>("glowhacks:habits", { habits: [] });
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState(EMOJIS[0]);

  if (!loaded) return <div className="h-48 animate-pulse rounded-2xl bg-glow-peach/40" aria-label="Loading" />;

  const today = todayNum();
  const days = Array.from({ length: DAYS }, (_, i) => today - (DAYS - 1 - i));

  const add = () => {
    if (!name.trim()) return;
    setData((p) => ({ habits: [...p.habits, { id: uid(), name: name.trim(), emoji, done: [] }] }));
    setName("");
  };
  const toggle = (id: string, key: string) =>
    setData((p) => ({ habits: p.habits.map((h) => (h.id === id ? { ...h, done: h.done.includes(key) ? h.done.filter((d) => d !== key) : [...h.done, key] } : h)) }));

  return (
    <div className="space-y-6">
      <div className="space-y-3 rounded-2xl bg-glow-bg p-4">
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Emoji">
          {EMOJIS.map((e) => <button key={e} type="button" aria-pressed={emoji === e} onClick={() => setEmoji(e)} className={`rounded-xl px-2.5 py-1.5 text-xl ${emoji === e ? "bg-glow-pink/50 ring-2 ring-glow-pink" : "bg-white"}`}>{e}</button>)}
        </div>
        <div className="flex gap-2">
          <input className="input" value={name} maxLength={40} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") add(); }} placeholder="New habit, e.g. Drink 8 glasses of water" aria-label="Habit name" />
          <button type="button" className="btn-primary shrink-0" onClick={add} disabled={!name.trim()}><Plus className="h-4 w-4" aria-hidden /> Add</button>
        </div>
      </div>

      {data.habits.length === 0 ? (
        <div className="rounded-2xl bg-glow-peach/40 p-5 text-sm text-glow-muted">Add your first habit. Tap a square each day you complete it to build a streak.</div>
      ) : (
        <ul className="space-y-4">
          {data.habits.map((h, hi) => {
            const { current, best } = streaks(h.done, today);
            const tone = TONES[hi % TONES.length];
            return (
              <li key={h.id} className="rounded-2xl border border-glow-peach p-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl" aria-hidden>{h.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{h.name}</p>
                    <p className="text-xs text-glow-muted">Best streak: {best} day{best === 1 ? "" : "s"} · Last {DAYS} days: {days.filter((d) => h.done.includes(numToKey(d))).length}/{DAYS}</p>
                  </div>
                  <span className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800"><Flame className="h-4 w-4" aria-hidden /> {current}</span>
                  <button type="button" aria-label={`Delete ${h.name}`} onClick={() => { if (window.confirm(`Delete "${h.name}"?`)) setData((p) => ({ habits: p.habits.filter((x) => x.id !== h.id) })); }} className="rounded-full p-1.5 text-glow-muted hover:bg-glow-pink/40"><Trash2 className="h-4 w-4" aria-hidden /></button>
                </div>
                <div className="mt-3 grid gap-1" style={{ gridTemplateColumns: "repeat(14, minmax(0, 1fr))" }}>
                  {days.map((d) => {
                    const key = numToKey(d);
                    const on = h.done.includes(key);
                    const isToday = d === today;
                    return (
                      <button key={key} type="button" aria-pressed={on} aria-label={`${key}${on ? ", done" : ""}`} onClick={() => toggle(h.id, key)} title={key}
                        className={`aspect-square rounded-md border text-[10px] transition hover:scale-110 ${isToday ? "border-glow-ink" : "border-transparent"}`}
                        style={{ background: on ? tone : "#f1eef3" }}>
                        {on ? "✓" : ""}
                      </button>
                    );
                  })}
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <Note>A streak counts consecutive days ending today (or yesterday, so you still have time today). Habits are saved only in this browser. Be kind to yourself on missed days and just start again.</Note>
    </div>
  );
}
