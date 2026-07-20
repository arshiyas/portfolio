"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { absenceDays, formatDisplayDate, toIsoDate } from "@/lib/days-in-canada/dates";
import { computeEligibility, validateKeyDates, type EligibilityResult } from "@/lib/days-in-canada/ircc";
import { newTripId, tripFromParsed } from "@/lib/days-in-canada/parser";
import { parseTravel, type AiParseProgress } from "@/lib/days-in-canada/parse-travel";
import { supportsWebGpu } from "@/lib/days-in-canada/ai-parser";
import type { AppState, ParsedTrip, PrePrPeriod, Trip } from "@/lib/days-in-canada/types";
import { DEFAULT_STATE } from "@/lib/days-in-canada/types";
import { clearLegacyStorage } from "@/lib/days-in-canada/storage";
import {
  downloadTripsCsv,
  downloadTripsPdf,
  tripToExportRow,
  type ExportOptions,
} from "@/lib/days-in-canada/export";
import { dedupeTrips, mergeParsedIntoTrips, tripDedupeKey } from "@/lib/days-in-canada/trips";
import { DaysGoneBackdrop } from "@/components/days-in-canada/DaysGoneBackdrop";

type StepId = "welcome" | "dates" | "trips" | "results";
type AppMode = "eligibility" | "parse";

const ELIGIBILITY_STEPS: { id: StepId; label: string }[] = [
  { id: "welcome", label: "Start" },
  { id: "dates", label: "Your dates" },
  { id: "trips", label: "Add trips" },
  { id: "results", label: "Results" },
];

const PARSE_STEPS: { id: StepId; label: string }[] = [
  { id: "welcome", label: "Start" },
  { id: "trips", label: "Parse trips" },
  { id: "results", label: "Your trips" },
];

const panel = "rounded-xl border border-claude-border bg-claude-surface";
const input =
  "w-full rounded-lg border border-claude-border bg-[var(--dg-input)] px-3 py-2.5 text-sm text-claude-text transition placeholder:text-claude-muted/70 focus:border-claude-accent focus:outline-none focus:ring-2 focus:ring-claude-accent/15";
const btnPrimary =
  "rounded-lg bg-claude-accent px-4 py-2.5 text-sm font-medium text-[var(--dg-band-text)] transition hover:bg-[var(--dg-accent-hover)] disabled:cursor-not-allowed disabled:opacity-45";
const btnSecondary =
  "rounded-lg border border-claude-border bg-[var(--dg-input)] px-4 py-2.5 text-sm font-medium text-claude-text transition hover:border-claude-accent/40 hover:bg-claude-accent-soft/30";
const btnDisabled =
  "rounded-lg bg-[var(--dg-disabled)] px-4 py-2.5 text-sm font-medium text-[var(--dg-panel-text)] cursor-not-allowed";
const badgeSuccess = "rounded-full bg-[var(--dg-success-bg)] px-2 py-0.5 text-xs font-medium text-[var(--dg-success-text)]";
const badgeWarning = "rounded-full bg-[var(--dg-warning-bg)] px-2 py-0.5 text-xs font-medium text-[var(--dg-warning-text)]";
const tableHead = "border-b border-claude-border bg-[var(--dg-panel)] text-xs font-medium uppercase tracking-wide text-[var(--dg-panel-muted)]";

function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden className="text-claude-muted">
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 10h18" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ChevronDownIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={`shrink-0 text-claude-accent transition ${expanded ? "rotate-180" : ""}`}
    >
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2M10 11v6M14 11v6M6 7l1 12a2 2 0 002 2h6a2 2 0 002-2l1-12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ParseStatusBanner({
  message,
  progress,
  isActive,
}: {
  message: string;
  progress?: number | null;
  isActive: boolean;
}) {
  return (
    <div
      className={`mt-3 rounded-lg border px-3 py-3 ${
        isActive
          ? "border-claude-border bg-[var(--dg-elevated)]"
          : "border-[color:var(--dg-success-border)] bg-[var(--dg-success-bg)]"
      }`}
    >
      <p
        className={`text-xs leading-relaxed ${
          isActive ? "text-claude-text" : "text-[var(--dg-success-text)]"
        }`}
      >
        {message}
      </p>
      {isActive && progress != null ? (
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--dg-input)]">
          <div
            className="h-full rounded-full bg-claude-accent transition-all duration-300"
            style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
          />
        </div>
      ) : null}
    </div>
  );
}

function AddedTripsCollapsible({
  trips,
  title,
  defaultExpanded = false,
  onRemove,
}: {
  trips: Trip[];
  title: string;
  defaultExpanded?: boolean;
  onRemove: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const count = trips.length;
  if (count === 0) return null;

  return (
    <div className="rounded-xl border border-[color:var(--dg-success-border)] bg-[var(--dg-success-bg)]">
      <button
        type="button"
        onClick={() => setExpanded((open) => !open)}
        className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left sm:px-5"
        aria-expanded={expanded}
      >
        <span className="text-sm font-semibold text-[var(--dg-success-text)]">{title}</span>
        <ChevronDownIcon expanded={expanded} />
      </button>
      {expanded ? (
        <div className="border-t border-[color:var(--dg-success-border)] px-4 pb-4 pt-2 sm:px-5">
          <ul className="space-y-2">
            {trips.map((trip) => (
              <li
                key={trip.id}
                className="flex items-start justify-between gap-2 rounded-lg bg-[var(--dg-input)]/80 px-3 py-2"
              >
                <div className="min-w-0 text-sm">
                  <p className="font-medium text-claude-text">
                    {formatDisplayDate(trip.left)} to {formatDisplayDate(trip.returned!)}
                  </p>
                  {trip.destination ? (
                    <p className="truncate text-xs text-claude-muted">{trip.destination}</p>
                  ) : null}
                  <p className="text-xs text-claude-muted">{trip.daysOutside} days outside Canada</p>
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(trip.id)}
                  className="shrink-0 rounded p-1.5 text-claude-muted transition hover:bg-[var(--dg-warning-bg)] hover:text-[var(--dg-danger)]"
                  aria-label={`Remove trip ${formatDisplayDate(trip.left)} to ${formatDisplayDate(trip.returned!)}`}
                >
                  <TrashIcon />
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function Callout({
  title,
  children,
  tone = "neutral",
}: {
  title: string;
  children: React.ReactNode;
  tone?: "neutral" | "success" | "warning" | "hud";
}) {
  const tones = {
    neutral: "border-claude-border bg-claude-surface",
    success: "border-[color:var(--dg-success-border)] bg-[var(--dg-success-bg)]",
    warning: "border-[color:var(--dg-warning-border)] bg-[var(--dg-warning-bg)]",
    hud: "border-[rgba(245,243,240,0.14)] bg-[var(--dg-panel)]",
  };
  const titleTone = {
    neutral: "text-claude-text",
    success: "text-[var(--dg-success-text)]",
    warning: "text-[var(--dg-warning-text)]",
    hud: "text-[var(--dg-panel-text)]",
  };
  const bodyTone = {
    neutral: "text-claude-muted",
    success: "text-[var(--dg-success-text)] opacity-90",
    warning: "text-[var(--dg-warning-text)] opacity-90",
    hud: "text-[var(--dg-panel-muted)]",
  };

  return (
    <div className={`rounded-xl border px-4 py-4 sm:px-5 ${tones[tone]}`}>
      <p className={`text-sm font-semibold ${titleTone[tone]}`}>{title}</p>
      <div className={`mt-1.5 text-sm leading-relaxed ${bodyTone[tone]}`}>{children}</div>
    </div>
  );
}

function DateField({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  function openPicker() {
    const input = inputRef.current;
    if (!input) return;
    try {
      if (typeof input.showPicker === "function") {
        input.showPicker();
        return;
      }
    } catch {
      // showPicker can throw if not allowed; fall through to focus + click
    }
    input.focus();
    input.click();
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={openPicker}
        className="flex min-h-11 w-full items-center justify-between gap-3 rounded-lg border border-claude-border bg-[var(--dg-input)] px-3 py-2.5 text-left transition hover:border-claude-accent/30 focus:border-claude-accent focus:outline-none focus:ring-2 focus:ring-claude-accent/15"
      >
        <div>
          <p className="text-xs font-medium text-claude-text">{label}</p>
          {description ? (
            <p className="mt-0.5 text-xs leading-relaxed text-claude-muted">{description}</p>
          ) : null}
          <p
            className={`mt-1 text-sm ${value ? "font-medium text-claude-text" : "text-claude-muted"}`}
          >
            {value ? formatDisplayDate(value) : "Tap to choose a date"}
          </p>
        </div>
        <CalendarIcon />
      </button>
      <input
        ref={inputRef}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        tabIndex={-1}
        className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0"
      />
    </div>
  );
}

function EligibilityResultsFootnote({
  eligibility,
  signingDate,
  prDate,
}: {
  eligibility: EligibilityResult;
  signingDate: string;
  prDate: string;
}) {
  return (
    <details
      className={`${panel} group`}
      open={!eligibility.eligible}
    >
      <summary className="cursor-pointer list-none px-4 py-3.5 sm:px-5 [&::-webkit-details-marker]:hidden">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-medium text-claude-text">
            Eligibility summary
            <span
              className={`ml-2 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                eligibility.eligible ? badgeSuccess : badgeWarning
              }`}
            >
              {eligibility.eligible ? "Eligible" : "Not yet eligible"}
            </span>
          </span>
          <span className="text-xs text-claude-muted group-open:hidden">Show details</span>
          <span className="hidden text-xs text-claude-muted group-open:inline">Hide details</span>
        </div>
        <p className="mt-1 text-xs leading-relaxed text-claude-muted group-open:hidden">
          {eligibility.daysPresentWithCredit.toLocaleString()} / {eligibility.requiredDays.toLocaleString()}{" "}
          days present · {eligibility.daysAsPr.toLocaleString()} /{" "}
          {eligibility.daysAsPrRequired.toLocaleString()} days as a PR
        </p>
      </summary>

      <div className="space-y-4 border-t border-claude-border px-4 py-4 text-sm sm:px-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-claude-muted">Physical presence</p>
            <p className="mt-1 font-mono tabular-nums text-claude-text">
              {eligibility.daysPresentWithCredit.toLocaleString()}
              <span className="text-claude-muted"> / {eligibility.requiredDays.toLocaleString()}</span>
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-claude-muted">Time as a PR</p>
            <p className="mt-1 font-mono tabular-nums text-claude-text">
              {eligibility.daysAsPr.toLocaleString()}
              <span className="text-claude-muted"> / {eligibility.daysAsPrRequired.toLocaleString()}</span>
            </p>
          </div>
        </div>

        <dl className="space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-claude-muted">Application date</dt>
            <dd className="font-medium text-claude-text">
              {signingDate ? formatDisplayDate(signingDate) : "—"}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-claude-muted">PR date</dt>
            <dd className="font-medium text-claude-text">{prDate ? formatDisplayDate(prDate) : "—"}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-claude-muted">Eligibility window</dt>
            <dd className="text-right font-medium text-claude-text">
              {formatDisplayDate(eligibility.windowStart)} to {formatDisplayDate(eligibility.windowEnd)}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-claude-muted">Absences in window</dt>
            <dd className="font-medium text-claude-text">
              {eligibility.daysOutside.toLocaleString()} day{eligibility.daysOutside === 1 ? "" : "s"}
            </dd>
          </div>
          {eligibility.prePrCreditDays > 0 ? (
            <div className="flex justify-between gap-4">
              <dt className="text-claude-muted">Pre-PR credit</dt>
              <dd className="text-right font-medium text-claude-text">
                {eligibility.prePrCreditDays.toLocaleString()} days
                <span className="mt-0.5 block text-xs font-normal text-claude-muted">
                  {eligibility.prePrTrDaysPresent.toLocaleString()} TR days,{" "}
                  {eligibility.prePrTrAbsenceDays.toLocaleString()} absence
                  {eligibility.prePrTrAbsenceDays === 1 ? "" : "s"} before PR
                </span>
              </dd>
            </div>
          ) : null}
        </dl>

        {!eligibility.eligible ? (
          <Callout tone="warning" title="What is still missing">
            {!eligibility.meetsPrRequirement ? (
              <p>
                You need {eligibility.daysAsPrRequired.toLocaleString()} days as a permanent resident. You
                would have {eligibility.daysAsPr.toLocaleString()}.
              </p>
            ) : null}
            {eligibility.daysPresentWithCredit < eligibility.requiredDays ? (
              <p className={!eligibility.meetsPrRequirement ? "mt-2" : undefined}>
                You need {eligibility.requiredDays.toLocaleString()} days physically present. You would have{" "}
                {eligibility.daysPresentWithCredit.toLocaleString()}.
              </p>
            ) : null}
          </Callout>
        ) : null}
      </div>
    </details>
  );
}

function StepIndicator({ current, steps }: { current: StepId; steps: { id: StepId; label: string }[] }) {
  const index = steps.findIndex((s) => s.id === current);

  return (
    <nav aria-label="Progress" className="days-gone-stepper days-in-canada-no-print">
      <ol className="flex items-center">
        {steps.map((step, i) => {
          const done = i < index;
          const active = i === index;
          return (
            <li key={step.id} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition ${
                    active
                      ? "bg-claude-accent text-[var(--dg-band-text)] ring-4 ring-claude-accent/15"
                      : done
                        ? "bg-[rgba(245,243,240,0.16)] text-[var(--dg-band-text)]"
                        : "border border-claude-border bg-transparent text-claude-muted"
                  }`}
                >
                  {done ? "✓" : i + 1}
                </div>
                <span
                  className={`hidden text-xs sm:block ${active ? "font-medium text-claude-text" : "text-claude-muted"}`}
                >
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 ? (
                <div
                  className={`mx-2 mb-6 h-px flex-1 ${done ? "bg-claude-accent/50" : "bg-claude-border"}`}
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function ModeChoiceCard({
  title,
  description,
  detail,
  onClick,
}: {
  title: string;
  description: string;
  detail: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${panel} w-full p-5 text-left transition hover:border-claude-accent/40 hover:bg-claude-accent-soft/20 sm:p-6`}
    >
      <p className="font-medium text-claude-text">{title}</p>
      <p className="mt-1.5 text-sm leading-relaxed text-claude-muted">{description}</p>
      <p className="mt-3 text-xs leading-relaxed text-claude-muted">{detail}</p>
    </button>
  );
}

function StepFooter({
  backLabel,
  nextLabel,
  onBack,
  onNext,
  hint,
  nextDisabled,
}: {
  backLabel?: string;
  nextLabel: string;
  onBack?: () => void;
  onNext?: () => void;
  hint?: string;
  nextDisabled?: boolean;
}) {
  return (
    <div className="days-in-canada-no-print mt-8 border-t border-claude-border pt-5">
      <div className="flex flex-wrap items-center gap-3">
        {onBack ? (
          <button type="button" onClick={onBack} className={btnSecondary}>
            {backLabel ?? "Back"}
          </button>
        ) : (
          <span />
        )}
        <div className="flex-1" />
        {hint ? <p className="text-xs text-claude-muted">{hint}</p> : null}
        <button type="button" onClick={onNext} disabled={nextDisabled} className={btnPrimary}>
          {nextLabel}
        </button>
      </div>
    </div>
  );
}

function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="inline-flex rounded-lg border border-claude-border bg-[var(--dg-tint)] p-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`rounded-md px-4 py-2 text-sm font-medium transition ${
            value === opt.value
              ? "bg-[var(--dg-elevated)] text-claude-text"
              : "text-claude-muted hover:text-claude-text"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function ClearTripsPrompt({
  tripCount,
  actionLabel,
  onClearAndContinue,
  onKeepAndContinue,
  onCancel,
}: {
  tripCount: number;
  actionLabel: string;
  onClearAndContinue: () => void;
  onKeepAndContinue: () => void;
  onCancel: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="clear-trips-title"
    >
      <div className="w-full max-w-md rounded-xl border border-claude-border bg-claude-surface p-5 sm:p-6">
        <h3 id="clear-trips-title" className="font-serif text-lg font-semibold text-claude-text">
          Clear trips already added?
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-claude-muted">
          You have {tripCount} trip{tripCount === 1 ? "" : "s"} added. {actionLabel}
        </p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <button type="button" onClick={onClearAndContinue} className={btnPrimary}>
            Clear trips and continue
          </button>
          <button type="button" onClick={onKeepAndContinue} className={btnSecondary}>
            Keep trips and continue
          </button>
          <button type="button" onClick={onCancel} className={`${btnSecondary} sm:ml-auto`}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function ParsedTripRow({
  trip,
  incompletePaste,
  onIncompletePasteChange,
  onFindMissingLeg,
  manualLeftDate,
  onManualLeftChange,
  manualReturnDate,
  onManualReturnChange,
  onSaveManualDates,
  manualDateError,
  onDiscard,
}: {
  trip: ParsedTrip & { id: string };
  incompletePaste: string;
  onIncompletePasteChange: (v: string) => void;
  onFindMissingLeg: () => void;
  manualLeftDate: string;
  onManualLeftChange: (v: string) => void;
  manualReturnDate: string;
  onManualReturnChange: (v: string) => void;
  onSaveManualDates: () => void;
  manualDateError?: string | null;
  onDiscard?: () => void;
}) {
  const missingLeft = !trip.left;
  const missingReturn = !trip.returned;
  const missingLabel = missingLeft && missingReturn
    ? "Missing departure and return"
    : missingLeft
      ? "Missing departure"
      : "Missing return or arrival";

  const resolvedLeft = trip.left ?? manualLeftDate;
  const resolvedReturn = trip.returned ?? manualReturnDate;
  const canSave = Boolean(resolvedLeft && resolvedReturn);

  return (
    <div className="rounded-lg border border-claude-border/80 bg-[var(--dg-faint)]/80 px-4 py-3.5">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
        <span className="font-medium">
          {trip.left ? formatDisplayDate(trip.left) : "Date unknown"}
        </span>
        <span className="text-claude-muted">→</span>
        <span className={`font-medium ${trip.returned ? "text-claude-text" : "text-claude-muted"}`}>
          {trip.returned ? formatDisplayDate(trip.returned) : "Return or arrival not found"}
        </span>
        {trip.route ? <span className="text-xs text-claude-muted">{trip.route}</span> : null}
        <span className="flex-1" />
        <span className={badgeWarning}>
          {missingLabel}
        </span>
      </div>

      <div className="mt-3 space-y-4 border-t border-claude-border/80 pt-3">
        <div className="space-y-2">
          <p className="text-xs leading-relaxed text-claude-muted">
            {missingLeft && !missingReturn
              ? "Paste an outbound confirmation or export. We will match it to this return date."
              : missingReturn && !missingLeft
                ? "Paste a return confirmation or export. We will match it to this departure date."
                : "Paste travel details from another email or export. We will match them to this trip."}
          </p>
          <textarea
            value={incompletePaste}
            onChange={(e) => onIncompletePasteChange(e.target.value)}
            rows={3}
            className={input}
          />
          <button type="button" onClick={onFindMissingLeg} className={btnPrimary}>
            Find missing date with local AI
          </button>
        </div>

        <div className="space-y-3 border-t border-claude-border/60 pt-3">
          <p className="text-xs leading-relaxed text-claude-muted">Or pick the missing date manually.</p>
          {missingLeft ? (
            <DateField
              label="Date left Canada"
              value={manualLeftDate}
              onChange={onManualLeftChange}
            />
          ) : null}
          {missingReturn ? (
            <DateField
              label="Date returned to Canada"
              value={manualReturnDate}
              onChange={onManualReturnChange}
            />
          ) : null}
          {manualDateError ? (
            <p className="text-xs leading-relaxed text-[var(--dg-warning-text)]">{manualDateError}</p>
          ) : null}
          <button
            type="button"
            onClick={onSaveManualDates}
            disabled={!canSave}
            className={btnSecondary}
          >
            Save trip dates
          </button>
        </div>

        {onDiscard ? (
          <button type="button" onClick={onDiscard} className="text-sm text-claude-muted hover:text-claude-text">
            Discard trip
          </button>
        ) : null}
      </div>
    </div>
  );
}

type TripsReplacePrompt =
  | { kind: "parse"; text: string }
  | { kind: "paste"; text: string };

export function DaysInCanadaApp() {
  const [appMode, setAppMode] = useState<AppMode | null>(null);
  const [step, setStep] = useState<StepId>("welcome");
  const [state, setState] = useState<AppState>(DEFAULT_STATE);
  const [tripMode, setTripMode] = useState<"paste" | "manual">("paste");
  const [pasteText, setPasteText] = useState("");
  const [parsedTrips, setParsedTrips] = useState<(ParsedTrip & { id: string })[]>([]);
  const [hasParsed, setHasParsed] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [parseStatus, setParseStatus] = useState<string | null>(null);
  const [parseProgress, setParseProgress] = useState<number | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [parseReturnedNoTrips, setParseReturnedNoTrips] = useState(false);
  const [tripsReplacePrompt, setTripsReplacePrompt] = useState<TripsReplacePrompt | null>(null);
  const [recentlyAddedTripIds, setRecentlyAddedTripIds] = useState<string[]>([]);
  const [fetchedTrips, setFetchedTrips] = useState<Trip[]>([]);
  const [incompletePastes, setIncompletePastes] = useState<Record<string, string>>({});
  const [incompleteManualLefts, setIncompleteManualLefts] = useState<Record<string, string>>({});
  const [incompleteManualReturns, setIncompleteManualReturns] = useState<Record<string, string>>({});
  const [incompleteManualDateErrors, setIncompleteManualDateErrors] = useState<
    Record<string, string | null>
  >({});
  const [manualLeft, setManualLeft] = useState("");
  const [manualReturn, setManualReturn] = useState("");
  const [manualDest, setManualDest] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const lastParsedTextRef = useRef<string | null>(null);
  const lastFetchedTripsRef = useRef<Trip[]>([]);
  const recentlyAddedTripIdsRef = useRef<string[]>([]);
  const tripsRef = useRef(state.trips);
  const parsedTripsRef = useRef(parsedTrips);

  function invalidateParseCacheIfTextChanged(text: string) {
    const normalized = text.trim();
    if (normalized !== lastParsedTextRef.current) {
      lastParsedTextRef.current = null;
      lastFetchedTripsRef.current = [];
      setParseStatus(null);
      setParseProgress(null);
      setParseError(null);
      setParseReturnedNoTrips(false);
    }
  }

  function syncParseSessionTrips(trips: Trip[]) {
    const complete = trips.filter((t) => t.left && t.returned);
    lastFetchedTripsRef.current = complete;
    const ids = complete.map((t) => t.id);
    recentlyAddedTripIdsRef.current = ids;
    setFetchedTrips(complete);
    setRecentlyAddedTripIds(ids);
    return complete;
  }

  function refreshParseSessionStatus() {
    const complete = syncParseSessionTrips(tripsRef.current);
    const incompleteCount = parsedTripsRef.current.length;

    if (incompleteCount > 0) {
      setParseStatus(
        `${complete.length} trip${complete.length === 1 ? "" : "s"} added. ${incompleteCount} still need a missing date.`,
      );
      return;
    }

    if (complete.length > 0) {
      setParseStatus(
        `${complete.length} trip${complete.length === 1 ? "" : "s"} added from this paste. Expand below to review.`,
      );
      return;
    }

    setParseStatus(null);
  }

  function clearAddedTrips() {
    setState((prev) => ({ ...prev, trips: [] }));
    setFetchedTrips([]);
    setRecentlyAddedTripIds([]);
    recentlyAddedTripIdsRef.current = [];
    lastFetchedTripsRef.current = [];
    lastParsedTextRef.current = null;
    setParsedTrips([]);
    setHasParsed(false);
    setParseStatus(null);
    setParseError(null);
    setIncompletePastes({});
    setIncompleteManualLefts({});
    setIncompleteManualReturns({});
    setIncompleteManualDateErrors({});
  }

  useEffect(() => {
    clearLegacyStorage();
  }, []);

  useEffect(() => {
    recentlyAddedTripIdsRef.current = recentlyAddedTripIds;
  }, [recentlyAddedTripIds]);

  useEffect(() => {
    tripsRef.current = state.trips;
  }, [state.trips]);

  useEffect(() => {
    parsedTripsRef.current = parsedTrips;
  }, [parsedTrips]);

  const updateState = useCallback((patch: Partial<AppState>) => {
    setState((prev) => ({ ...prev, ...patch }));
  }, []);

  const eligibility = useMemo(
    () =>
      computeEligibility(
        state.signingDate,
        state.prDate,
        state.prePrCredit,
        state.prePrPeriods,
        state.trips,
      ),
    [state],
  );

  const keyDatesValidation = useMemo(
    () => validateKeyDates(state.signingDate, state.prDate),
    [state.signingDate, state.prDate],
  );

  const datesReady = Boolean(state.signingDate && state.prDate);
  const prePrPeriodsValid =
    !state.prePrCredit ||
    state.prePrPeriods.some(
      (p) =>
        p.from &&
        p.to &&
        p.from <= p.to &&
        p.to < state.prDate &&
        (!state.signingDate || p.from <= state.signingDate),
    );
  const datesValid = datesReady && keyDatesValidation.ok && prePrPeriodsValid;

  const completeTrips = state.trips.filter((t) => t.left && t.returned);
  const canProceedToResults = completeTrips.length > 0;
  const showNoTripsParseCallout = parseReturnedNoTrips && !canProceedToResults;

  const displayFetchedTrips = useMemo(
    () => state.trips.filter((t) => t.left && t.returned),
    [state.trips],
  );

  const addedTripsTitle = `${displayFetchedTrips.length} trip${displayFetchedTrips.length === 1 ? "" : "s"} added`;

  const wizardSteps = appMode === "parse" ? PARSE_STEPS : ELIGIBILITY_STEPS;
  const isEligibilityMode = appMode === "eligibility";
  const isParseMode = appMode === "parse";

  function resetSessionData() {
    clearLegacyStorage();
    setState(DEFAULT_STATE);
    setTripMode("paste");
    setPasteText("");
    setParsedTrips([]);
    setHasParsed(false);
    setIsParsing(false);
    setParseStatus(null);
    setParseProgress(null);
    setParseError(null);
    setParseReturnedNoTrips(false);
    setTripsReplacePrompt(null);
    setRecentlyAddedTripIds([]);
    setFetchedTrips([]);
    setIncompletePastes({});
    setIncompleteManualLefts({});
    setIncompleteManualReturns({});
    setIncompleteManualDateErrors({});
    setManualLeft("");
    setManualReturn("");
    setManualDest("");
    setEditingId(null);
    setIsExportingPdf(false);
    lastParsedTextRef.current = null;
    lastFetchedTripsRef.current = [];
    recentlyAddedTripIdsRef.current = [];
  }

  function returnToWelcome() {
    resetSessionData();
    setAppMode(null);
    setStep("welcome");
  }

  function startWithMode(mode: AppMode) {
    resetSessionData();
    setAppMode(mode);
    setStep(mode === "eligibility" ? "dates" : "trips");
  }

  const parseModeAbsentDays = useMemo(
    () => completeTrips.reduce((sum, trip) => sum + (trip.daysOutside ?? 0), 0),
    [completeTrips],
  );

  const exportOptions = useMemo((): ExportOptions | null => {
    if (isParseMode) {
      if (completeTrips.length === 0) return null;
      const trips = completeTrips
        .map((trip) => tripToExportRow(trip))
        .filter((trip): trip is NonNullable<typeof trip> => trip !== null);
      return { mode: "parse", trips };
    }
    if (!eligibility) return null;
    const trips = eligibility.tripsInWindow
      .map((trip) =>
        tripToExportRow(trip, {
          absentDays: trip.inEligibilityWindow ? trip.daysOutside ?? 0 : 0,
          inEligibilityWindow: trip.inEligibilityWindow,
        }),
      )
      .filter((trip): trip is NonNullable<typeof trip> => trip !== null);
    return {
      mode: "eligibility",
      signingDate: state.signingDate,
      prDate: state.prDate,
      eligibility,
      trips,
    };
  }, [completeTrips, eligibility, isParseMode, state.prDate, state.signingDate]);

  async function handleExportPdf() {
    if (!exportOptions) return;
    setIsExportingPdf(true);
    try {
      await downloadTripsPdf(exportOptions);
    } finally {
      setIsExportingPdf(false);
    }
  }

  function handleExportCsv() {
    if (!exportOptions) return;
    downloadTripsCsv(exportOptions);
  }

  function commitParsedTrips(parsed: ParsedTrip[]): Trip[] {
    const complete = parsed.filter((t) => t.left && t.returned);
    const incomplete = parsed
      .filter((t) => !(t.left && t.returned))
      .map((t) => ({ ...t, id: newTripId() }));

    const newTrips = complete.map((t) => tripFromParsed(t, newTripId()));
    let batchTrips: Trip[] = [];
    let mergedTrips: Trip[] = [];

    setState((prev) => {
      const { merged, fetched } = mergeParsedIntoTrips(
        newTrips,
        prev.trips,
        recentlyAddedTripIdsRef.current,
      );
      batchTrips = fetched;
      mergedTrips = merged;
      return { ...prev, trips: merged };
    });

    syncParseSessionTrips(mergedTrips);
    setParsedTrips(incomplete);
    setHasParsed(batchTrips.length > 0 || incomplete.length > 0);

    const pastes: Record<string, string> = {};
    const manualLefts: Record<string, string> = {};
    const manualReturns: Record<string, string> = {};
    for (const trip of incomplete) {
      pastes[trip.id] = "";
      if (!trip.left) manualLefts[trip.id] = "";
      if (!trip.returned) manualReturns[trip.id] = "";
    }
    setIncompletePastes(pastes);
    setIncompleteManualLefts(manualLefts);
    setIncompleteManualReturns(manualReturns);
    setIncompleteManualDateErrors({});
    return batchTrips;
  }

  function commitCompletedTrip(trip: ParsedTrip & { id: string }) {
    if (!trip.left || !trip.returned) return;
    const newTrip = tripFromParsed(trip, newTripId());
    let mergedTrips: Trip[] = [];

    setState((prev) => {
      mergedTrips = dedupeTrips([...prev.trips, newTrip]);
      return { ...prev, trips: mergedTrips };
    });

    syncParseSessionTrips(mergedTrips);
    const nextIncomplete = parsedTrips.filter((t) => t.id !== trip.id);
    setParsedTrips(nextIncomplete);
    if (lastParsedTextRef.current) {
      const completeCount = mergedTrips.filter((t) => t.left && t.returned).length;
      if (nextIncomplete.length > 0) {
        setParseStatus(
          `${completeCount} trip${completeCount === 1 ? "" : "s"} added. ${nextIncomplete.length} still need a missing date.`,
        );
      } else if (completeCount > 0) {
        setParseStatus(
          `${completeCount} trip${completeCount === 1 ? "" : "s"} added from this paste. Expand below to review.`,
        );
      }
    }
  }

  async function executeParse(text: string) {
    setParseError(null);
    setParseReturnedNoTrips(false);
    setParseProgress(null);
    setParseStatus("Loading local AI on your device...");

    const normalized = text.trim();
    if (!normalized) {
      lastParsedTextRef.current = null;
      lastFetchedTripsRef.current = [];
      setParsedTrips([]);
      setHasParsed(false);
      setRecentlyAddedTripIds([]);
      setFetchedTrips([]);
      setParseStatus(null);
      return;
    }

    if (lastParsedTextRef.current === normalized) {
      refreshParseSessionStatus();
      return;
    }

    setIsParsing(true);
    try {
      const onProgress = (p: AiParseProgress) => {
        setParseStatus(p.message);
        setParseProgress(p.progress ?? null);
      };

      const parsed = await parseTravel(text, { onProgress });
      const batchTrips = commitParsedTrips(parsed);
      const incompleteCount = parsed.filter((t) => !(t.left && t.returned)).length;
      const totalFound = parsed.length;
      if (parsed.length > 0) {
        lastParsedTextRef.current = normalized;
      }

      if (batchTrips.length > 0 && incompleteCount > 0) {
        setParseReturnedNoTrips(false);
        setParseStatus(
          `Found ${totalFound} trip${totalFound === 1 ? "" : "s"}: ${batchTrips.length} ready, ${incompleteCount} need a missing date.`,
        );
        setParseProgress(null);
      } else if (batchTrips.length > 0) {
        setParseReturnedNoTrips(false);
        setParseStatus(
          `Successfully fetched ${batchTrips.length} trip${batchTrips.length > 1 ? "s" : ""}. Expand below to review.`,
        );
        setParseProgress(null);
      } else if (parsed.length === 0) {
        setParseStatus(null);
        setParseReturnedNoTrips(true);
        setParseError("No trips found. Try editing the paste or adding more detail.");
      } else {
        setParseReturnedNoTrips(false);
        setParseStatus("Some trips need a return date. See incomplete trips below.");
        setParseProgress(null);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Parsing failed.";
      setParseError(message);
      setParseReturnedNoTrips(false);
      setParseStatus(null);
      setParsedTrips([]);
      setHasParsed(false);
    } finally {
      setIsParsing(false);
      setParseProgress(null);
    }
  }

  function requestParse(text: string) {
    const normalized = text.trim();
    if (!normalized) {
      void executeParse(text);
      return;
    }
    if (lastParsedTextRef.current === normalized) {
      void executeParse(text);
      return;
    }
    if (displayFetchedTrips.length > 0) {
      setTripsReplacePrompt({ kind: "parse", text: normalized });
      return;
    }
    void executeParse(text);
  }

  function handleMainPaste(e: React.ClipboardEvent<HTMLTextAreaElement>) {
    if (displayFetchedTrips.length === 0) return;
    const pasted = e.clipboardData.getData("text");
    if (!pasted.trim()) return;
    e.preventDefault();
    setTripsReplacePrompt({ kind: "paste", text: pasted });
  }

  function resolveTripsReplacePrompt(clearTrips: boolean) {
    const prompt = tripsReplacePrompt;
    if (!prompt) return;
    setTripsReplacePrompt(null);
    if (clearTrips) clearAddedTrips();
    if (prompt.kind === "paste") {
      setPasteText(prompt.text);
      invalidateParseCacheIfTextChanged(prompt.text);
      return;
    }
    void executeParse(prompt.text);
  }

  function clearIncompleteTripFields(tripId: string) {
    setIncompletePastes((prev) => {
      const next = { ...prev };
      delete next[tripId];
      return next;
    });
    setIncompleteManualLefts((prev) => {
      const next = { ...prev };
      delete next[tripId];
      return next;
    });
    setIncompleteManualReturns((prev) => {
      const next = { ...prev };
      delete next[tripId];
      return next;
    });
    setIncompleteManualDateErrors((prev) => {
      const next = { ...prev };
      delete next[tripId];
      return next;
    });
  }

  function saveManualDatesForTrip(tripId: string) {
    const trip = parsedTrips.find((t) => t.id === tripId);
    if (!trip) return;

    const left = trip.left ?? incompleteManualLefts[tripId] ?? "";
    const returned = trip.returned ?? incompleteManualReturns[tripId] ?? "";
    if (!left || !returned) return;

    if (returned < left) {
      setIncompleteManualDateErrors((prev) => ({
        ...prev,
        [tripId]: "Return date must be on or after the date you left Canada.",
      }));
      return;
    }

    commitCompletedTrip({ ...trip, left, returned });
    clearIncompleteTripFields(tripId);
  }

  async function findMissingLegForTrip(tripId: string) {
    const trip = parsedTrips.find((t) => t.id === tripId);
    const paste = incompletePastes[tripId] ?? "";
    if (!paste.trim() || !trip) return;

    setIsParsing(true);
    setParseProgress(null);
    setParseStatus("Looking for the missing date...");
    setParseError(null);
    try {
      const found = await parseTravel(paste, {
        context: trip.left
          ? { knownDeparture: trip.left, knownDestination: trip.destination }
          : trip.returned
            ? { knownReturn: trip.returned, knownDestination: trip.destination }
            : undefined,
        onProgress: (p) => {
          setParseStatus(p.message);
          setParseProgress(p.progress ?? null);
        },
      });

      const left = trip.left ?? found.find((t) => t.left)?.left ?? found[0]?.left ?? null;
      const returned =
        trip.returned ?? found.find((t) => t.returned)?.returned ?? found[0]?.returned ?? null;

      if (!left || !returned) {
        setParseError("Could not find the missing date in that paste.");
        return;
      }
      if (returned < left) {
        setParseError("Found dates do not form a valid trip. Return must be on or after departure.");
        return;
      }

      commitCompletedTrip({ ...trip, left, returned });
      clearIncompleteTripFields(tripId);
    } catch (err) {
      setParseError(err instanceof Error ? err.message : "Could not parse the missing date.");
    } finally {
      setIsParsing(false);
      setParseProgress(null);
    }
  }

  function addManualTrip() {
    if (!manualLeft || !manualReturn) return;
    const trip: Trip = {
      id: newTripId(),
      left: manualLeft,
      returned: manualReturn,
      destination: manualDest,
      daysOutside: absenceDays(manualLeft, manualReturn),
    };
    updateState({ trips: dedupeTrips([...state.trips, trip]) });
    setManualLeft("");
    setManualReturn("");
    setManualDest("");
  }

  function updateTrip(id: string, patch: Partial<Trip>) {
    updateState({
      trips: dedupeTrips(
        state.trips.map((t) => {
          if (t.id !== id) return t;
          const next = { ...t, ...patch };
          if (next.left && next.returned) {
            next.daysOutside = absenceDays(next.left, next.returned);
          }
          return next;
        }),
      ),
    });
  }

  function removeTrip(id: string) {
    updateState({ trips: state.trips.filter((t) => t.id !== id) });
    setFetchedTrips((prev) => {
      const next = prev.filter((t) => t.id !== id);
      lastFetchedTripsRef.current = next;
      return next;
    });
    setRecentlyAddedTripIds((prev) => prev.filter((tripId) => tripId !== id));
  }

  function addPrePrPeriod() {
    updateState({
      prePrPeriods: [...state.prePrPeriods, { id: newTripId(), from: "", to: "" }],
    });
  }

  function updatePrePrPeriod(id: string, patch: Partial<PrePrPeriod>) {
    updateState({
      prePrPeriods: state.prePrPeriods.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    });
  }

  function removePrePrPeriod(id: string) {
    updateState({ prePrPeriods: state.prePrPeriods.filter((p) => p.id !== id) });
  }

  function setPrePrCredit(enabled: boolean) {
    updateState({
      prePrCredit: enabled,
      prePrPeriods:
        enabled && state.prePrPeriods.length === 0
          ? [{ id: newTripId(), from: "", to: "" }]
          : state.prePrPeriods,
    });
  }

  function handleStartOver() {
    returnToWelcome();
  }


  return (
    <div>
      {tripsReplacePrompt ? (
        <ClearTripsPrompt
          tripCount={displayFetchedTrips.length}
          actionLabel={
            tripsReplacePrompt.kind === "paste"
              ? "Clear them before pasting new travel history, or keep them and paste on top."
              : "Clear them before parsing this new paste, or keep them and add any new trips found."
          }
          onClearAndContinue={() => resolveTripsReplacePrompt(true)}
          onKeepAndContinue={() => resolveTripsReplacePrompt(false)}
          onCancel={() => setTripsReplacePrompt(null)}
        />
      ) : null}

      <div className="days-gone-band border-b border-claude-border">
        <DaysGoneBackdrop />
        <div className="relative z-10 mx-auto w-full max-w-[640px] px-5 pb-8 pt-10 sm:px-6 sm:pt-12">
          <header className="mb-8 flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-claude-accent">
                Free · Private · Browser-only
              </p>
              <h1 className="mt-2 font-sans text-[1.65rem] font-bold uppercase tracking-[0.14em] text-claude-text sm:text-[1.85rem]">
                Days Gone
              </h1>
              <p className="mt-1.5 text-xs leading-relaxed text-claude-muted">
                Track days gone from Canada for citizenship math.
              </p>
            </div>
            <Link
              href="/projects/days-in-canada"
              className="days-in-canada-no-print shrink-0 pt-1 text-xs font-medium text-claude-accent hover:underline"
            >
              Why I built this
            </Link>
          </header>

          <StepIndicator current={step} steps={wizardSteps} />
        </div>
      </div>

      <div className="mx-auto w-full max-w-[640px] px-5 pb-10 pt-10 sm:px-6">
        {step === "welcome" ? (
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-claude-muted">
              Canadian citizenship requires 1,095 days of physical presence in the last 5 years. The hard part
              is finding exact travel dates scattered across emails, apps, and old notes. Choose how you want
              to use this tool.
            </p>
            <Callout title="Your data stays in this session" tone="hud">
              No account. No server. Trips live in memory for this visit only. Choosing a different path or
              Start over clears everything.
            </Callout>
            <div className="space-y-3">
              <ModeChoiceCard
                title="Check my eligibility"
                description="Enter your application date, PR date, and any pre-PR permit time. Add trips outside Canada and see if you meet IRCC requirements."
                detail="About 5 minutes · signing date, PR date, absences, 1,095-day math"
                onClick={() => startWithMode("eligibility")}
              />
              <ModeChoiceCard
                title="Parse travel dates only"
                description="Skip eligibility math. Paste messy travel history and extract departure and return dates to copy into IRCC's calculator yourself."
                detail="Fastest path · paste, review trips, no dates required"
                onClick={() => startWithMode("parse")}
              />
            </div>
          </div>
        ) : null}

        {step === "dates" && isEligibilityMode ? (
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-xl font-semibold text-claude-text">Your dates</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-claude-muted">
                When you plan to apply and when you became a permanent resident. We check these against
                IRCC rules as you go.
              </p>
            </div>
            <div className={`${panel} space-y-4 p-5 sm:p-6`}>
              <div className="space-y-2">
                <DateField
                  label="Planned application date"
                  description="When you plan to sign and submit your citizenship application."
                  value={state.signingDate}
                  onChange={(v) => updateState({ signingDate: v })}
                />
                <button
                  type="button"
                  onClick={() => updateState({ signingDate: toIsoDate(new Date()) })}
                  className="text-xs font-medium text-claude-accent hover:underline"
                >
                  Use today
                </button>
              </div>
              <DateField
                label="Date you became a PR"
                description="The date on your permanent resident card or confirmation of permanent residence."
                value={state.prDate}
                onChange={(v) => updateState({ prDate: v })}
              />
              <label className="flex items-start gap-3 border-t border-claude-border pt-4">
                <input
                  type="checkbox"
                  checked={state.prePrCredit}
                  onChange={(e) => setPrePrCredit(e.target.checked)}
                  className="mt-0.5 size-4 rounded border-claude-border text-claude-accent focus:ring-claude-accent/20"
                />
                <span className="text-sm">
                  <span className="font-medium text-claude-text">I lived in Canada before becoming a PR</span>
                  <span className="mt-0.5 block leading-relaxed text-claude-muted">
                    Visitor, worker, or student time counts as half-days toward presence, up to 365 days
                    credit. List each period you had valid temporary status in Canada before your PR date.
                  </span>
                </span>
              </label>

              {state.prePrCredit ? (
                <div className="space-y-4 rounded-lg border border-claude-border/80 bg-[var(--dg-faint)]/80 p-4">
                  <p className="text-xs leading-relaxed text-claude-muted">
                    Match IRCC&apos;s calculator: one row per stretch on a visitor, work, or study permit.
                    Trips you add later count as absences during these periods too.
                  </p>
                  {state.prePrPeriods.map((period, index) => (
                    <div key={period.id} className="space-y-3 border-t border-claude-border/60 pt-4 first:border-0 first:pt-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-medium text-claude-text">
                          Temporary resident period {index + 1}
                        </p>
                        {state.prePrPeriods.length > 1 ? (
                          <button
                            type="button"
                            onClick={() => removePrePrPeriod(period.id)}
                            className="text-xs text-claude-muted hover:text-claude-text"
                          >
                            Remove
                          </button>
                        ) : null}
                      </div>
                      <DateField
                        label="First day on this permit in Canada"
                        value={period.from}
                        onChange={(v) => updatePrePrPeriod(period.id, { from: v })}
                      />
                      <DateField
                        label="Last day on this permit in Canada"
                        description="Must be before your PR date. Use your last day of valid temporary status."
                        value={period.to}
                        onChange={(v) => updatePrePrPeriod(period.id, { to: v })}
                      />
                    </div>
                  ))}
                  <button type="button" onClick={addPrePrPeriod} className={btnSecondary}>
                    Add another period
                  </button>
                  {state.prDate && state.prePrPeriods.some((p) => p.to && p.to >= state.prDate) ? (
                    <p className="text-xs text-[var(--dg-warning-text)]">
                      Each period must end before your PR date ({formatDisplayDate(state.prDate)}).
                    </p>
                  ) : null}
                </div>
              ) : null}
            </div>

            {datesReady && !keyDatesValidation.ok ? (
              <div className="space-y-3">
                {keyDatesValidation.issues.map((issue) => {
                  if (issue.type === "pr_after_signing") {
                    return (
                      <Callout key={issue.type} tone="warning" title="These dates cannot work together">
                        Your PR date is after your planned application date. You need to be a permanent
                        resident before you apply.
                      </Callout>
                    );
                  }
                  return (
                    <Callout key={issue.type} tone="warning" title="Not enough time as a permanent resident">
                      IRCC requires at least 730 days as a PR before you apply. With these dates you would
                      only have {issue.daysAsPr} day{issue.daysAsPr === 1 ? "" : "s"}. Earliest you could
                      apply: {formatDisplayDate(issue.earliestSigningDate)}.
                    </Callout>
                  );
                })}
              </div>
            ) : null}

            {datesValid && eligibility ? (
              <Callout tone="success" title="Dates look good">
                You would have {keyDatesValidation.daysAsPr} days as a permanent resident by{" "}
                {formatDisplayDate(state.signingDate)}. Your 5-year presence window runs{" "}
                {formatDisplayDate(eligibility.windowStart)} to {formatDisplayDate(eligibility.windowEnd)}.
                {eligibility.prePrCreditDays > 0 ? (
                  <>
                    {" "}
                    Pre-PR credit from your permit periods: {eligibility.prePrCreditDays} day
                    {eligibility.prePrCreditDays === 1 ? "" : "s"} (half-day rule, max 365).
                  </>
                ) : null}
              </Callout>
            ) : null}

            {datesReady && keyDatesValidation.ok && state.prePrCredit && !prePrPeriodsValid ? (
              <Callout tone="warning" title="Add your temporary resident periods">
                Enter at least one permit period with start and end dates, ending before your PR date.
              </Callout>
            ) : null}

            <StepFooter
              backLabel="Back"
              nextLabel="Continue to trips"
              onBack={returnToWelcome}
              onNext={() => setStep("trips")}
              nextDisabled={!datesValid}
              hint={
                !datesReady
                  ? "Choose both dates to continue"
                  : !keyDatesValidation.ok
                    ? "Fix the date issues above"
                    : state.prePrCredit && !prePrPeriodsValid
                      ? "Add at least one valid permit period"
                      : undefined
              }
            />
          </div>
        ) : null}

        {step === "trips" ? (
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-xl font-semibold text-claude-text">
                {isParseMode ? "Parse your trips outside Canada" : "Add your trips outside Canada"}
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-claude-muted">
                {isParseMode
                  ? "Paste travel history from booking emails, loyalty apps, Google Timeline, or notes. Parsing runs on your device."
                  : "List every time you left Canada, even day trips to the US. One method at a time keeps this simple."}
              </p>
            </div>

            {!isParseMode ? (
              <SegmentedControl
                value={tripMode}
                onChange={setTripMode}
                options={[
                  { value: "paste", label: "Paste travel history" },
                  { value: "manual", label: "Enter one trip" },
                ]}
              />
            ) : null}

            {tripMode === "manual" && !isParseMode ? (
              <div className="space-y-4">
                <div className={`${panel} space-y-4 p-5 sm:p-6`}>
                  <DateField label="Date left Canada" value={manualLeft} onChange={setManualLeft} />
                  <DateField label="Date returned to Canada" value={manualReturn} onChange={setManualReturn} />
                  <label className="block text-sm">
                    <span className="text-claude-muted">Destination (optional)</span>
                    <input
                      type="text"
                      value={manualDest}
                      onChange={(e) => setManualDest(e.target.value)}
                      placeholder="e.g. United States"
                      className={`${input} mt-1.5`}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={addManualTrip}
                    disabled={!manualLeft || !manualReturn}
                    className={btnPrimary}
                  >
                    Add trip
                  </button>
                </div>

                {displayFetchedTrips.length > 0 ? (
                  <AddedTripsCollapsible
                    trips={displayFetchedTrips}
                    title={addedTripsTitle}
                    onRemove={removeTrip}
                  />
                ) : null}
              </div>
            ) : (
              <div className="space-y-4">
                <div className={`${panel} p-5 sm:p-6`}>
                  <p className="mb-4 text-sm leading-relaxed text-claude-muted">
                    Copy from booking emails, loyalty apps, Google Timeline, calendars, or your own notes.
                    Messy text is fine. Parsing runs on your device.
                  </p>
                  <textarea
                    value={pasteText}
                    onChange={(e) => {
                      setPasteText(e.target.value);
                      invalidateParseCacheIfTextChanged(e.target.value);
                    }}
                    onPaste={handleMainPaste}
                    rows={6}
                    placeholder="Paste travel confirmations, loyalty history, timeline exports..."
                    className={`${input} font-mono text-[13px] leading-relaxed`}
                  />
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => requestParse(pasteText)}
                      disabled={isParsing || !pasteText.trim()}
                      className={isParsing ? btnDisabled : btnPrimary}
                    >
                      {isParsing ? "Parsing..." : "Parse with local AI"}
                    </button>
                  </div>
                  {parseStatus ? (
                    <ParseStatusBanner
                      message={parseStatus}
                      progress={parseProgress}
                      isActive={isParsing}
                    />
                  ) : (
                    <p className="mt-3 text-xs leading-relaxed text-claude-muted">
                      {supportsWebGpu()
                        ? "Runs on your device with local AI. First run downloads a small model."
                        : "Runs on your device with local AI. WebGPU is not available in this browser, so parsing may fail."}
                    </p>
                  )}
                  {parseError && !parseReturnedNoTrips ? (
                    <p className="mt-2 text-xs leading-relaxed text-[var(--dg-warning-text)]">{parseError}</p>
                  ) : null}
                </div>

                {displayFetchedTrips.length > 0 ? (
                  <AddedTripsCollapsible
                    trips={displayFetchedTrips}
                    title={addedTripsTitle}
                    onRemove={removeTrip}
                  />
                ) : null}

                {parsedTrips.length > 0 ? (
                  <div className={`${panel} p-5 sm:p-6`}>
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-medium text-claude-text">
                        {parsedTrips.length} trip{parsedTrips.length > 1 ? "s need" : " needs"} a missing date
                      </h3>
                      <span className={badgeWarning}>
                        Incomplete
                      </span>
                    </div>

                    <Callout tone="warning" title="Some trips are missing a date">
                      We found part of each trip below, but not both the departure and return dates. Paste
                      another confirmation or pick the missing date manually for each trip.
                    </Callout>

                    <div className="mt-4 space-y-3">
                      {parsedTrips.map((trip) => (
                        <ParsedTripRow
                          key={trip.id}
                          trip={trip}
                          onDiscard={() => {
                            setParsedTrips((prev) => prev.filter((t) => t.id !== trip.id));
                            clearIncompleteTripFields(trip.id);
                          }}
                          incompletePaste={incompletePastes[trip.id] ?? ""}
                          onIncompletePasteChange={(v) =>
                            setIncompletePastes((prev) => ({ ...prev, [trip.id]: v }))
                          }
                          onFindMissingLeg={() => findMissingLegForTrip(trip.id)}
                          manualLeftDate={incompleteManualLefts[trip.id] ?? ""}
                          onManualLeftChange={(v) => {
                            setIncompleteManualLefts((prev) => ({ ...prev, [trip.id]: v }));
                            if (incompleteManualDateErrors[trip.id]) {
                              setIncompleteManualDateErrors((prev) => ({ ...prev, [trip.id]: null }));
                            }
                          }}
                          manualReturnDate={incompleteManualReturns[trip.id] ?? ""}
                          onManualReturnChange={(v) => {
                            setIncompleteManualReturns((prev) => ({ ...prev, [trip.id]: v }));
                            if (incompleteManualDateErrors[trip.id]) {
                              setIncompleteManualDateErrors((prev) => ({ ...prev, [trip.id]: null }));
                            }
                          }}
                          onSaveManualDates={() => saveManualDatesForTrip(trip.id)}
                          manualDateError={incompleteManualDateErrors[trip.id]}
                        />
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            )}

            {showNoTripsParseCallout ? (
              <Callout tone="warning" title="No trips found">
                <p>{parseError}</p>
              </Callout>
            ) : null}

            <StepFooter
              backLabel="Back"
              nextLabel={isParseMode ? "Review trips" : "See results"}
              onBack={() => (isParseMode ? returnToWelcome() : setStep("dates"))}
              onNext={() => {
                if (!canProceedToResults) return;
                setStep("results");
              }}
              nextDisabled={!canProceedToResults}
              hint={
                canProceedToResults
                  ? `${completeTrips.length} trip${completeTrips.length === 1 ? "" : "s"} ready`
                  : undefined
              }
            />
          </div>
        ) : null}

        {step === "results" ? (
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-xl font-semibold text-claude-text">
                {isParseMode ? "Your trips" : "Trips outside Canada"}
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-claude-muted">
                {isParseMode
                  ? "Review the dates we extracted. Copy each row into IRCC's Physical Presence Calculator when you are ready."
                  : "Confirm each date below, then enter every row into IRCC's Physical Presence Calculator."}
              </p>
            </div>

            {isParseMode ? (
              completeTrips.length > 0 ? (
                <div className={`${panel} overflow-hidden`}>
                    <table className="w-full min-w-[480px] text-left text-sm">
                      <thead>
                        <tr className={tableHead}>
                          <th className="px-4 py-3">Left Canada</th>
                          <th className="px-4 py-3">Returned</th>
                          <th className="px-4 py-3">Route</th>
                          <th className="px-4 py-3 text-right">Absent days</th>
                          <th className="px-4 py-3" />
                        </tr>
                      </thead>
                      <tbody>
                        {completeTrips.map((trip) => (
                          <tr key={trip.id} className="border-b border-claude-border/70 last:border-0">
                            <td className="px-4 py-3">{formatDisplayDate(trip.left)}</td>
                            <td className="px-4 py-3">{formatDisplayDate(trip.returned!)}</td>
                            <td className="px-4 py-3 text-claude-muted">{trip.destination || "—"}</td>
                            <td className="px-4 py-3 text-right font-mono font-semibold tabular-nums">
                              {trip.daysOutside}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button
                                type="button"
                                onClick={() => setEditingId(editingId === trip.id ? null : trip.id)}
                                className="text-xs font-medium text-claude-accent hover:underline"
                              >
                                Edit
                              </button>
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-[var(--dg-tint)]/70 font-medium">
                          <td className="px-4 py-3" colSpan={3}>
                            Total
                          </td>
                          <td className="px-4 py-3 text-right font-mono tabular-nums">{parseModeAbsentDays}</td>
                          <td />
                        </tr>
                      </tbody>
                    </table>
                  </div>
              ) : (
                <p className="text-sm text-claude-muted">Add at least one complete trip to review results.</p>
              )
            ) : eligibility ? (
              <>
                <div className={`${panel} overflow-hidden`}>
                  <table className="w-full min-w-[480px] text-left text-sm">
                    <thead>
                      <tr className={tableHead}>
                        <th className="px-4 py-3">Left Canada</th>
                        <th className="px-4 py-3">Returned</th>
                        <th className="px-4 py-3">Route</th>
                        <th className="px-4 py-3 text-right">Absent days</th>
                        <th className="px-4 py-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {eligibility.tripsInWindow.map((trip) => (
                        <tr
                          key={trip.id}
                          className={`border-b border-claude-border/70 last:border-0 ${
                            trip.inEligibilityWindow ? "" : "opacity-60"
                          }`}
                        >
                          <td className="px-4 py-3">{formatDisplayDate(trip.left)}</td>
                          <td className="px-4 py-3">{formatDisplayDate(trip.returned!)}</td>
                          <td className="px-4 py-3 text-claude-muted">
                            {trip.destination || "—"}
                            {!trip.inEligibilityWindow ? (
                              <span className="mt-1 block text-xs text-[var(--dg-warning-text)]">Outside eligibility window</span>
                            ) : null}
                          </td>
                          <td className="px-4 py-3 text-right font-mono font-semibold tabular-nums">
                            {trip.inEligibilityWindow ? trip.daysOutside : "—"}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              type="button"
                              onClick={() => setEditingId(editingId === trip.id ? null : trip.id)}
                              className="text-xs font-medium text-claude-accent hover:underline"
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-[var(--dg-tint)]/70 font-medium">
                        <td className="px-4 py-3" colSpan={3}>
                          Total in window
                        </td>
                        <td className="px-4 py-3 text-right font-mono tabular-nums">{eligibility.daysOutside}</td>
                        <td />
                      </tr>
                    </tbody>
                  </table>
                </div>

                <EligibilityResultsFootnote
                  eligibility={eligibility}
                  signingDate={state.signingDate}
                  prDate={state.prDate}
                />
              </>
            ) : !isParseMode ? (
              <p className="text-sm text-claude-muted">
                Add your signing date, PR date, and at least one complete trip to see results.
              </p>
            ) : null}

            {editingId ? (
              <div className={`${panel} space-y-3 p-5 sm:p-6`}>
                {(() => {
                  const trip = state.trips.find((t) => t.id === editingId);
                  if (!trip) return null;
                  return (
                    <>
                      <DateField
                        label="Date left Canada"
                        value={trip.left}
                        onChange={(v) => updateTrip(trip.id, { left: v })}
                      />
                      <DateField
                        label="Date returned"
                        value={trip.returned ?? ""}
                        onChange={(v) => updateTrip(trip.id, { returned: v })}
                      />
                      <button
                        type="button"
                        onClick={() => removeTrip(trip.id)}
                        className="text-sm text-[var(--dg-danger)] hover:underline"
                      >
                        Remove trip
                      </button>
                    </>
                  );
                })()}
              </div>
            ) : null}

            {!isParseMode && eligibility ? (
              <p className="text-xs leading-relaxed text-claude-muted">
                Departure and return days count as present. Only full calendar days entirely outside Canada
                count as absent. Your signing date and PR date are from Step 2.
              </p>
            ) : isParseMode && completeTrips.length > 0 ? (
              <p className="text-xs leading-relaxed text-claude-muted">
                Departure and return days count as present in IRCC&apos;s calculator. Only full calendar days
                entirely outside Canada count as absent.
              </p>
            ) : null}

            {exportOptions ? (
              <div className="days-in-canada-no-print flex flex-wrap gap-2">
                <button type="button" onClick={handleExportCsv} className={btnSecondary}>
                  Export CSV
                </button>
                <button
                  type="button"
                  onClick={() => void handleExportPdf()}
                  disabled={isExportingPdf}
                  className={btnSecondary}
                >
                  {isExportingPdf ? "Preparing PDF…" : "Export PDF"}
                </button>
                <button type="button" onClick={() => window.print()} className={btnSecondary}>
                  Print
                </button>
              </div>
            ) : null}

            <Callout title="All data stayed on this device" tone="hud">
              Nothing was uploaded. Local AI (if you used it) ran on your device only. Use Start over to
              clear this session.
            </Callout>

            <StepFooter
              backLabel="Edit trips"
              nextLabel="Start over"
              onBack={() => setStep("trips")}
              onNext={handleStartOver}
            />
          </div>
        ) : null}

        <footer className="days-in-canada-no-print mt-14 border-t border-claude-border pt-6 text-center text-xs text-claude-muted">
          <Link href="/" className="hover:text-claude-accent">
            arshiya.dev
          </Link>
          {" · "}
          <button type="button" onClick={handleStartOver} className="hover:text-claude-accent">
            Start over
          </button>
        </footer>
      </div>
    </div>
  );
}
