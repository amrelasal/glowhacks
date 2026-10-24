"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { uid } from "@/lib/util";
import Note from "./Note";

const AISLES = ["Produce", "Bakery", "Meat & Seafood", "Dairy & Eggs", "Frozen", "Pantry", "Snacks & Drinks", "Household", "Personal Care", "Other"] as const;

// Checked in this order, first match wins.
const RULES: [string, RegExp][] = [
  ["Frozen", /\b(frozen|ice cream|popsicle|gelato)/i],
  ["Personal Care", /\b(shampoo|conditioner|toothpaste|toothbrush|deodorant|lotion|razor|tampon|pads?\b|sunscreen|makeup|cotton|face wash|mouthwash|floss|serum|cleanser|moisturi[sz]er|mascara|lipstick|hand cream|body wash)/i],
  ["Household", /\b(detergent|dish soap|paper towel|tissue|toilet paper|trash bag|bin bag|sponge|foil|cling wrap|bleach|cleaner|laundry|batter(y|ies)|light bulb|napkin|candle)/i],
  ["Pantry", /\b(peanut butter|almond butter|rice|pasta|flour|sugar|oil\b|vinegar|sauce|spice|salt\b|black pepper|beans?\b|lentil|oats?\b|cereal|honey|jam\b|canned|soup|noodle|stock|broth|ketchup|mustard|mayo|baking|tuna|quinoa|couscous|olive)/i],
  ["Snacks & Drinks", /\b(chips|chocolate|cookie|snack|candy|cracker|popcorn|juice|soda|water\b|coffee|tea\b|tea ?bags?|wine|beer|sparkling|kombucha|nuts|granola|protein bar)/i],
  ["Dairy & Eggs", /\b(milk|cheese|yogh?urt|butter|eggs?\b|cream|cottage|kefir)/i],
  ["Meat & Seafood", /\b(chicken|beef|pork|turkey|fish|salmon|shrimp|steak|bacon|sausage|ham\b|lamb|mince|meat|tofu)/i],
  ["Bakery", /\b(bread|bagel|buns?\b|tortilla|croissant|muffin|cake|rolls?\b|pita|baguette)/i],
  ["Produce", /\b(apples?|banana|lettuce|spinach|tomato|onion|garlic|potato|carrot|cucumber|avocado|lemon|lime|orange|berr(y|ies)|strawberr|grapes?|pepper|broccoli|mushroom|herbs?|basil|cilantro|parsley|fruit|vegetable|salad|zucchini|cabbage|celery|ginger|mango|pineapple|melon|kale|pear|peach)/i],
];

const guess = (name: string) => RULES.find(([, re]) => re.test(name))?.[0] ?? "Other";

interface Item { id: string; name: string; aisle: string; done: boolean }

export default function GroceryOrganizer() {
  const [data, setData, loaded] = useLocalStorage<{ items: Item[] }>("glowhacks:grocery", { items: [] });
  const [text, setText] = useState("");

  if (!loaded) return <div className="h-48 animate-pulse rounded-2xl bg-glow-peach/40" aria-label="Loading" />;

  const add = () => {
    const names = text.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
    if (!names.length) return;
    setData((p) => ({ items: [...p.items, ...names.map((name) => ({ id: uid(), name, aisle: guess(name), done: false }))] }));
    setText("");
  };

  const patch = (id: string, v: Partial<Item>) => setData((p) => ({ items: p.items.map((i) => (i.id === id ? { ...i, ...v } : i)) }));
  const checked = data.items.filter((i) => i.done).length;

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="g" className="label">Add items (type or paste several, separated by commas or new lines)</label>
        <div className="flex gap-2">
          <textarea id="g" rows={2} className="input resize-y" value={text} onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); add(); } }} placeholder="milk, bananas, shampoo, pasta, paper towels" />
          <button type="button" className="btn-primary shrink-0 self-start" onClick={add}><Plus className="h-4 w-4" aria-hidden /> Add</button>
        </div>
      </div>

      {data.items.length === 0 ? (
        <div className="rounded-2xl bg-glow-peach/40 p-5 text-sm text-glow-muted">Your list is empty. Add items and they will be sorted by supermarket aisle automatically.</div>
      ) : (
        <>
          <div className="flex items-center justify-between text-sm">
            <span className="text-glow-muted">{checked} of {data.items.length} in the cart</span>
            <button type="button" className="font-medium underline underline-offset-4 hover:text-glow-ink disabled:opacity-40" disabled={!checked} onClick={() => setData((p) => ({ items: p.items.filter((i) => !i.done) }))}>Clear checked</button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {AISLES.map((a) => {
              const items = data.items.filter((i) => i.aisle === a);
              if (!items.length) return null;
              return (
                <section key={a} className="rounded-2xl bg-glow-bg p-4">
                  <h3 className="mb-2 text-sm font-semibold">{a} <span className="font-normal text-glow-muted">({items.length})</span></h3>
                  <ul className="space-y-1">
                    {items.map((i) => (
                      <li key={i.id} className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-white">
                        <input id={i.id} type="checkbox" checked={i.done} onChange={() => patch(i.id, { done: !i.done })} className="h-4 w-4 shrink-0 rounded accent-[#ffb6b9]" />
                        <label htmlFor={i.id} className={`flex-1 cursor-pointer text-sm ${i.done ? "text-glow-muted line-through" : ""}`}>{i.name}</label>
                        <select aria-label={`Aisle for ${i.name}`} value={i.aisle} onChange={(e) => patch(i.id, { aisle: e.target.value })} className="max-w-28 rounded-lg border border-glow-peach bg-white px-1.5 py-1 text-xs">
                          {AISLES.map((x) => <option key={x}>{x}</option>)}
                        </select>
                        <button type="button" aria-label={`Remove ${i.name}`} onClick={() => setData((p) => ({ items: p.items.filter((x) => x.id !== i.id) }))} className="rounded-full p-1 text-glow-muted hover:bg-glow-pink/40"><Trash2 className="h-3.5 w-3.5" aria-hidden /></button>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        </>
      )}
      <Note>Aisles are guessed from the item name. If one is wrong, change it with the dropdown. Aisles are listed in a typical store order, and your list is saved only in this browser.</Note>
    </div>
  );
}
