"use client";

import { formatDistanceToNow } from "date-fns";
import { ArrowUpRight, Code2, Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ProjectManifest } from "@/types/portfolio";

interface ProjectGridProps {
  projects: ProjectManifest[];
  allTags: string[];
}

export function ProjectGrid({ projects, allTags }: ProjectGridProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const clearFilters = () => setSelectedTags([]);

  const filteredProjects =
    selectedTags.length === 0
      ? projects
      : projects.filter((p) =>
          selectedTags.some((tag) => p.techStack?.includes(tag)),
        );

  return (
    <div className="flex flex-col gap-10">
      {/* Tags Filter Strip */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-md pt-2 pb-6 border-b border-border flex items-center gap-3 overflow-x-auto scrollbar-hide">
        <Badge
          variant={selectedTags.length === 0 ? "default" : "outline"}
          className={cn(
            "whitespace-nowrap cursor-pointer transition-all px-4 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-widest",
            selectedTags.length === 0
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted font-bold",
          )}
          onClick={clearFilters}
        >
          All Projects
        </Badge>
        <div className="w-px h-4 bg-border mx-1" />
        {allTags.map((tag) => (
          <Badge
            key={tag}
            variant={selectedTags.includes(tag) ? "default" : "outline"}
            className={cn(
              "whitespace-nowrap cursor-pointer transition-all px-4 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-widest",
              selectedTags.includes(tag)
                ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(20,241,149,0.2)]"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
            onClick={() => toggleTag(tag)}
          >
            {tag}
          </Badge>
        ))}

        {selectedTags.length > 0 && (
          <button
            type="button"
            onClick={clearFilters}
            className="ml-4 text-[10px] font-mono text-primary hover:underline uppercase tracking-widest whitespace-nowrap"
          >
            [ Clear All ]
          </button>
        )}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            scroll={false}
            className="flex flex-col group hover:-translate-y-1 transition-transform duration-300 border border-border bg-card/50 hover:bg-card rounded-xl overflow-hidden shadow-lg"
          >
            <Card className="border-0 bg-transparent flex flex-col h-full rounded-none">
              <CardHeader className="flex flex-col gap-2 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
                    <Code2 className="w-4 h-4" />
                    <span className="text-xs font-mono font-medium truncate max-w-[120px]">
                      {project.techStack?.[0]}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {project.stats?.stars !== undefined && (
                      <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-muted-foreground">
                        <Star className="w-3.5 h-3.5 fill-muted-foreground/30" />
                        {project.stats.stars}
                      </div>
                    )}
                  </div>
                </div>
                <CardTitle className="tracking-tight text-xl mt-2 group-hover:text-primary transition-colors flex items-center justify-between">
                  {project.name}
                  {project.hasDeepDive && (
                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -translate-y-1" />
                  )}
                </CardTitle>
                <CardDescription className="font-medium text-foreground/80 line-clamp-1">
                  {project.tagline}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 pb-4">
                <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-4">
                  {project.techStack?.slice(0, 4).map((tech: string) => (
                    <Badge
                      key={tech}
                      variant="secondary"
                      className="text-[10px] font-mono px-1.5 py-0 bg-muted/30 pointer-events-none"
                    >
                      {tech}
                    </Badge>
                  ))}
                  {(project.techStack?.length || 0) > 4 && (
                    <span className="text-[10px] text-muted-foreground font-mono">
                      +{(project.techStack?.length || 0) - 4} MORE
                    </span>
                  )}
                </div>
              </CardContent>
              <CardFooter className="pt-4 border-t border-border flex items-center justify-between text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                <div className="flex items-center gap-1.5">
                  ID: {project.id.slice(0, 10)}
                </div>
                {project.stats?.lastCommit && (
                  <div className="flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    SYNCED{" "}
                    {formatDistanceToNow(new Date(project.stats.lastCommit), {
                      addSuffix: true,
                    })}
                  </div>
                )}
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="py-20 text-center flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center bg-muted">
            <Code2 className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            No projects found for the selected stack
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-4 px-4 py-2 border border-primary/20 bg-primary/5 text-primary text-[10px] font-mono uppercase tracking-[0.2em] hover:bg-primary/10 transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
}
