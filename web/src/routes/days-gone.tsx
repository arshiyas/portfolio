import { createFileRoute } from "@tanstack/react-router"
import { DaysInCanadaApp } from "@/components/days-in-canada/DaysInCanadaApp"

export const Route = createFileRoute("/days-gone")({
  head: () => ({
    meta: [{ title: "Days Gone | Arshiya Sayyed" }],
  }),
  component: DaysGonePage,
})

function DaysGonePage() {
  return (
    <div className="days-gone-app min-h-full">
      <DaysInCanadaApp />
    </div>
  )
}
