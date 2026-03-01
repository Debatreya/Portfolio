import { headers } from "next/headers";
import type { MetadataRoute } from "next";
import { getRemoteTILs } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const headersList = await headers();
  const host = headersList.get("host") || "debatreya.dev";
  const protocol = headersList.get("x-forwarded-proto") || "https";
  const baseUrl = `${protocol}://${host}`;

  // 1. Static Routes
  const staticRoutes = ["", "/projects", "/writing/til", "/resume", "/lab"].map(
    (route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.8,
    }),
  );

  // 2. Dynamic TIL Routes
  let tilRoutes: MetadataRoute.Sitemap = [];
  try {
    const posts = await getRemoteTILs();
    tilRoutes = posts.map((post) => ({
      url: `${baseUrl}/writing/til/${post.id}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch (error) {
    console.error("Sitemap generation error for TILs:", error);
  }

  return [...staticRoutes, ...tilRoutes];
}
