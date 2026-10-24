// Day-number helpers (days since 1970-01-01, timezone-safe).
const DAY = 86400000;

export const pad = (n: number) => String(n).padStart(2, "0");

export function dayNumFromParts(y: number, m0: number, d: number) {
  return Math.round(Date.UTC(y, m0, d) / DAY);
}

export function todayNum() {
  const n = new Date();
  return dayNumFromParts(n.getFullYear(), n.getMonth(), n.getDate());
}

export function keyToNum(key: string) {
  const [y, m, d] = key.split("-").map(Number);
  return dayNumFromParts(y, m - 1, d);
}

export function numToKey(n: number) {
  const d = new Date(n * DAY);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

export const todayKey = () => numToKey(todayNum());

export function formatNum(n: number, withYear = true) {
  return new Date(n * DAY).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: withYear ? "numeric" : undefined,
    timeZone: "UTC",
  });
}
