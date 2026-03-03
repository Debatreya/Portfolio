import { ArrowLeft, ArrowUpRight, Folder, Layers, Users } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectContent } from "@/components/ProjectContent";
import { getProjectDeepDive, getRemoteTILs } from "@/lib/content";
import { getProjects } from "@/lib/github";

export const revalidate = 43200; // Refresh data every 12 hours

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects
    .filter((p) => p.hasDeepDive)
    .map((p) => ({
      id: p.id,
    }));
}

export default async function ProjectDeepDive({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const project = await getProjectDeepDive(id);

  if (!project) {
    notFound();
  }

  // Fetch data for Knowledge Graph sidebar
  const allProjects = await getProjects();
  const allTILs = await getRemoteTILs();

  // Find related TILs - either explicitly linked or by tech stack overlap
  const relatedTILs = allTILs
    .filter((til) => {
      const isExplicitlyLinked = til.related_projects?.includes(id);
      const hasSharedTags = til.tags.some((tag) =>
        project.techStack?.some(
          (tech) => tech.toLowerCase() === tag.toLowerCase(),
        ),
      );
      return til.id !== id && (isExplicitlyLinked || hasSharedTags);
    })
    .slice(0, 3);

  // Find related projects - projects with shared tech stack
  const relatedProjects = allProjects
    .filter((p) => {
      if (p.id === id) return false;
      return p.techStack?.some((tech) => project.techStack?.includes(tech));
    })
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left Column: Project Content */}
        <article className="flex-1 min-w-0">
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors mb-12"
          >
            <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" />{" "}
            [ BACK_TO_GALLERY ]
          </Link>

          <ProjectContent project={project} />
        </article>

        {/* Right Column: Knowledge Graph Sidebar */}
        <aside className="w-full lg:w-[350px] shrink-0">
          <div className="sticky top-24 space-y-12">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-5 h-5 bg-primary/20 rounded flex items-center justify-center">
                <Layers className="w-3 h-3 text-primary" />
              </div>
              <h2 className="text-xs font-mono font-black uppercase tracking-[0.25em] text-foreground">
                Knowledge Graph
              </h2>
            </div>

            {/* Related TILs */}
            <div className="space-y-6">
              <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em] border-l-2 border-white/10 pl-3">
                LINK::RELATED_TIL
              </div>
              <div className="space-y-3">
                {relatedTILs.map((item) => (
                  <Link
                    key={item.id}
                    href={`/writing/til/${item.id}`}
                    className="group block p-4 bg-white/5 border border-white/5 hover:border-primary/30 transition-all cursor-pointer relative"
                  >
                    <h3 className="text-xs font-bold mb-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono text-muted-foreground uppercase">
                        ID: {item.id.slice(0, 8)}
                      </span>
                      <ArrowUpRight className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </Link>
                ))}
                {relatedTILs.length === 0 && (
                  <div className="text-[9px] font-mono text-muted-foreground italic">
                    NO_RELATED_NODES_FOUND
                  </div>
                )}
              </div>
            </div>

            {/* Related Projects */}
            <div className="space-y-6">
              <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em] border-l-2 border-white/10 pl-3">
                LINK::RELATED_PROJECT
              </div>
              <div className="space-y-3">
                {relatedProjects.map((item) => (
                  <Link
                    key={item.id}
                    href={`/projects/${item.id}`}
                    className="group block p-4 bg-white/5 border border-white/5 hover:border-primary/30 transition-all cursor-pointer"
                  >
                    <h3 className="text-xs font-bold mb-2 group-hover:text-primary transition-colors">
                      {item.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono text-muted-foreground uppercase">
                        ID: {item.id.slice(0, 10)}
                      </span>
                      <Folder className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </Link>
                ))}
                {relatedProjects.length === 0 && (
                  <div className="text-[9px] font-mono text-muted-foreground italic">
                    NO_LINKED_REPOS_FOUND
                  </div>
                )}
              </div>
            </div>

            <div className="h-px bg-white/5 w-full" />

            {/* Contributors */}
            <div className="space-y-6">
              <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em]">
                NODE_CONTRIBUTORS
              </div>
              <div className="flex items-center -space-x-1">
                {project.contributor_avatars &&
                project.contributor_avatars.length > 0 ? (
                  project.contributor_avatars.map((c: any) => {
                    const name = typeof c === "string" ? "Contributor" : c.name;
                    const avatar = typeof c === "string" ? c : c.avatar;
                    return (
                      <div
                        key={avatar}
                        className="w-8 h-8 rounded-full border-2 border-[#121415] bg-muted overflow-hidden flex items-center justify-center"
                        title={name}
                      >
                        <img
                          src={avatar}
                          alt={name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    );
                  })
                ) : (
                  <div className="w-8 h-8 rounded-full border-2 border-[#121415] bg-muted overflow-hidden flex items-center justify-center">
                    <Users className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
