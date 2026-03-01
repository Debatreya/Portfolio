import { FileCode2, FolderGit2, Terminal } from "lucide-react";
import Link from "next/link";

// Mock Lab Registry data
// This should ideally be auto-generated build-time or fetched via an API.
const LAB_EXPERIMENTS = [
  {
    slug: "fluid-shader",
    title: "WebGL Fluid Sim",
    category: "shader",
    date: "2026-02-15",
  },
  {
    slug: "dynamic-island",
    title: "Dynamic Island Nav",
    category: "ui",
    date: "2026-01-20",
  },
  {
    slug: "pram-visualizer",
    title: "PRAM Algorithm Visualizer",
    category: "algorithm",
    date: "2025-11-10",
  },
];

export default function LabIndex() {
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] border rounded-xl overflow-hidden bg-background">
      {/* Lab Header */}
      <div className="h-12 border-b bg-muted/30 flex items-center px-4 gap-2 text-sm font-mono text-muted-foreground">
        <Terminal className="w-4 h-4" />
        <span>~/debatreyadas.dev/src/app/lab</span>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Explorer */}
        <aside className="w-64 border-r bg-muted/10 p-4 overflow-y-auto">
          <div className="flex items-center gap-2 font-mono text-sm font-bold mb-4">
            <FolderGit2 className="w-4 h-4" />
            <span>Experiments</span>
          </div>

          <div className="flex flex-col gap-1">
            {LAB_EXPERIMENTS.map((exp) => (
              <Link
                key={exp.slug}
                href={`/lab/${exp.slug}`}
                className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted font-mono text-xs transition-colors group"
              >
                <FileCode2 className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="truncate">{exp.title}</span>
              </Link>
            ))}
          </div>
        </aside>

        {/* Main Canvas Area */}
        <main className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[url('/noise.png')] bg-repeat opacity-90">
          <div className="max-w-md space-y-4">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center mb-6 border border-primary/20">
              <Terminal className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              The Engineering Lab
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Select an experiment from the sidebar explorer. This space is
              dedicated to standalone interactive components, WebGL shaders, and
              algorithm visualizations.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
