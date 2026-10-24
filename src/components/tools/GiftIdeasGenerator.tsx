"use client";

import { useMemo, useState } from "react";
import { Gift, Shuffle } from "lucide-react";
import Note from "./Note";

type Tier = 0 | 1 | 2; // low, mid, high

// [low, mid, high] ideas for each interest.
const IDEAS: Record<string, [string[], string[], string[]]> = {
  Skincare: [["Sheet mask set", "Lip balm trio"], ["Vitamin C serum", "Jade roller and gua sha"], ["Skincare gift set", "LED face mask"]],
  Fashion: [["Silk scrunchies", "Statement earrings"], ["Silk scarf", "Leather card holder"], ["Designer-style tote", "Quality leather belt"]],
  Books: [["Bookmark and a paperback", "Reading light"], ["Hardcover bestseller", "Book subscription (1 month)"], ["E-reader", "Annual book club membership"]],
  Cooking: [["Fancy spice blend", "Cute measuring spoons"], ["Cast iron skillet", "Cookbook by a favorite chef"], ["Stand mixer attachment", "Cooking class voucher"]],
  Fitness: [["Resistance bands", "Water bottle with time marks"], ["Yoga mat", "Gym tote bag"], ["Fitness tracker", "Boutique class pass"]],
  Travel: [["Packing cubes", "Passport holder"], ["Travel pillow and eye mask", "Scratch-off world map"], ["Carry-on suitcase", "Weekend getaway voucher"]],
  Tech: [["Phone grip and case", "Cable organizer"], ["Wireless earbuds", "Portable charger"], ["Smart speaker", "Tablet stand and keyboard"]],
  "Art & DIY": [["Watercolor set", "Sticker sheets"], ["Embroidery kit", "Calligraphy pen set"], ["Instant camera", "Art class voucher"]],
  Gaming: [["Gaming mouse pad", "Collectible pin"], ["Controller grips", "Board game"], ["Headset", "Gift card for a game store"]],
  Plants: [["Mini succulent in a cute pot", "Plant mister"], ["Large houseplant", "Self-watering planters"], ["Indoor herb garden kit", "Grow light"]],
  Music: [["Concert poster", "Guitar picks"], ["Vinyl record", "Bluetooth speaker"], ["Concert tickets", "Quality headphones"]],
  "Coffee & Tea": [["Loose-leaf tea sampler", "Cute mug"], ["Milk frother", "Specialty coffee beans"], ["Pour-over set", "Espresso machine"]],
  Wellness: [["Scented candle", "Bath bombs"], ["Weighted eye pillow", "Essential oil diffuser"], ["Spa day voucher", "Massage gun"]],
  Home: [["Photo frame", "Cozy socks"], ["Throw blanket", "Ceramic vase"], ["Linen bedding set", "Quality lamp"]],
};

const GENERAL: [string[], string[], string[]] = [
  ["Handwritten card and chocolates", "Personalized notebook"], ["Custom photo book", "Jewelry with their initial"], ["Weekend experience for two", "Personalized jewelry box"],
];

const RECIPIENTS = ["Friend", "Mom", "Sister", "Partner", "Coworker", "Teen"];
const OCCASIONS = ["Birthday", "Holiday", "Thank you", "Anniversary", "Just because"];
const TIERS = ["Under 25", "25 to 75", "Over 75"];

const tierFor = (amount: number): Tier => (amount <= 25 ? 0 : amount <= 75 ? 1 : 2);

export default function GiftIdeasGenerator() {
  const [budget, setBudget] = useState(40);
  const [currency, setCurrency] = useState("$");
  const [recipient, setRecipient] = useState(RECIPIENTS[0]);
  const [occasion, setOccasion] = useState(OCCASIONS[0]);
  const [interests, setInterests] = useState<string[]>([]);
  const [seed, setSeed] = useState(0);

  const tier = tierFor(budget);

  const ideas = useMemo(() => {
    const keys = interests.length ? interests : ["__general"];
    return keys.map((k) => {
      const [low, mid, high] = k === "__general" ? GENERAL : IDEAS[k];
      const pool = [low, mid, high][tier];
      const list = seed % 2 === 0 ? pool : [...pool].reverse();
      return { interest: k === "__general" ? "Always-safe picks" : k, list };
    });
  }, [interests, tier, seed]);

  const surprise = () => {
    const all = ideas.flatMap((i) => i.list);
    return all[Math.abs(seed) % all.length];
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="budget" className="label">Budget: <strong>{currency}{budget}</strong> <span className="font-normal text-glow-muted">({TIERS[tier]} range)</span></label>
          <input id="budget" type="range" min={5} max={200} step={5} value={budget} onChange={(e) => setBudget(Number(e.target.value))} className="w-full accent-[#ffb6b9]" />
          <div className="mt-2 flex items-center gap-2 text-sm"><label htmlFor="cur" className="text-glow-muted">Currency symbol</label><input id="cur" className="input w-20 py-1.5" maxLength={4} value={currency} onChange={(e) => setCurrency(e.target.value)} /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="rec" className="label">Who is it for?</label>
            <select id="rec" className="input" value={recipient} onChange={(e) => setRecipient(e.target.value)}>{RECIPIENTS.map((r) => <option key={r}>{r}</option>)}</select>
          </div>
          <div>
            <label htmlFor="occ" className="label">Occasion</label>
            <select id="occ" className="input" value={occasion} onChange={(e) => setOccasion(e.target.value)}>{OCCASIONS.map((r) => <option key={r}>{r}</option>)}</select>
          </div>
        </div>
      </div>

      <div>
        <p className="label">Their interests (pick any)</p>
        <div className="flex flex-wrap gap-2">
          {Object.keys(IDEAS).map((k) => (
            <button key={k} type="button" aria-pressed={interests.includes(k)} onClick={() => setInterests((p) => (p.includes(k) ? p.filter((x) => x !== k) : [...p, k]))}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${interests.includes(k) ? "bg-glow-pink shadow-soft" : "bg-glow-bg text-glow-muted hover:bg-glow-peach/60"}`}>{k}</button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="flex items-center gap-2 text-lg font-semibold"><Gift className="h-5 w-5" aria-hidden /> {occasion} ideas for your {recipient.toLowerCase()}</h3>
          <button type="button" className="btn-soft" onClick={() => setSeed((s) => s + 1)}><Shuffle className="h-4 w-4" aria-hidden /> Surprise me</button>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-glow-pink/30 to-glow-peach/50 p-5 text-center">
          <p className="text-xs text-glow-muted">Top pick</p>
          <p className="text-2xl font-bold">{surprise()}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {ideas.map((g) => (
            <div key={g.interest} className="rounded-2xl bg-glow-bg p-4">
              <p className="text-sm font-semibold">{g.interest}</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm marker:text-glow-pink">{g.list.map((x) => <li key={x}>{x}</li>)}</ul>
            </div>
          ))}
        </div>
        <p className="rounded-2xl bg-glow-mint/30 p-4 text-sm">
          <strong>Make it personal:</strong> add a handwritten note about a favorite memory. It often means more than the price tag.
        </p>
      </div>
      <Note>Price ranges are approximate and use your own currency. Prices vary by store and country, so check current prices before buying.</Note>
    </div>
  );
}
