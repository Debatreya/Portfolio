import { BookOpen, Clock, GitPullRequest } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data for initial rendering.
// Will be replaced by real GitHub API & Markdown fetcher later
const MOCK_ACTIVITY = [
  {
    id: "1",
    type: "PR" as const,
    repo: "facebook/react",
    title: "Fix hydration mismatch in concurrent mode",
    date: "2 hours ago",
    link: "#",
  },
  {
    id: "2",
    type: "TIL" as const,
    title: "Understanding React Server Components Architecture",
    date: "1 day ago",
    link: "/writing/til/rsc-architecture",
  },
  {
    id: "3",
    type: "PR" as const,
    repo: "vercel/next.js",
    title: "Add support for custom route handlers",
    date: "3 days ago",
    link: "#",
  },
  {
    id: "4",
    type: "TIL" as const,
    title: "How to setup a monorepo with Turborepo",
    date: "5 days ago",
    link: "/writing/til/turborepo-setup",
  },
];

export function PulseFeed() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 pb-2 border-b">
        <h2 className="text-xl font-bold tracking-tight">Recent Activity</h2>
        <Badge variant="secondary" className="text-xs">
          Live
        </Badge>
      </div>

      <div className="relative border-l ml-4 space-y-8 pb-4">
        {MOCK_ACTIVITY.map((item) => (
          <div key={item.id} className="relative pl-6">
            {/* Timeline dot */}
            <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-background" />

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {item.type === "PR" ? (
                  <GitPullRequest className="w-4 h-4 text-emerald-500" />
                ) : (
                  <BookOpen className="w-4 h-4 text-blue-500" />
                )}
                <span className="font-medium text-foreground">
                  {item.type === "PR" ? item.repo : "New TIL"}
                </span>
                <span className="flex items-center gap-1 text-xs">
                  <Clock className="w-3 h-3" />
                  {item.date}
                </span>
              </div>

              <a
                href={item.link}
                className="text-base font-medium hover:text-primary transition-colors hover:underline decoration-muted-foreground/30 underline-offset-4"
              >
                {item.title}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
