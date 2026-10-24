"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, Pause, Play, RotateCcw, SunMedium } from "lucide-react";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { playChime } from "@/lib/util";
import Note from "./Note";

const PRESETS = [
  { label: "Standard", min: 120, hint: "Every 2 hours" },
  { label: "Water resistant", min: 80, hint: "Swimming or sweating" },
  { label: "Intense sun", min: 60, hint: "High UV, beach, snow" },
];

export default function SunscreenTimer() {
  const [data, setData, loaded] = useLocalStorage<{ endAt: number | null; minutes: number }>("glowhacks:sunscreen", {
    endAt: null,
    minutes: 120,
  });
  const [now, setNow] = useState(0);
  const [perm, setPerm] = useState("default");
  const alerted = useRef(false);

  useEffect(() => {
    if ("Notification" in window) setPerm(Notification.permission);
  }, []);

  useEffect(() => {
    if (!data.endAt) return;
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [data.endAt]);

  const remaining = data.endAt && now ? Math.max(0, Math.ceil((data.endAt - now) / 1000)) : null;

  useEffect(() => {
    if (remaining === 0 && !alerted.current) {
      alerted.current = true;
      playChime();
      try {
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("Time to reapply your sunscreen ☀️");
        }
      } catch {
        /* ignore */
      }
    }
  }, [remaining]);

  if (!loaded) return <div className="h-48 animate-pulse rounded-2xl bg-glow-peach/40" aria-label="Loading" />;

  const start = () => {
    alerted.current = false;
    const t = Date.now();
    setNow(t);
    setData((p) => ({ ...p, endAt: t + p.minutes * 60000 }));
  };
  const stop = () => setData((p) => ({ ...p, endAt: null }));

  const total = data.minutes * 60;
  const running = data.endAt !== null;
  const due = remaining === 0;
  const progress = running && remaining !== null ? 1 - remaining / total : 0;
  const hh = remaining !== null ? Math.floor(remaining / 3600) : 0;
  const mm = remaining !== null ? Math.floor((remaining % 3600) / 60) : 0;
  const ss = remaining !== null ? remaining % 60 : 0;
  const pad = (n: number) => String(n).padStart(2, "0");

  const R = 90;
  const C = 2 * Math.PI * R;

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="space-y-5">
        <div>
          <p className="label">Reapply interval</p>
          <div className="grid gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.min}
                type="button"
                disabled={running}
                aria-pressed={data.minutes === p.min}
                onClick={() => setData((s) => ({ ...s, minutes: p.min }))}
                className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition disabled:opacity-60 ${
                  data.minutes === p.min ? "border-glow-pink bg-glow-pink/20" : "border-glow-peach bg-white hover:bg-glow-peach/30"
                }`}
              >
                <span>
                  <span className="block text-sm font-semibold">{p.label}</span>
                  <span className="block text-xs text-glow-muted">{p.hint}</span>
                </span>
                <span className="text-sm font-semibold">{p.min} min</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <label htmlFor="custom" className="label">Custom (minutes)</label>
          <input
            id="custom"
            type="number"
            min={15}
            max={300}
            disabled={running}
            value={data.minutes}
            onChange={(e) => setData((p) => ({ ...p, minutes: Math.min(300, Math.max(15, Number(e.target.value) || 120)) }))}
            className="input"
          />
        </div>
        {"Notification" in (typeof window === "undefined" ? {} : window) && perm === "default" && (
          <button
            type="button"
            className="btn-ghost"
            onClick={async () => setPerm(await Notification.requestPermission())}
          >
            <Bell className="h-4 w-4" aria-hidden /> Enable browser reminders
          </button>
        )}
        <Note>
          Apply about a quarter teaspoon (two finger-lengths) to your face and neck. Reapply after swimming, sweating,
          or towel drying. Keep this tab open so the alert can sound.
        </Note>
      </div>

      <div className={`flex flex-col items-center gap-5 rounded-3xl p-6 ${due ? "bg-glow-pink/40" : "bg-gradient-to-b from-glow-peach/50 to-glow-pink/20"}`}>
        <div className="relative h-56 w-56">
          <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90" role="img" aria-label="Sunscreen countdown">
            <circle cx="100" cy="100" r={R} fill="none" stroke="#ffffff" strokeWidth="10" />
            <circle
              cx="100" cy="100" r={R} fill="none" stroke="#ffb6b9" strokeWidth="10" strokeLinecap="round"
              strokeDasharray={C} strokeDashoffset={C * (1 - progress)} style={{ transition: "stroke-dashoffset 1s linear" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <SunMedium className="h-6 w-6" aria-hidden />
            {!running ? (
              <span className="mt-1 text-lg font-semibold">Ready</span>
            ) : due ? (
              <span className="mt-1 px-4 text-lg font-bold">Time to reapply!</span>
            ) : (
              <span className="mt-1 text-3xl font-semibold tabular-nums">
                {hh > 0 ? `${hh}:` : ""}{pad(mm)}:{pad(ss)}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          {!running ? (
            <button type="button" onClick={start} className="btn-primary px-7 py-3 text-base shadow-soft">
              <Play className="h-4 w-4" aria-hidden /> Start timer
            </button>
          ) : (
            <>
              <button type="button" onClick={start} className="btn-primary px-6 py-3 shadow-soft">
                <RotateCcw className="h-4 w-4" aria-hidden /> I reapplied
              </button>
              <button type="button" onClick={stop} className="btn-ghost px-6 py-3">
                <Pause className="h-4 w-4" aria-hidden /> Stop
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
