import { TilGrid } from "@/components/TilGrid";
import { getRemoteTILs } from "@/lib/content";

export const revalidate = 43200; // Refresh data every 12 hours

export default async function TilIndex() {
  const posts = await getRemoteTILs();

  return <TilGrid posts={posts} />;
}
