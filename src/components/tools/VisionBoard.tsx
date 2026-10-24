"use client";

import { useState } from "react";
import { Check, Plus, Trash2 } from "lucide-react";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { uid } from "@/lib/util";
import Note from "./Note";

const AREAS = [
  { name: "Career", tone: "bg-glow-pink/30" },
  { name: "Health", tone: "bg-glow-mint/50" },
  { name: "Love & Friends", tone: "bg-rose-100" },
  { name: "Travel", tone: "bg-sky-100" },
  { name: "Money", tone: "bg-amber-100" },
  { name: "Growth", tone: "bg-purple-100" },
] as const;
const EMOJIS = ["✨", "💼", "🏃‍♀️", "🥗", "💖", "✈️", "🏡", "💰", "📚", "🎨", "🧘‍♀️", "🌱"];

interface Goal { id: string; area: string; text: string; emoji: string; done: boolean }
interface State { word: string; goals: Goal[] }

export default function VisionBoard() {
  const [data, setData, loaded] = useLocalStorage<State>("glowhacks:vision", { word: "", goals: [] });
  const [area, setArea] = useState<string>(AREAS[0].name);
  const [emoji, setEmoji] = useState(EMOJIS[0]);
  const [text, setText] = useState("");

  if (!loaded) return <div className="h-64 animate-pulse rounded-2xl bg-glow-peach/40" aria-label="Loading" />;

  const add = () => {
    if (!text.trim()) return;
    setData((p) => ({ ...p, goals: [...p.goals, { id: uid(), area, text: text.trim(), emoji, done: false }] }));
    setText("");
  };
  const toggle = (id: string) => setData((p) => ({ ...p, goals: p.goals.map((g) => (g.id === id ? { ...g, done: !g.done } : g)) }));
  const remove = (id: string) => setData((p) => ({ ...p, goals: p.goals.filter((g) => g.id !== id) }));

  const done = data.goals.filter((g) => g.done).length;
  const pct = data.goals.length ? Math.round((done / data.goals.length) * 100) : 0;

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-gradient-to-br from-glow-pink/30 via-glow-peach/50 to-glow-mint/40 p-6 text-center">
        <label htmlFor="word" className="text-sm font-medium text-glow-muted">My word or theme for this year</label>
        <input
          id="word"
          value={data.word}
          maxLength={30}
          onChange={(e) => setData((p) => ({ ...p, word: e.target.value }))}
          placeholder="e.g. Bloom"
          className="mx-auto mt-1 block w-full max-w-sm bg-transparent text-center text-4xl font-bold outline-none placeholder:text-glow-ink/25"
        />
        <div className="mx-auto mt-4 max-w-xs">
          <div className="h-2 overflow-hidden rounded-full bg-white/70"><div className="h-full rounded-full bg-glow-pink transition-all" style={{ width: `${pct}%` }} /></div>
          <p className="mt-1.5 text-xs text-glow-muted">{done} of {data.goals.length} goals achieved</p>
        </div>
      </div>

      <div className="space-y-4 rounded-2xl border border-glow-peach p-5">
        <p className="font-semibold">Add a goal</p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Area of life">
          {AREAS.map((a) => (
            <button key={a.name} type="button" aria-pressed={area === a.name} onClick={() => setArea(a.name)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium ${area === a.name ? "bg-glow-pink shadow-soft" : "bg-glow-bg text-glow-muted"}`}>{a.name}</button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Emoji">
          {EMOJIS.map((e) => (
            <button key={e} type="button" aria-pressed={emoji === e} onClick={() => setEmoji(e)} className={`rounded-xl px-2.5 py-1.5 text-xl ${emoji === e ? "bg-glow-pink/50 ring-2 ring-glow-pink" : "bg-glow-bg"}`}>{e}</button>
          ))}
        </div>
        <div className="flex gap-2">
          <input className="input" value={text} maxLength={80} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") add(); }} placeholder="e.g. Run a 10K in the spring" aria-label="Goal" />
          <button type="button" className="btn-primary shrink-0" onClick={add} disabled={!text.trim()}><Plus className="h-4 w-4" aria-hidden /> Add</button>
        </div>
      </div>

      {data.goals.length === 0 ? (
        <div className="rounded-2xl bg-glow-peach/40 p-6 text-center text-sm text-glow-muted">Your board is empty. Add your first goal above. Dream big and keep it specific.</div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {AREAS.map((a) => {
            const goals = data.goals.filter((g) => g.area === a.name);
            if (!goals.length) return null;
            return (
              <section key={a.name} className={`rounded-3xl p-4 ${a.tone}`}>
                <h3 className="mb-3 text-sm font-semibold">{a.name}</h3>
                <ul className="space-y-2">
                  {goals.map((g) => (
                    <li key={g.id} className="flex items-center gap-2 rounded-2xl bg-white/85 p-3 shadow-sm">
                      <span className="text-2xl" aria-hidden>{g.emoji}</span>
                      <span className={`flex-1 text-sm ${g.done ? "text-glow-muted line-through" : ""}`}>{g.text}</span>
                      <button type="button" onClick={() => toggle(g.id)} aria-pressed={g.done} aria-label={g.done ? "Mark as not done" : "Mark as done"}
                        className={`flex h-7 w-7 items-center justify-center rounded-full border-2 ${g.done ? "border-teal-500 bg-teal-500 text-white" : "border-glow-pink"}`}>
                        {g.done && <Check className="h-4 w-4" aria-hidden />}
                      </button>
                      <button type="button" onClick={() => remove(g.id)} aria-label={`Delete ${g.text}`} className="rounded-full p-1 text-glow-muted hover:bg-glow-pink/40"><Trash2 className="h-4 w-4" aria-hidden /></button>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}
      <Note>Your vision board is saved only in this browser. Screenshot it to keep a copy or set it as your wallpaper.</Note>
    </div>
  );
}
