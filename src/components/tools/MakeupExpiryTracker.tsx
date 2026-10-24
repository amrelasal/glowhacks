"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Plus, Trash2, XCircle } from "lucide-react";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { formatNum, keyToNum, todayKey, todayNum } from "@/lib/date";
import { uid } from "@/lib/util";
import Note from "./Note";

const TYPES = [
  { name: "Mascara", pao: 3 },
  { name: "Liquid eyeliner", pao: 3 },
  { name: "Foundation", pao: 12 },
  { name: "Concealer", pao: 12 },
  { name: "Lipstick", pao: 18 },
  { name: "Lip gloss", pao: 12 },
  { name: "Powder, blush or bronzer", pao: 24 },
  { name: "Cream blush", pao: 12 },
  { name: "Eyeshadow", pao: 24 },
  { name: "Nail polish", pao: 12 },
  { name: "Cleanser", pao: 12 },
  { name: "Moisturizer", pao: 12 },
  { name: "Serum", pao: 9 },
  { name: "Sunscreen", pao: 12 },
  { name: "Other", pao: 12 },
];

interface Item {
  id: string;
  name: string;
  opened: string;
  pao: number;
}

function addMonths(key: string, months: number) {
  const [y, m, d] = key.split("-").map(Number);
  const total = m - 1 + months;
  const ny = y + Math.floor(total / 12);
  const nm = ((total % 12) + 12) % 12;
  const dim = new Date(Date.UTC(ny, nm + 1, 0)).getUTCDate();
  return Math.round(Date.UTC(ny, nm, Math.min(d, dim)) / 86400000);
}

export default function MakeupExpiryTracker() {
  const [data, setData, loaded] = useLocalStorage<{ items: Item[] }>("glowhacks:makeup", { items: [] });
  const [typeIdx, setTypeIdx] = useState(0);
  const [name, setName] = useState("");
  const [opened, setOpened] = useState("");
  const [pao, setPao] = useState(TYPES[0].pao);

  const today = todayNum();

  const rows = useMemo(
    () =>
      data.items
        .map((it) => {
          const expiry = addMonths(it.opened, it.pao);
          return { ...it, expiry, left: expiry - today };
        })
        .sort((a, b) => a.expiry - b.expiry),
    [data.items, today]
  );

  if (!loaded) return <div className="h-48 animate-pulse rounded-2xl bg-glow-peach/40" aria-label="Loading" />;

  const add = () => {
    if (!opened) return;
    const label = name.trim() || TYPES[typeIdx].name;
    setData((p) => ({ items: [...p.items, { id: uid(), name: label, opened, pao }] }));
    setName("");
    setOpened("");
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="mtype" className="label">Product type</label>
          <select
            id="mtype"
            className="input"
            value={typeIdx}
            onChange={(e) => {
              const i = Number(e.target.value);
              setTypeIdx(i);
              setPao(TYPES[i].pao);
            }}
          >
            {TYPES.map((t, i) => (
              <option key={t.name} value={i}>{t.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="mname" className="label">Name or shade (optional)</label>
          <input id="mname" className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Rosy Nude lipstick" />
        </div>
        <div>
          <label htmlFor="mopen" className="label">Date opened</label>
          <input id="mopen" type="date" className="input" max={todayKey()} value={opened} onChange={(e) => setOpened(e.target.value)} />
        </div>
        <div>
          <label htmlFor="mpao" className="label">PAO symbol (months): <strong>{pao}M</strong></label>
          <input id="mpao" type="range" min={1} max={36} value={pao} onChange={(e) => setPao(Number(e.target.value))} className="w-full accent-[#ffb6b9]" />
          <p className="text-xs text-glow-muted">Preset for this product type. Match it to the number on your packaging.</p>
        </div>
      </div>
      <button type="button" onClick={add} disabled={!opened} className="btn-primary">
        <Plus className="h-4 w-4" aria-hidden /> Add product
      </button>

      {rows.length === 0 ? (
        <div className="rounded-2xl bg-glow-peach/40 p-5 text-sm text-glow-muted">
          Your products will appear here, soonest expiry first. Saved only in this browser.
        </div>
      ) : (
        <ul className="space-y-3">
          {rows.map((r) => {
            const status =
              r.left < 0
                ? { Icon: XCircle, tone: "border-glow-pink bg-glow-pink/20", text: `Expired ${-r.left} day${-r.left === 1 ? "" : "s"} ago. Time to toss it.` }
                : r.left <= 30
                ? { Icon: AlertTriangle, tone: "border-amber-200 bg-amber-50", text: `Expires in ${r.left} day${r.left === 1 ? "" : "s"}. Use it up soon.` }
                : { Icon: CheckCircle2, tone: "border-glow-mint bg-glow-mint/25", text: `Good for ${r.left} more days.` };
            return (
              <li key={r.id} className={`flex items-center gap-4 rounded-2xl border p-4 ${status.tone}`}>
                <status.Icon className="h-6 w-6 shrink-0" aria-hidden />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{r.name}</p>
                  <p className="text-xs text-glow-muted">
                    Opened {formatNum(keyToNum(r.opened))} · {r.pao}M · expires <strong>{formatNum(r.expiry)}</strong>
                  </p>
                  <p className="mt-1 text-sm">{status.text}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setData((p) => ({ items: p.items.filter((x) => x.id !== r.id) }))}
                  className="rounded-full p-2 text-glow-muted hover:bg-white hover:text-glow-ink"
                  aria-label={`Remove ${r.name}`}
                >
                  <Trash2 className="h-4 w-4" aria-hidden />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <Note>
        The PAO symbol is a small open jar icon with a number and an M (for example 12M). Throw products away sooner if
        the smell, color, or texture changes, or if you get irritation. Eye products are the most important to replace on time.
      </Note>
    </div>
  );
}
