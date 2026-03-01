import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { CommandPalette } from "@/components/CommandPalette";
import { Navbar } from "@/components/layout/Navbar";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "Debatreya Das | Developer OS",
  description: "A Manifest-Driven Developer Portfolio and Digital Garden",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <CommandPalette>
            <div className="min-h-screen bg-background text-foreground flex flex-col">
              <Navbar />
              <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {children}
              </main>

              {/* OS Status Bar */}
              <footer className="w-full border-t bg-background/95 backdrop-blur px-4 py-2 flex items-center justify-between text-[10px] font-mono text-muted-foreground uppercase tracking-wider sticky bottom-0 z-50">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span>
                      OS_RUNNING_OK:{" "}
                      <span className="text-primary font-semibold">
                        STATUS_200
                      </span>
                    </span>
                  </div>
                </div>

                <div className="hidden md:flex items-center gap-6">
                  <a
                    href="/projects"
                    className="hover:text-primary transition-colors"
                  >
                    GITHUB
                  </a>
                  <a
                    href="/resume"
                    className="hover:text-primary transition-colors"
                  >
                    LINKEDIN
                  </a>
                  <a
                    href="/writing/til"
                    className="hover:text-primary transition-colors"
                  >
                    RSS
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <span>
                    © {new Date().getFullYear()} DEV_PORTFOLIO_OS / 1.0.4-STABLE
                  </span>
                </div>
              </footer>
            </div>
          </CommandPalette>
        </ThemeProvider>
      </body>
    </html>
  );
}
