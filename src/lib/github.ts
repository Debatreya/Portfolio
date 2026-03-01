import { Octokit } from "octokit";
import { ProjectManifest } from "@/types/portfolio";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const GITHUB_USERNAME = process.env.NEXT_PUBLIC_GITHUB_USERNAME || "Debatreya";

export async function getProjects(): Promise<ProjectManifest[]> {
  try {
    // 1. Search for repositories with the "portfolio" topic
    const { data: searchData } = await octokit.rest.search.repos({
      q: `user:${GITHUB_USERNAME} topic:portfolio`,
    });

    const projectPromises = searchData.items.map(async (repo): Promise<ProjectManifest | null> => {
      try {
        // 2. Fetch the .debatreya manifest file
        const { data: manifestContent } = await octokit.rest.repos.getContent({
          owner: GITHUB_USERNAME,
          repo: repo.name,
          path: ".debatreya",
        });

        if ("content" in manifestContent) {
          const content = Buffer.from(manifestContent.content, "base64").toString();
          const manifest = JSON.parse(content) as ProjectManifest;

          // 3. Live Data Enrichment
          return {
            ...manifest,
            id: manifest.id || repo.name, 
            links: {
              ...manifest.links,
              github: repo.html_url,
              demo: manifest.links?.demo || repo.homepage || undefined,
            },
            stats: {
              stars: repo.stargazers_count,
              lastCommit: repo.pushed_at || new Date().toISOString(),
            },
          };
        }
      } catch (error) {
        console.error(`Error fetching manifest for ${repo.name}:`, error);
        return null;
      }
      return null;
    });

    const projectsRaw = await Promise.all(projectPromises);
    const projects = projectsRaw.filter(
      (p): p is ProjectManifest => p !== null
    );

    // Sort by priority
    return projects.sort((a, b) => (b.priority || 0) - (a.priority || 0));
  } catch (error) {
    console.error("Error fetching projects from GitHub:", error);
    return [];
  }
}

/**
 * Fetches a commit count for a push event using the Compare API.
 * Falls back to 0 if the comparison fails (e.g., force push, deleted branch).
 */
async function getCommitCount(
  repoFullName: string,
  before: string,
  head: string
): Promise<number> {
  try {
    const [owner, repo] = repoFullName.split("/");
    const { data } = await octokit.rest.repos.compareCommitsWithBasehead({
      owner,
      repo,
      basehead: `${before}...${head}`,
    });
    return data.total_commits ?? data.commits?.length ?? 0;
  } catch {
    return 0;
  }
}

/**
 * Resolves a PR title using the Pulls API when the Events API payload
 * returns a truncated pull_request object (common with org repos).
 */
async function getPRTitle(
  repoFullName: string,
  prNumber: number
): Promise<string> {
  try {
    const [owner, repo] = repoFullName.split("/");
    const { data } = await octokit.rest.pulls.get({
      owner,
      repo,
      pull_number: prNumber,
    });
    return data.title;
  } catch {
    return `PR #${prNumber}`;
  }
}

export async function getGithubEvents(page = 1, per_page = 30) {
  try {
    const { data: events } = await octokit.rest.activity.listEventsForAuthenticatedUser({
      username: GITHUB_USERNAME,
      per_page,
      page,
    });

    const parsed = await Promise.all(
      events.map(async (event) => {
        let title = "";
        let link = `https://github.com/${event.repo.name}`;
        let type: "PR" | "COMMIT" | "ISSUE" | "REPO" | "MERGE" | "OTHER" =
          "OTHER";
        const payload = event.payload as any;
        const repoShort =
          event.repo.name.split("/")[1] || event.repo.name;

        switch (event.type) {
          // ── PushEvent ────────────────────────────────────────────
          // Events API payload: push_id, ref, head, before, repository_id
          // size / commits are NOT guaranteed by the Events API spec.
          case "PushEvent": {
            const branch =
              payload.ref?.replace("refs/heads/", "") || "unknown";

            // Try undocumented size field first, then commits array, then Compare API
            let commitCount: number | null =
              typeof payload.size === "number" ? payload.size : null;

            if (commitCount === null && Array.isArray(payload.commits)) {
              commitCount = payload.commits.length;
            }

            // If still null, use the Compare API for accurate count
            if (commitCount === null && payload.before && payload.head) {
              commitCount = await getCommitCount(
                event.repo.name,
                payload.before,
                payload.head
              );
            }

            commitCount = commitCount ?? 0;

            if (commitCount > 0) {
              title = `Pushed ${commitCount} ${commitCount === 1 ? "commit" : "commits"} to ${branch}`;
            } else {
              title = `Pushed to ${branch} in ${repoShort}`;
            }
            type = "COMMIT";

            // Best link: first commit SHA, then head SHA
            if (payload.commits?.[0]?.sha) {
              link = `https://github.com/${event.repo.name}/commit/${payload.commits[0].sha}`;
            } else if (payload.head) {
              link = `https://github.com/${event.repo.name}/commit/${payload.head}`;
            }
            break;
          }

          // ── PullRequestEvent ─────────────────────────────────────
          // Events API action can be: opened, closed, merged, reopened,
          // assigned, unassigned, labeled, unlabeled
          // (Webhook API never sends action:"merged"; it uses closed + merged:true)
          case "PullRequestEvent": {
            const pr = payload.pull_request;
            const action: string = payload.action || "";
            const prNumber: number | undefined = payload.number ?? pr?.number;

            // Resolve title: Events API may truncate the PR object for org repos
            let prTitle: string =
              pr?.title ||
              (prNumber ? await getPRTitle(event.repo.name, prNumber) : "a pull request");

            // Detect merge: Events API sends action:"merged" directly
            const isMerged =
              action === "merged" || (action === "closed" && pr?.merged === true);

            if (isMerged) {
              title = `Merged PR: ${prTitle}`;
              type = "MERGE";
            } else {
              const label =
                action.charAt(0).toUpperCase() + action.slice(1) || "Updated";
              title = `${label} PR: ${prTitle}`;
              type = "PR";
            }
            link = pr?.html_url || link;
            break;
          }

          // ── IssuesEvent ──────────────────────────────────────────
          case "IssuesEvent": {
            const issue = payload.issue;
            const actionLabel =
              (payload.action?.charAt(0).toUpperCase() ?? "") +
              (payload.action?.slice(1) ?? "Updated");
            title = `${actionLabel} issue: ${issue?.title || "Untitled Issue"}`;
            type = "ISSUE";
            link = issue?.html_url || link;
            break;
          }

          // ── CreateEvent ──────────────────────────────────────────
          case "CreateEvent": {
            if (payload.ref_type === "repository") {
              title = `Created new repository: ${repoShort}`;
              type = "REPO";
            } else {
              title = `Created ${payload.ref_type} ${payload.ref} in ${repoShort}`;
            }
            break;
          }

          // ── Other well-known types ───────────────────────────────
          case "WatchEvent":
            title = `Starred ${event.repo.name}`;
            break;
          case "ForkEvent":
            title = `Forked ${event.repo.name}`;
            break;
          case "DeleteEvent":
            title = `Deleted ${payload.ref_type} ${payload.ref} from ${repoShort}`;
            break;
          case "ReleaseEvent":
            title = `Released ${payload.release?.tag_name || "a version"} of ${repoShort}`;
            break;
          case "MemberEvent":
            title = `Added ${payload.member?.login || "a collaborator"} to ${repoShort}`;
            break;
          case "PullRequestReviewEvent":
            title = `Reviewed PR in ${repoShort}`;
            type = "PR";
            link = payload.pull_request?.html_url || link;
            break;
          case "PullRequestReviewCommentEvent":
            title = `Commented on PR in ${repoShort}`;
            type = "PR";
            link =
              payload.comment?.html_url ||
              payload.pull_request?.html_url ||
              link;
            break;
          case "IssueCommentEvent":
            title = `Commented on ${payload.issue?.pull_request ? "PR" : "issue"} in ${repoShort}`;
            type = payload.issue?.pull_request ? "PR" : "ISSUE";
            link = payload.comment?.html_url || link;
            break;
          case "GollumEvent":
            title = `Updated wiki in ${repoShort}`;
            break;

          // ── Catch-all ────────────────────────────────────────────
          default: {
            const eventName = (event.type || "Activity").replace("Event", "");
            title = `${eventName} in ${repoShort}`;
          }
        }

        return {
          id: event.id,
          type,
          repo: event.repo.name,
          title,
          date: event.created_at || new Date().toISOString(),
          link,
        };
      })
    );

    return parsed;
  } catch (error) {
    console.error("Error fetching GitHub events:", error);
    return [];
  }
}
