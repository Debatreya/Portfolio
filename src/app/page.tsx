import { CalendarDays, Download, ExternalLink } from "lucide-react";
import { PulseFeed } from "@/components/layout/PulseFeed";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-10 pb-16">
      {/* Column 1: Identity (Sticky) */}
      <div className="md:col-span-4 lg:col-span-3">
        <div className="sticky top-24">
          <Sidebar />
        </div>
      </div>

      {/* Column 2: The Pulse Feed (Scrollable) */}
      <div className="md:col-span-8 lg:col-span-6 min-h-screen">
        <PulseFeed />
      </div>

      {/* Column 3: Actions & Quick Links (Sticky) */}
      <div className="md:col-span-12 lg:col-span-3">
        <div className="sticky top-24 space-y-6">
          <div className="p-6 rounded-xl border bg-card text-card-foreground shadow flex flex-col gap-4">
            <h3 className="font-semibold tracking-tight">Quick Actions</h3>

            <Button className="w-full justify-between group" variant="default">
              <span>Book a Coffee Chat</span>
              <CalendarDays className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </Button>

            <Button className="w-full justify-between group" variant="outline">
              <span>Download Resume</span>
              <Download className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
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
