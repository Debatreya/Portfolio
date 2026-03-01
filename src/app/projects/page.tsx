import { ProjectGrid } from "@/components/ProjectGrid";
import { getProjects } from "@/lib/github";

export const revalidate = 43200; // Refresh data every 12 hours

export default async function ProjectsPage() {
  const projectsData = await getProjects();

  // Extract unique tech stack tags from all projects
  const allTags = Array.from(
    new Set(projectsData.flatMap((p) => p.techStack || [])),
  ).sort();

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-white/5 pb-8">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
          PROJECT_GALLERY
        </h1>
        <p className="text-lg text-muted-foreground w-full max-w-2xl font-medium">
          A showcase of open source contributions, lab experiments, and
          full-stack systems synced directly from GitHub manifests.
        </p>
      </div>

      <ProjectGrid projects={projectsData} allTags={allTags} />
    </div>
  );
}
