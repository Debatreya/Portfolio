import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { Octokit } from "octokit";
import type { Post, ProjectManifest } from "@/types/portfolio";

import { getProjects } from "./github";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const GITHUB_USERNAME = process.env.NEXT_PUBLIC_GITHUB_USERNAME || "Debatreya";
const TIL_REPO_RAW = process.env.TIL_GARDEN_REPO || "Debatreya-TIL-garden";
const TIL_REPO = TIL_REPO_RAW.split("/").pop() || "Debatreya-TIL-garden";
const TIL_BRANCH = "master";

const CONTENT_DIR = path.join(process.cwd(), "src/content");

export function getPostsByType(type: "til" | "blog" | "experience"): Post[] {
  const directory = path.join(CONTENT_DIR, type);

  // Return empty array if directory doesn't exist yet
  if (!fs.existsSync(directory)) {
    return [];
  }

  const fileNames = fs.readdirSync(directory);

  const posts = fileNames
    .filter(
      (fileName) =>
        fileName.endsWith(".md") ||
        fileName.endsWith(".mdx") ||
        fileName.endsWith(".qmd"),
    )
    .map((fileName) => {
      const id = fileName.replace(/\.(mdx?|qmd)$/, "");
      const fullPath = path.join(directory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);

      return {
        id,
        title: data.title || id,
        date: data.date || new Date().toISOString(),
        category: data.category || "Uncategorized",
        tags: data.tags || [],
        excerpt: data.excerpt || `${content.slice(0, 150)}...`,
        content,
        type: type as "til" | "blog",
      };
    });

  // Sort posts by date descending
  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export function getPostById(
  type: "til" | "blog" | "experience",
  id: string,
): Post | null {
  try {
    const possibleExtensions = [".md", ".mdx", ".qmd"];
    let fullPath = "";
    for (const ext of possibleExtensions) {
      const p = path.join(CONTENT_DIR, type, `${id}${ext}`);
      if (fs.existsSync(p)) {
        fullPath = p;
        break;
      }
    }

    if (!fullPath) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      id,
      title: data.title || id,
      date: data.date || data.published || new Date().toISOString(),
      category: data.category || "Uncategorized",
      tags: data.tags || [],
      excerpt: data.excerpt || `${content.slice(0, 150)}...`,
      content,
      type: type as "til" | "blog",
      related_projects: data.related_projects || [],
      system_manifest: data.system_manifest || "",
      code_filename: data["code-filename"] || "",
    };
  } catch (error) {
    console.error(`Error reading post ${type}/${id}:`, error);
    return null;
  }
}

/**
 * Fetch remote TILs from the til-garden repository.
 */
export async function getRemoteTILs(): Promise<Post[]> {
  try {
    const { data: tree } = await octokit.rest.git.getTree({
      owner: GITHUB_USERNAME,
      repo: TIL_REPO,
      tree_sha: TIL_BRANCH,
      recursive: "true",
    });

    // Filter for .qmd or .md files specifically in the 'records/' directory if applicable
    const qmdFiles = tree.tree.filter(
      (node) =>
        (node.path?.endsWith(".qmd") || node.path?.endsWith(".md")) &&
        node.type === "blob",
    );

    const postPromises = qmdFiles.map(async (file) => {
      return getRemoteTILByPath(file.path || "");
    });

    const posts = (await Promise.all(postPromises)).filter(
      (p): p is Post => p !== null,
    );

    return posts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  } catch (error) {
    console.error("Error fetching remote TILs:", error);
    return [];
  }
}

export async function getRemoteTILByPath(
  filePath: string,
): Promise<Post | null> {
  try {
    const { data: fileData } = await octokit.rest.repos.getContent({
      owner: GITHUB_USERNAME,
      repo: TIL_REPO,
      path: filePath,
      ref: TIL_BRANCH,
    });

    if ("content" in fileData) {
      const contentRaw = Buffer.from(fileData.content, "base64").toString();
      const { data, content } = matter(contentRaw);

      const id =
        data.id ||
        filePath
          .split("/")
          .pop()
          ?.replace(/\.(qmd|md)$/, "") ||
        "";

      return {
        id,
        title: data.title || id,
        date: data.date
          ? new Date(data.date).toISOString()
          : new Date().toISOString(),
        category: data.category || "TIL",
        tags: (data.tags || []).map((t: string) => t.replace(/^#/, "")), // strip leading #
        excerpt: data.excerpt || `${content.slice(0, 150)}...`,
        content,
        type: "til",
        read_time: data.read_time || "5 min",
        related_projects: data.related_projects || [],
        related_tils: data.related_tils || [],
        system_manifest: data.system_manifest || "",
        code_filename: data["code-filename"] || "",
        contributor_avatars: data.contributor_avatars || [],
      };
    }
    return null;
  } catch (error) {
    console.error(`Error fetching remote TIL by path ${filePath}:`, error);
    return null;
  }
}

// Keep the old one just in case or update it to use the new logic
export async function getRemoteTILById(id: string): Promise<Post | null> {
  const allPosts = await getRemoteTILs();
  return allPosts.find((p) => p.id === id) || null;
}

export async function getProjectDeepDive(
  id: string,
): Promise<(ProjectManifest & { content: string }) | null> {
  // 1. Get the base manifest and stats from GitHub first (to ensure matching IDs)
  const allProjects = await getProjects();
  const baseProject = allProjects.find((p) => p.id === id);

  const directory = path.join(CONTENT_DIR, "projects");

  const possibleExtensions = [".md", ".qmd", ".mdx"];
  let fullPath = "";
  for (const ext of possibleExtensions) {
    const p = path.join(directory, `${id}${ext}`);
    if (fs.existsSync(p)) {
      fullPath = p;
      break;
    }
  }

  let localContent = "";
  let localData = {};

  if (fullPath) {
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);
    localContent = content;
    localData = data;
  }

  if (!baseProject && !localContent) {
    return null;
  }

  // Merge: GitHub Manifest (Source of truth for links/stats) + Local MDX Content
  return {
    name: id,
    tagline: "",
    description: "",
    techStack: [],
    links: { github: "" },
    featured: false,
    priority: 0,
    ...baseProject,
    ...localData,
    content: localContent,
    id,
  } as ProjectManifest & { content: string };
}
