"use client";

import { formatDistanceToNow } from "date-fns";
import {
  BookOpen,
  ChevronDown,
  Clock,
  GitCommit,
  GitMerge,
  GitPullRequest,
  Loader2,
  MessageSquare,
  PlusCircle,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type EventType = "TIL" | "PR" | "COMMIT" | "ISSUE" | "REPO" | "MERGE" | "OTHER";

interface ActivityItem {
  id: string;
  type: EventType;
  title: string;
  date: string;
  link: string;
  repo: string | null;
}

const TYPE_CONFIG: Record<
  EventType,
  { icon: React.ElementType; color: string; label: string }
> = {
  TIL: { icon: BookOpen, color: "text-blue-500", label: "TIL" },
  PR: { icon: GitPullRequest, color: "text-emerald-500", label: "PR" },
  COMMIT: { icon: GitCommit, color: "text-orange-500", label: "Commit" },
  ISSUE: { icon: MessageSquare, color: "text-red-500", label: "Issue" },
  REPO: { icon: PlusCircle, color: "text-purple-500", label: "New Repo" },
  MERGE: { icon: GitMerge, color: "text-purple-500", label: "Merged" },
  OTHER: { icon: Clock, color: "text-muted-foreground", label: "Activity" },
};

export function PulseFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [activeFilters, setActiveFilters] = useState<EventType[]>([
    "TIL",
    "MERGE",
  ]);

  const fetchActivities = useCallback(
    async (pageNum: number, currentFilters: EventType[]) => {
      try {
        const typesQuery =
          currentFilters.length > 0 ? `&types=${currentFilters.join(",")}` : "";
        const res = await fetch(`/api/events?page=${pageNum}${typesQuery}`);
        const data = await res.json();

        // Update hasMore based on server response
        setHasMore(data.hasMore || false);

        if (pageNum === 1) {
          setActivities(data.events || []);
        } else {
          setActivities((prev) => [...prev, ...(data.events || [])]);
        }
      } catch (err) {
        console.error("Failed to fetch activities:", err);
        setHasMore(false);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [],
  );

  useEffect(() => {
    setLoading(true);
    setPage(1);
    fetchActivities(1, activeFilters);
  }, [activeFilters, fetchActivities]);

  const toggleFilter = (type: EventType) => {
    setActiveFilters((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const filteredActivities = activities;

  const loadMore = () => {
    setLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);
    fetchActivities(nextPage, activeFilters);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] border border-white/5 bg-card/30 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm">
      {/* Header & Filters */}
      <div className="p-6 border-b border-white/5 space-y-4 bg-white/2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <h2 className="text-sm font-mono font-bold uppercase tracking-[0.2em] text-foreground">
              RECENT_ACTIVITY
            </h2>
          </div>
          <Badge
            variant="outline"
            className="text-[9px] font-mono border-emerald-500/20 text-emerald-500 bg-emerald-500/5 px-2 py-0"
          >
            LIVE_SYNC
          </Badge>
        </div>

        <div className="flex flex-wrap gap-2">
          {(Object.keys(TYPE_CONFIG) as EventType[]).map((type) => {
            const isActive = activeFilters.includes(type);
            return (
              <button
                type="button"
                key={type}
                onClick={() => toggleFilter(type)}
                className={cn(
                  "px-3 py-1 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider transition-all border",
                  isActive
                    ? "bg-primary text-black border-primary shadow-[0_0_10px_rgba(16,241,149,0.2)]"
                    : "bg-white/5 text-muted-foreground border-white/5 hover:border-white/10",
                )}
              >
                {TYPE_CONFIG[type].label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Feed Area */}
      <ScrollArea className="flex-1 px-6 py-6 overflow-y-auto">
        <div className="relative border-l border-white/5 ml-3 space-y-8 pb-10">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
              <p className="font-mono text-[10px] text-muted-foreground uppercase">
                Initialising System Scan...
              </p>
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="pl-8 py-10">
              <p className="text-xs font-mono text-muted-foreground uppercase italic tracking-widest">
                [ NO_MATCHING_SIGNALS_FOUND ]
              </p>
            </div>
          ) : (
            filteredActivities.map((item) => {
              const config = TYPE_CONFIG[item.type] || TYPE_CONFIG.OTHER;
              const Icon = config.icon;

              return (
                <div key={item.id} className="relative pl-8 group">
                  {/* Timeline dot */}
                  <span
                    className={cn(
                      "absolute -left-1.25 top-1.5 h-2.5 w-2.5 rounded-full ring-4 ring-background transition-all group-hover:scale-125",
                      item.type === "TIL" ? "bg-blue-500" : "bg-primary",
                    )}
                  />

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "p-1.5 rounded-md bg-white/5 border border-white/5",
                          config.color,
                        )}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest leading-none">
                          {item.repo || "KNOWLEDGE_BASE"}
                        </span>
                        <span className="text-[9px] font-mono text-muted-foreground/40 mt-1">
                          {formatDistanceToNow(new Date(item.date), {
                            addSuffix: true,
                          }).toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <a
                      href={item.link}
                      target={item.type === "TIL" ? "_self" : "_blank"}
                      rel={
                        item.type === "TIL" ? undefined : "noopener noreferrer"
                      }
                      className="text-sm font-bold text-foreground/90 group-hover:text-primary transition-colors leading-snug max-w-md block"
                    >
                      {item.title}
                    </a>
                  </div>
                </div>
              );
            })
          )}

          {hasMore && !loading && (
            <div className="pl-8 pt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={loadMore}
                disabled={loadingMore}
                className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-primary hover:bg-transparent p-0 flex items-center gap-2 group"
              >
                {loadingMore ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <>
                    <ChevronDown className="w-3 h-3 group-hover:translate-y-0.5 transition-transform" />
                    [ TRACE_PREVIOUS_SIGNALS ]
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer Status */}
      <div className="px-6 py-3 bg-white/2 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
          <span className="text-[8px] font-mono text-muted-foreground/50 uppercase tracking-widest">
            SYS_UPTIME: 99.9%
          </span>
        </div>
        <span className="text-[8px] font-mono text-muted-foreground/30 uppercase tracking-widest">
          NODE_V1.0.4
        </span>
      </div>
    </div>
  );
}
