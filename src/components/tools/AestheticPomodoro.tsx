"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { todayKey } from "@/lib/date";

type Mode = "focus" | "short" | "long";

const MODES: Record<Mode, { label: string; min: number; ring: string }> = {
  focus: { label: "Focus", min: 25, ring: "#ffb6b9" },
  short: { label: "Short break", min: 5, ring: "#9fd2c6" },
  long: { label: "Long break", min: 15, ring: "#f2c4ab" },
};

interface Stats {
  date: string;
  count: number;
  sound: boolean;
}

function chime() {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    [659.25, 880].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      const t = ctx.currentTime + i * 0.35;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.25, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 1.3);
    });
  } catch {
    /* audio unavailable */
  }
}

export default function AestheticPomodoro() {
  const [mode, setMode] = useState<Mode>("focus");
  const [left, setLeft] = useState(MODES.focus.min * 60);
  const [running, setRunning] = useState(false);
  const endAt = useRef(0);
  const [stats, setStats, loaded] = useLocalStorage<Stats>("glowhacks:pomodoro", { date: "", count: 0, sound: true });

  const sessionsToday = loaded && stats.date === todayKey() ? stats.count : 0;

  const switchMode = (m: Mode) => {
    setMode(m);
    setLeft(MODES[m].min * 60);
    setRunning(false);
  };

  // Tick using a wall-clock end time so background tabs stay accurate.
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      const r = Math.max(0, Math.ceil((endAt.current - Date.now()) / 1000));
      setLeft(r);
      if (r === 0) setRunning(false);
    }, 250);
    return () => clearInterval(id);
  }, [running]);

  // Session finished.
  useEffect(() => {
    if (left !== 0) return;
    if (stats.sound) chime();
    if (mode === "focus") {
      const count = (stats.date === todayKey() ? stats.count : 0) + 1;
      setStats((p) => ({ ...p, date: todayKey(), count }));
      switchMode(count % 4 === 0 ? "long" : "short");
    } else {
      switchMode("focus");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left]);

  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");

  useEffect(() => {
    const original = document.title;
    if (running) document.title = `${mm}:${ss} · ${MODES[mode].label}`;
    return () => {
      document.title = original;
    };
  }, [running, mm, ss, mode]);

  const toggle = () => {
    if (running) {
      setRunning(false);
    } else {
      endAt.current = Date.now() + left * 1000;
      setRunning(true);
    }
  };

  const total = MODES[mode].min * 60;
  const progress = 1 - left / total;
  const R = 90;
  const C = 2 * Math.PI * R;

  return (
    <div className="flex flex-col items-center gap-6 rounded-3xl bg-gradient-to-b from-glow-peach/40 via-white to-glow-mint/30 px-4 py-8">
      <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Timer mode">
        {(Object.keys(MODES) as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            aria-pressed={mode === m}
            onClick={() => switchMode(m)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${mode === m ? "bg-white shadow-soft" : "text-glow-muted hover:bg-white/60"}`}
          >
            {MODES[m].label}
          </button>
        ))}
      </div>

      <div className="relative h-64 w-64">
        <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90" role="img" aria-label={`${mm}:${ss} remaining`}>
          <circle cx="100" cy="100" r={R} fill="none" stroke="#ffffff" strokeWidth="10" />
          <circle
            cx="100" cy="100" r={R} fill="none" stroke={MODES[mode].ring} strokeWidth="10" strokeLinecap="round"
            strokeDasharray={C} strokeDashoffset={C * (1 - progress)}
            style={{ transition: "stroke-dashoffset .3s linear" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-semibold tabular-nums" aria-live="off">{mm}:{ss}</span>
          <span className="mt-1 text-sm text-glow-muted">{running ? (mode === "focus" ? "Stay with it" : "Rest and breathe") : "Ready when you are"}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button type="button" onClick={() => switchMode(mode)} className="btn-ghost" aria-label="Reset timer">
          <RotateCcw className="h-4 w-4" aria-hidden />
        </button>
        <button type="button" onClick={toggle} className="btn-primary min-w-36 px-8 py-3 text-base shadow-soft">
          {running ? <><Pause className="h-4 w-4" aria-hidden /> Pause</> : <><Play className="h-4 w-4" aria-hidden /> {left < total ? "Resume" : "Start"}</>}
        </button>
        <button
          type="button"
          onClick={() => setStats((p) => ({ ...p, sound: !p.sound }))}
          className="btn-ghost"
          aria-label={stats.sound ? "Mute chime" : "Unmute chime"}
          aria-pressed={stats.sound}
        >
          {stats.sound ? <Volume2 className="h-4 w-4" aria-hidden /> : <VolumeX className="h-4 w-4" aria-hidden />}
        </button>
      </div>

      <div className="text-center text-sm text-glow-muted">
        <p>
          Focus sessions today: <strong className="text-glow-ink">{sessionsToday}</strong>
        </p>
        <div className="mt-2 flex justify-center gap-1.5" aria-hidden>
          {Array.from({ length: 4 }, (_, i) => (
            <span key={i} className={`h-2.5 w-2.5 rounded-full ${i < sessionsToday % 4 || (sessionsToday > 0 && sessionsToday % 4 === 0) ? "bg-glow-pink" : "bg-white"}`} />
          ))}
        </div>
        <p className="mt-2 text-xs">Every 4th focus session earns a longer 15-minute break.</p>
      </div>
    </div>
  );
}
