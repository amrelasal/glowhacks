"use client";

import { useMemo, useState } from "react";
import { CalendarPlus, ChevronLeft, ChevronRight, Info, Lock, Trash2 } from "lucide-react";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { formatNum, keyToNum, numToKey, todayKey, todayNum } from "@/lib/date";

interface State {
  /** Logged period start dates, "YYYY-MM-DD" */
  starts: string[];
  cycleLength: number;
  periodLength: number;
}

const INITIAL: State = { starts: [], cycleLength: 28, periodLength: 5 };
const DAY = 86400000;
const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

export default function PeriodCalculator() {
  const [data, setData, loaded] = useLocalStorage<State>("glowhacks:period", INITIAL);
  const [newDate, setNewDate] = useState("");
  const [view, setView] = useState<{ y: number; m: number } | null>(null);

  const today = todayNum();

  const calc = useMemo(() => {
    const nums = [...data.starts].sort().map(keyToNum);
    let avg: number | null = null;
    if (nums.length >= 2) {
      const diffs: number[] = [];
      for (let i = 1; i < nums.length; i++) diffs.push(nums[i] - nums[i - 1]);
      const recent = diffs.slice(-6).filter((d) => d >= 18 && d <= 60);
      if (recent.length) avg = Math.round(recent.reduce((a, b) => a + b, 0) / recent.length);
    }
    const cycle = avg ?? data.cycleLength;
    const plen = data.periodLength;
    const latest = nums.length ? nums[nums.length - 1] : null;

    const logged = new Set<number>();
    const predicted = new Set<number>();
    const fertile = new Set<number>();
    const ovulation = new Set<number>();
    const predictedStarts: number[] = [];
    const ovList: number[] = [];

    if (latest !== null) {
      nums.forEach((s) => {
        for (let i = 0; i < plen; i++) logged.add(s + i);
      });
      for (let k = 1; k <= 12; k++) {
        const start = latest + k * cycle;
        predictedStarts.push(start);
        for (let i = 0; i < plen; i++) predicted.add(start + i);
      }
      const allStarts = [...nums, ...predictedStarts];
      allStarts.forEach((s, i) => {
        const nextStart = i < nums.length - 1 ? nums[i + 1] : s + cycle;
        const ov = nextStart - 14;
        ovList.push(ov);
        ovulation.add(ov);
        for (let d = ov - 5; d <= ov + 1; d++) fertile.add(d);
      });
    }

    const nextStart = predictedStarts.find((s) => s >= today) ?? null;
    const nextOv = ovList.find((o) => o >= today) ?? null;
    const cycleDay = latest !== null && today >= latest ? today - latest + 1 : null;

    return { cycle, avg, latest, logged, predicted, fertile, ovulation, nextStart, nextOv, cycleDay, plen };
  }, [data, today]);

  if (!loaded) {
    return <div className="h-64 animate-pulse rounded-2xl bg-glow-peach/40" aria-label="Loading" />;
  }

  const t = new Date(today * DAY);
  const current = view ?? { y: t.getUTCFullYear(), m: t.getUTCMonth() };
  const firstWeekday = new Date(Date.UTC(current.y, current.m, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(current.y, current.m + 1, 0)).getUTCDate();
  const monthLabel = new Date(Date.UTC(current.y, current.m, 1)).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  const shiftMonth = (delta: number) => {
    const d = new Date(Date.UTC(current.y, current.m + delta, 1));
    setView({ y: d.getUTCFullYear(), m: d.getUTCMonth() });
  };

  const addStart = () => {
    if (!newDate || data.starts.includes(newDate)) return;
    setData((p) => ({ ...p, starts: [...p.starts, newDate].sort() }));
    setNewDate("");
  };

  const removeStart = (d: string) => setData((p) => ({ ...p, starts: p.starts.filter((x) => x !== d) }));

  const dayClass = (n: number) => {
    if (calc.logged.has(n)) return "bg-glow-pink font-semibold";
    if (calc.predicted.has(n)) return "bg-glow-pink/35 border border-dashed border-glow-pink";
    if (calc.ovulation.has(n)) return "bg-glow-mint font-semibold";
    if (calc.fertile.has(n)) return "bg-glow-mint/45";
    return "hover:bg-glow-bg";
  };

  const daysUntil = (n: number) => n - today;
  const untilLabel = (n: number) => {
    const d = daysUntil(n);
    return d === 0 ? "Today" : d === 1 ? "Tomorrow" : `In ${d} days`;
  };

  return (
    <div className="space-y-8">
      <p className="flex items-center gap-2 rounded-2xl bg-glow-mint/40 px-4 py-3 text-sm">
        <Lock className="h-4 w-4 shrink-0" aria-hidden />
        Your cycle data is saved only in this browser (LocalStorage). It is never uploaded or shared.
      </p>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-6">
          <div>
            <label htmlFor="start" className="label">First day of your last period</label>
            <div className="flex gap-2">
              <input
                id="start"
                type="date"
                max={todayKey()}
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="input"
              />
              <button type="button" onClick={addStart} disabled={!newDate} className="btn-primary shrink-0">
                <CalendarPlus className="h-4 w-4" aria-hidden /> Add
              </button>
            </div>
            <p className="mt-1.5 text-xs text-glow-muted">Add several past periods for more accurate predictions.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="cycle" className="label">
                Cycle length: <span className="font-semibold">{data.cycleLength}d</span>
              </label>
              <input
                id="cycle"
                type="range"
                min={21}
                max={45}
                value={data.cycleLength}
                onChange={(e) => setData((p) => ({ ...p, cycleLength: Number(e.target.value) }))}
                className="w-full accent-[#ffb6b9]"
              />
            </div>
            <div>
              <label htmlFor="plen" className="label">
                Period length: <span className="font-semibold">{data.periodLength}d</span>
              </label>
              <input
                id="plen"
                type="range"
                min={2}
                max={10}
                value={data.periodLength}
                onChange={(e) => setData((p) => ({ ...p, periodLength: Number(e.target.value) }))}
                className="w-full accent-[#ffb6b9]"
              />
            </div>
          </div>
          {calc.avg && (
            <p className="text-xs text-glow-muted">
              Using your logged average of <strong>{calc.avg} days</strong> instead of the slider.
            </p>
          )}

          {data.starts.length > 0 && (
            <div>
              <h3 className="label">Logged periods</h3>
              <ul className="space-y-2">
                {[...data.starts].sort().reverse().map((d) => (
                  <li key={d} className="flex items-center justify-between rounded-2xl bg-glow-bg px-4 py-2 text-sm">
                    {formatNum(keyToNum(d))}
                    <button
                      type="button"
                      onClick={() => removeStart(d)}
                      className="rounded-full p-1.5 text-glow-muted hover:bg-glow-pink/40 hover:text-glow-ink"
                      aria-label={`Remove ${d}`}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                    </button>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Delete all saved cycle data from this browser?")) setData(INITIAL);
                }}
                className="mt-3 text-xs font-medium text-glow-muted underline underline-offset-4 hover:text-glow-ink"
              >
                Delete all my data
              </button>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="space-y-4">
          {calc.latest === null ? (
            <div className="rounded-2xl bg-glow-peach/40 p-6 text-sm text-glow-muted">
              Add the first day of your last period to see your predicted next period, ovulation day, and fertile
              window.
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-glow-pink/30 p-4">
                <p className="text-xs font-medium text-glow-muted">Next period</p>
                <p className="mt-1 text-lg font-semibold">{calc.nextStart ? formatNum(calc.nextStart, false) : "–"}</p>
                {calc.nextStart && <p className="text-xs text-glow-muted">{untilLabel(calc.nextStart)}</p>}
              </div>
              <div className="rounded-2xl bg-glow-mint/50 p-4">
                <p className="text-xs font-medium text-glow-muted">Estimated ovulation</p>
                <p className="mt-1 text-lg font-semibold">{calc.nextOv ? formatNum(calc.nextOv, false) : "–"}</p>
                {calc.nextOv && <p className="text-xs text-glow-muted">{untilLabel(calc.nextOv)}</p>}
              </div>
              <div className="rounded-2xl bg-glow-peach/60 p-4">
                <p className="text-xs font-medium text-glow-muted">Fertile window</p>
                <p className="mt-1 text-sm font-semibold">
                  {calc.nextOv ? `${formatNum(calc.nextOv - 5, false)} – ${formatNum(calc.nextOv + 1, false)}` : "–"}
                </p>
              </div>
              <div className="rounded-2xl bg-glow-bg p-4">
                <p className="text-xs font-medium text-glow-muted">Today</p>
                <p className="mt-1 text-lg font-semibold">
                  {calc.cycleDay ? `Cycle day ${calc.cycleDay}` : "–"}
                </p>
                <p className="text-xs text-glow-muted">
                  {calc.cycleDay && calc.cycleDay > calc.cycle ? "Your period may be late" : `${calc.cycle}-day cycle`}
                </p>
              </div>
            </div>
          )}

          {/* Calendar */}
          <div className="rounded-2xl border border-glow-peach p-4">
            <div className="mb-3 flex items-center justify-between">
              <button type="button" onClick={() => shiftMonth(-1)} className="rounded-full p-2 hover:bg-glow-peach/60" aria-label="Previous month">
                <ChevronLeft className="h-4 w-4" aria-hidden />
              </button>
              <h3 className="text-sm font-semibold">{monthLabel}</h3>
              <button type="button" onClick={() => shiftMonth(1)} className="rounded-full p-2 hover:bg-glow-peach/60" aria-label="Next month">
                <ChevronRight className="h-4 w-4" aria-hidden />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {WEEKDAYS.map((d, i) => (
                <div key={i} className="py-1 font-medium text-glow-muted">{d}</div>
              ))}
              {Array.from({ length: firstWeekday }, (_, i) => (
                <div key={`b${i}`} />
              ))}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const n = Math.round(Date.UTC(current.y, current.m, i + 1) / DAY);
                return (
                  <div
                    key={n}
                    className={`flex aspect-square items-center justify-center rounded-full text-xs transition ${dayClass(n)} ${
                      n === today ? "ring-2 ring-glow-ink ring-offset-1" : ""
                    }`}
                    title={numToKey(n)}
                  >
                    {i + 1}
                  </div>
                );
              })}
            </div>
            <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-glow-muted">
              <li className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-glow-pink" /> Period</li>
              <li className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full border border-dashed border-glow-pink bg-glow-pink/35" /> Predicted</li>
              <li className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-glow-mint/45" /> Fertile</li>
              <li className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-glow-mint" /> Ovulation</li>
            </ul>
          </div>
        </div>
      </div>

      <p className="flex items-start gap-2 text-xs leading-relaxed text-glow-muted">
        <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
        Predictions are estimates based on averages and are not a method of birth control or a medical diagnosis. Cycles
        vary. If your cycle is very irregular, very painful, or you have concerns, please speak with a healthcare
        professional.
      </p>
    </div>
  );
}
