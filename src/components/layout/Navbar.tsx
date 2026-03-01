"use client";

import { Command } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home" },
    { href: "/resume", label: "Resume" },
    { href: "/projects", label: "Projects" },
    { href: "/writing/til", label: "TIL" },
    { href: "/lab", label: "Lab" },
  ];

  return (
    <nav className="flex items-center justify-between w-full p-4 mb-8 sticky top-0 bg-background/80 backdrop-blur-sm z-50 border-b">
      <div className="flex items-center gap-6">
        <Link href="/" className="font-bold text-lg tracking-tighter">
          DD.
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

      {/* Command Palette Hint */}
      <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md border cursor-pointer hover:bg-muted/80 transition-colors">
        <Command className="w-3 h-3" />
        <span>K for Menu</span>
      </div>
    </nav>
  );
}
