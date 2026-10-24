"use client";

import { useState } from "react";
import { ArrowLeft, RotateCcw } from "lucide-react";
import Note from "./Note";

const QUESTIONS = [
  { q: "How long does your hair take to air-dry after washing?", o: ["A very long time", "An average amount of time", "It dries very quickly"] },
  { q: "Drop a clean strand in a glass of water for 2 to 4 minutes. What happens?", o: ["It floats on top", "It hovers in the middle", "It sinks quickly"] },
  { q: "When you apply oils or creams, what do they do?", o: ["Sit on top of the hair", "Absorb normally", "Absorb instantly and hair feels dry again soon"] },
  { q: "When you spritz water on dry hair, what happens?", o: ["Water beads up", "It absorbs normally", "It soaks in right away and hair frizzes"] },
  { q: "How would you describe your hair texture?", o: ["Smooth and shiny", "Mostly smooth with some frizz", "Rough, frizzy, tangles and breaks easily"] },
  { q: "How often do you use heat, color, or bleach?", o: ["Rarely or never", "Sometimes", "Often"] },
];

const RESULTS = {
  low: {
    title: "Low porosity",
    desc: "Your cuticles lie flat and tight. Hair resists moisture at first but holds it well once absorbed.",
    do: ["Use lightweight products like gels, mousses, and water-based leave-ins", "Apply products to damp, warm hair so moisture can enter", "Deep condition with gentle heat, like a warm towel", "Clarify every few weeks to prevent buildup"],
    avoid: ["Heavy butters and thick oils", "Protein-heavy treatments too often"],
  },
  medium: {
    title: "Medium (normal) porosity",
    desc: "Your cuticles are balanced. Hair takes in and keeps moisture well and is generally easy to manage.",
    do: ["Keep a simple routine: gentle shampoo and a regular conditioner", "Use a moisturizing mask every two weeks", "Alternate moisture and protein treatments as needed", "Protect from heat to keep your balance"],
    avoid: ["Overusing heat tools or harsh chemical treatments"],
  },
  high: {
    title: "High porosity",
    desc: "Your cuticles are raised or have gaps. Hair absorbs moisture fast but loses it just as fast.",
    do: ["Layer products: leave-in, then cream, then a sealing oil or butter", "Use protein treatments to help fill gaps, about once a month", "Rinse with cool water to help close the cuticle", "Use heat protectant, and sleep on satin or silk"],
    avoid: ["Frequent bleaching and high heat", "Harsh sulfate cleansers"],
  },
};

export default function HairPorosityQuiz() {
  const [answers, setAnswers] = useState<number[]>([]);
  const step = answers.length;
  const done = step === QUESTIONS.length;
  const score = answers.reduce((a, b) => a + b, 0);
  const key = score <= 9 ? "low" : score <= 14 ? "medium" : "high";
  const result = RESULTS[key];

  return (
    <div className="space-y-6">
      {!done ? (
        <>
          <div>
            <div className="mb-2 flex justify-between text-xs text-glow-muted">
              <span>Question {step + 1} of {QUESTIONS.length}</span>
              <span>{Math.round((step / QUESTIONS.length) * 100)}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-glow-bg">
              <div className="h-full rounded-full bg-glow-pink transition-all" style={{ width: `${(step / QUESTIONS.length) * 100}%` }} />
            </div>
          </div>
          <h3 className="text-lg font-semibold">{QUESTIONS[step].q}</h3>
          <div className="grid gap-3">
            {QUESTIONS[step].o.map((opt, i) => (
              <button
                key={opt}
                type="button"
                onClick={() => setAnswers((a) => [...a, i + 1])}
                className="rounded-2xl border border-glow-peach bg-white px-5 py-4 text-left text-sm font-medium transition hover:border-glow-pink hover:bg-glow-pink/10"
              >
                {opt}
              </button>
            ))}
          </div>
          {step > 0 && (
            <button type="button" onClick={() => setAnswers((a) => a.slice(0, -1))} className="flex items-center gap-1.5 text-sm font-medium text-glow-muted hover:text-glow-ink">
              <ArrowLeft className="h-4 w-4" aria-hidden /> Previous question
            </button>
          )}
        </>
      ) : (
        <div className="space-y-5">
          <div className="rounded-3xl bg-gradient-to-br from-glow-mint/50 to-glow-pink/30 p-6">
            <p className="text-sm text-glow-muted">Your result</p>
            <h3 className="text-3xl font-bold">{result.title}</h3>
            <p className="mt-2 text-sm leading-relaxed">{result.desc}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-glow-mint/30 p-5">
              <p className="font-semibold">Routine tips</p>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm marker:text-teal-600">
                {result.do.map((d) => <li key={d}>{d}</li>)}
              </ul>
            </div>
            <div className="rounded-2xl bg-glow-pink/20 p-5">
              <p className="font-semibold">Go easy on</p>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm marker:text-rose-500">
                {result.avoid.map((d) => <li key={d}>{d}</li>)}
              </ul>
            </div>
          </div>
          <button type="button" onClick={() => setAnswers([])} className="btn-soft">
            <RotateCcw className="h-4 w-4" aria-hidden /> Retake quiz
          </button>
        </div>
      )}
      <Note>Porosity can change with damage and treatments, and a quiz is only an estimate. Rinse-off and leave-in needs vary by hair type too.</Note>
    </div>
  );
}
