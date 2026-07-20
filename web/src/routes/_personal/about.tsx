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
      <div className="mb-8 flex flex-wrap items-center gap-6">
        <div
          className="h-[72px] w-[72px] rounded-full bg-gradient-to-br from-playful-purple to-playful-coral"
          aria-hidden
        />
        <div>
          <h1 className="font-serif text-3xl font-semibold">Hey, I&apos;m Arshiya</h1>
          <p className="text-claude-muted">Toronto · Penn State MS · Pune BE</p>
        </div>
      </div>

      <p className="max-w-xl text-[1.05rem] leading-relaxed">
        I&apos;m a backend engineer who loves shipping systems that actually get used, from
        hospital imaging pipelines to satellite data platforms to ride-sharing APIs used by
        millions.
      </p>
      <p className="mt-4 max-w-xl text-claude-muted">
        I care about clear architecture, measurable impact, and teams that move fast without
        breaking things. Always learning, always building.
      </p>

      <div className="my-6 flex flex-wrap gap-2">
        <Badge className="rounded-full bg-[#f3ecfb] text-playful-purple hover:bg-[#f3ecfb]">
          Healthcare
        </Badge>
        <Badge className="rounded-full bg-[#e8f5ee] text-[#3d7a55] hover:bg-[#e8f5ee]">
          Geospatial
        </Badge>
        <Badge className="rounded-full bg-[#fdeee8] text-playful-coral hover:bg-[#fdeee8]">
          Mobility
        </Badge>
        <Badge className="rounded-full bg-[#fdf6e8] text-[#a67c2a] hover:bg-[#fdf6e8]">
          Mentorship
        </Badge>
      </div>

      <Card className="mt-6 border-playful-border shadow-none">
        <CardHeader>
          <CardTitle className="font-serif text-lg">Beyond the resume</CardTitle>
          <CardDescription>
            This is where the personal side lives: what you&apos;re reading, what you&apos;re
            learning, what you care about outside of sprint planning. We&apos;ll fill this in
            together.
          </CardDescription>
        </CardHeader>
        <CardContent />
      </Card>
    </main>
  )
}
