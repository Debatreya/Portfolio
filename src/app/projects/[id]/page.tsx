import { getProjectDeepDive } from "@/lib/content";
import { getProjects } from "@/lib/github";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProjectContent } from "@/components/ProjectContent";

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

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Gallery
      </Link>

      <ProjectContent project={project} />
    </div>
  );
}
