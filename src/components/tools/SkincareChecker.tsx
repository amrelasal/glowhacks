"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Eraser, Info, ShieldAlert, Wand2 } from "lucide-react";

type Level = "avoid" | "caution";

interface Rule {
  id: string;
  label: string;
  level: Level;
  pattern: RegExp;
  reason: string;
}

// Patterns are tested against lowercase ingredient names.
const RULES: Rule[] = [
  {
    id: "drying-alcohol",
    label: "Drying alcohols",
    level: "avoid",
    pattern: /^alcohol$|alcohol denat|denatured alcohol|^sd alcohol|isopropyl alcohol|^ethanol$|^methanol$/,
    reason: "Can strip the skin barrier and cause dryness, tightness, or irritation, especially on dry or sensitive skin. (Fatty alcohols like cetyl or stearyl alcohol are gentle and are not flagged.)",
  },
  {
    id: "parabens",
    label: "Parabens",
    level: "avoid",
    pattern: /paraben/,
    reason: "Common preservatives (methylparaben, propylparaben, etc.) that some people prefer to avoid because of ongoing debate about hormone-disrupting effects.",
  },
  {
    id: "formaldehyde",
    label: "Formaldehyde releasers",
    level: "avoid",
    pattern: /dmdm hydantoin|quaternium-15|imidazolidinyl urea|diazolidinyl urea|formaldehyde|bronopol|2-bromo-2-nitropropane/,
    reason: "Preservatives that slowly release small amounts of formaldehyde, a known skin allergen and irritant.",
  },
  {
    id: "phthalates",
    label: "Phthalates",
    level: "avoid",
    pattern: /phthalate/,
    reason: "Used to make fragrances last and plastics flexible. Linked to hormone-disruption concerns.",
  },
  {
    id: "triclosan",
    label: "Triclosan / triclocarban",
    level: "avoid",
    pattern: /triclosan|triclocarban/,
    reason: "Antibacterial agents that have been restricted in many products due to safety and resistance concerns.",
  },
  {
    id: "hydroquinone",
    label: "Hydroquinone",
    level: "avoid",
    pattern: /hydroquinone/,
    reason: "A strong skin-lightening agent that is restricted in many countries. Use only under a dermatologist's guidance.",
  },
  {
    id: "sulfates",
    label: "Harsh sulfates",
    level: "caution",
    pattern: /(lauryl|laureth) sulfate/,
    reason: "Strong cleansing agents (SLS, SLES, ammonium lauryl sulfate) that can be drying or irritating for sensitive or dry skin and scalps.",
  },
  {
    id: "fragrance",
    label: "Synthetic fragrance",
    level: "caution",
    pattern: /fragrance|parfum|perfume/,
    reason: "A top cause of contact allergies. The exact ingredients inside \"fragrance\" are not disclosed on the label.",
  },
  {
    id: "essential-oils",
    label: "Essential oils & fragrance allergens",
    level: "caution",
    pattern: /(lavender|lavandula|peppermint|mentha|eucalyptus|tea tree|melaleuca|bergamot|ylang|citrus|lemon|orange|cinnamon)[^,]*oil|limonene|linalool|citronellol|geraniol|eugenol|cinnamal|citral|coumarin|hydroxycitronellal/,
    reason: "Natural does not always mean gentle. These can trigger redness or allergic reactions, especially on sensitive skin.",
  },
  {
    id: "irritants",
    label: "Potential irritants",
    level: "caution",
    pattern: /^menthol$|^camphor$|witch hazel|hamamelis/,
    reason: "Cooling or astringent ingredients that can feel refreshing but may irritate compromised or sensitive skin.",
  },
  {
    id: "uv-filters",
    label: "Controversial UV filters",
    level: "caution",
    pattern: /oxybenzone|benzophenone-3|octinoxate|ethylhexyl methoxycinnamate/,
    reason: "Chemical sunscreen filters that are banned in some regions to protect coral reefs, and are debated for hormone effects.",
  },
  {
    id: "bht",
    label: "BHT / BHA preservatives",
    level: "caution",
    pattern: /butylated hydroxy(toluene|anisole)|^bht$/,
    reason: "Synthetic antioxidants used to keep products fresh. Some people are sensitive to them.",
  },
  {
    id: "dyes",
    label: "Synthetic dyes",
    level: "caution",
    pattern: /^ci ?(1|4)\d{4}$|^(fd&c|d&c) /,
    reason: "Colorants that add no skin benefit and can irritate sensitive skin or clog pores in some people.",
  },
  {
    id: "mineral-oil",
    label: "Mineral oil & petrolatum",
    level: "caution",
    pattern: /mineral oil|paraffinum liquidum|petrolatum/,
    reason: "Very effective at sealing in moisture, but some people with acne-prone skin find them too heavy. Highly refined grades are generally considered safe.",
  },
  {
    id: "peg",
    label: "PEG compounds",
    level: "caution",
    pattern: /^peg-\d+/,
    reason: "Texture and cleansing helpers that can increase the penetration of other ingredients and may carry manufacturing impurities.",
  },
  {
    id: "retinoids",
    label: "Retinoids",
    level: "caution",
    pattern: /retinol|retinal$|retinyl|tretinoin|adapalene/,
    reason: "Powerful and effective, but can cause dryness and sun sensitivity. Use SPF daily and check with a doctor if you are pregnant or planning to be.",
  },
];

const SAMPLE =
  "Aqua, Alcohol Denat., Glycerin, Sodium Lauryl Sulfate, Methylparaben, Propylparaben, Parfum (Fragrance), Limonene, Cetearyl Alcohol, Niacinamide, Tocopherol, CI 19140";

/** Split on commas that are not inside parentheses. */
function splitIngredients(text: string): string[] {
  const cleaned = text.replace(/^\s*ingredients?\s*[:\-]/i, "").replace(/[•·;\n\r]+/g, ",");
  const parts: string[] = [];
  let depth = 0;
  let current = "";
  for (const ch of cleaned) {
    if (ch === "(") depth++;
    if (ch === ")") depth = Math.max(0, depth - 1);
    if (ch === "," && depth === 0) {
      parts.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  parts.push(current);
  return parts
    .map((p) => p.replace(/\s+/g, " ").replace(/\.+$/, "").trim())
    .filter(Boolean);
}

/** The ingredient itself, without parentheses, plus each parenthesised name. */
function variantsOf(ingredient: string): string[] {
  const lower = ingredient.toLowerCase();
  const outside = lower.replace(/\(.*?\)/g, "").trim();
  const inside = [...lower.matchAll(/\((.*?)\)/g)].flatMap((m) => m[1].split(",").map((s) => s.trim()));
  return [lower, outside, ...inside].filter(Boolean);
}

export default function SkincareChecker() {
  const [text, setText] = useState("");

  const { ingredients, findings } = useMemo(() => {
    const list = splitIngredients(text);
    const found = RULES.map((rule) => ({
      rule,
      matches: list.filter((ing) => variantsOf(ing).some((v) => rule.pattern.test(v))),
    })).filter((f) => f.matches.length > 0);
    return { ingredients: list, findings: found };
  }, [text]);

  const avoid = findings.filter((f) => f.rule.level === "avoid");
  const caution = findings.filter((f) => f.rule.level === "caution");
  const score = Math.max(0, 100 - avoid.length * 22 - caution.length * 8);

  const verdict =
    score >= 90
      ? { label: "Looking gentle", tone: "bg-glow-mint/60 text-teal-900" }
      : score >= 60
      ? { label: "Worth a closer look", tone: "bg-amber-100 text-amber-900" }
      : { label: "Several flags found", tone: "bg-glow-pink/40 text-rose-900" };

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="ingredients" className="label">Paste the ingredient list</label>
        <textarea
          id="ingredients"
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Aqua, Glycerin, Alcohol Denat., Methylparaben, Parfum..."
          className="input resize-y"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={() => setText(SAMPLE)} className="btn-soft">
            <Wand2 className="h-4 w-4" aria-hidden /> Try a sample
          </button>
          <button type="button" onClick={() => setText("")} disabled={!text} className="btn-ghost">
            <Eraser className="h-4 w-4" aria-hidden /> Clear
          </button>
        </div>
      </div>

      {ingredients.length === 0 ? (
        <div className="rounded-2xl bg-glow-peach/40 p-5 text-sm text-glow-muted">
          Copy the ingredients from the back of your product (or from the brand&apos;s website) and paste them above. Results
          appear instantly, and nothing leaves your device.
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-4 rounded-2xl bg-glow-bg p-5">
            <div className="flex h-20 w-20 flex-col items-center justify-center rounded-full bg-white shadow-soft">
              <span className="text-2xl font-bold leading-none">{score}</span>
              <span className="text-[10px] font-medium text-glow-muted">Glow score</span>
            </div>
            <div>
              <span className={`rounded-full px-3 py-1 text-sm font-semibold ${verdict.tone}`}>{verdict.label}</span>
              <p className="mt-2 text-sm text-glow-muted">
                Checked {ingredients.length} ingredient{ingredients.length === 1 ? "" : "s"}: {avoid.length} to avoid,{" "}
                {caution.length} to watch.
              </p>
            </div>
          </div>

          {findings.length === 0 && (
            <div className="flex items-start gap-3 rounded-2xl bg-glow-mint/40 p-5">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-teal-700" aria-hidden />
              <p className="text-sm">
                No common irritants or harsh chemicals from our checklist were found. Remember that every skin type is
                different, so patch-test new products.
              </p>
            </div>
          )}

          {[...avoid, ...caution].map(({ rule, matches }) => {
            const isAvoid = rule.level === "avoid";
            return (
              <div
                key={rule.id}
                className={`rounded-2xl border p-5 ${isAvoid ? "border-glow-pink bg-glow-pink/15" : "border-amber-200 bg-amber-50"}`}
              >
                <div className="flex items-center gap-2">
                  {isAvoid ? (
                    <ShieldAlert className="h-5 w-5 text-rose-600" aria-hidden />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-amber-600" aria-hidden />
                  )}
                  <h3 className="font-semibold">{rule.label}</h3>
                  <span className={`ml-auto rounded-full px-2.5 py-0.5 text-xs font-semibold ${isAvoid ? "bg-rose-100 text-rose-800" : "bg-amber-100 text-amber-800"}`}>
                    {isAvoid ? "Avoid" : "Watch"}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-glow-ink/80">{rule.reason}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {matches.map((m) => (
                    <span key={m} className="rounded-full bg-white px-3 py-1 text-xs font-medium shadow-sm">{m}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="flex items-start gap-2 text-xs leading-relaxed text-glow-muted">
        <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
        This checker is a simple guide, not medical advice. Whether an ingredient is a problem depends on its
        concentration, your skin type, and your sensitivities. See a dermatologist for persistent skin concerns.
      </p>
    </div>
  );
}
