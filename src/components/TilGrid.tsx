"use client";

import { useState } from "react";
import { format } from "date-fns";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Post {
  id: string;
  title: string;
  date: string;
  category: string;
  tags: string[];
}

interface TilGridProps {
  posts: Post[];
}

export function TilGrid({ posts }: TilGridProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All Logs");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  // Filter posts logic
  const filteredPosts = posts.filter((post) => {
    const categoryMatch =
      activeCategory === "All Logs" || post.category === activeCategory;
    const tagMatch = !activeTag || post.tags.includes(activeTag);
    return categoryMatch && tagMatch;
  });

  // Dynamically calculate categories from CURRENTLY filtered posts?
  // No, better to keep them static from the full list for indexing.
  const categoryCounts = posts.reduce(
    (acc, post) => {
      acc[post.category] = (acc[post.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const categories = [
    { name: "All Logs", count: posts.length },
    ...Object.entries(categoryCounts).map(([name, count]) => ({
      name,
      count,
    })),
  ];

  const uniqueTags = Array.from(
    new Set(posts.flatMap((post) => post.tags)),
  ).sort();

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row gap-0 min-h-[calc(100vh-100px)]">
      {/* Sidebar - CATEGORIES & FILTER_MANIFEST */}
      <aside className="w-full md:w-64 border-r border-white/5 pr-6 hidden md:flex flex-col gap-10 py-12">
        <div className="flex flex-col gap-4">
          <h2 className="text-[10px] font-bold font-mono text-muted-foreground uppercase tracking-widest pl-4">
            CATEGORIES
          </h2>
          <nav className="flex flex-col gap-1">
            {categories.map((cat) => (
              <div
                key={cat.name}
                onClick={() => {
                  setActiveCategory(cat.name);
                  setActiveTag(null); // Clear tag when switching category
                }}
                className={cn(
                  "flex items-center justify-between px-4 py-2 text-sm rounded-md cursor-pointer transition-all",
                  activeCategory === cat.name
                    ? "bg-primary text-black font-bold"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                )}
              >
                <span>{cat.name}</span>
                <span
                  className={cn(
                    "text-[10px] font-mono",
                    activeCategory === cat.name
                      ? "text-black/70"
                      : "text-muted-foreground/50",
                  )}
                >
                  {cat.count}
                </span>
              </div>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-[10px] font-bold font-mono text-muted-foreground uppercase tracking-widest pl-4">
            FILTER_MANIFEST
          </h2>
          <div className="flex flex-wrap gap-2 px-4">
            {uniqueTags.map((tag) => (
              <Badge
                key={tag}
                variant={activeTag === tag ? "default" : "outline"}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                className={cn(
                  "text-[10px] font-mono border-white/10 cursor-pointer rounded-sm px-2 py-1 uppercase transition-all",
                  activeTag === tag
                    ? "bg-primary text-black border-primary"
                    : "bg-transparent text-muted-foreground hover:border-primary/50 hover:text-primary",
                )}
              >
                #{tag}
              </Badge>
            ))}
            {activeTag && (
              <button
                onClick={() => setActiveTag(null)}
                className="text-[9px] font-mono text-primary hover:underline uppercase tracking-widest mt-2"
              >
                [ CLEAR_FILTER ]
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 py-12 px-6 md:px-12 max-w-5xl border-l border-white/2">
        <header className="flex flex-col gap-4 border-b border-white/5 pb-12 pt-0">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter font-sans text-foreground">
            TODAY_I_LEARNED
          </h1>
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            SYNCHRONIZED_KNOWLEDGE_BASE_V1.0
          </p>
        </header>

        <div className="flex flex-col gap-8 pt-8">
          {filteredPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-4 border border-dashed border-white/5 rounded-lg">
              <p className="text-muted-foreground italic font-mono text-sm uppercase tracking-widest">
                [ NO_MATCHING_RECORDS_FOUND ]
              </p>
              <p className="text-[10px] text-muted-foreground/50 max-w-xs uppercase leading-relaxed font-mono">
                The current filter configuration [CAT: {activeCategory}] [TAG:{" "}
                {activeTag || "NONE"}] yielded zero hits.
              </p>
              <button
                onClick={() => {
                  setActiveCategory("All Logs");
                  setActiveTag(null);
                }}
                className="mt-4 px-4 py-2 border border-primary/20 bg-primary/5 text-primary text-[10px] font-mono uppercase tracking-[0.2em] hover:bg-primary/10 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <Link
                key={post.id}
                href={`/writing/til/${post.id}`}
                className="group grid grid-cols-1 md:grid-cols-[120px_1fr_auto] items-center gap-6 py-6 border-b border-white/5 hover:bg-white/[0.02] transition-all -mx-4 px-4 rounded-lg relative overflow-hidden"
              >
                <div className="absolute left-0 top-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />

                <time className="text-sm text-muted-foreground/50 font-mono order-2 md:order-1 tabular-nums">
                  {format(new Date(post.date), "yyyy.MM.dd")}
                </time>

                <div className="order-1 md:order-2 flex flex-col gap-1">
                  <h3 className="text-lg font-bold text-foreground transition-colors leading-tight">
                    {post.title}
                  </h3>
                  <div className="flex gap-2">
                    {post.tags.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="text-[9px] font-mono text-muted-foreground/40 uppercase"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="order-3 flex justify-end">
                  <Badge
                    variant="outline"
                    className="text-[10px] font-mono rounded-none px-3 py-1 border-white/10 bg-white/5 text-muted-foreground group-hover:border-primary/50 group-hover:text-primary transition-all tracking-widest uppercase"
                  >
                    {post.category}
                  </Badge>
                </div>
              </Link>
            ))
          )}

          <div className="flex items-center justify-between mt-12 pt-6 border-t border-white/5">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest font-bold">
                SYSTEM_HIT_COUNT: {filteredPosts.length}
              </span>
              <span className="text-[10px] font-mono text-muted-foreground/30">
                |
              </span>
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                VER: 1.0.4.STABLE
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
