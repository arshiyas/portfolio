import { createFileRoute } from "@tanstack/react-router"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const Route = createFileRoute("/_personal/about")({
  head: () => ({
    meta: [{ title: "About | Arshiya Sayyed" }],
  }),
  component: AboutPage,
})

function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-[920px] flex-1 px-6 py-14">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-semibold">Hey, I&apos;m Arshiya</h1>
        <p className="mt-2 text-muted-foreground">Toronto · Penn State MS</p>
      </div>

      <p className="max-w-xl text-[1.05rem] leading-relaxed">
        I&apos;m a software engineer who loves shipping systems that actually get used, from
        hospital imaging pipelines to satellite data platforms to ride-sharing APIs used by
        millions.
      </p>
      <p className="mt-4 max-w-xl text-muted-foreground">
        I care about clear architecture, measurable impact, and teams that move fast without
        breaking things. Always learning, always building.
      </p>

      <div className="my-6 flex flex-wrap gap-2">
        <Badge className="rounded-full bg-chart-3/15 text-chart-3 hover:bg-chart-3/15">
          Healthcare
        </Badge>
        <Badge className="rounded-full bg-chart-4/15 text-chart-4 hover:bg-chart-4/15">
          Geospatial
        </Badge>
        <Badge className="rounded-full bg-chart-5/15 text-chart-5 hover:bg-chart-5/15">
          Mobility
        </Badge>
        <Badge className="rounded-full bg-chart-1/15 text-chart-1 hover:bg-chart-1/15">
          Mentorship
        </Badge>
      </div>

      <Card className="mt-6 border-border shadow-none">
        <CardHeader>
          <CardTitle className="font-serif text-lg">Beyond the resume</CardTitle>
          <CardDescription>
            A lot of what I enjoy at work happens next to the code.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            I mentor engineers ramping onto unfamiliar projects, and I write and run interview
            questions for engineering hiring, including the rubrics behind them.
          </p>
          <p>
            I speak when I have something worth sharing. Most recently that was &ldquo;Expanding
            Lyft to Europe with Cursor and Claude&rdquo; at Toronto Tech Week 2026, on what
            actually changes when a team builds with coding agents.
          </p>
          <p>
            I build small tools for problems I personally have. Days Gone came out of my own
            citizenship application, and it stayed browser-only because I wasn&apos;t willing to
            upload immigration data to anyone&apos;s server, including mine.
          </p>
          <p>
            Away from a screen, I kayak and hike as much as the season allows, which in Ontario is a
            narrower window than I&apos;d like. The rest of the time I&apos;m at home with two cats,
            who treat my desk as theirs.
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
