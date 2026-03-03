"use client";

import { format } from "date-fns";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Filter posts logic
  const filteredPosts = posts.filter((post) => {
    const categoryMatch =
      activeCategory === "All Logs" || post.category === activeCategory;
    const tagMatch =
      selectedTags.length === 0 ||
      selectedTags.some((tag) => post.tags.includes(tag));
    return categoryMatch && tagMatch;
  });

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const clearTags = () => setSelectedTags([]);

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

  const maxVisibleTags = 8;
  const selectedVisibleTags = uniqueTags.filter((tag) =>
    selectedTags.includes(tag),
  );
  const remainingTags = uniqueTags.filter((tag) => !selectedTags.includes(tag));
  const visibleTags = [...selectedVisibleTags, ...remainingTags].slice(
    0,
    maxVisibleTags,
  );
  const showSeeMoreTags = uniqueTags.length > maxVisibleTags;

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row gap-0">
      {/* Sidebar - CATEGORIES & FILTER_MANIFEST */}
      <aside className="w-full md:w-64 border-r border-border pr-6 hidden md:flex flex-col gap-10 py-12 sticky top-0 h-fit self-start">
        <div className="flex flex-col gap-4">
          <h2 className="text-[10px] font-bold font-mono text-muted-foreground uppercase tracking-widest pl-4">
            CATEGORIES
          </h2>
          <nav className="flex flex-col gap-1">
            {categories.map((cat) => (
              <button
                type="button"
                key={cat.name}
                onClick={() => {
                  setActiveCategory(cat.name);
                  // Optional: clear tags when switching category?
                  // Usually better to keep them for cross-category search.
                  // But user indicated "All Projects" mutually exclusive.
                  // Here categories are a bit different. I'll keep them as is unless asked.
                }}
                className={cn(
                  "flex items-center justify-between px-4 py-2 text-sm rounded-md cursor-pointer transition-all border-none outline-none w-full",
                  activeCategory === cat.name
                    ? "bg-primary text-primary-foreground font-bold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <span>{cat.name}</span>
                <span
                  className={cn(
                    "text-[10px] font-mono",
                    activeCategory === cat.name
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground/50",
                  )}
                >
                  {cat.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-[10px] font-bold font-mono text-muted-foreground uppercase tracking-widest pl-4">
            FILTER_MANIFEST
          </h2>
          <div className="flex flex-wrap gap-2 px-4">
            {uniqueTags.map((tag) => (
              <button
                type="button"
                key={tag}
                onClick={() => toggleTag(tag)}
                className="border-none p-0 bg-transparent outline-none"
              >
                <Badge
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className={cn(
                    "text-[10px] font-mono border-border cursor-pointer rounded-sm px-2 py-1 uppercase transition-all",
                    selectedTags.includes(tag)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-transparent text-muted-foreground hover:border-primary/50 hover:text-primary",
                  )}
                >
                  #{tag}
                </Badge>
              </button>
            ))}
            {selectedTags.length > 0 && (
              <button
                type="button"
                onClick={clearTags}
                className="text-[9px] font-mono text-primary hover:underline uppercase tracking-widest mt-2"
              >
                [ CLEAR_FILTER ]
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area - already inside scrolling main layout */}
      <div className="flex-1 py-12 px-6 md:px-12 max-w-5xl border-l border-border/50">
        <header className="flex flex-col gap-4 border-b border-border pb-12 pt-0">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter font-sans text-foreground">
            TODAY_I_LEARNED
          </h1>
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            SYNCHRONIZED_KNOWLEDGE_BASE_V1.0
          </p>
        </header>

        {/* Mobile Filter Section - Marks area from user request */}
        <div className="md:hidden sticky top-0 z-30 bg-background/95 backdrop-blur-md -mx-6 px-6 py-4 border-b border-border flex flex-col gap-4">
          {/* Mobile Categories - Horizontal Scroll */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                type="button"
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={cn(
                  "whitespace-nowrap px-3 py-1 text-[10px] font-mono uppercase tracking-widest rounded-full border transition-all shrink-0",
                  activeCategory === cat.name
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:bg-muted",
                )}
              >
                {cat.name} ({cat.count})
              </button>
            ))}
          </div>

          {/* Mobile Tags - Wrapping with See More */}
          <div className="flex flex-wrap items-center gap-2">
            {visibleTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className={cn(
                  "text-[9px] font-mono border-border cursor-pointer rounded-sm px-2 py-0.5 uppercase transition-all",
                  selectedTags.includes(tag)
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-transparent text-muted-foreground hover:border-primary/50 hover:text-primary",
                )}
                onClick={() => toggleTag(tag)}
              >
                #{tag}
              </Badge>
            ))}

            {showSeeMoreTags && (
              <Dialog>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="text-[9px] font-mono text-primary hover:underline uppercase tracking-widest"
                  >
                    + SEE_ALL
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="font-mono uppercase tracking-[0.2em] text-sm">
                      FILTER_MANIFEST_FULL
                    </DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
                    {uniqueTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={
                          selectedTags.includes(tag) ? "default" : "outline"
                        }
                        className={cn(
                          "whitespace-nowrap cursor-pointer transition-all px-3 py-1.5 rounded-md font-mono text-[9px] uppercase tracking-widest justify-center",
                          selectedTags.includes(tag)
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-muted",
                        )}
                        onClick={() => toggleTag(tag)}
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            )}

            {selectedTags.length > 0 && (
              <button
                type="button"
                onClick={clearTags}
                className="ml-auto text-[9px] font-mono text-primary hover:underline uppercase tracking-widest"
              >
                [ CLEAR ]
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-8 pt-8">
          {filteredPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-4 border border-dashed border-border rounded-lg">
              <p className="text-muted-foreground italic font-mono text-sm uppercase tracking-widest">
                [ NO_MATCHING_RECORDS_FOUND ]
              </p>
              <p className="text-[10px] text-muted-foreground/50 max-w-xs uppercase leading-relaxed font-mono">
                The current filter configuration [CAT: {activeCategory}] [TAGS:{" "}
                {selectedTags.length > 0 ? selectedTags.join(", ") : "NONE"}]
                yielded zero hits.
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveCategory("All Logs");
                  clearTags();
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
                className="group grid grid-cols-1 md:grid-cols-[120px_1fr_auto] items-center gap-6 py-6 border-b border-border hover:bg-muted/30 transition-all -mx-4 px-4 rounded-lg relative overflow-hidden"
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
                    className="text-[10px] font-mono rounded-none px-3 py-1 border-border bg-muted/50 text-muted-foreground group-hover:border-primary/50 group-hover:text-primary transition-all tracking-widest uppercase"
                  >
                    {post.category}
                  </Badge>
                </div>
              </Link>
            ))
          )}

          <div className="flex items-center justify-between mt-12 pt-6 border-t border-border">
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
