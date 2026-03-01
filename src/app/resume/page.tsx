import { Download, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import resumeData from "@/data/resume.json";

export default function ResumePage() {
  const { profile, work, education, skills } = resumeData;

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 flex flex-col gap-16 relative">
      {/* Floating Download Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <Button
          size="lg"
          className="shadow-2xl rounded-full gap-2 px-6 hover:scale-105 transition-transform"
          asChild
        >
          <a href="/api/resume" target="_blank" rel="noopener">
            <Download className="w-4 h-4" />
            Download PDF
          </a>
        </Button>
      </div>

      {/* Header Section */}
      <header className="flex flex-col gap-4 border-b pb-8">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight">
          {profile.name}
        </h1>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground">
          <span className="font-medium text-foreground">{profile.role}</span>
          <span>{profile.location}</span>
          <a
            href={`mailto:${profile.socials.email}`}
            className="hover:text-primary transition-colors"
          >
            {profile.socials.email}
          </a>
          <a
            href={profile.socials.github}
            target="_blank"
            className="hover:text-primary transition-colors"
          >
            GitHub
          </a>
          <a
            href={profile.socials.linkedin}
            target="_blank"
            className="hover:text-primary transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </header>

      {/* Experience Section */}
      <section className="flex flex-col gap-8">
        <h2 className="text-2xl font-bold tracking-tight">Experience</h2>
        <div className="flex flex-col gap-12">
          {work.map((job) => (
            <div
              key={job.id}
              className="flex flex-col md:flex-row gap-4 md:gap-8 group"
            >
              <div className="min-w-[200px] text-sm text-muted-foreground font-medium pt-1">
                {job.duration}
              </div>
              <div className="flex flex-col gap-3 flex-1">
                <div className="flex flex-col">
                  <h3 className="text-xl font-bold text-foreground">
                    {job.position}
                  </h3>
                  <div className="flex items-center gap-2 text-muted-foreground font-medium">
                    <span>{job.company}</span>
                    <span>•</span>
                    <span>{job.location}</span>
                  </div>
                </div>

                <ul className="list-disc list-inside space-y-1.5 text-muted-foreground ml-1">
                  {job.description.map((desc, i) => (
                    <li key={i} className="leading-relaxed">
                      <span className="-ml-1">{desc}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2 mt-2">
                  {job.techStack.map((tech) => (
                    <Badge
                      key={tech}
                      variant="secondary"
                      className="font-mono text-[10px] bg-muted/50 rounded pointer-events-none"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>

                {job.slug && (
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 group-hover:border-primary/50 transition-colors"
                      asChild
                    >
                      <a href={`/experience/${job.slug}`}>
                        Read Deep-Dive <ExternalLink className="w-3 h-3" />
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Education Section */}
      <section className="flex flex-col gap-8">
        <h2 className="text-2xl font-bold tracking-tight">Education</h2>
        <div className="flex flex-col gap-8">
          {education.map((edu, idx) => (
            <div key={idx} className="flex flex-col md:flex-row gap-4 md:gap-8">
              <div className="min-w-[200px] text-sm text-muted-foreground font-medium pt-1">
                {edu.duration}
              </div>
              <div className="flex flex-col flex-1">
                <h3 className="text-lg font-bold text-foreground">
                  {edu.institution}
                </h3>
                <div className="flex items-center justify-between mt-1 text-muted-foreground">
                  <span>{edu.degree}</span>
                  {edu.grade && (
                    <span className="font-mono bg-muted/50 px-2 py-0.5 rounded text-xs">
                      {edu.grade}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Skills Section */}
      <section className="flex flex-col gap-8">
        <h2 className="text-2xl font-bold tracking-tight">Technical Arsenal</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Object.entries(skills).map(([category, items]) => (
            <div key={category} className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {items.map((skill) => (
                  <Badge key={skill} variant="outline" className="px-3 py-1">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
