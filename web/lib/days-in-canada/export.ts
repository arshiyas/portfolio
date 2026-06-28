import { formatDisplayDate } from "./dates";
import type { EligibilityResult } from "./ircc";
import type { Trip } from "./types";

export type ExportTripRow = {
  left: string;
  returned: string;
  destination: string;
  absentDays: number;
  inEligibilityWindow?: boolean;
};

export type ExportOptions = {
  mode: "eligibility" | "parse";
  signingDate?: string;
  prDate?: string;
  eligibility?: EligibilityResult | null;
  trips: ExportTripRow[];
};

function escapeCsvCell(value: string | number): string {
  const text = String(value);
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function csvLine(cells: (string | number)[]): string {
  return cells.map(escapeCsvCell).join(",");
}

function exportStamp(): string {
  return toIsoDate(new Date());
}

function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function tripToExportRow(
  trip: Trip,
  options?: { inEligibilityWindow?: boolean; absentDays?: number },
): ExportTripRow | null {
  if (!trip.left || !trip.returned) return null;
  return {
    left: trip.left,
    returned: trip.returned,
    destination: trip.destination,
    absentDays: options?.absentDays ?? trip.daysOutside ?? 0,
    inEligibilityWindow: options?.inEligibilityWindow,
  };
}

export function buildTripsCsv(options: ExportOptions): string {
  const lines: string[] = [];

  if (options.mode === "eligibility" && options.eligibility) {
    const e = options.eligibility;
    lines.push(csvLine(["field", "value"]));
    lines.push(csvLine(["export_type", "eligibility"]));
    lines.push(csvLine(["application_date", options.signingDate ?? ""]));
    lines.push(csvLine(["pr_date", options.prDate ?? ""]));
    lines.push(csvLine(["eligibility_window_start", e.windowStart]));
    lines.push(csvLine(["eligibility_window_end", e.windowEnd]));
    lines.push(csvLine(["days_present_with_credit", e.daysPresentWithCredit]));
    lines.push(csvLine(["required_days_present", e.requiredDays]));
    lines.push(csvLine(["days_as_pr", e.daysAsPr]));
    lines.push(csvLine(["required_days_as_pr", e.daysAsPrRequired]));
    lines.push(csvLine(["absence_days_in_window", e.daysOutside]));
    lines.push(csvLine(["pre_pr_credit_days", e.prePrCreditDays]));
    lines.push(csvLine(["eligible", e.eligible ? "yes" : "no"]));
    lines.push("");
    lines.push(
      csvLine([
        "date_left_canada",
        "date_returned",
        "route",
        "absent_days",
        "in_eligibility_window",
      ]),
    );
    for (const trip of options.trips) {
      lines.push(
        csvLine([
          trip.left,
          trip.returned,
          trip.destination,
          trip.absentDays,
          trip.inEligibilityWindow ? "yes" : "no",
        ]),
      );
    }
    return lines.join("\n");
  }

  lines.push(csvLine(["date_left_canada", "date_returned", "route", "absent_days"]));
  for (const trip of options.trips) {
    lines.push(csvLine([trip.left, trip.returned, trip.destination, trip.absentDays]));
  }
  const total = options.trips.reduce((sum, trip) => sum + trip.absentDays, 0);
  lines.push(csvLine(["", "", "total", total]));
  return lines.join("\n");
}

export function downloadBlob(filename: string, blob: Blob): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function downloadTripsCsv(options: ExportOptions): void {
  const csv = buildTripsCsv(options);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  downloadBlob(`days-in-canada-trips-${exportStamp()}.csv`, blob);
}

export async function downloadTripsPdf(options: ExportOptions): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF();
  const marginX = 14;
  let cursorY = 18;

  doc.setFontSize(16);
  doc.text("Days in Canada", marginX, cursorY);
  cursorY += 8;

  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  if (options.mode === "eligibility" && options.eligibility) {
    const e = options.eligibility;
    doc.text("Citizenship eligibility summary", marginX, cursorY);
    cursorY += 6;
    doc.setTextColor(40, 40, 40);
    const summary = [
      `Application date: ${options.signingDate ? formatDisplayDate(options.signingDate) : "—"}`,
      `PR date: ${options.prDate ? formatDisplayDate(options.prDate) : "—"}`,
      `Eligibility window: ${formatDisplayDate(e.windowStart)} to ${formatDisplayDate(e.windowEnd)}`,
      `Days present: ${e.daysPresentWithCredit} / ${e.requiredDays}`,
      `Days as PR: ${e.daysAsPr} / ${e.daysAsPrRequired}`,
      `Absence days in window: ${e.daysOutside}`,
      e.prePrCreditDays > 0 ? `Pre-PR credit: ${e.prePrCreditDays} days` : null,
      `Eligible to apply: ${e.eligible ? "Yes" : "No"}`,
    ].filter((line): line is string => Boolean(line));
    for (const line of summary) {
      doc.text(line, marginX, cursorY);
      cursorY += 5;
    }
    cursorY += 2;
  } else {
    doc.text("Parsed travel trips", marginX, cursorY);
    cursorY += 8;
    const total = options.trips.reduce((sum, trip) => sum + trip.absentDays, 0);
    doc.setTextColor(40, 40, 40);
    doc.text(`${options.trips.length} trip${options.trips.length === 1 ? "" : "s"}, ${total} total absent days`, marginX, cursorY);
    cursorY += 8;
  }

  const head =
    options.mode === "eligibility"
      ? [["Left Canada", "Returned", "Route", "Absent days", "In window"]]
      : [["Left Canada", "Returned", "Route", "Absent days"]];

  const body = options.trips.map((trip) => {
    const row = [
      formatDisplayDate(trip.left),
      formatDisplayDate(trip.returned),
      trip.destination || "—",
      String(trip.absentDays),
    ];
    if (options.mode === "eligibility") {
      row.push(trip.inEligibilityWindow ? "Yes" : "No");
    }
    return row;
  });

  const totalAbsent = options.trips.reduce((sum, trip) => sum + trip.absentDays, 0);
  if (options.mode === "parse") {
    body.push(["", "", "Total", String(totalAbsent)]);
  } else if (options.eligibility) {
    body.push(["", "", "Total in window", String(options.eligibility.daysOutside), ""]);
  }

  autoTable(doc, {
    startY: cursorY,
    head,
    body,
    styles: { fontSize: 9, cellPadding: 2.5 },
    headStyles: { fillColor: [243, 240, 234], textColor: [60, 60, 60] },
    alternateRowStyles: { fillColor: [252, 251, 249] },
  });

  const tableEnd = (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? cursorY + 20;
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(
    "For reference only. Confirm dates in IRCC's Physical Presence Calculator before applying.",
    marginX,
    tableEnd + 10,
  );

  doc.save(`days-in-canada-trips-${exportStamp()}.pdf`);
}
