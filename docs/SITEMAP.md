Based on our architectural planning and your finalized data structure, here is the comprehensive sitemap for **debatreyadas.dev**. This map is designed to guide your AI agent through the routing and page-level requirements.

---

### 🌐 The `debatreyadas.dev` Sitemap

#### 1. **Home (`/`)** — The "Dashboard"

* 
**Purpose:** Central hub for your digital identity.


* **Key Sections:**
* 
**Identity Sidebar:** Name, Bio, Live Availability Status (Green/Grey dot).


* 
**The Pulse (Feed):** Integrated timeline of recent GitHub PRs, commits, and latest TIL posts.


* 
**Action Center:** "Download PDF" and "Book Coffee Chat" (Cal.com).


* 
**Global Navigation:** Access to all major sub-sections.





#### 2. **Resume (`/resume`)** — The "Data Engine"

* 
**Purpose:** Fully responsive web-representation of your `resume.json`.


* **Key Sections:**
* 
**Work Experience:** Chronological timeline with "Deep-Dive" buttons for roles with a `slug` (e.g., Microsoft).


* 
**Education:** Detailed academic history (NIT Kurukshetra, 9.57 CGPA).


* 
**Skills Matrix:** Categorized tags for languages, frameworks, and tools.


* 
**Dynamic PDF:** Trigger for the `@react-pdf/renderer` download route (`/api/resume`).





#### 3. **Projects (`/projects`)** — The "Manifest Gallery"

* 
**Purpose:** Showcasing GitHub and manual projects.


* **Sub-routes:**
* 
**Index (`/projects`):** Filterable grid of project cards synced via `.debatreya` manifests.


* 
**Project Detail (`/projects/[id]`):** (Optional) Dedicated page for complex projects or those requiring external case studies.





#### 4. **Writing (`/writing`)** — The "Knowledge Base"

* 
**Purpose:** Your digital garden for long-form and quick-bite learning.


* **Categories:**
* 
**TIL (`/writing/til`):** Quick technical snippets and lessons learned.


* 
**Blog (`/writing/blog`):** Deep-dives and thought pieces.


* 
**Individual Post (`/writing/[type]/[slug]`):** Minimalist markdown-rendered reading environment.





#### 5. **The Lab (`/lab`)** — The "Experiment Gallery"

* 
**Purpose:** Isolated playground for specialized technical proof.


* **Structure:**
* 
**Explorer (`/lab`):** File-tree style navigation of all experiments.


* 
**Experiment View (`/lab/[slug]`):** Standalone full-page interactive React components (Shaders, PRAM visualizations, etc.).





#### 6. **Case Studies (`/experience/[slug]`)** — The "Deep Dives"

* 
**Purpose:** Detailed storytelling for high-impact roles (e.g., Microsoft, Flywheel, Samagra).


* 
**Content:** Fetched from `/src/content/experience/{slug}.md`.



---

### 🛠️ Developer & API Routes (Background)

These aren't visible in the UI but are critical for the agent to build:

* 
**`/api/resume`:** Generates and streams the PDF file.


* 
**GET `/api/revalidate`:** A secure route you can hit (or set as a GitHub Webhook) to tell Vercel: "Hey, I just added a new project, please rebuild the /projects and / pages right now."