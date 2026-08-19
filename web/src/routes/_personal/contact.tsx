import { createFileRoute } from "@tanstack/react-router"
import { CalendlyBookingCard } from "@/components/CalendlyBookingCard"
import { ContactForm } from "@/components/ContactForm"

export const Route = createFileRoute("/_personal/contact")({
  head: () => ({
    meta: [{ title: "Contact | Arshiya Sayyed" }],
  }),
  component: ContactPage,
})

export function ContactPage() {
  return (
    <main className="mx-auto w-full max-w-[920px] flex-1 px-6 py-14">
      <div className="max-w-xl">
        <h1 className="font-serif text-3xl font-semibold">Contact me</h1>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          Recruiting, collaboration, or a project chat. Send a note, or book a
          time.
        </p>
      </div>

      <div className="mt-10">
        <CalendlyBookingCard />
      </div>

      <div className="mt-8">
        <ContactForm />
      </div>
    </main>
  )
}
