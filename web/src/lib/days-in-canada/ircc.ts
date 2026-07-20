import { absenceDays, addDays, addYears, calendarDayDiff, isWithinWindow } from "./dates";
import type { Trip } from "./types";

export const DAYS_AS_PR_REQUIRED = 730;
export const PHYSICAL_PRESENCE_REQUIRED = 1095;
export const MAX_PRE_PR_CREDIT_DAYS = 365;

type DateInterval = { start: string; end: string };

function maxDate(a: string, b: string): string {
  return a > b ? a : b;
}

function minDate(a: string, b: string): string {
  return a < b ? a : b;
}

function inclusiveCalendarDays(start: string, end: string): number {
  if (end < start) return 0;
  return calendarDayDiff(start, end) + 1;
}

function mergeIntervals(intervals: DateInterval[]): DateInterval[] {
  const sorted = [...intervals].sort((a, b) => a.start.localeCompare(b.start));
  const merged: DateInterval[] = [];

  for (const interval of sorted) {
    const last = merged[merged.length - 1];
    if (!last || interval.start > last.end) {
      merged.push({ ...interval });
      continue;
    }
    if (interval.end > last.end) {
      last.end = interval.end;
    }
  }

  return merged;
}

function countUnionDays(intervals: DateInterval[]): number {
  return intervals.reduce((sum, interval) => sum + inclusiveCalendarDays(interval.start, interval.end), 0);
}

function absenceDaysOverlappingIntervals(
  tripLeft: string,
  tripReturn: string,
  intervals: DateInterval[],
): number {
  let total = 0;
  for (const interval of intervals) {
    if (!isWithinWindow(tripLeft, tripReturn, interval.start, interval.end)) continue;
    const left = maxDate(tripLeft, interval.start);
    const returned = minDate(tripReturn, interval.end);
    total += absenceDays(left, returned);
  }
  return total;
}

export type PrePrCreditResult = {
  creditDays: number;
  trCalendarDays: number;
  trAbsenceDays: number;
  trDaysPresent: number;
};

export function computePrePrCreditDays(
  signingDate: string,
  prDate: string,
  periods: { from: string; to: string }[],
  trips: Trip[],
): PrePrCreditResult {
  const empty = { creditDays: 0, trCalendarDays: 0, trAbsenceDays: 0, trDaysPresent: 0 };
  if (!signingDate || !prDate || periods.length === 0) return empty;

  const windowStart = addYears(signingDate, 5);
  const lastTrDay = addDays(prDate, -1);
  const clipped: DateInterval[] = [];

  for (const period of periods) {
    if (!period.from || !period.to || period.to < period.from) continue;
    const start = maxDate(period.from, windowStart);
    const end = minDate(minDate(period.to, lastTrDay), signingDate);
    if (start > end) continue;
    clipped.push({ start, end });
  }

  const merged = mergeIntervals(clipped);
  const trCalendarDays = countUnionDays(merged);
  if (trCalendarDays === 0) return empty;

  let trAbsenceDays = 0;
  for (const trip of trips) {
    if (!trip.returned || trip.left >= prDate) continue;
    trAbsenceDays += absenceDaysOverlappingIntervals(trip.left, trip.returned, merged);
  }

  const trDaysPresent = Math.max(0, trCalendarDays - trAbsenceDays);
  const creditDays = Math.min(MAX_PRE_PR_CREDIT_DAYS, trDaysPresent * 0.5);

  return { creditDays, trCalendarDays, trAbsenceDays, trDaysPresent };
}

export type KeyDatesIssue =
  | { type: "pr_after_signing" }
  | { type: "insufficient_pr_days"; daysAsPr: number; earliestSigningDate: string };

export type KeyDatesValidation = {
  ok: boolean;
  issues: KeyDatesIssue[];
  daysAsPr: number | null;
};

export function validateKeyDates(signingDate: string, prDate: string): KeyDatesValidation {
  if (!signingDate || !prDate) {
    return { ok: true, issues: [], daysAsPr: null };
  }

  const issues: KeyDatesIssue[] = [];

  if (prDate > signingDate) {
    issues.push({ type: "pr_after_signing" });
    return { ok: false, issues, daysAsPr: null };
  }

  const daysAsPr = calendarDayDiff(prDate, signingDate) + 1;
  if (daysAsPr < DAYS_AS_PR_REQUIRED) {
    issues.push({
      type: "insufficient_pr_days",
      daysAsPr,
      earliestSigningDate: addDays(prDate, DAYS_AS_PR_REQUIRED - 1),
    });
  }

  return { ok: issues.length === 0, issues, daysAsPr };
}

export type EligibilityResult = {
  windowStart: string;
  windowEnd: string;
  windowDays: number;
  daysOutside: number;
  daysPresent: number;
  prePrCreditDays: number;
  prePrTrDaysPresent: number;
  prePrTrAbsenceDays: number;
  daysPresentWithCredit: number;
  requiredDays: number;
  daysAsPrRequired: number;
  daysAsPr: number;
  eligible: boolean;
  meetsPrRequirement: boolean;
  tripsInWindow: (Trip & { inEligibilityWindow: boolean })[];
};

export function countDaysOutside(trip: Trip): number {
  if (!trip.returned) return 0;
  return absenceDays(trip.left, trip.returned);
}

export function absenceDaysInWindow(
  tripLeft: string,
  tripReturn: string,
  windowStart: string,
  windowEnd: string,
): number {
  if (!isWithinWindow(tripLeft, tripReturn, windowStart, windowEnd)) return 0;

  const left = tripLeft < windowStart ? windowStart : tripLeft;
  const returned = tripReturn > windowEnd ? windowEnd : tripReturn;
  if (returned <= left) return 0;
  return absenceDays(left, returned);
}

export function computeEligibility(
  signingDate: string,
  prDate: string,
  prePrCredit: boolean,
  prePrPeriods: { from: string; to: string }[],
  trips: Trip[],
): EligibilityResult | null {
  if (!signingDate || !prDate) return null;

  const windowEnd = signingDate;
  const windowStart = addYears(signingDate, 5);
  const windowDays = calendarDayDiff(windowStart, windowEnd) + 1;

  const completeTrips = trips.filter((t) => t.left && t.returned);
  const tripsInWindow = completeTrips.filter((t) =>
    isWithinWindow(t.left, t.returned!, windowStart, windowEnd),
  );

  const daysOutside = tripsInWindow.reduce(
    (sum, trip) => sum + absenceDaysInWindow(trip.left, trip.returned!, windowStart, windowEnd),
    0,
  );

  const daysPresent = windowDays - daysOutside;
  const prePr =
    prePrCredit && prePrPeriods.length > 0
      ? computePrePrCreditDays(signingDate, prDate, prePrPeriods, trips)
      : { creditDays: 0, trCalendarDays: 0, trAbsenceDays: 0, trDaysPresent: 0 };
  const daysPresentWithCredit = daysPresent + prePr.creditDays;

  const daysAsPr = calendarDayDiff(prDate, signingDate) + 1;
  const requiredDays = PHYSICAL_PRESENCE_REQUIRED;
  const daysAsPrRequired = DAYS_AS_PR_REQUIRED;

  return {
    windowStart,
    windowEnd,
    windowDays,
    daysOutside,
    daysPresent,
    prePrCreditDays: prePr.creditDays,
    prePrTrDaysPresent: prePr.trDaysPresent,
    prePrTrAbsenceDays: prePr.trAbsenceDays,
    daysPresentWithCredit,
    requiredDays,
    daysAsPrRequired,
    daysAsPr,
    eligible: daysPresentWithCredit >= requiredDays && daysAsPr >= daysAsPrRequired,
    meetsPrRequirement: daysAsPr >= daysAsPrRequired,
    tripsInWindow: completeTrips.map((t) => ({
      ...t,
      daysOutside: absenceDaysInWindow(t.left, t.returned!, windowStart, windowEnd),
      inEligibilityWindow: isWithinWindow(t.left, t.returned!, windowStart, windowEnd),
    })),
  };
}
