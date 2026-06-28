import type { Trip } from "./types";

export function tripDedupeKey(trip: Pick<Trip, "left" | "returned" | "destination">): string {
  if (!trip.left || !trip.returned) {
    return `incomplete:${trip.left ?? ""}|${trip.returned ?? ""}`;
  }
  return `${trip.left}|${trip.returned}`;
}

export function dedupeTrips(trips: Trip[]): Trip[] {
  const seen = new Set<string>();

  return trips.filter((trip) => {
    if (!trip.left || !trip.returned) return true;
    const key = tripDedupeKey(trip);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function mergeParsedIntoTrips(
  newTrips: Trip[],
  existingTrips: Trip[],
  replaceBatchIds: string[],
): { merged: Trip[]; fetched: Trip[] } {
  const parsedKeys = new Set(
    newTrips.filter((t) => t.left && t.returned).map((t) => tripDedupeKey(t)),
  );
  const batchSet = new Set(replaceBatchIds);
  const merged = dedupeTrips([
    ...existingTrips.filter((t) => !batchSet.has(t.id)),
    ...newTrips,
  ]);
  let fetched = merged.filter(
    (t) => t.left && t.returned && parsedKeys.has(tripDedupeKey(t)),
  );
  if (fetched.length === 0 && newTrips.length > 0) {
    fetched = newTrips;
  }
  return { merged, fetched };
}
