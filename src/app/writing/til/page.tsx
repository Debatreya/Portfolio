import { format } from "date-fns";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getPostsByType } from "@/lib/content";

export default function TilIndex() {
  const posts = getPostsByType("til");

  return (
    <div className="max-w-3xl mx-auto py-12 px-6 flex flex-col gap-10">
      <header className="flex flex-col gap-4 border-b pb-8">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight font-serif">
          Today I Learned
        </h1>
        <p className="text-lg text-muted-foreground font-serif">
          A collection of concise technical notes, daily learnings, and quick
          snippets.
        </p>
      </header>

      <div className="flex flex-col gap-8">
        {posts.length === 0 ? (
          <p className="text-muted-foreground italic">
            No posts found yet. Check back soon!
          </p>
        ) : (
          posts.map((post) => (
            <Link
              key={post.id}
              href={`/writing/til/${post.id}`}
              className="group flex justify-between items-baseline gap-4 py-4 -mx-4 px-4 rounded-xl hover:bg-muted/50 transition-colors"
            >
              <div className="flex flex-col gap-1.5 flex-1">
                <h3 className="text-xl font-bold font-serif group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <div className="flex items-center gap-3">
                  <Badge
                    variant="secondary"
                    className="text-[10px] font-mono rounded-sm px-1.5 bg-background border shadow-sm"
                  >
                    {post.category}
                  </Badge>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {post.excerpt}
                  </p>
                </div>
              </div>
              <time className="text-sm text-muted-foreground font-mono shrink-0 whitespace-nowrap pt-1">
                {format(new Date(post.date), "MMM dd, yyyy")}
              </time>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
