import { absenceDays } from "./dates";
import type { ParsedTrip } from "./types";

const MONTHS: Record<string, number> = {
  jan: 0,
  january: 0,
  feb: 1,
  february: 1,
  mar: 2,
  march: 2,
  apr: 3,
  april: 3,
  may: 4,
  jun: 5,
  june: 5,
  jul: 6,
  july: 6,
  aug: 7,
  august: 7,
  sep: 8,
  sept: 8,
  september: 8,
  oct: 9,
  october: 9,
  nov: 10,
  november: 10,
  dec: 11,
  december: 11,
};

const CANADA_AIRPORTS = new Set([
  "YYZ",
  "YUL",
  "YVR",
  "YTZ",
  "YOW",
  "YWG",
  "YYC",
  "YEG",
  "YHZ",
  "YYT",
  "YQB",
  "YXE",
  "YQR",
  "YXX",
  "YKF",
]);

const AERoplanFlightLine =
  /(?:AC|QK|DL|TS|UA|AA|WS)\s+\d+,\s*([A-Z]{3})\s+([A-Z\s'()-]+?)\s*-\s*([A-Z]{3})\s+([A-Z\s'()-]+?),\s*[^,\n]*,[^,\n]*,\s*(\d{1,2}-[A-Za-z]{3}-20\d{2})/i;

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function toIso(y: number, m: number, d: number): string {
  return `${y}-${pad(m + 1)}-${pad(d)}`;
}

export function parseNamedDate(text: string): string | null {
  const iso = text.match(/\b(20\d{2})-(\d{2})-(\d{2})\b/);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;

  const dmyHyphen = text.match(/\b(\d{1,2})-([A-Za-z]{3})-(20\d{2})\b/);
  if (dmyHyphen) {
    const month = MONTHS[dmyHyphen[2].toLowerCase()];
    if (month !== undefined) return toIso(Number(dmyHyphen[3]), month, Number(dmyHyphen[1]));
  }

  const dmy = text.match(/\b(\d{1,2})[/-](\d{1,2})[/-](20\d{2})\b/);
  if (dmy) return toIso(Number(dmy[3]), Number(dmy[2]) - 1, Number(dmy[1]));

  const named = text.match(
    /\b(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)?\s*(\d{1,2})\s+([A-Za-z]+)\s+(20\d{2})\b/i,
  );
  if (named) {
    const month = MONTHS[named[2].toLowerCase()];
    if (month !== undefined) return toIso(Number(named[3]), month, Number(named[1]));
  }

  const mdy = text.match(/\b([A-Za-z]+)\s+(\d{1,2}),?\s+(20\d{2})\b/);
  if (mdy) {
    const month = MONTHS[mdy[1].toLowerCase()];
    if (month !== undefined) return toIso(Number(mdy[3]), month, Number(mdy[2]));
  }

  return null;
}

function extractRoute(text: string): string {
  const aeroplan = text.match(/([A-Z]{3})\s+[A-Z\s'()-]+-\s*([A-Z]{3})\s+[A-Z\s'()-]+/i);
  if (aeroplan) return `${aeroplan[1].toUpperCase()} → ${aeroplan[2].toUpperCase()}`;

  const arrow = text.match(/([A-Za-z][\w\s.'-]*?)\s*(?:→|->|-->|to)\s*([A-Za-z][\w\s.'()-]*)/i);
  if (arrow) return `${arrow[1].trim()} → ${arrow[2].trim()}`;

  const airport = text.match(/\b([A-Z]{3})\s*[-–]\s*([A-Z]{3})\b/);
  if (airport) return `${airport[1]} → ${airport[2]}`;

  return "";
}

type FlightLeg = {
  date: string;
  from: string;
  to: string;
  route: string;
  destination: string;
  kind: "out" | "in" | "domestic" | "other";
};

function legKind(from: string, to: string): FlightLeg["kind"] {
  const fromCa = CANADA_AIRPORTS.has(from);
  const toCa = CANADA_AIRPORTS.has(to);
  if (fromCa && !toCa) return "out";
  if (!fromCa && toCa) return "in";
  if (fromCa && toCa) return "domestic";
  return "other";
}

function titleCaseCity(raw: string): string {
  return raw
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

function parseAeroplanFlightLine(line: string): FlightLeg | null {
  const match = line.match(AERoplanFlightLine);
  if (!match) return null;

  const from = match[1].toUpperCase();
  const fromCity = match[2];
  const to = match[3].toUpperCase();
  const toCity = match[4];
  const date = parseNamedDate(match[5]);
  if (!date) return null;

  const kind = legKind(from, to);
  const route = `${from} → ${to}`;
  const destination = kind === "out" ? titleCaseCity(toCity) : titleCaseCity(fromCity);

  return { date, from, to, route, destination, kind };
}

function pairFlightLegs(legs: FlightLeg[]): ParsedTrip[] {
  const sorted = [...legs].sort((a, b) => a.date.localeCompare(b.date));
  const openOuts: FlightLeg[] = [];
  const trips: ParsedTrip[] = [];

  for (const leg of sorted) {
    if (leg.kind === "domestic" || leg.kind === "other") continue;

    if (leg.kind === "out") {
      openOuts.push(leg);
      continue;
    }

    const matchIdx = openOuts.findLastIndex((o) => o.to === leg.from && o.date <= leg.date);
    const out = matchIdx >= 0 ? openOuts.splice(matchIdx, 1)[0] : openOuts.shift();

    if (out) {
      trips.push({
        left: out.date,
        returned: leg.date,
        route: `${out.route} / ${leg.route}`,
        destination: out.destination || leg.destination,
      });
    } else {
      trips.push({
        left: null,
        returned: leg.date,
        route: leg.route,
        destination: leg.destination,
      });
    }
  }

  for (const out of openOuts) {
    trips.push({
      left: out.date,
      returned: null,
      route: out.route,
      destination: out.destination,
    });
  }

  return trips.sort((a, b) => (a.left ?? a.returned ?? "").localeCompare(b.left ?? b.returned ?? ""));
}

function parseAeroplanLegsFromLines(text: string): FlightLeg[] {
  const legs: FlightLeg[] = [];
  for (const line of text.split("\n")) {
    const leg = parseAeroplanFlightLine(line);
    if (leg) legs.push(leg);
  }
  return legs;
}

function findAirportForCity(text: string, city: string): string | null {
  const trimmed = city.trim();
  if (!trimmed) return null;
  const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const nearCity = text.match(new RegExp(`${escaped}\\s+([A-Z]{3})\\b`, "i"));
  if (nearCity) return nearCity[1].toUpperCase();
  return null;
}

function legFromAirports(
  date: string,
  from: string,
  to: string,
  fromCity: string,
  toCity: string,
): FlightLeg | null {
  const kind = legKind(from, to);
  if (kind !== "out" && kind !== "in") return null;
  return {
    date,
    from,
    to,
    route: `${from} → ${to}`,
    destination: kind === "out" ? titleCaseCity(toCity) : titleCaseCity(fromCity),
    kind,
  };
}

function flightSectionKind(label: string): "out" | "in" | null {
  const lower = label.toLowerCase();
  if (/^depart(?:ure)?|^outbound|^outgoing/.test(lower)) return "out";
  if (/^return(?:ing)?|^inbound/.test(lower)) return "in";
  return null;
}

const FLIGHT_SECTION_HEADER =
  /(Depart(?:ure)?|Return(?:ing)?|Outbound|Inbound|Outgoing)\s*(?:[•·:\-–]\s*|\s+)(?:(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s+)?(\d{1,2})\s+([A-Za-z]+),?\s+(20\d{2})/gi;

const FLIGHT_SECTION_BOUNDARY =
  /\n(?:Depart(?:ure)?|Return(?:ing)?|Outbound|Inbound|Outgoing|Purchase|Payment|Baggage|Receipt|Total\b|Changes and cancel)/i;

function flightSectionEnd(text: string, start: number): number {
  const rest = text.slice(start + 1);
  const cut = rest.search(FLIGHT_SECTION_BOUNDARY);
  return cut >= 0 ? start + 1 + cut : text.length;
}

function parseFlightSectionLegs(text: string): FlightLeg[] {
  const legs: FlightLeg[] = [];
  const markers: { index: number; kind: "out" | "in"; date: string }[] = [];
  let match: RegExpExecArray | null;

  while ((match = FLIGHT_SECTION_HEADER.exec(text)) !== null) {
    const kind = flightSectionKind(match[1]);
    if (!kind) continue;
    const date = parseNamedDate(`${match[2]} ${match[3]} ${match[4]}`);
    if (!date) continue;
    markers.push({ index: match.index, kind, date });
  }

  for (let i = 0; i < markers.length; i++) {
    const start = markers[i].index;
    const end = i + 1 < markers.length ? markers[i + 1].index : flightSectionEnd(text, start);
    const slice = text.slice(start, end > start ? end : undefined);
    const airports = [...slice.matchAll(/([A-Za-z][A-Za-z\s.'()-]*?)\s+([A-Z]{3})\b/g)];
    if (airports.length < 2) continue;

    const from = airports[0][2].toUpperCase();
    const to = airports[1][2].toUpperCase();
    const leg = legFromAirports(markers[i].date, from, to, airports[0][1], airports[1][1]);
    if (leg) legs.push(leg);
  }

  return legs;
}

function parseCityToCitySnippets(text: string): FlightLeg[] {
  const legs: FlightLeg[] = [];
  const yearMatch = text.match(/\b(20\d{2})\b/);
  const defaultYear = yearMatch ? Number(yearMatch[1]) : null;
  const re =
    /^([A-Za-z][\w\s.'-]+?)\s+to\s+([A-Za-z][\w\s.'-]+?)\s*\r?\n\s*(?:(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s+)?([A-Za-z]+)\s+(\d{1,2})\b/gim;

  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) !== null) {
    const fromCity = match[1].trim();
    const toCity = match[2].trim();
    const month = MONTHS[match[3].toLowerCase()];
    if (month === undefined || defaultYear == null) continue;

    const date = toIso(defaultYear, month, Number(match[4]));
    const from = findAirportForCity(text, fromCity);
    const to = findAirportForCity(text, toCity);
    if (!from || !to) continue;

    const leg = legFromAirports(date, from, to, fromCity, toCity);
    if (leg) legs.push(leg);
  }

  return legs;
}

function dedupeLegs(legs: FlightLeg[]): FlightLeg[] {
  const seen = new Set<string>();
  return legs.filter((leg) => {
    const key = `${leg.date}|${leg.from}|${leg.to}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function extractFlightLegs(text: string): FlightLeg[] {
  return dedupeLegs([
    ...parseFlightSectionLegs(text),
    ...parseCityToCitySnippets(text),
    ...parseAeroplanLegsFromLines(text),
  ]).filter((leg) => leg.kind === "out" || leg.kind === "in");
}

export function legsToParsedTrips(legs: FlightLeg[]): ParsedTrip[] {
  return pairFlightLegs(legs);
}

export function formatFlightLegsForAi(legs: FlightLeg[], text: string): string {
  if (legs.length === 0) return "";

  const lines = ["Structured flight legs detected in this paste:"];
  for (let i = 0; i < legs.length; i++) {
    const leg = legs[i];
    const direction =
      leg.kind === "out" ? "OUTBOUND (departed Canada)" : "RETURN (arrived back in Canada)";
    lines.push(`${i + 1}. ${direction}: ${leg.date} ${leg.from} -> ${leg.to}`);
  }

  const bookingRef = text.match(/\b(?:booking|confirmation)\s+reference\s+([A-Z0-9]{5,10})\b/i);
  if (bookingRef) lines.push(`Booking reference: ${bookingRef[1].toUpperCase()}`);

  lines.push(
    "",
    "Task: merge each outbound flight leg with its matching return leg into one trip object.",
    "left = outbound flight date leaving Canada. returned = return flight date arriving in Canada. destination = foreign city or country visited.",
  );
  return lines.join("\n");
}

function tryPairTrips(a: ParsedTrip, b: ParsedTrip): ParsedTrip | null {
  const pair = (outbound: ParsedTrip, inbound: ParsedTrip): ParsedTrip | null => {
    if (!outbound.left || outbound.returned || !inbound.returned || inbound.left) return null;
    if (outbound.left > inbound.returned) return null;
    return {
      left: outbound.left,
      returned: inbound.returned,
      route: [outbound.route, inbound.route].filter(Boolean).join(" / "),
      destination: outbound.destination || inbound.destination,
    };
  };

  return pair(a, b) ?? pair(b, a);
}

export function consolidateRoundTrips(trips: ParsedTrip[]): ParsedTrip[] {
  const result: ParsedTrip[] = [];
  const used = new Set<number>();

  for (let i = 0; i < trips.length; i++) {
    if (used.has(i)) continue;
    const trip = trips[i];
    if (trip.left && trip.returned) {
      result.push(trip);
      used.add(i);
      continue;
    }

    let paired = false;
    for (let j = i + 1; j < trips.length; j++) {
      if (used.has(j)) continue;
      const merged = tryPairTrips(trip, trips[j]);
      if (!merged) continue;
      result.push(merged);
      used.add(i);
      used.add(j);
      paired = true;
      break;
    }

    if (!paired) {
      result.push(trip);
      used.add(i);
    }
  }

  return result.sort((a, b) => (a.left ?? a.returned ?? "").localeCompare(b.left ?? b.returned ?? ""));
}

function tripScore(trips: ParsedTrip[]): number {
  const complete = trips.filter((trip) => trip.left && trip.returned).length;
  const partial = trips.length - complete;
  return complete * 10 - partial;
}

export function mergeTripCandidates(...groups: ParsedTrip[][]): ParsedTrip[] {
  const merged = consolidateRoundTrips(groups.flat());
  const seen = new Set<string>();
  return merged
    .filter((trip) => {
      if (!trip.left && !trip.returned) return false;
      const key = `${trip.left ?? ""}|${trip.returned ?? ""}|${trip.route}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => (a.left ?? a.returned ?? "").localeCompare(b.left ?? b.returned ?? ""));
}

export function pickBestParsedTrips(...groups: ParsedTrip[][]): ParsedTrip[] {
  const candidates = groups.map((group) => mergeTripCandidates(group)).filter((group) => group.length > 0);
  if (candidates.length === 0) return [];
  if (candidates.length === 1) return candidates[0];
  return candidates.reduce((best, current) => (tripScore(current) > tripScore(best) ? current : best));
}

function parseAeroplanText(text: string): ParsedTrip[] {
  const legs: FlightLeg[] = [];
  for (const line of text.split("\n")) {
    const leg = parseAeroplanFlightLine(line);
    if (leg) legs.push(leg);
  }
  if (legs.length === 0) return [];
  return pairFlightLegs(legs);
}

function splitBlocks(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);
}

function labelDates(block: string): { left: string | null; returned: string | null } {
  const lines = block.split("\n");
  let left: string | null = null;
  let returned: string | null = null;

  for (const line of lines) {
    const lower = line.toLowerCase();
    const date = parseNamedDate(line);
    if (!date) continue;

    if (
      /depart|departure|outbound|leave|left|going|from canada/.test(lower) &&
      !/return|inbound|arriv|back/.test(lower)
    ) {
      left = date;
      continue;
    }

    if (/return|inbound|arriv|back|home|landed/.test(lower)) {
      returned = date;
      continue;
    }

    if (!left) left = date;
    else if (!returned) returned = date;
  }

  const datePattern =
    /\b(?:20\d{2}-\d{2}-\d{2}|\d{1,2}-[A-Za-z]{3}-20\d{2}|\d{1,2}\s+[A-Za-z]+\s+20\d{2}|[A-Za-z]+\s+\d{1,2},?\s+20\d{2})\b/g;
  const allDates = [...block.matchAll(datePattern)]
    .map((m) => parseNamedDate(m[0]))
    .filter((d): d is string => d !== null);

  if (!left && allDates[0]) left = allDates[0];
  if (!returned && allDates[1]) returned = allDates[1];

  return { left, returned };
}

function parseEmailBlocks(text: string): ParsedTrip[] {
  const blocks = splitBlocks(text);
  const source = blocks.length > 1 ? blocks : [text];

  return source
    .map((block) => {
      const { left, returned } = labelDates(block);
      const route = extractRoute(block);
      const destination = route.split("→").pop()?.trim() ?? "";

      return { left, returned, route, destination };
    })
    .filter((trip) => trip.left || trip.returned);
}

export function parseTravelText(text: string): ParsedTrip[] {
  const structured = legsToParsedTrips(extractFlightLegs(text));
  if (structured.some((trip) => trip.left && trip.returned)) return structured;

  const aeroplan = parseAeroplanText(text);
  if (aeroplan.some((trip) => trip.left && trip.returned)) return aeroplan;

  const emailBlocks = parseEmailBlocks(text);
  return pickBestParsedTrips(structured, aeroplan, emailBlocks);
}

export function tripFromParsed(parsed: ParsedTrip, id: string) {
  const daysOutside =
    parsed.left && parsed.returned ? absenceDays(parsed.left, parsed.returned) : null;

  return {
    id,
    left: parsed.left ?? "",
    returned: parsed.returned,
    destination: parsed.destination,
    daysOutside,
  };
}

export function newTripId(): string {
  return `trip-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
