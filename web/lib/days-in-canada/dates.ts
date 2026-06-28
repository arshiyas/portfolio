export function parseIsoDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function formatDisplayDate(iso: string): string {
  return parseIsoDate(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function calendarDayDiff(startIso: string, endIso: string): number {
  const start = parseIsoDate(startIso);
  const end = parseIsoDate(endIso);
  const ms = end.getTime() - start.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

export function absenceDays(leftIso: string, returnedIso: string): number {
  return Math.max(0, calendarDayDiff(leftIso, returnedIso) - 1);
}

export function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function addYears(iso: string, years: number): string {
  const date = parseIsoDate(iso);
  date.setFullYear(date.getFullYear() - years);
  return toIsoDate(date);
}

export function addDays(iso: string, days: number): string {
  const date = parseIsoDate(iso);
  date.setDate(date.getDate() + days);
  return toIsoDate(date);
}

export function isWithinWindow(
  tripLeft: string,
  tripReturn: string,
  windowStart: string,
  windowEnd: string,
): boolean {
  return tripReturn >= windowStart && tripLeft <= windowEnd;
}
