
## 1. Project Vision

This project, **debatreyadas.dev** is a "Manifest-Driven Developer OS." It is a zero-maintenance, data-driven portfolio that syncs work from GitHub and local JSON/Markdown sources to present a professional identity, a lab for experiments, and an automated resume engine.

## 2. Tech Stack Constraints

* **Framework:** Next.js latest (App Router).
* **Language:** TypeScript (Strict Mode).
* **Styling:** Tailwind CSS + shadcn/ui components.
* **State/Data:** Server Components primarily; ISR (Incremental Static Regeneration) for data fetching.
* **PDF Engine:** `@react-pdf/renderer` for runtime PDF generation.
* **Icons:** Lucide React.

## 3. Data Architecture (The Three Pillars)

### A. The Resume Engine (`/src/data/resume.json`)

* **Role:** Single source of truth for work history, education, and "private" projects.
* **Feature:** This data feeds both the **Web UI Resume** and the **Downloadable PDF**.
* **Experience Deep-Dives:** If an entry has a `slug`, the UI links to a detailed Markdown case study in `/src/content/experience/{slug}.md`.

### B. The Project Sync (`/scripts/sync-projects.mjs`)

* **Source:** GitHub API.
* **Discovery:** Crawl repos with the topic `portfolio`.
* **Manifest:** Each repo MUST contain a `.debatreya` JSON file with metadata (title, tagline, techStack).
* **Output:** Generates `/src/data/projects.json` during build time.

#### Detailed Steps
###### Project Discovery Engine:

* **Mechanism**: Next.js Server-side fetching with ISR.
***Logic**: A getProjects() utility fetches all repositories via GitHub REST/GraphQL API filtered by the portfolio topic.
* **Manifest Extraction**: For each repo, it fetches the HEAD:.debatreya file and parses it into the ProjectManifest type.
* **Caching**: Use next: { revalidate: 86400 } (24 hours) to keep the data fresh without hitting API limits.

### C. The Knowledge Base (TILs/Blogs)

* **Source:** Dedicated external GitHub repo or local `/src/content/til/`.
* **Format:** Markdown/MDX with frontmatter.

## 4. UI/UX Specifications

* **Theme:** System-aware Dark/Light mode. Default to Dark.
* **Home Page Dashboard:**
* **Status:** Pulsating dot (Available/Busy) driven by `resume.json`.
* **Booking:** Cal.com embed for "Book a Coffee Chat."
* **Live Feed:** Aggregated list of recent GitHub PRs and latest TILs.


* **The Lab (`/src/app/lab/`):**
* Isolated directory where each folder is a standalone `.tsx` experiment.
* Must use a "Registry" pattern so the index page auto-updates.


* **Command Palette:** Global `Cmd + K` search using `kbar`.

## 5. Development Principles for Agents

1. **No Hardcoding:** All personal data must come from JSON or Markdown.
2. **Component Isolation:** Keep logic-heavy "Feature" components separate from "UI" components.
3. **Type Safety:** Always define Interfaces for data before building the UI.
4. **Mobile First:** All layouts must be responsive, collapsing columns into a clean vertical stack.