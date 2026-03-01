/**
 * scripts/sync-projects.mjs
 * 
 * Fetches GitHub repositories for the authenticated user that have the topic "portfolio".
 * For each repo, it attempts to fetch the HEAD:.debatreya file to construct the project manifest.
 * Outputs to src/data/projects.json.
 */

import { Octokit } from "octokit";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, "../src/data");

// Required environment variable for API rate limits and private repos (if needed)
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// You can configure your GitHub username here
const GITHUB_USERNAME = "Debatreya";

const octokit = new Octokit({
  auth: GITHUB_TOKEN,
});

async function fetchProjects() {
  console.log(`[sync-projects] Fetching repositories for ${GITHUB_USERNAME} with topic 'portfolio'...`);
  
  try {
    const { data: repos } = await octokit.rest.search.repos({
      q: `user:${GITHUB_USERNAME} topic:portfolio`,
      per_page: 100,
    });

    console.log(`[sync-projects] Found ${repos.items.length} matching repositories.`);
    
    const projects = [];

    for (const repo of repos.items) {
      console.log(`[sync-projects] Processing ${repo.name}...`);
      
      try {
        // Attempt to fetch the .debatreya manifest file
        const { data: fileData } = await octokit.rest.repos.getContent({
          owner: repo.owner.login,
          repo: repo.name,
          path: ".debatreya",
        });

        if (fileData.type === "file" && fileData.content) {
          const content = Buffer.from(fileData.content, "base64").toString("utf-8");
          const manifest = JSON.parse(content);

          projects.push({
            id: repo.name, // Use repo name as ID by default
            name: manifest.name || repo.name,
            tagline: manifest.tagline || repo.description || "",
            description: manifest.description || repo.description || "",
            techStack: manifest.techStack || [],
            links: {
              github: repo.html_url,
              demo: manifest.links?.demo || repo.homepage || "",
            },
            stats: {
              stars: repo.stargazers_count,
              lastCommit: repo.pushed_at || repo.updated_at,
            },
            featured: manifest.featured ?? false,
            priority: manifest.priority ?? 0,
            relatedTILIds: manifest.relatedTILIds || [],
          });
          
          console.log(`[sync-projects]   -> Successfully parsed manifest for ${repo.name}`);
        }
      } catch (err) {
        if (err.status === 404) {
          console.log(`[sync-projects]   -> No .debatreya manifest found in ${repo.name}. Skipping...`);
        } else {
          console.error(`[sync-projects]   -> Error fetching manifest for ${repo.name}:`, err.message);
        }
      }
    }

    // Sort projects by priority (highest first)
    projects.sort((a, b) => b.priority - a.priority);

    // Save to src/data/projects.json
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(
      path.join(DATA_DIR, "projects.json"),
      JSON.stringify(projects, null, 2),
      "utf-8"
    );

    console.log(`[sync-projects] Successfully saved ${projects.length} projects to src/data/projects.json`);
  } catch (err) {
    console.error(`[sync-projects] Fatal Error:`, err);
    process.exit(1);
  }
}

fetchProjects();
