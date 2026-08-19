import { createFileRoute } from "@tanstack/react-router"
import { Download } from "lucide-react"
import { ResumeDocument } from "@/components/ResumeDocument"
import { Button } from "@/components/ui/button"
import { downloadResumePdf } from "@/lib/resume-pdf"

export const Route = createFileRoute("/_work/resume")({
  head: () => ({
    meta: [{ title: "Resume | Arshiya Sayyed" }],
  }),
  component: ResumePage,
})

function ResumePage() {
  return (
    <main className="mx-auto w-full max-w-[920px] flex-1 px-6 py-14">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-[clamp(1.8rem,4vw,2.4rem)] font-semibold tracking-tight">
            Resume
          </h1>
          <p className="mt-3 max-w-lg text-muted-foreground">
            Software engineering across mobility, geospatial, and healthcare.
          </p>
        </div>
        <Button
          type="button"
          className="rounded-full px-5"
          onClick={() => {
            void downloadResumePdf()
          }}
        >
          <Download className="size-4" aria-hidden />
          Download PDF
        </Button>
      </div>
      <ResumeDocument />
    </main>
  )
}
