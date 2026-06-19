import { TilGrid } from "@/components/TilGrid";
import { getRemoteTILs } from "@/lib/content";
import { constructMetadata } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = constructMetadata({
  title: "Today I Learned | Debatreya Das",
  description: "A collection of micro-learnings and technical notes.",
});

export const revalidate = 43200; // Refresh data every 12 hours

export default async function TilIndex() {
  const posts = await getRemoteTILs();

  return <TilGrid posts={posts} />;
}
