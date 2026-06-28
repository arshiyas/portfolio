"use client";

import Link from "next/link";
import { useState } from "react";
import { projects, type ProjectType } from "@/lib/content";

type Filter = "all" | ProjectType;

export function ProjectGrid() {
  const [filter, setFilter] = useState<Filter>("all");
  const filtered = projects.filter((p) => filter === "all" || p.type === filter);

  return (
    <>
      <div className="mb-6 flex gap-2">
        {(["all", "work", "personal"] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            className={
              filter === value
                ? "rounded-full border border-claude-accent-soft bg-claude-accent-soft px-4 py-2 text-sm text-claude-accent"
                : "rounded-full border border-claude-border px-4 py-2 text-sm text-claude-muted transition hover:border-claude-accent-soft hover:bg-claude-accent-soft hover:text-claude-accent"
            }
          >
            {value === "all" ? "All" : value === "work" ? "Work" : "Personal"}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((project) => {
          const isPersonal = project.type === "personal";
          const href = project.caseStudy
            ? `/projects/${project.slug}`
            : project.toolUrl ?? "/projects";
          const className = isPersonal
            ? "group block rounded-[18px] border border-playful-border bg-[#fffdfb] p-5 transition hover:border-playful-purple"
            : "group block rounded-[18px] border border-claude-border bg-claude-surface p-5 transition hover:border-claude-accent";

          return (
            <Link key={project.slug} href={href} className={className}>
              <p
                className={
                  isPersonal
                    ? "text-xs font-semibold uppercase tracking-wider text-playful-purple"
                    : "text-xs font-semibold uppercase tracking-wider text-claude-accent"
                }
              >
                {project.category}
              </p>
              <h3
                className={
                  isPersonal
                    ? "mt-2 font-sans text-base font-semibold group-hover:text-playful-purple"
                    : "mt-2 font-serif text-base font-semibold group-hover:text-claude-accent"
                }
              >
                {project.title}
              </h3>
              <p className="mt-2 text-sm text-claude-muted">{project.description}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className={
                      isPersonal
                        ? "rounded-full bg-[#f3ecfb] px-2 py-0.5 text-xs text-playful-purple"
                        : "rounded-full bg-claude-accent-soft px-2 py-0.5 text-xs text-claude-accent"
                    }
                  >
                    {tag}
                  </span>
                ))}
              </div>
              {project.caseStudy ? (
                <p className="mt-4 text-xs font-medium text-claude-accent">Read case study →</p>
              ) : project.toolUrl ? (
                <p className="mt-4 text-xs font-medium text-claude-accent">Open tool →</p>
              ) : null}
            </Link>
          );
        })}
      </div>
    </>
  );
}
