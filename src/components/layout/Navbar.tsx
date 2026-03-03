"use client";

import { useKBar } from "kbar";
import { Command, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const { query } = useKBar();

  const links = [
    { href: "/", label: "Home" },
    { href: "/resume", label: "Resume" },
    { href: "/projects", label: "Projects" },
    { href: "/writing/til", label: "TIL" },
    { href: "/lab", label: "Lab" },
  ];

  return (
    <nav className="flex items-center justify-between w-full p-4 mb-4 sticky top-0 bg-background/95 backdrop-blur-md z-50 border-b">
      <div className="flex items-center gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-mono font-bold text-sm tracking-tight text-primary"
        >
          <div className="w-4 h-4 rounded-sm bg-primary/20 flex items-center justify-center">
            <div className="w-2 h-2 rounded-[2px] bg-primary animate-pulse" />
          </div>
          DEV_OS_V1.0
        </Link>
        <div className="hidden md:flex items-center gap-4 text-sm font-medium">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === link.href
                  ? "text-foreground"
                  : "text-muted-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Command Palette Hint & Mobile Menu */}
      <div className="flex items-center gap-2 md:gap-4">
        <button
          type="button"
          onClick={() => query.toggle()}
          className="flex md:hidden items-center justify-center w-9 h-9 text-muted-foreground bg-muted/50 rounded-md border border-white/10 cursor-pointer hover:bg-muted/80 transition-colors"
          aria-label="Toggle Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => query.toggle()}
          className="hidden md:flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md border border-white/10 cursor-pointer hover:bg-muted/80 transition-colors"
        >
          <Command className="w-3 h-3" />
          <span>K for Menu</span>
        </button>
        <ThemeToggle />
      </div>
    </nav>
  );
}
