"use server";

import fs from "node:fs";
import path from "node:path";

export async function getImagesFromFolder(folder: string) {
  try {
    // folder is expected to be something like "me" or "/me"
    // Normalize folder path to prevent directory traversal
    const safeFolder = folder.replace(/^\/+/, "").replace(/\.\./g, "");
    const directoryPath = path.join(process.cwd(), "public", safeFolder);

    if (!fs.existsSync(directoryPath)) {
      console.warn(`Directory not found: ${directoryPath}`);
      return [];
    }

    const files = fs.readdirSync(directoryPath);
    // Filter out non-image files and map to the format expected by Next.js Image src
    return files
      .filter((file) => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .map((file) => `/${safeFolder}/${file}`);
  } catch (error) {
    console.error("Error reading images from folder:", error);
    return [];
  }
}
