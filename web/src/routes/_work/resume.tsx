import { Link, createFileRoute } from "@tanstack/react-router"
import { Download } from "lucide-react"
import { PageTrail } from "@/components/PageTrail"
import { ResumeDocument } from "@/components/ResumeDocument"
import { Button } from "@/components/ui/button"
import { site } from "@/lib/content"
import { downloadResumePdf } from "@/lib/resume-pdf"

const chatLinkClass =
  "font-medium text-primary underline underline-offset-4 hover:opacity-80"

export const Route = createFileRoute("/_work/resume")({
  head: () => ({
    meta: [{ title: "Resume | Arshiya Sayyed" }],
  }),
  component: ResumePage,
})

export function ResumePage() {
  return (
    <main className="site-page flex-1 py-14">
      <PageTrail items={[{ label: "Home", to: "/" }]} />
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-[clamp(1.8rem,4vw,2.4rem)] font-semibold tracking-tight">
            Resume
          </h1>
          <p className="mt-3 max-w-lg text-muted-foreground">
            Interested?{" "}
            <a
              href={site.links.calendly}
              target="_blank"
              rel="noreferrer"
              className={chatLinkClass}
            >
              book a time
            </a>{" "}
            or{" "}
            <Link to="/about" hash="contact" className={chatLinkClass}>
              send a note
            </Link>
            .
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
