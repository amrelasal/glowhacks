"use client";

import { useEffect, useMemo, useState } from "react";
import { Pause, Play } from "lucide-react";

interface Phase {
  label: string;
  sec: number;
  scale: number;
}

const SMALL = 0.5;

const PATTERNS: Record<string, { name: string; desc: string; phases: Phase[] }> = {
  box: {
    name: "Box breathing",
    desc: "4-4-4-4 · steady and grounding",
    phases: [
      { label: "Inhale", sec: 4, scale: 1 },
      { label: "Hold", sec: 4, scale: 1 },
      { label: "Exhale", sec: 4, scale: SMALL },
      { label: "Hold", sec: 4, scale: SMALL },
    ],
  },
  relax: {
    name: "4-7-8 relax",
    desc: "Wind down before sleep",
    phases: [
      { label: "Inhale", sec: 4, scale: 1 },
      { label: "Hold", sec: 7, scale: 1 },
      { label: "Exhale", sec: 8, scale: SMALL },
    ],
  },
  calm: {
    name: "Calm 5-5",
    desc: "Simple, gentle and even",
    phases: [
      { label: "Inhale", sec: 5, scale: 1 },
      { label: "Exhale", sec: 5, scale: SMALL },
    ],
  },
};

export default function BreathingVisualizer() {
  const [key, setKey] = useState<keyof typeof PATTERNS>("box");
  const [running, setRunning] = useState(false);
  const [st, setSt] = useState({ idx: 0, left: 4, cycles: 0 });

  const phases = useMemo(() => PATTERNS[key].phases, [key]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSt((s) => {
        if (s.left > 1) return { ...s, left: s.left - 1 };
        const next = (s.idx + 1) % phases.length;
        return { idx: next, left: phases[next].sec, cycles: next === 0 ? s.cycles + 1 : s.cycles };
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, phases]);

  const start = () => {
    setSt({ idx: 0, left: phases[0].sec, cycles: 0 });
    setRunning(true);
  };
  const stop = () => {
    setRunning(false);
    setSt({ idx: 0, left: phases[0].sec, cycles: 0 });
  };
  const choose = (k: string) => {
    setKey(k);
    setRunning(false);
    setSt({ idx: 0, left: PATTERNS[k].phases[0].sec, cycles: 0 });
  };

  const phase = phases[st.idx];
  const scale = running ? phase.scale : SMALL;
  const isMove = phase.label === "Inhale" || phase.label === "Exhale";
  const duration = running && isMove ? phase.sec : 0.6;

  return (
    <div className="flex flex-col items-center gap-8 rounded-3xl bg-gradient-to-b from-glow-mint/30 via-white to-glow-pink/20 px-4 py-8">
      <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Breathing pattern">
        {Object.entries(PATTERNS).map(([k, p]) => (
          <button
            key={k}
            type="button"
            aria-pressed={key === k}
            onClick={() => choose(k)}
            className={`rounded-2xl px-4 py-2 text-left transition ${key === k ? "bg-white shadow-soft" : "hover:bg-white/60"}`}
          >
            <span className="block text-sm font-semibold">{p.name}</span>
            <span className="block text-xs text-glow-muted">{p.desc}</span>
          </button>
        ))}
      </div>

      <div className="relative flex h-72 w-72 items-center justify-center">
        <div className="absolute inset-0 rounded-full border-2 border-dashed border-glow-pink/70" aria-hidden />
        <div
          aria-hidden
          className="h-full w-full rounded-full bg-gradient-to-br from-glow-pink via-glow-peach to-glow-mint shadow-soft"
          style={{ transform: `scale(${scale})`, transition: `transform ${duration}s ease-in-out` }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center" aria-live="polite">
          <span className="text-2xl font-semibold">{running ? phase.label : "Ready"}</span>
          <span className="mt-1 text-4xl font-bold tabular-nums">{running ? st.left : ""}</span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3">
        <button type="button" onClick={running ? stop : start} className="btn-primary px-8 py-3 text-base shadow-soft">
          {running ? <><Pause className="h-4 w-4" aria-hidden /> Stop</> : <><Play className="h-4 w-4" aria-hidden /> Begin</>}
        </button>
        <p className="text-sm text-glow-muted">
          {running ? `Breaths completed: ${st.cycles}` : "Sit comfortably, relax your shoulders, and follow the circle."}
        </p>
      </div>

      <p className="max-w-md text-center text-xs leading-relaxed text-glow-muted">
        Breathe in through your nose and out slowly through your mouth. If you ever feel dizzy, stop and return to
        normal breathing. This exercise is for relaxation and is not medical advice.
      </p>
    </div>
  );
}
