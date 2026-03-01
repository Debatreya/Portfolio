import { Download, ExternalLink } from "lucide-react";
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
      <header className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-white/10 pb-12 pt-4">
        <div className="flex flex-col gap-5 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            {profile.name}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Software Engineer specialized in{" "}
            <span className="text-primary">distributed systems</span> and{" "}
            <span className="text-primary">digital public goods</span>.
            Currently scaling infrastructure at Microsoft.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono text-muted-foreground uppercase tracking-widest mt-2">
            <div className="flex items-center gap-2">
              <span className="text-primary">LOC:</span>
              <span>{profile.location}</span>
            </div>
            <a
              href={`mailto:${profile.socials.email}`}
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <span className="text-primary">MAIL:</span>
              <span>{profile.socials.email}</span>
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-3 min-w-[140px]">
          <a
            href={profile.socials.linkedin}
            target="_blank"
            className="px-4 py-2 text-xs font-mono font-bold uppercase tracking-widest text-center border border-white/10 rounded-md hover:bg-white/5 transition-colors"
          >
            LinkedIn
          </a>
          <a
            href={profile.socials.github}
            target="_blank"
            className="px-4 py-2 text-xs font-mono font-bold uppercase tracking-widest text-center border border-white/10 rounded-md hover:bg-white/5 transition-colors"
          >
            GitHub
          </a>
        </div>
      </header>

      {/* Experience Section */}
      <section className="flex flex-col gap-10">
        <h2 className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-muted-foreground border-b border-white/10 pb-4">
          Work Experience
        </h2>
        <div className="flex flex-col gap-14">
          {work.map((job) => (
            <div key={job.id} className="flex flex-col gap-4 group">
              <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2">
                <div className="flex flex-col">
                  <h3 className="text-xl font-bold text-foreground">
                    {job.position}
                  </h3>
                  <div className="text-primary font-medium">{job.company}</div>
                </div>
                <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                  {job.duration}
                </div>
              </div>

              <ul className="list-disc list-outside ml-4 space-y-3 text-sm text-foreground/80">
                {job.description.map((desc) => (
                  <li key={desc} className="leading-relaxed pl-2">
                    {desc}
                  </li>
                ))}
              </ul>

              {job.slug && (
                <div className="mt-4">
                  <Button
                    variant="outline"
                    className="border-primary/20 bg-primary/5 text-primary hover:bg-primary hover:text-primary-foreground text-xs font-mono uppercase tracking-widest rounded-sm px-4 h-8"
                    asChild
                  >
                    <a href={`/experience/${job.slug}`}>
                      Read Deep-Dive <ExternalLink className="w-3 h-3 ml-2" />
                    </a>
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Technical Stack Section */}
      <section className="flex flex-col gap-8 pt-8">
        <h2 className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-muted-foreground border-b border-white/10 pb-4">
          Technical Stack
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-white/10 rounded-lg overflow-hidden">
          {Object.entries(skills).map(([category, items], i, arr) => (
            <div
              key={category}
              className={`flex flex-col gap-4 p-6 ${i !== arr.length - 1 ? "border-b md:border-b-0 md:border-r border-white/10" : ""}`}
            >
              <h3 className="text-[10px] font-bold font-mono text-primary uppercase tracking-widest">
                {category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {items.map((skill) => (
                  <div
                    key={skill}
                    className="px-2 py-1 text-xs font-mono bg-white/5 border border-white/10 rounded-md text-foreground/80"
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Education Section */}
      <section className="flex flex-col gap-8 pt-8 pb-12 border-b border-white/10">
        <h2 className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-muted-foreground border-b border-white/10 pb-4">
          Education
        </h2>
        <div className="flex flex-col gap-8">
          {education.map((edu) => (
            <div
              key={edu.institution}
              className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 p-6 border border-white/10 rounded-lg"
            >
              <div className="flex flex-col gap-1">
                <h3 className="text-base font-bold text-foreground">
                  {edu.degree}
                </h3>
                <div className="text-sm text-muted-foreground">
                  {edu.institution}
                </div>
              </div>
              <div className="flex flex-col md:items-end gap-1 text-xs font-mono uppercase tracking-widest text-muted-foreground">
                <div className="text-primary font-bold">
                  {edu.grade && `GPA: ${edu.grade}`}
                </div>
                <div>{edu.duration}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
