import { Github, Linkedin, Mail } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import resumeData from "@/data/resume.json";

export function Sidebar() {
  const { profile } = resumeData;

  return (
    <aside className="flex flex-col gap-3 p-3 rounded-xl border bg-card text-card-foreground shadow">
      {/* Profile Section */}
      <div className="flex flex-col items-center text-center gap-4">
        <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-muted">
          {/* Fallback image if avatarUrl is missing/broken */}
          <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-3xl font-bold">
            {profile.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
        </div>

        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight">{profile.name}</h1>
          <p className="text-primary font-mono text-xs uppercase tracking-widest">
            {profile.role.replace(" ", "_")}
          </p>
        </div>

        {/* Live Status */}
        <Badge
          variant="secondary"
          className="flex items-center gap-2 px-3 py-1 font-normal bg-green-500/10 text-green-600 hover:bg-green-500/20 dark:text-green-400"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
          </span>
          <span className="text-[10px] tracking-widest uppercase font-mono">
            {profile.availability === "available"
              ? "SYSTEM_READY"
              : "CURRENTLY_BUSY"}
          </span>
        </Badge>
      </div>

      {/* Bio & Details */}
      <div className="space-y-4 text-sm mt-2">
        <p className="text-muted-foreground leading-relaxed">{profile.bio}</p>

        <div className="flex flex-col gap-2 text-muted-foreground font-mono text-[10px] tracking-widest uppercase mt-6">
          <div className="flex items-center gap-3 border-l-2 border-primary/30 pl-3">
            <span className="text-primary">LOC:</span>
            <span>{profile.location}</span>
          </div>
          <div className="flex items-center gap-3 border-l-2 border-primary/30 pl-3">
            <span className="text-primary">SYS:</span>
            <span>
              {new Date().toLocaleTimeString("en-US", {
                timeZone: "Asia/Kolkata",
                hour12: false,
              })}{" "}
              (IST)
            </span>
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="flex gap-4 justify-center mt-2 pt-6 border-t">
        <Link
          href={profile.socials.github}
          target="_blank"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <Github className="w-5 h-5" />
          <span className="sr-only">GitHub</span>
        </Link>
        <Link
          href={profile.socials.linkedin}
          target="_blank"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <Linkedin className="w-5 h-5" />
          <span className="sr-only">LinkedIn</span>
        </Link>
        <Link
          href={`mailto:${profile.socials.email}`}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <Mail className="w-5 h-5" />
          <span className="sr-only">Email</span>
        </Link>
      </div>
    </aside>
  );
}
