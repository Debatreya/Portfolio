/**
 * src/types/portfolio.ts
 * This file acts as the "Single Source of Truth" for all data structures
 * in debatreyadas.dev.
 */

export type AvailabilityStatus = "available" | "busy" | "away";

/**
 * 1. RESUME & PROFILE TYPES
 * Used for the Web UI, PDF Generation, and Home Dashboard.
 */

export interface Socials {
  github: string;
  linkedin: string;
  x?: string;
  email: string;
  calendar: string; // URL for Cal.com booking
}

export interface Profile {
  name: string;
  role: string;
  availability: AvailabilityStatus;
  location: string;
  bio: string;
  avatarUrl: string;
  socials: Socials;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location: string;
  duration: string; // e.g., "Jan 2024 - Present"
  description: string[];
  techStack: string[];
  /** * slug: Links to a Markdown deep-dive in /src/content/experience/{slug}.md
   * Required for major roles like your Microsoft Internship.
   */
  slug?: string;
}

export interface Education {
  institution: string;
  degree: string;
  duration: string;
  grade?: string;
  details?: string[];
}

export interface ResumeData {
  profile: Profile;
  work: WorkExperience[];
  education: Education[];
  skills: {
    languages: string[];
    frameworks: string[];
    tools: string[];
    databases: string[];
  };
}

/**
 * 2. PROJECT TYPES
 * Merged from local manual entries and GitHub .debatreya manifests.
 */

export interface ProjectManifest {
  id: string; // GitHub Repo ID or custom slug
  name: string;
  tagline: string;
  description: string;
  techStack: string[];
  links: {
    github: string;
    demo?: string;
  };
  stats?: {
    stars: number;
    lastCommit: string; // ISO String
  };
  featured: boolean;
  priority: number; // Higher number = shown first
  relatedTILIds?: string[];
  hasDeepDive?: boolean;
}

/**
 * 3. KNOWLEDGE BASE (TIL & BLOG)
 * Parsed from Markdown frontmatter.
 */

export interface Post {
  id: string;
  title: string;
  date: string;
  category: string;
  tags: string[];
  excerpt: string;
  content: string; // HTML or Markdown string
  type: "til" | "blog";
  read_time?: string;
  related_projects?: string[]; // Project IDs
  related_tils?: string[];
  system_manifest?: string; // For System Note
  code_filename?: string; // For code block header
  contributor_avatars?: string[];
}

/**
 * 4. THE LAB
 * Used for the interactive playground index.
 */

export interface LabExperiment {
  slug: string;
  title: string;
  description: string;
  category: "shader" | "algorithm" | "ui" | "experiment";
  date: string;
  githubUrl?: string;
}

/**
 * 5. GITHUB ACTIVITY (GraphQL)
 * Used for the "Live Pulse" feed on the Home Page.
 */

export interface GitHubActivity {
  id: string;
  type: "PR" | "ISSUE" | "COMMIT";
  repository: string;
  title: string;
  url: string;
  createdAt: string;
}
