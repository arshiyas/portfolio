import { createFileRoute } from "@tanstack/react-router"
import { Badge } from "@/components/ui/badge"
import { WritingList } from "@/components/WritingList"

export const Route = createFileRoute("/_personal/writing")({
  head: () => ({
    meta: [{ title: "Writing | Arshiya Sayyed" }],
  }),
  component: WritingPage,
})

function WritingPage() {
  return (
    <main className="mx-auto w-full max-w-[920px] flex-1 px-6 py-14">
      <p className="mb-2 font-mono text-xs uppercase tracking-widest text-playful-purple">
        Essays &amp; notes
      </p>
      <h1 className="font-serif text-[clamp(1.8rem,4vw,2.4rem)] font-semibold tracking-tight">
        Writing
      </h1>
      <p className="mt-3 mb-8 max-w-lg text-claude-muted">
        Engineering deep-dives and career reflections. Coming soon, layout ready.
      </p>

      <div className="mb-8 flex gap-2">
        <Badge className="rounded-full bg-[#f3ecfb] text-playful-purple hover:bg-[#f3ecfb]">
          Engineering
        </Badge>
        <Badge className="rounded-full bg-[#fdeee8] text-playful-coral hover:bg-[#fdeee8]">
          Career
        </Badge>
      </div>

      <WritingList />
    </main>
  )
}
