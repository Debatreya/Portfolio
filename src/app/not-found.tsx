import { AlertTriangle, Home, Search, Terminal } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      {/* OS Error Header */}
      <div className="mb-12 relative">
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse" />
        <div className="relative bg-background border-2 border-primary/30 p-8 rounded-2xl shadow-[0_0_50px_rgba(20,241,149,0.1)]">
          <AlertTriangle className="w-16 h-16 text-primary mx-auto mb-6 animate-bounce" />
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-2 text-foreground">
            404
          </h1>
          <p className="font-mono text-sm uppercase tracking-[0.3em] text-primary font-bold">
            SIGNAL_LOST
          </p>
        </div>
      </div>

      {/* Terminal Output Style */}
      <div className="max-w-xl w-full bg-black/40 border border-white/5 rounded-lg p-6 mb-10 font-mono text-left relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />

        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 rounded-full bg-red-500/50" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
          <div className="w-3 h-3 rounded-full bg-green-500/50" />
          <span className="text-[10px] text-muted-foreground/50 ml-2 uppercase">
            System Process: runtime_recovery.sh
          </span>
        </div>

        <div className="space-y-2 text-xs md:text-sm">
          <p className="text-muted-foreground flex gap-2">
            <span className="text-primary opacity-50 select-none">
              [{new Date().toLocaleTimeString([], { hour12: false })}]
            </span>
            <span className="text-blue-400">INFO:</span> Scanning directory
            nodes...
          </p>
          <p className="text-muted-foreground flex gap-2">
            <span className="text-primary opacity-50 select-none">
              [{new Date().toLocaleTimeString([], { hour12: false })}]
            </span>
            <span className="text-yellow-400">WARN:</span> Entry point at
            current URI not found.
          </p>
          <p className="text-muted-foreground flex gap-2">
            <span className="text-primary opacity-50 select-none">
              [{new Date().toLocaleTimeString([], { hour12: false })}]
            </span>
            <span className="text-red-400">CRIT:</span> File system integrity
            check failed.
          </p>
          <p className="text-primary animate-pulse mt-4">
            {">"} SECTOR_NOT_FOUND: Redirect suggested. _
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/"
          className="group flex items-center justify-center gap-2 px-8 py-3 bg-primary text-black font-bold rounded-full transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(20,241,149,0.4)]"
        >
          <Home className="w-4 h-4" />
          RETURN_HOME
        </Link>
        <Link
          href="/projects"
          className="group flex items-center justify-center gap-2 px-8 py-3 bg-white/5 border border-white/10 text-foreground font-mono text-sm font-bold rounded-full transition-all hover:bg-white/10 hover:border-primary/50 uppercase tracking-widest"
        >
          <Search className="w-4 h-4" />
          SEARCH_ARCHIVES
        </Link>
      </div>

      <div className="mt-12 opacity-30 pointer-events-none select-none">
        <Terminal className="w-48 h-48 text-primary/10 rotate-12" />
      </div>
    </div>
  );
}
