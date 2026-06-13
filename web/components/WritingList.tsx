import { writingPosts } from "@/lib/content";

export function WritingList() {
  return (
    <div className="flex flex-col gap-3">
      {writingPosts.map((post) => {
        const isEngineering = post.category === "Engineering";
        return (
          <article
            key={post.slug}
            className="flex gap-4 rounded-2xl border border-playful-border bg-playful-surface p-5 transition hover:border-playful-purple"
          >
            <div
              className={`w-1 shrink-0 rounded-full ${isEngineering ? "bg-playful-purple" : "bg-playful-coral"}`}
            />
            <div>
              <h2 className="font-serif text-base font-semibold">{post.title}</h2>
              <p className="mt-1 text-xs text-claude-muted">
                {post.category} · {post.date} · {post.status}
              </p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
