"use client";

import { useMemo, useState } from "react";
import Note from "./Note";

type Sys = "US" | "UK" | "EU";
interface Row { US: string; UK: string; EU: string; extra?: string }

const womenClothes: Row[] = [
  ["0", "XXS"], ["2", "XS"], ["4", "S"], ["6", "S"], ["8", "M"], ["10", "M"], ["12", "L"], ["14", "L"], ["16", "XL"], ["18", "XXL"],
].map(([us, letter]) => ({ US: us, UK: String(Number(us) + 4), EU: String(Number(us) + 32), extra: letter }));

const rows = (list: [string, string, string][]): Row[] => list.map(([US, UK, EU]) => ({ US, UK, EU }));

const TABLES: Record<string, { label: string; extraLabel?: string; rows: Row[] }> = {
  clothes: { label: "Women's clothing", extraLabel: "Letter size", rows: womenClothes },
  wshoes: {
    label: "Women's shoes",
    rows: rows([["5", "3", "35.5"], ["5.5", "3.5", "36"], ["6", "4", "36.5"], ["6.5", "4.5", "37"], ["7", "5", "37.5"], ["7.5", "5.5", "38"], ["8", "6", "38.5"], ["8.5", "6.5", "39"], ["9", "7", "40"], ["9.5", "7.5", "40.5"], ["10", "8", "41"], ["10.5", "8.5", "41.5"], ["11", "9", "42"]]),
  },
  mshoes: {
    label: "Men's shoes",
    rows: rows([["6", "5.5", "39"], ["6.5", "6", "39.5"], ["7", "6.5", "40"], ["7.5", "7", "40.5"], ["8", "7.5", "41"], ["8.5", "8", "42"], ["9", "8.5", "42.5"], ["9.5", "9", "43"], ["10", "9.5", "44"], ["10.5", "10", "44.5"], ["11", "10.5", "45"], ["12", "11.5", "46"]]),
  },
  bra: {
    label: "Bra band",
    rows: rows([["30", "30", "65"], ["32", "32", "70"], ["34", "34", "75"], ["36", "36", "80"], ["38", "38", "85"], ["40", "40", "90"], ["42", "42", "95"], ["44", "44", "100"]]),
  },
};

const SYSTEMS: Sys[] = ["US", "UK", "EU"];

export default function SizeConverter() {
  const [cat, setCat] = useState<keyof typeof TABLES>("clothes");
  const [from, setFrom] = useState<Sys>("US");
  const [idx, setIdx] = useState(4);

  const table = TABLES[cat];
  const safeIdx = Math.min(idx, table.rows.length - 1);
  const row = table.rows[safeIdx];
  const options = useMemo(() => table.rows.map((r) => r[from]), [table, from]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Category">
        {Object.entries(TABLES).map(([k, t]) => (
          <button
            key={k}
            type="button"
            aria-pressed={cat === k}
            onClick={() => {
              setCat(k);
              setIdx(Math.min(idx, TABLES[k].rows.length - 1));
            }}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${cat === k ? "bg-glow-pink shadow-soft" : "bg-glow-bg text-glow-muted hover:bg-glow-peach/60"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="from" className="label">I know my size in</label>
          <select id="from" className="input" value={from} onChange={(e) => setFrom(e.target.value as Sys)}>
            {SYSTEMS.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="size" className="label">Size</label>
          <select id="size" className="input" value={safeIdx} onChange={(e) => setIdx(Number(e.target.value))}>
            {options.map((o, i) => <option key={`${o}-${i}`} value={i}>{o}</option>)}
          </select>
        </div>
      </div>

      <div className={`grid gap-3 ${table.extraLabel ? "sm:grid-cols-4" : "sm:grid-cols-3"}`}>
        {SYSTEMS.map((s) => (
          <div key={s} className={`rounded-2xl p-4 text-center ${s === from ? "bg-glow-pink/40" : "bg-glow-peach/50"}`}>
            <p className="text-xs font-medium text-glow-muted">{s}</p>
            <p className="text-3xl font-bold">{row[s]}</p>
          </div>
        ))}
        {table.extraLabel && (
          <div className="rounded-2xl bg-glow-mint/40 p-4 text-center">
            <p className="text-xs font-medium text-glow-muted">{table.extraLabel}</p>
            <p className="text-3xl font-bold">{row.extra}</p>
          </div>
        )}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-glow-peach">
        <table className="w-full text-center text-sm">
          <thead className="bg-glow-peach/50 text-xs">
            <tr>
              {SYSTEMS.map((s) => <th key={s} className="px-3 py-2 font-semibold">{s}</th>)}
              {table.extraLabel && <th className="px-3 py-2 font-semibold">{table.extraLabel}</th>}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((r, i) => (
              <tr key={i} className={i === safeIdx ? "bg-glow-pink/30 font-semibold" : "odd:bg-glow-bg"}>
                {SYSTEMS.map((s) => <td key={s} className="px-3 py-2">{r[s]}</td>)}
                {table.extraLabel && <td className="px-3 py-2">{r.extra}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Note>Sizes are approximate and vary between brands and countries. Always check the brand&apos;s own size chart, and measure yourself when in doubt.</Note>
    </div>
  );
}
