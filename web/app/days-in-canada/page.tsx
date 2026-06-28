import type { Metadata } from "next";
import { DaysInCanadaApp } from "@/components/days-in-canada/DaysInCanadaApp";

export const metadata: Metadata = {
  title: "Days in Canada",
  description:
    "Track days outside Canada for citizenship physical presence requirements. Private, browser-only travel absence calculator.",
};

export default function DaysInCanadaPage() {
  return (
    <div className="days-in-canada-app min-h-full">
      <DaysInCanadaApp />
    </div>
  );
}
