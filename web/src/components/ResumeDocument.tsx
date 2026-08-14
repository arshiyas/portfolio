import type { ReactNode } from "react"
import { resume } from "@/lib/resume"

const linkClass = "text-claude-accent underline-offset-4 hover:underline"

function linkifyResumeText(text: string): ReactNode {
  const companyLinks = resume.experience
    .filter((role) => role.companyUrl)
    .map((role) => ({ label: role.company, url: role.companyUrl! }))

  const links = [...companyLinks, ...resume.productLinks].sort(
    (a, b) => b.label.length - a.label.length,
  )

  let nodes: ReactNode[] = [text]

  for (const { label, url } of links) {
    nodes = nodes.flatMap((node, nodeIndex) => {
      if (typeof node !== "string") return [node]

      const parts = node.split(label)
      if (parts.length === 1) return [node]

      return parts.flatMap((part, partIndex) => {
        const chunk: ReactNode[] = part ? [part] : []
        if (partIndex < parts.length - 1) {
          chunk.push(
            <a
              key={`${label}-${nodeIndex}-${partIndex}`}
              href={url}
              target="_blank"
              rel="noreferrer"
              className={linkClass}
            >
              {label}
            </a>,
          )
        }
        return chunk
      })
    })
  }

  return nodes
}

export function ResumeDocument() {
  return (
    <article className="rounded-xl border border-claude-border bg-claude-surface px-6 py-8 shadow-none sm:px-10 sm:py-10">
      <header className="border-b border-claude-border pb-6">
        <h2 className="font-serif text-[1.65rem] font-semibold tracking-tight text-claude-text">
          {resume.name}
        </h2>
        <p className="mt-1 text-sm font-medium text-claude-text">
          {resume.headline}
          <span className="font-normal text-claude-muted"> · {resume.location}</span>
        </p>
        <p className="mt-3 text-sm leading-relaxed text-claude-muted">
          <a href={`mailto:${resume.email}`} className={linkClass}>
            {resume.email}
          </a>
          <span className="mx-2 text-claude-border">|</span>
          <a href="tel:+16476732138" className={linkClass}>
            {resume.phone}
          </a>
          <span className="mx-2 text-claude-border">|</span>
          <a href={resume.linkedin} target="_blank" rel="noreferrer" className={linkClass}>
            linkedin.com/in/arshiyasayyed
          </a>
        </p>
      </header>

      <ResumeSection title="Summary">
        <p className="text-sm leading-relaxed text-claude-muted">
          {linkifyResumeText(resume.summary)}
        </p>
      </ResumeSection>

      <ResumeSection title="Skills">
        <ul className="space-y-2.5 text-sm leading-relaxed text-claude-muted">
          {resume.skills.map((skill) => (
            <SkillLine key={skill} skill={skill} />
          ))}
        </ul>
      </ResumeSection>

      <ResumeSection title="Experience">
        <div className="space-y-7">
          {resume.experience.map((role) => (
            <div key={`${role.company}-${role.period}`}>
              <p className="text-sm font-semibold text-claude-text">{role.title}</p>
              <p className="mt-0.5 text-sm text-claude-muted">
                {role.companyUrl ? (
                  <a href={role.companyUrl} target="_blank" rel="noreferrer" className={linkClass}>
                    {role.company}
                  </a>
                ) : (
                  role.company
                )}
                , {role.location}
                <span className="mx-2 text-claude-border">|</span>
                {role.period}
              </p>
              <ul className="mt-2.5 list-none space-y-1.5 pl-0 text-sm leading-relaxed text-claude-muted">
                {role.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-2">
                    <span className="shrink-0 text-claude-muted">-</span>
                    <span>{linkifyResumeText(bullet)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </ResumeSection>

      <ResumeSection title="Education">
        <ul className="space-y-2.5 text-sm text-claude-muted">
          {resume.education.map((item) => (
            <li key={`${item.degree}-${item.school}`}>
              <span className="font-semibold text-claude-text">{item.degree}</span>
              <span className="mx-2 text-claude-border">|</span>
              {item.school}
            </li>
          ))}
        </ul>
      </ResumeSection>
    </article>
  )
}

function SkillLine({ skill }: { skill: string }) {
  const colonIndex = skill.indexOf(":")
  if (colonIndex === -1) return <li>{skill}</li>

  const label = skill.slice(0, colonIndex + 1)
  const value = skill.slice(colonIndex + 1).trim()

  return (
    <li>
      <span className="font-semibold text-claude-text">{label}</span> {value}
    </li>
  )
}

function ResumeSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-8">
      <h3 className="border-b border-claude-border pb-2 font-mono text-xs font-semibold uppercase tracking-widest text-claude-text">
        {title}
      </h3>
      <div className="mt-4">{children}</div>
    </section>
  )
}
