import { CalendarDays, Download, ExternalLink } from "lucide-react";
import { PulseFeed } from "@/components/layout/PulseFeed";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import resumeData from "@/data/resume.json";

export default function Home() {
  const { profile } = resumeData;

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12 gap-6 lg:gap-10 lg:h-[calc(100vh-140px)] lg:overflow-hidden py-2 px-4 md:px-0">
      {/* Column 1: Identity - Always visible, stacks on mobile */}
      <div className="md:col-span-5 lg:col-span-3 h-fit">
        <Sidebar />
      </div>

      {/* Column 2: The Pulse Feed - Primary content */}
      <div className="md:col-span-7 lg:col-span-6 h-full min-h-[500px] lg:min-h-0">
        <PulseFeed />
      </div>

      {/* Column 3: Actions & Quick Links - Stacks below on tablet, side-by-side on desktop */}
      <div className="md:col-span-12 lg:col-span-3 h-full overflow-y-auto scrollbar-hide">
        <div className="space-y-6">
          <div className="p-6 rounded-xl border border-white/5 bg-card/30 backdrop-blur-sm text-card-foreground shadow-xl flex flex-col gap-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-muted-foreground">
              Quick Actions
            </h3>

            <Button
              className="w-full justify-between group"
              variant="default"
              asChild
            >
              <a
                href={profile.socials.calendar}
                target="_blank"
                rel="noreferrer noopener"
              >
                <span>Book a Coffee Chat</span>
                <CalendarDays className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </a>
            </Button>

            <Button
              className="w-full justify-between group"
              variant="outline"
              asChild
            >
              <a href="/api/resume" target="_blank" rel="noreferrer noopener">
                <span>Download Resume</span>
                <Download className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
              </a>
            </Button>

            <div className="text-xs text-center text-muted-foreground mt-2 px-4 py-2 bg-muted/50 rounded-lg border border-dashed flex items-center justify-center gap-2">
              <kbd className="font-mono text-[10px] px-1 bg-background rounded border shadow-sm">
                Cmd
              </kbd>
              <span>+</span>
              <kbd className="font-mono text-[10px] px-1 bg-background rounded border shadow-sm">
                K
              </kbd>
              <span>to search anytime</span>
            </div>
          </div>

          <div className="p-6 rounded-xl border bg-card text-card-foreground shadow flex flex-col gap-4">
            <h3 className="font-semibold tracking-tight text-sm text-muted-foreground uppercase">
              Highlights
            </h3>
            <a
              href="/projects"
              className="flex items-center justify-between text-sm font-medium hover:text-primary transition-colors"
            >
              <span>View Project Gallery</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href="/writing/til"
              className="flex items-center justify-between text-sm font-medium hover:text-primary transition-colors"
            >
              <span>Read the Base</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
