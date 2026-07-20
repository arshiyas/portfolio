import { parseNamedDate } from "./parser";
import type { ParsedTrip } from "./types";

const DEFAULT_MODEL = "Qwen2.5-0.5B-Instruct-q4f16_1-MLC";

const SYSTEM_PROMPT = `You parse flight dates from messy pasted travel text: airline booking emails, loyalty exports, itinerary PDFs, calendar snippets, and notes.

Goal: find when the traveller left Canada and when they returned, for physical presence tracking.

Respond with ONLY valid JSON. No markdown, no explanation.
Shape: {"trips":[{"left":"YYYY-MM-DD or null","returned":"YYYY-MM-DD or null","destination":"city or country","route":"optional route string"}]}

Flight parsing rules:
- left = calendar date of the flight that departs Canada
- returned = calendar date of the flight that arrives back in Canada
- only trips that leave Canada count (skip domestic Canada-only flights)
- read dates beside flight legs: depart/return headers, outbound/inbound labels, city-to-city lines, airport codes (e.g. YYZ, YVR, LAX), and dates near flight numbers
- pair outbound and return legs from the same booking into ONE trip; do not leave them as separate one-way rows when both dates are present
- when structured leg hints appear above the paste, trust those dates and airports, then output merged round trips
- ignore receipts, baggage, seat selection, taxes, promos, and email footers
- use null when a date is truly missing; never invent dates
- all dates must be ISO YYYY-MM-DD`;

export type ParseContext = {
  knownDeparture?: string;
  knownReturn?: string;
  knownDestination?: string;
};

export type AiParseProgress = {
  phase: "loading-model" | "parsing";
  message: string;
  progress?: number;
};

type AiTripsPayload = {
  trips?: Array<{
    left?: string | null;
    returned?: string | null;
    destination?: string;
    route?: string;
  }>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MlcEngine = any;

declare global {
  interface Window {
    __daysInCanadaEnginePromise?: Promise<MlcEngine>;
    __daysInCanadaEngine?: MlcEngine;
  }
}

export function supportsWebGpu(): boolean {
  if (typeof navigator === "undefined") return false;
  return "gpu" in navigator;
}

function normalizeDate(value: string | null | undefined): string | null {
  if (value == null || value === "null") return null;
  const str = String(value).trim();
  if (!str) return null;
  return parseNamedDate(str) ?? parseNamedDate(str.replace(/\s/g, " "));
}

function normalizeTrips(raw: AiTripsPayload): ParsedTrip[] {
  if (!raw.trips?.length) return [];

  return raw.trips
    .map((trip) => ({
      left: normalizeDate(trip.left),
      returned: normalizeDate(trip.returned),
      destination: String(trip.destination ?? "").trim(),
      route: String(trip.route ?? "").trim(),
    }))
    .filter((trip) => trip.left || trip.returned);
}

function clearEngineCache(): void {
  if (typeof window !== "undefined") {
    window.__daysInCanadaEnginePromise = undefined;
    window.__daysInCanadaEngine = undefined;
  }
}

async function getEngine(onProgress?: (p: AiParseProgress) => void): Promise<MlcEngine> {
  if (!supportsWebGpu()) {
    throw new Error("WebGPU is not available in this browser.");
  }

  if (typeof window === "undefined") {
    throw new Error("Local AI only runs in the browser.");
  }

  if (window.__daysInCanadaEngine) {
    return window.__daysInCanadaEngine;
  }

  if (!window.__daysInCanadaEnginePromise) {
    window.__daysInCanadaEnginePromise = (async () => {
      const { CreateMLCEngine } = await import("@mlc-ai/web-llm");
      onProgress?.({
        phase: "loading-model",
        message: "Loading local model (first time only)...",
        progress: 0,
      });

      const engine = await CreateMLCEngine(String(DEFAULT_MODEL), {
        initProgressCallback: (report) => {
          const pct = Math.round(Number(report.progress) * 100);
          const text = typeof report.text === "string" ? report.text : `Loading model ${pct}%`;
          onProgress?.({
            phase: "loading-model",
            message: text,
            progress: pct,
          });
        },
      });

      window.__daysInCanadaEngine = engine;
      return engine;
    })().catch((err) => {
      clearEngineCache();
      throw err;
    });
  }

  return window.__daysInCanadaEnginePromise;
}

function buildUserPrompt(text: string, context?: ParseContext): string {
  const parts = ["Extract flight dates and round trips from this pasted text:", String(text).trim()];
  if (context?.knownDeparture) {
    parts.push(
      "",
      `Context: a trip already has departure date ${String(context.knownDeparture)}. The paste may contain only the return leg. Set left to ${String(context.knownDeparture)} if appropriate and extract returned from the paste.`,
    );
  }
  if (context?.knownReturn) {
    parts.push(
      "",
      `Context: a trip already has return date ${String(context.knownReturn)}. The paste may contain only the outbound leg. Set returned to ${String(context.knownReturn)} if appropriate and extract left from the paste.`,
    );
  }
  if (context?.knownDestination) {
    parts.push(`Known destination hint: ${String(context.knownDestination)}`);
  }
  return parts.join("\n");
}

function messageContent(raw: unknown): string {
  if (typeof raw === "string") return raw;
  if (Array.isArray(raw)) {
    return raw
      .map((part) => {
        if (typeof part === "string") return part;
        if (part && typeof part === "object" && "text" in part) {
          return String((part as { text?: unknown }).text ?? "");
        }
        return "";
      })
      .join("");
  }
  return raw == null ? "" : String(raw);
}

function extractJson(content: string): AiTripsPayload {
  const trimmed = content.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced?.[1]?.trim() ?? trimmed;

  try {
    return JSON.parse(candidate) as AiTripsPayload;
  } catch {
    const start = candidate.indexOf("{");
    const end = candidate.lastIndexOf("}");
    if (start >= 0 && end > start) {
      return JSON.parse(candidate.slice(start, end + 1)) as AiTripsPayload;
    }
    throw new Error("Model did not return valid JSON.");
  }
}

export async function parseWithAi(
  text: string,
  context?: ParseContext,
  onProgress?: (p: AiParseProgress) => void,
): Promise<ParsedTrip[]> {
  if (!String(text).trim()) return [];

  onProgress?.({ phase: "parsing", message: "Parsing flight dates on your device..." });

  const engine = await getEngine(onProgress);
  const reply = await engine.chat.completions.create({
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: buildUserPrompt(text, context) },
    ],
    temperature: 0.1,
    max_tokens: 1536,
  });

  const content = messageContent(reply.choices?.[0]?.message?.content);
  if (!content.trim()) return [];

  return normalizeTrips(extractJson(content));
}

export function resetAiEngine(): void {
  clearEngineCache();
}
