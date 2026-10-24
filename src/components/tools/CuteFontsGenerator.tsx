"use client";

import { useMemo, useState } from "react";
import { Check, Copy, Info } from "lucide-react";

interface MapSpec {
  upper?: number;
  lower?: number;
  digit?: number;
  /** Characters whose code point is not contiguous in Unicode. */
  exceptions?: Record<string, number>;
}

function makeMapper(spec: MapSpec) {
  return (text: string) =>
    Array.from(text)
      .map((ch) => {
        if (spec.exceptions?.[ch] !== undefined) return String.fromCodePoint(spec.exceptions[ch]);
        const c = ch.charCodeAt(0);
        if (spec.upper !== undefined && c >= 65 && c <= 90) return String.fromCodePoint(spec.upper + c - 65);
        if (spec.lower !== undefined && c >= 97 && c <= 122) return String.fromCodePoint(spec.lower + c - 97);
        if (spec.digit !== undefined && c >= 48 && c <= 57) return String.fromCodePoint(spec.digit + c - 48);
        return ch;
      })
      .join("");
}

const SMALL_CAPS: Record<string, string> = {
  a: "ᴀ", b: "ʙ", c: "ᴄ", d: "ᴅ", e: "ᴇ", f: "ꜰ", g: "ɢ", h: "ʜ", i: "ɪ", j: "ᴊ", k: "ᴋ", l: "ʟ", m: "ᴍ",
  n: "ɴ", o: "ᴏ", p: "ᴘ", q: "ǫ", r: "ʀ", s: "ꜱ", t: "ᴛ", u: "ᴜ", v: "ᴠ", w: "ᴡ", x: "x", y: "ʏ", z: "ᴢ",
};

const circled = (text: string) =>
  Array.from(text)
    .map((ch) => {
      const c = ch.charCodeAt(0);
      if (c >= 65 && c <= 90) return String.fromCodePoint(0x24b6 + c - 65);
      if (c >= 97 && c <= 122) return String.fromCodePoint(0x24d0 + c - 97);
      if (c >= 49 && c <= 57) return String.fromCodePoint(0x2460 + c - 49);
      if (c === 48) return "\u24EA";
      return ch;
    })
    .join("");

const smallCaps = (text: string) =>
  Array.from(text).map((ch) => SMALL_CAPS[ch.toLowerCase()] ?? ch).join("");

const scriptEx: Record<string, number> = {
  B: 0x212c, E: 0x2130, F: 0x2131, H: 0x210b, I: 0x2110, L: 0x2112, M: 0x2133, R: 0x211b,
  e: 0x212f, g: 0x210a, o: 0x2134,
};
const frakturEx: Record<string, number> = { C: 0x212d, H: 0x210c, I: 0x2111, R: 0x211c, Z: 0x2128 };
const doubleEx: Record<string, number> = {
  C: 0x2102, H: 0x210d, N: 0x2115, P: 0x2119, Q: 0x211a, R: 0x211d, Z: 0x2124,
};

const STYLES: { name: string; convert: (t: string) => string }[] = [
  { name: "Bold script", convert: makeMapper({ upper: 0x1d4d0, lower: 0x1d4ea }) },
  { name: "Script", convert: makeMapper({ upper: 0x1d49c, lower: 0x1d4b6, exceptions: scriptEx }) },
  { name: "Bold", convert: makeMapper({ upper: 0x1d400, lower: 0x1d41a, digit: 0x1d7ce }) },
  { name: "Italic", convert: makeMapper({ upper: 0x1d434, lower: 0x1d44e, exceptions: { h: 0x210e } }) },
  { name: "Bold italic", convert: makeMapper({ upper: 0x1d468, lower: 0x1d482 }) },
  { name: "Gothic", convert: makeMapper({ upper: 0x1d504, lower: 0x1d51e, exceptions: frakturEx }) },
  { name: "Bold gothic", convert: makeMapper({ upper: 0x1d56c, lower: 0x1d586 }) },
  { name: "Double-struck", convert: makeMapper({ upper: 0x1d538, lower: 0x1d552, digit: 0x1d7d8, exceptions: doubleEx }) },
  { name: "Sans", convert: makeMapper({ upper: 0x1d5a0, lower: 0x1d5ba, digit: 0x1d7e2 }) },
  { name: "Sans bold", convert: makeMapper({ upper: 0x1d5d4, lower: 0x1d5ee, digit: 0x1d7ec }) },
  { name: "Sans italic", convert: makeMapper({ upper: 0x1d608, lower: 0x1d622 }) },
  { name: "Monospace", convert: makeMapper({ upper: 0x1d670, lower: 0x1d68a, digit: 0x1d7f6 }) },
  { name: "Bubbles", convert: circled },
  { name: "Small caps", convert: smallCaps },
  { name: "Wide", convert: makeMapper({ upper: 0xff21, lower: 0xff41, digit: 0xff10 }) },
];

const DECORATIONS: { name: string; wrap: (s: string) => string }[] = [
  { name: "None", wrap: (s) => s },
  { name: "Sparkles", wrap: (s) => `✧･ﾟ: *✧･ﾟ:* ${s} *:･ﾟ✧*:･ﾟ✧` },
  { name: "Hearts", wrap: (s) => `♡ ${s} ♡` },
  { name: "Stars", wrap: (s) => `⋆｡°✩ ${s} ✩°｡⋆` },
  { name: "Bows", wrap: (s) => `ᯓ★ ${s} ᯓ★` },
  { name: "Soft brackets", wrap: (s) => `꒰ ${s} ꒱` },
  { name: "Flowers", wrap: (s) => `❀ ${s} ❀` },
];

export default function CuteFontsGenerator() {
  const [text, setText] = useState("glow up");
  const [deco, setDeco] = useState(0);
  const [copied, setCopied] = useState<string | null>(null);

  const results = useMemo(
    () => STYLES.map((s) => ({ name: s.name, out: DECORATIONS[deco].wrap(s.convert(text || "your text")) })),
    [text, deco]
  );

  async function copy(name: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = value;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(name);
    setTimeout(() => setCopied((c) => (c === name ? null : c)), 1500);
  }

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="cute-text" className="label">Type your text</label>
        <input
          id="cute-text"
          value={text}
          maxLength={80}
          onChange={(e) => setText(e.target.value)}
          placeholder="your name, bio, caption..."
          className="input"
        />
      </div>

      <div>
        <p className="label">Decoration</p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Decoration">
          {DECORATIONS.map((d, i) => (
            <button
              key={d.name}
              type="button"
              aria-pressed={deco === i}
              onClick={() => setDeco(i)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${deco === i ? "bg-glow-pink shadow-soft" : "bg-glow-bg text-glow-muted hover:bg-glow-peach/60"}`}
            >
              {d.name}
            </button>
          ))}
        </div>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2">
        {results.map(({ name, out }) => (
          <li key={name} className="flex items-center justify-between gap-3 rounded-2xl bg-glow-bg p-4">
            <div className="min-w-0">
              <p className="text-xs font-medium text-glow-muted">{name}</p>
              <p className="mt-1 break-words text-lg">{out}</p>
            </div>
            <button
              type="button"
              onClick={() => copy(name, out)}
              className={`shrink-0 ${copied === name ? "btn-mint" : "btn-soft"} px-3.5 py-2`}
              aria-label={`Copy ${name} text`}
            >
              {copied === name ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
              <span className="text-xs">{copied === name ? "Copied" : "Copy"}</span>
            </button>
          </li>
        ))}
      </ul>

      <p className="flex items-start gap-2 text-xs leading-relaxed text-glow-muted">
        <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
        These are Unicode symbols, not real fonts, so they paste almost anywhere. A few older devices may show boxes
        for some characters, and screen readers can read them poorly, so avoid using them for important information.
      </p>
    </div>
  );
}
