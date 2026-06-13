import { experience } from "@/lib/content";

function CodeBlock({ code }: { code: string }) {
  const lines = code.split("\n");

  return (
    <div className="mt-4 overflow-x-auto rounded-xl border border-claude-border bg-[#f3f0ea] p-4 font-mono text-xs leading-relaxed text-[#4a4540]">
      {lines.map((line, index) => {
        const isMethod = line.startsWith("POST") || line.startsWith("GET") || line.startsWith("SQS");
        const isOk = line.startsWith("→");
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
        );
      })}
    </div>
  );
}

export function ExperienceTimeline() {
  return (
    <div className="flex flex-col gap-4">
      {experience.map((role) => (
        <article
          key={role.id}
          className="rounded-[18px] border border-claude-border bg-claude-surface p-6"
        >
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <span className="font-mono text-xs text-claude-muted">{role.period}</span>
            <span className="rounded-full border border-claude-accent-soft bg-claude-accent-soft px-3 py-1 text-xs text-claude-accent">
              {role.company} · {role.location}
            </span>
          </div>
          <h2 className="font-serif text-xl font-semibold">
            {role.title} · <span className="text-claude-accent">{role.company}</span>
          </h2>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-claude-muted">
            {role.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
          <CodeBlock code={role.code} />
        </article>
      ))}
    </div>
  );
}
