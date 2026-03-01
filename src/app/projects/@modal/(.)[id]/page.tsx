import { getProjectDeepDive } from "@/lib/content";
import { ProjectContent } from "@/components/ProjectContent";
import { ProjectModalWrapper } from "@/components/ProjectModalWrapper";
import { notFound } from "next/navigation";

export default async function ProjectModalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  // Try to get deep dive first, then fall back to basic manifest if needed
  const project = await getProjectDeepDive(id);

  if (!project) {
    notFound();
  }

  return (
    <ProjectModalWrapper>
      <ProjectContent project={project} isModal />
    </ProjectModalWrapper>
  );
}
