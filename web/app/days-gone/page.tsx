import type { Metadata } from "next";
import { DaysInCanadaApp } from "@/components/days-in-canada/DaysInCanadaApp";

export const metadata: Metadata = {
  title: "Days Gone",
  description:
    "Track days gone from Canada for citizenship physical presence requirements. Private, browser-only travel absence calculator.",
};

export default function DaysGonePage() {
  return (
    <div className="days-gone-app min-h-full">
      <DaysInCanadaApp />
    </div>
  );
}
