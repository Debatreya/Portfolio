import { TilGrid } from "@/components/TilGrid";
import { getRemoteTILs } from "@/lib/content";

export const revalidate = 86400; // Refresh data daily

export default async function TilIndex() {
  const posts = await getRemoteTILs();

  return <TilGrid posts={posts} />;
}
