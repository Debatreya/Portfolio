import { formatDistanceToNow } from "date-fns";
import { Code2, ExternalLink, Github, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import projectsData from "@/data/projects.json";

export default function ProjectsPage() {
  // Extract unique tech stack tags from all projects
  const allTags = Array.from(new Set(projectsData.flatMap((p) => p.techStack)));

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b pb-8">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight">
          Project Gallery
        </h1>
        <p className="text-lg text-muted-foreground w-full max-w-2xl">
          A showcase of open source contributions, lab experiments, and
          full-stack projects synced directly from GitHub.
        </p>
      </div>

      {/* Tags Filter Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
        <Badge variant="default" className="whitespace-nowrap cursor-pointer">
          All Projects
        </Badge>
        {allTags.map((tag) => (
          <Badge
            key={tag}
            variant="outline"
            className="whitespace-nowrap cursor-pointer hover:bg-muted transition-colors"
          >
            {tag}
          </Badge>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projectsData.map((project) => (
          <Card
            key={project.id}
            className="flex flex-col group hover:-translate-y-1 transition-transform duration-300 border bg-card/50 hover:bg-card"
          >
            <CardHeader className="flex flex-col gap-2 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
                  <Code2 className="w-4 h-4" />
                  <span className="text-xs font-mono font-medium truncate max-w-[120px]">
                    {project.techStack[0]}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {project.links.github && (
                    <a
                      href={project.links.github}
                      target="_blank"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {project.links.demo && (
                    <a
                      href={project.links.demo}
                      target="_blank"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
              <CardTitle className="tracking-tight text-xl mt-2 group-hover:text-primary transition-colors">
                {project.name}
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
                {project.techStack.map((tech) => (
                  <Badge
                    key={tech}
                    variant="secondary"
                    className="text-[10px] font-mono px-1.5 py-0 bg-muted/30 pointer-events-none"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="pt-4 border-t flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 fill-muted-foreground/30 text-muted-foreground/50" />
                <span className="font-medium">{project.stats.stars}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500/50" />
                Updated{" "}
                {formatDistanceToNow(new Date(project.stats.lastCommit), {
                  addSuffix: true,
                })}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
