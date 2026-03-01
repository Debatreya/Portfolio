import fs from "fs";
import matter from "gray-matter";
import path from "path";
import type { Post } from "@/types/portfolio";

const CONTENT_DIR = path.join(process.cwd(), "src/content");

export function getPostsByType(type: "til" | "blog" | "experience"): Post[] {
  const directory = path.join(CONTENT_DIR, type);

  // Return empty array if directory doesn't exist yet
  if (!fs.existsSync(directory)) {
    return [];
  }

  const fileNames = fs.readdirSync(directory);

  const posts = fileNames
    .filter((fileName) => fileName.endsWith(".md") || fileName.endsWith(".mdx"))
    .map((fileName) => {
      const id = fileName.replace(/\.mdx?$/, "");
      const fullPath = path.join(directory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);

      return {
        id,
        title: data.title || id,
        date: data.date || new Date().toISOString(),
        category: data.category || "Uncategorized",
        tags: data.tags || [],
        excerpt: data.excerpt || content.slice(0, 150) + "...",
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
    const mdPath = path.join(CONTENT_DIR, type, `${id}.md`);
    const mdxPath = path.join(CONTENT_DIR, type, `${id}.mdx`);

    let fullPath = mdPath;
    if (!fs.existsSync(fullPath)) {
      fullPath = mdxPath;
      if (!fs.existsSync(fullPath)) {
        return null; // Return null if neither .md nor .mdx exists
      }
    }

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      id,
      title: data.title || id,
      date: data.date || new Date().toISOString(),
      category: data.category || "Uncategorized",
      tags: data.tags || [],
      excerpt: data.excerpt || content.slice(0, 150) + "...",
      content,
      type: type as "til" | "blog",
    };
  } catch (error) {
    console.error(`Error reading post ${type}/${id}:`, error);
    return null;
  }
}
