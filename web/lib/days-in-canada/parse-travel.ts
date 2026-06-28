import { parseWithAi, type AiParseProgress, type ParseContext } from "./ai-parser";
import {
  extractFlightLegs,
  formatFlightLegsForAi,
  legsToParsedTrips,
  parseTravelText as parseWithRules,
  pickBestParsedTrips,
} from "./parser";
import type { ParsedTrip } from "./types";

export type { AiParseProgress, ParseContext };

const MAX_AI_INPUT_CHARS = 12_000;

function slimTextForAi(text: string): string {
  const lines = text.split("\n");
  const relevant = lines.filter((line) =>
    /\d{1,2}[-/][A-Za-z]{3}[-/]20\d{2}|20\d{2}-\d{2}-\d{2}|\b(?:depart(?:ure)?|return(?:ing)?|outbound|inbound|arrival|left|landed)\b|[A-Z]{3}\s+[A-Z'()-]|\b(?:AC|QK|DL|TS|UA|AA|WS)\s*\d+/i.test(
      line,
    ),
  );

  const candidate = relevant.length >= 2 ? relevant.join("\n") : text;
  if (candidate.length <= MAX_AI_INPUT_CHARS) return candidate;
  return candidate.slice(0, MAX_AI_INPUT_CHARS);
}

function buildAiInput(text: string): string {
  const legs = extractFlightLegs(text);
  const structured = formatFlightLegsForAi(legs, text);
  const excerpt = slimTextForAi(text);

  if (structured) {
    return `${structured}\n\n---\nPaste excerpt:\n${excerpt}`;
  }
  return excerpt;
}

export async function parseTravel(
  text: string,
  options?: {
    context?: ParseContext;
    onProgress?: (p: AiParseProgress) => void;
  },
): Promise<ParsedTrip[]> {
  const trimmed = text.trim();
  if (!trimmed) return [];

  const structuredTrips = legsToParsedTrips(extractFlightLegs(trimmed));
  const ruleTrips = parseWithRules(trimmed);

  try {
    options?.onProgress?.({
      phase: "loading-model",
      message: "Loading local AI on your device...",
    });
    const aiTrips = await parseWithAi(buildAiInput(trimmed), options?.context, options?.onProgress);
    const best = pickBestParsedTrips(aiTrips, structuredTrips, ruleTrips);
    if (best.length > 0) return best;
  } catch (err) {
    options?.onProgress?.({
      phase: "parsing",
      message:
        err instanceof Error
          ? `Local AI unavailable (${err.message}). Using pattern matching instead.`
          : "Local AI unavailable. Using pattern matching instead.",
    });
  }

  return pickBestParsedTrips(structuredTrips, ruleTrips);
}
