import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { experience } from "@/lib/content"

function CodeBlock({ code }: { code: string }) {
  const lines = code.split("\n")

  return (
    <div className="mt-4 overflow-x-auto rounded-xl border border-border bg-muted p-4 font-mono text-xs leading-relaxed text-[#4a4540]">
      {lines.map((line, index) => {
        const isMethod =
          line.startsWith("POST") || line.startsWith("GET") || line.startsWith("SQS")
        const isOk = line.startsWith("→")
        return (
          <div key={index}>
            {isMethod ? (
              <>
                <span className="text-claude-accent">{line.split(" ")[0]}</span>
                {line.slice(line.indexOf(" "))}
              </>
            ) : isOk ? (
              <span className="text-[#3d7a55]">{line}</span>
            ) : (
              line
            )}
          </div>
        )
      })}
    </div>
  )
}

export function ExperienceTimeline() {
  return (
    <div className="flex flex-col gap-4">
      {experience.map((role) => (
        <Card key={role.id} className="border-claude-border shadow-none">
          <CardHeader className="pb-2">
            <div className="mb-1 flex flex-wrap items-center gap-3">
              <span className="font-mono text-xs text-claude-muted">{role.period}</span>
              <Badge
                variant="secondary"
                className="rounded-full border-claude-accent-soft bg-claude-accent-soft text-claude-accent"
              >
                {role.company} · {role.location}
              </Badge>
            </div>
            <CardTitle className="font-serif text-xl">
              {role.title} · <span className="text-claude-accent">{role.company}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-1.5 pl-5 text-claude-muted">
              {role.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
            <CodeBlock code={role.code} />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
