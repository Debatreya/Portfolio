import { formatDistanceToNow } from "date-fns";
import { ArrowUpRight, Clock, Code2, Star } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ProjectContentProps {
  project: {
    id?: string;
    name?: string;
    tagline?: string;
    description?: string;
    content?: string;
    techStack?: string[];
    featured?: boolean;
    contributor_avatars?: string[];
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
            {project.contributor_avatars?.map((avatar: string) => (
              <div
                key={avatar}
                className="w-6 h-6 rounded-full border border-background bg-muted overflow-hidden"
              >
                <img
                  src={avatar}
                  alt="Contributor Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
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
          <MDXRemote source={project.content} />
        ) : (
          <div className="bg-white/5 border border-white/5 p-6 rounded-sm">
            <p className="font-mono text-xs uppercase tracking-widest text-primary mb-4">
              [ DESCRIPTION_LOG ]
            </p>
            <p>{project.description}</p>
          </div>
        )}
      </div>

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
