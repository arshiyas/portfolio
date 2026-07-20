import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { writingPosts } from "@/lib/content"

export function WritingList() {
  return (
    <div className="flex flex-col gap-3">
      {writingPosts.map((post) => {
        const isEngineering = post.category === "Engineering"
        return (
          <Card
            key={post.slug}
            className="flex gap-4 border-playful-border py-0 shadow-none transition hover:border-playful-purple"
          >
            <div
              className={`w-1 shrink-0 rounded-full ${isEngineering ? "bg-playful-purple" : "bg-playful-coral"}`}
            />
            <CardHeader className="flex-1 py-5 pl-0">
              <CardTitle className="font-serif text-base">{post.title}</CardTitle>
              <CardDescription>
                {post.category} · {post.date} · {post.status}
              </CardDescription>
            </CardHeader>
          </Card>
        )
      })}
    </div>
  )
}
