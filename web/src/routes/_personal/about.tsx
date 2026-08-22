import { useEffect, useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { ContactForm } from "@/components/ContactForm"
import { PageTrail } from "@/components/PageTrail"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card"
import { site } from "@/lib/content"

const chatLinkClass =
  "font-medium text-primary underline underline-offset-4 hover:opacity-80"

export const Route = createFileRoute("/_personal/about")({
  head: () => ({
    meta: [{ title: "About | Arshiya Sayyed" }],
  }),
  component: AboutPage,
})

export function AboutPage() {
  const [noteOpen, setNoteOpen] = useState(false)

  useEffect(() => {
    if (window.location.hash === "#contact") {
      setNoteOpen(true)
    }
  }, [])

  return (
    <main className="mx-auto w-full max-w-[920px] flex-1 px-6 py-14">
      <PageTrail items={[{ label: "Home", to: "/" }]} />
      <div className="mb-8 max-w-xl">
        <h1 className="font-serif text-3xl font-semibold">
          Hey, I&apos;m Arshiya
        </h1>
        {noteOpen ? (
          <div id="contact" className="mt-6">
            <ContactForm />
          </div>
        ) : (
          <p className="mt-3 text-muted-foreground">
            Would like to chat?{" "}
            <a
              href={site.links.calendly}
              target="_blank"
              rel="noreferrer"
              className={chatLinkClass}
            >
              Book a time
            </a>{" "}
            or{" "}
            <a
              href="#contact"
              className={chatLinkClass}
              onClick={() => setNoteOpen(true)}
            >
              send me a note
            </a>
            .
          </p>
        )}
      </div>

      {noteOpen ? null : (
        <Card className="max-w-xl border-border shadow-none">
          <CardHeader>
            <h2 className="font-serif text-lg font-medium">
              Beyond the resume
            </h2>
            <CardDescription>
              A lot of what I enjoy at work happens next to the code.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
            <p>
              I mentor engineers ramping onto unfamiliar projects, and I write
              and run interview questions for engineering hiring, including the
              rubrics behind them.
            </p>
            <p>
              I speak when I have something worth sharing. Most recently that
              was &ldquo;Expanding Lyft to Europe with Cursor and Claude&rdquo;
              at Toronto Tech Week 2026, on what actually changes when a team
              builds with coding agents.
            </p>
            <p>
              I build small tools for problems I personally have. Days Gone came
              out of my own citizenship application, and it stayed browser-only
              because I wasn&apos;t willing to upload immigration data to
              anyone&apos;s server, including mine.
            </p>
            <p>
              Away from a screen, I kayak and hike as much as the season allows,
              which in Ontario is a narrower window than I&apos;d like. The rest
              of the time I&apos;m at home with two cats, who treat my desk as
              theirs.
            </p>
          </CardContent>
        </Card>
      )}
    </main>
  )
}
