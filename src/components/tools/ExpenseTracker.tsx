"use client";

import { useState } from "react";
import { Plus, Tag, Trash2 } from "lucide-react";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { uid } from "@/lib/util";
import Note from "./Note";

interface Entry { id: string; name: string; amount: number }
interface State { budget: string; currency: string; entries: Entry[] }

const num = (s: string) => {
  const n = parseFloat(s);
  return Number.isFinite(n) && n >= 0 ? n : 0;
};

export default function ExpenseTracker() {
  const [data, setData, loaded] = useLocalStorage<State>("glowhacks:expenses", { budget: "", currency: "$", entries: [] });
  const [price, setPrice] = useState("");
  const [off, setOff] = useState("");
  const [extra, setExtra] = useState("");
  const [tax, setTax] = useState("");
  const [name, setName] = useState("");
  const [amt, setAmt] = useState("");

  if (!loaded) return <div className="h-64 animate-pulse rounded-2xl bg-glow-peach/40" aria-label="Loading" />;

  const cur = data.currency || "";
  const money = (n: number) => `${cur}${n.toFixed(2)}`;

  // Sale calculator
  const p = num(price);
  const afterFirst = p * (1 - Math.min(num(off), 100) / 100);
  const afterExtra = afterFirst * (1 - Math.min(num(extra), 100) / 100);
  const final = afterExtra * (1 + num(tax) / 100);
  const saved = p - afterExtra;
  const effective = p > 0 ? (saved / p) * 100 : 0;

  // Budget
  const budget = num(data.budget);
  const spent = data.entries.reduce((a, e) => a + e.amount, 0);
  const left = budget - spent;
  const pct = budget > 0 ? Math.min(100, (spent / budget) * 100) : 0;
  const over = budget > 0 && spent > budget;

  const addEntry = (n: string, a: number) => {
    if (a <= 0) return;
    setData((s) => ({ ...s, entries: [...s.entries, { id: uid(), name: n.trim() || "Purchase", amount: a }] }));
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <section className="space-y-4 rounded-2xl bg-glow-peach/40 p-5">
        <h3 className="flex items-center gap-2 font-semibold"><Tag className="h-4 w-4" aria-hidden /> Sale price calculator</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label htmlFor="price" className="label">Original price</label>
            <input id="price" type="number" min={0} inputMode="decimal" className="input" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" />
          </div>
          <div>
            <label htmlFor="off" className="label">Discount %</label>
            <input id="off" type="number" min={0} max={100} inputMode="decimal" className="input" value={off} onChange={(e) => setOff(e.target.value)} placeholder="30" />
          </div>
          <div>
            <label htmlFor="extra" className="label">Extra discount %</label>
            <input id="extra" type="number" min={0} max={100} inputMode="decimal" className="input" value={extra} onChange={(e) => setExtra(e.target.value)} placeholder="10" />
          </div>
          <div className="col-span-2">
            <label htmlFor="tax" className="label">Tax % (optional)</label>
            <input id="tax" type="number" min={0} inputMode="decimal" className="input" value={tax} onChange={(e) => setTax(e.target.value)} placeholder="0" />
          </div>
        </div>
        <div className="rounded-2xl bg-white p-4 text-center">
          <p className="text-xs text-glow-muted">You pay</p>
          <p className="text-4xl font-bold">{money(final)}</p>
          <p className="mt-1 text-sm text-teal-700">You save {money(saved)} ({effective.toFixed(0)}% off)</p>
        </div>
        <button type="button" className="btn-primary w-full" disabled={final <= 0} onClick={() => { addEntry("Sale item", Number(final.toFixed(2))); setPrice(""); setOff(""); setExtra(""); }}>
          <Plus className="h-4 w-4" aria-hidden /> Add to my shopping budget
        </button>
      </section>

      <section className="space-y-4 rounded-2xl bg-glow-mint/30 p-5">
        <h3 className="font-semibold">Shopping budget</h3>
        <div className="grid grid-cols-[1fr_6rem] gap-3">
          <div>
            <label htmlFor="budget" className="label">My budget</label>
            <input id="budget" type="number" min={0} inputMode="decimal" className="input" value={data.budget} onChange={(e) => setData((s) => ({ ...s, budget: e.target.value }))} placeholder="200" />
          </div>
          <div>
            <label htmlFor="cur" className="label">Currency</label>
            <input id="cur" className="input" maxLength={4} value={data.currency} onChange={(e) => setData((s) => ({ ...s, currency: e.target.value }))} />
          </div>
        </div>

        <div>
          <div className="mb-1 flex justify-between text-sm"><span>Spent {money(spent)}</span><span className={over ? "font-semibold text-rose-600" : "text-glow-muted"}>{budget > 0 ? (over ? `Over by ${money(-left)}` : `${money(left)} left`) : "Set a budget"}</span></div>
          <div className="h-3 overflow-hidden rounded-full bg-white">
            <div className={`h-full rounded-full transition-all ${over ? "bg-rose-400" : pct > 80 ? "bg-amber-300" : "bg-glow-mint"}`} style={{ width: `${pct}%` }} />
          </div>
        </div>

        <div className="flex gap-2">
          <input className="input" placeholder="Item" aria-label="Item name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="input w-28" type="number" min={0} inputMode="decimal" placeholder="Price" aria-label="Item price" value={amt} onChange={(e) => setAmt(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { addEntry(name, num(amt)); setName(""); setAmt(""); } }} />
          <button type="button" className="btn-soft shrink-0" aria-label="Add item" onClick={() => { addEntry(name, num(amt)); setName(""); setAmt(""); }}><Plus className="h-4 w-4" aria-hidden /></button>
        </div>

        {data.entries.length > 0 && (
          <>
            <ul className="space-y-2">
              {data.entries.map((e) => (
                <li key={e.id} className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm">
                  <span className="flex-1 truncate">{e.name}</span>
                  <span className="font-semibold">{money(e.amount)}</span>
                  <button type="button" aria-label={`Remove ${e.name}`} onClick={() => setData((s) => ({ ...s, entries: s.entries.filter((x) => x.id !== e.id) }))} className="rounded-full p-1 text-glow-muted hover:bg-glow-pink/40"><Trash2 className="h-4 w-4" aria-hidden /></button>
                </li>
              ))}
            </ul>
            <button type="button" className="text-xs font-medium text-glow-muted underline underline-offset-4 hover:text-glow-ink" onClick={() => { if (window.confirm("Clear all items?")) setData((s) => ({ ...s, entries: [] })); }}>Clear all items</button>
          </>
        )}
      </section>
      <div className="lg:col-span-2"><Note>Extra discounts apply after the first discount, the way most stores stack coupons. Your budget and items are saved only in this browser.</Note></div>
    </div>
  );
}
