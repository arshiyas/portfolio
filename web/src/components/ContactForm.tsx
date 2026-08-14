import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { site } from "@/lib/content"

type FormStatus = "idle" | "submitting" | "success" | "error"

const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY

export function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle")
  const [errorMessage, setErrorMessage] = useState("")

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!accessKey) {
      setStatus("error")
      setErrorMessage(
        "Form is not configured yet. Email me directly for now.",
      )
      return
    }

    const form = event.currentTarget
    const formData = new FormData(form)
    setStatus("submitting")
    setErrorMessage("")

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      })

      const data = (await response.json()) as {
        success?: boolean
        message?: string
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message ?? "Something went wrong. Please try again.")
      }

      form.reset()
      setStatus("success")
    } catch (error) {
      setStatus("error")
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      )
    }
  }

  return (
    <div className="max-w-xl">
      {!accessKey ? (
        <p className="mb-6 rounded-xl border border-playful-border bg-[#fff5ef] px-4 py-3 text-sm leading-relaxed text-claude-muted">
          Form delivery is not wired up in this environment yet. You can still
          reach me at{" "}
          <a
            href={`mailto:${site.links.email}`}
            className="text-playful-purple underline-offset-4 hover:underline"
          >
            {site.links.email}
          </a>
          .
        </p>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-5">
        <input type="hidden" name="access_key" value={accessKey ?? ""} />
        <input type="hidden" name="subject" value="Portfolio contact form" />
        <input
          type="checkbox"
          name="botcheck"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden
        />

        <div className="space-y-2">
          <Label htmlFor="contact-name">Name</Label>
          <Input
            id="contact-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Your name"
            className="h-10 border-playful-border bg-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-email">Email</Label>
          <Input
            id="contact-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className="h-10 border-playful-border bg-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-message">Message</Label>
          <Textarea
            id="contact-message"
            name="message"
            required
            rows={6}
            placeholder="What would you like to talk about?"
            className="min-h-36 border-playful-border bg-white"
          />
        </div>

        <Button
          type="submit"
          disabled={status === "submitting"}
          className="rounded-full bg-playful-purple px-6 hover:bg-playful-purple/90"
        >
          {status === "submitting" ? "Sending..." : "Send message"}
        </Button>

        {status === "success" ? (
          <p className="text-sm text-[#3d7a55]" role="status">
            Message sent. I&apos;ll get back to you soon.
          </p>
        ) : null}

        {status === "error" ? (
          <p className="text-sm text-playful-coral" role="alert">
            {errorMessage}{" "}
            <a
              href={`mailto:${site.links.email}`}
              className="underline-offset-4 hover:underline"
            >
              Email me instead
            </a>
            .
          </p>
        ) : null}
      </form>
    </div>
  )
}
