"use client";

import { useState } from "react";
import { Plus, RotateCcw, Trash2, Wand2 } from "lucide-react";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { uid } from "@/lib/util";
import Note from "./Note";

const TRIPS = ["Beach", "City break", "Hiking & nature", "Ski & winter", "Business", "Road trip"] as const;
const WEATHER = ["Hot", "Cold", "Rainy"] as const;
const GROUPS = ["Documents & money", "Clothing", "Toiletries", "Tech", "Extras"] as const;

interface Item { id: string; group: string; label: string; qty: number; done: boolean }
interface State { title: string; items: Item[] }

type Draft = [string, string, number?];

function build(type: string, days: number, weather: string[]): Draft[] {
  const d = days;
  const l: Draft[] = [
    ["Documents & money", "Passport or ID"], ["Documents & money", "Wallet, cards and some cash"], ["Documents & money", "Tickets and bookings"], ["Documents & money", "Travel insurance details"],
    ["Clothing", "Underwear", Math.min(d + 1, 10)], ["Clothing", "Socks", Math.min(d + 1, 8)], ["Clothing", "Tops", Math.min(Math.ceil(d * 0.8) + 1, 8)],
    ["Clothing", "Bottoms", Math.min(Math.ceil(d / 3) + 1, 5)], ["Clothing", "Sleepwear", d > 6 ? 2 : 1], ["Clothing", "Comfortable walking shoes"],
    ["Toiletries", "Toothbrush and toothpaste"], ["Toiletries", "Cleanser and moisturizer"], ["Toiletries", "Sunscreen"], ["Toiletries", "Deodorant"], ["Toiletries", "Hair brush and ties"], ["Toiletries", "Medications and first-aid basics"],
    ["Tech", "Phone charger"], ["Tech", "Power bank"], ["Tech", "Headphones"],
    ["Extras", "Reusable water bottle"], ["Extras", "Tote or day bag"],
  ];
  if (d > 7) l.push(["Extras", "Laundry bag"], ["Toiletries", "Travel laundry detergent"]);
  if (type === "Beach") l.push(["Clothing", "Swimsuits", Math.min(Math.ceil(d / 3) + 1, 4)], ["Clothing", "Cover-up or sarong"], ["Clothing", "Flip-flops or sandals"], ["Extras", "Beach towel"], ["Extras", "Sunglasses and sun hat"], ["Toiletries", "After-sun lotion"], ["Tech", "Waterproof phone pouch"]);
  if (type === "City break") l.push(["Clothing", "Stylish comfy outfit for dinner"], ["Extras", "Crossbody bag"], ["Tech", "Offline maps downloaded"], ["Extras", "Small umbrella"]);
  if (type === "Hiking & nature") l.push(["Clothing", "Hiking boots"], ["Clothing", "Moisture-wicking layers", 3], ["Clothing", "Light rain jacket"], ["Extras", "Insect repellent"], ["Extras", "Snacks and trail mix"], ["Extras", "Headlamp or flashlight"], ["Toiletries", "Blister plasters"]);
  if (type === "Ski & winter") l.push(["Clothing", "Thermal base layers", 3], ["Clothing", "Waterproof jacket and pants"], ["Clothing", "Gloves, hat and scarf"], ["Clothing", "Wool socks", Math.min(d, 6)], ["Toiletries", "Lip balm with SPF"], ["Extras", "Goggles or sunglasses"], ["Toiletries", "Heavy moisturizer"]);
  if (type === "Business") l.push(["Clothing", "Work outfits", Math.min(d, 5)], ["Clothing", "Dress shoes"], ["Clothing", "Blazer or jacket"], ["Extras", "Business cards"], ["Tech", "Laptop and charger"], ["Documents & money", "Meeting notes or agenda"]);
  if (type === "Road trip") l.push(["Documents & money", "Driver's license and car papers"], ["Tech", "Car phone mount and charger"], ["Extras", "Playlist, podcasts or audiobooks"], ["Extras", "Snacks and drinks"], ["Extras", "Blanket or travel pillow"], ["Extras", "Emergency kit"]);
  if (weather.includes("Hot")) l.push(["Clothing", "Light breathable clothes"], ["Extras", "Hat and sunglasses"], ["Toiletries", "Extra sunscreen"]);
  if (weather.includes("Cold")) l.push(["Clothing", "Warm jacket"], ["Clothing", "Sweater or fleece", 2], ["Clothing", "Gloves and hat"]);
  if (weather.includes("Rainy")) l.push(["Clothing", "Rain jacket"], ["Extras", "Compact umbrella"], ["Clothing", "Waterproof shoes"]);
  const seen = new Set<string>();
  return l.filter(([g, lab]) => (seen.has(g + lab) ? false : (seen.add(g + lab), true)));
}

export default function SmartPackingList() {
  const [data, setData, loaded] = useLocalStorage<State>("glowhacks:packing", { title: "", items: [] });
  const [dest, setDest] = useState("");
  const [type, setType] = useState<string>(TRIPS[0]);
  const [days, setDays] = useState(5);
  const [weather, setWeather] = useState<string[]>([]);
  const [custom, setCustom] = useState("");
  const [customGroup, setCustomGroup] = useState<string>("Extras");

  if (!loaded) return <div className="h-64 animate-pulse rounded-2xl bg-glow-peach/40" aria-label="Loading" />;

  const generate = () => {
    const items = build(type, days, weather).map(([group, label, qty]) => ({ id: uid(), group, label, qty: qty ?? 0, done: false }));
    setData({ title: `${dest.trim() || type} · ${days} day${days === 1 ? "" : "s"}`, items });
  };

  const toggle = (id: string) => setData((p) => ({ ...p, items: p.items.map((i) => (i.id === id ? { ...i, done: !i.done } : i)) }));
  const addCustom = () => {
    if (!custom.trim()) return;
    setData((p) => ({ ...p, items: [...p.items, { id: uid(), group: customGroup, label: custom.trim(), qty: 0, done: false }] }));
    setCustom("");
  };
  const done = data.items.filter((i) => i.done).length;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="dest" className="label">Destination (optional)</label>
          <input id="dest" className="input" value={dest} onChange={(e) => setDest(e.target.value)} placeholder="e.g. Lisbon" />
        </div>
        <div>
          <label htmlFor="days" className="label">Trip length: <strong>{days} day{days === 1 ? "" : "s"}</strong></label>
          <input id="days" type="range" min={1} max={30} value={days} onChange={(e) => setDays(Number(e.target.value))} className="w-full accent-[#ffb6b9]" />
        </div>
        <div>
          <p className="label">Trip type</p>
          <div className="flex flex-wrap gap-2">
            {TRIPS.map((t) => (
              <button key={t} type="button" aria-pressed={type === t} onClick={() => setType(t)} className={`rounded-full px-3.5 py-1.5 text-sm font-medium ${type === t ? "bg-glow-pink shadow-soft" : "bg-glow-bg text-glow-muted"}`}>{t}</button>
            ))}
          </div>
        </div>
        <div>
          <p className="label">Weather</p>
          <div className="flex flex-wrap gap-2">
            {WEATHER.map((w) => (
              <button key={w} type="button" aria-pressed={weather.includes(w)} onClick={() => setWeather((p) => (p.includes(w) ? p.filter((x) => x !== w) : [...p, w]))}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium ${weather.includes(w) ? "bg-glow-mint shadow-soft" : "bg-glow-bg text-glow-muted"}`}>{w}</button>
            ))}
          </div>
        </div>
      </div>
      <button type="button" className="btn-primary" onClick={generate}><Wand2 className="h-4 w-4" aria-hidden /> Generate my packing list</button>

      {data.items.length > 0 && (
        <div className="space-y-5">
          <div>
            <div className="mb-1 flex justify-between text-sm"><span className="font-semibold">{data.title}</span><span className="text-glow-muted">{done}/{data.items.length} packed</span></div>
            <div className="h-2.5 overflow-hidden rounded-full bg-glow-bg"><div className="h-full rounded-full bg-glow-mint transition-all" style={{ width: `${(done / data.items.length) * 100}%` }} /></div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {GROUPS.map((g) => {
              const items = data.items.filter((i) => i.group === g);
              if (!items.length) return null;
              return (
                <section key={g} className="rounded-2xl bg-glow-bg p-4">
                  <h3 className="mb-2 text-sm font-semibold">{g}</h3>
                  <ul className="space-y-1">
                    {items.map((i) => (
                      <li key={i.id} className="group flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-white">
                        <input id={i.id} type="checkbox" checked={i.done} onChange={() => toggle(i.id)} className="h-4 w-4 shrink-0 rounded accent-[#ffb6b9]" />
                        <label htmlFor={i.id} className={`flex-1 cursor-pointer text-sm ${i.done ? "text-glow-muted line-through" : ""}`}>{i.qty > 0 ? `${i.qty}× ` : ""}{i.label}</label>
                        <button type="button" aria-label={`Remove ${i.label}`} onClick={() => setData((p) => ({ ...p, items: p.items.filter((x) => x.id !== i.id) }))} className="rounded-full p-1 text-glow-muted opacity-60 hover:bg-glow-pink/40 hover:opacity-100">
                          <Trash2 className="h-3.5 w-3.5" aria-hidden />
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input className="input min-w-40 flex-1" value={custom} onChange={(e) => setCustom(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") addCustom(); }} placeholder="Add your own item" aria-label="Custom item" />
            <select className="input w-44" value={customGroup} onChange={(e) => setCustomGroup(e.target.value)} aria-label="Group">{GROUPS.map((g) => <option key={g}>{g}</option>)}</select>
            <button type="button" className="btn-soft" onClick={addCustom}><Plus className="h-4 w-4" aria-hidden /> Add</button>
            <button type="button" className="btn-ghost" onClick={() => { if (window.confirm("Clear this packing list?")) setData({ title: "", items: [] }); }}><RotateCcw className="h-4 w-4" aria-hidden /> Clear</button>
          </div>
        </div>
      )}
      <Note>Quantities assume you can do laundry on longer trips. Your list is saved only in this browser. Always check airline baggage rules and local entry requirements.</Note>
    </div>
  );
}
