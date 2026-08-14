import { createFileRoute } from "@tanstack/react-router"
import { ContactForm } from "@/components/ContactForm"

export const Route = createFileRoute("/_personal/contact")({
  head: () => ({
    meta: [{ title: "Contact | Arshiya Sayyed" }],
  }),
  component: ContactPage,
})

function ContactPage() {
  return (
    <main className="mx-auto w-full max-w-[920px] flex-1 px-6 py-14">
      <div className="max-w-xl">
        <h1 className="font-serif text-3xl font-semibold">Contact me</h1>
        <p className="mt-3 leading-relaxed text-claude-muted">
          Recruiting, collaboration, or just want to talk through a project —
          send a note and I&apos;ll reply by email.
        </p>
      </div>

      <div className="mt-10">
        <ContactForm />
      </div>
    </main>
  )
}
