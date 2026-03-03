import { formatDistanceToNow } from "date-fns";
import {
  ArrowUpRight,
  Clock,
  Code2,
  FileCode,
  Info,
  MoreHorizontal,
  Star,
} from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import "katex/dist/katex.min.css";

interface ProjectContentProps {
  project: {
    id?: string;
    name?: string;
    tagline?: string;
    description?: string;
    content?: string;
    techStack?: string[];
    code_filename?: string;
    system_manifest?: string;
    featured?: boolean;
    contributor_avatars?: (string | { name: string; avatar: string })[];
    stats?: {
      stars?: number;
      lastCommit?: string;
    };
    links?: {
      github?: string;
      demo?: string;
    };
  };
  isModal?: boolean;
}

export function ProjectContent({ project, isModal }: ProjectContentProps) {
  const mdxComponents = {
    h1: (props: React.ComponentPropsWithoutRef<"h1">) => (
      <h1
        className="mt-12 mb-6 text-3xl font-bold tracking-tight text-foreground"
        {...props}
      />
    ),
    h2: (props: React.ComponentPropsWithoutRef<"h2">) => (
      <h2
        className="mt-12 mb-6 text-2xl font-bold tracking-tight text-foreground flex items-center gap-2 group"
        {...props}
      >
        <span className="w-4 h-0.5 bg-primary/40 group-hover:bg-primary transition-colors" />
        {props.children}
      </h2>
    ),
    h3: (props: React.ComponentPropsWithoutRef<"h3">) => (
      <h3 className="mt-8 mb-4 text-xl font-bold text-foreground" {...props} />
    ),
    p: (props: React.ComponentPropsWithoutRef<"p">) => (
      <p
        className="mb-6 leading-relaxed text-muted-foreground/90 text-lg"
        {...props}
      />
    ),
    ul: (props: React.ComponentPropsWithoutRef<"ul">) => (
      <ul
        className="mb-8 ml-6 list-disc space-y-3 text-muted-foreground/90 text-lg"
        {...props}
      />
    ),
    ol: (props: React.ComponentPropsWithoutRef<"ol">) => (
      <ol
        className="mb-8 ml-6 list-decimal space-y-3 text-muted-foreground/90 text-lg"
        {...props}
      />
    ),
    li: (props: React.ComponentPropsWithoutRef<"li">) => (
      <li className="pl-2" {...props} />
    ),
    blockquote: (props: React.ComponentPropsWithoutRef<"blockquote">) => (
      <blockquote
        className="border-l-2 border-primary/50 bg-primary/5 px-6 py-4 my-8 rounded-r-md italic text-muted-foreground/90"
        {...props}
      />
    ),
    code: (props: React.ComponentPropsWithoutRef<"code">) => (
      <code
        className="bg-primary/10 text-primary px-1.5 py-0.5 rounded font-mono text-xs border border-primary/20"
        {...props}
      />
    ),
    pre: (props: React.ComponentPropsWithoutRef<"pre">) => {
      return (
        <div className="my-8 rounded-lg overflow-hidden border border-white/5 bg-[#0a0a0a]">
          <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
            <div className="flex items-center gap-2">
              <FileCode className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                {(props as { filename?: string }).filename ||
                  project.code_filename ||
                  "Code Block"}
              </span>
            </div>
            <MoreHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
          <pre
            className="p-6 overflow-x-auto font-mono text-sm text-[#e0e0e0] leading-relaxed"
            {...props}
          />
        </div>
      );
    },
    a: (props: React.ComponentPropsWithoutRef<"a">) => (
      <a
        className="text-primary hover:text-primary/80 underline decoration-primary/30 underline-offset-4 transition-colors font-medium text-lg"
        target={props.href?.startsWith("http") ? "_blank" : undefined}
        rel={props.href?.startsWith("http") ? "noopener noreferrer" : undefined}
        {...props}
      />
    ),
    strong: (props: React.ComponentPropsWithoutRef<"strong">) => (
      <strong className="font-bold text-foreground" {...props} />
    ),
    table: (props: React.ComponentPropsWithoutRef<"table">) => (
      <div className="my-8 overflow-x-auto border border-white/10 rounded-lg overflow-hidden">
        <table className="w-full border-collapse text-sm" {...props} />
      </div>
    ),
    thead: (props: React.ComponentPropsWithoutRef<"thead">) => (
      <thead className="bg-white/5 border-b border-white/10" {...props} />
    ),
    th: (props: React.ComponentPropsWithoutRef<"th">) => (
      <th
        className="px-6 py-4 text-left font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
        {...props}
      />
    ),
    td: (props: React.ComponentPropsWithoutRef<"td">) => (
      <td
        className="px-6 py-4 border-b border-white/5 text-muted-foreground/90 leading-relaxed"
        {...props}
      />
    ),
    tr: (props: React.ComponentPropsWithoutRef<"tr">) => (
      <tr className="hover:bg-white/[0.02] transition-colors" {...props} />
    ),
    img: (props: React.ComponentPropsWithoutRef<"img">) => {
      const { src: originalSrc, alt, ...rest } = props;
      const srcStr = typeof originalSrc === "string" ? originalSrc : "";
      const isRelative =
        srcStr && !srcStr.startsWith("http") && !srcStr.startsWith("/");
      const githubBase = `https://raw.githubusercontent.com/Debatreya/Debatreya-TIL-garden/master/`;
      const finalSrc = isRelative ? `${githubBase}${srcStr}` : srcStr;

      return (
        <span className="block my-8 rounded-lg overflow-hidden border border-white/10 bg-white/5">
          <img
            {...rest}
            src={finalSrc}
            className="w-full h-auto object-cover max-h-[500px]"
            alt={alt || "Project Image"}
          />
        </span>
      );
    },
  };

  const content = (
    <div className={isModal ? "p-0" : "max-w-4xl mx-auto py-4"}>
      <header className="mb-10">
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex items-center gap-2 text-primary bg-primary/10 px-3 py-1.5 rounded-sm text-[10px] font-mono font-bold uppercase tracking-[0.2em] leading-none border border-primary/20">
            <Code2 className="w-3.5 h-3.5" />
            {project.techStack?.[0] || "DEVELOPMENT"}
          </div>
          <div className="text-muted-foreground/30 font-mono text-xs">/</div>
          <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em] font-bold">
            {project.featured ? "FEATURED_SYSTEM" : "KERNEL_PROJECT"}
          </div>

          <div className="ml-auto flex -space-x-2">
            {project.contributor_avatars?.map((c) => {
              const name = typeof c === "string" ? "Contributor" : c.name;
              const avatar = typeof c === "string" ? c : c.avatar;
              return (
                <div
                  key={avatar}
                  className="w-6 h-6 rounded-full border border-background bg-muted overflow-hidden"
                  title={name}
                >
                  <img
                    src={avatar}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                </div>
              );
            })}
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 leading-[0.95] text-foreground">
          {project.name}
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground mb-10 font-medium leading-tight max-w-2xl">
          {project.tagline}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-y border-white/5 py-6">
          <div className="space-y-1">
            <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest">
              STARS::COUNT
            </div>
            <div className="flex items-center gap-2 font-mono text-sm">
              <Star className="w-3.5 h-3.5 fill-primary/20 text-primary" />
              {project.stats?.stars || 0}
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest">
              LAST_SYNC::EPOCH
            </div>
            <div className="flex items-center gap-2 font-mono text-sm truncate">
              <Clock className="w-3.5 h-3.5 text-primary" />
              {project.stats?.lastCommit
                ? formatDistanceToNow(new Date(project.stats.lastCommit), {
                    addSuffix: true,
                  }).toUpperCase()
                : "N/A"}
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest">
              REPO::ACCESS
            </div>
            <div className="flex items-center gap-3">
              {project.links?.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono hover:text-primary transition-colors flex items-center gap-1 uppercase"
                >
                  Github <ArrowUpRight className="w-2.5 h-2.5" />
                </a>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest">
              SITE::LIVE
            </div>
            <div className="flex items-center gap-3">
              {project.links?.demo ? (
                <a
                  href={project.links.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono hover:text-primary transition-colors flex items-center gap-1 uppercase"
                >
                  Demo <ArrowUpRight className="w-2.5 h-2.5" />
                </a>
              ) : (
                <span className="text-[10px] text-muted-foreground/30 font-mono">
                  OFFLINE
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="prose prose-invert max-w-none prose-h1:text-2xl prose-h1:mt-12 prose-h2:text-xl prose-h2:mt-10 prose-p:text-muted-foreground/90 prose-p:leading-relaxed prose-p:text-lg">
        {project.content ? (
          <MDXRemote
            source={project.content}
            components={mdxComponents}
            options={{
              mdxOptions: {
                format: "md",
                remarkPlugins: [remarkMath, remarkGfm],
                rehypePlugins: [rehypeKatex, rehypeHighlight],
              },
            }}
          />
        ) : (
          <div className="bg-white/5 border border-white/5 p-6 rounded-sm">
            <p className="font-mono text-xs uppercase tracking-widest text-primary mb-4">
              [ DESCRIPTION_LOG ]
            </p>
            <p>{project.description}</p>
          </div>
        )}
      </div>

      {project.system_manifest && (
        <div className="mt-12 p-6 bg-primary/5 border border-primary/20 rounded-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
            <Info className="w-12 h-12 text-primary" />
          </div>
          <div className="flex items-center gap-3 mb-3">
            <Info className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-mono font-bold text-primary uppercase tracking-[0.2em]">
              System Note
            </span>
          </div>
          <p className="text-[11px] leading-relaxed text-muted-foreground font-medium">
            Auto-sync enabled. This document is part of the{" "}
            <span className="text-primary/80 font-bold">
              {project.system_manifest}
            </span>{" "}
            manifest.
          </p>
        </div>
      )}

      <div className="mt-16 pt-10 border-t border-white/5">
        <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-muted-foreground/50 mb-6">
          DEPENDENCY_GRAPH / TECH_STACK
        </h4>
        <div className="flex flex-wrap gap-2">
          {project.techStack?.map((tech: string) => (
            <Badge
              key={tech}
              variant="outline"
              className="text-[10px] font-mono border-white/10 px-3 py-1 bg-white/[0.02] rounded-none"
            >
              {tech}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <ScrollArea className="max-h-[85vh] px-8 py-10">{content}</ScrollArea>
    );
  }

  return content;
}
