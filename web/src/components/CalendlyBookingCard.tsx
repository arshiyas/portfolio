import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card"
import { site } from "@/lib/content"

export function CalendlyBookingCard() {
  return (
    <Card className="max-w-xl border-border shadow-none">
      <CardHeader>
        <h2 className="font-serif text-lg leading-snug font-medium">
          Prefer to talk live?
        </h2>
        <CardDescription>Book a chat on my calendar.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          asChild
          variant="outline"
          className="rounded-full border-primary bg-card px-6 text-primary hover:bg-accent"
        >
          <a href={site.links.calendly} target="_blank" rel="noreferrer">
            Book a time ↗
          </a>
        </Button>
      </CardContent>
    </Card>
  )
}
