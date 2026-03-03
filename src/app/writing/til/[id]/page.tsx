import { format } from "date-fns";
import {
  ArrowLeft,
  ArrowUpRight,
  Calendar,
  Clock,
  FileCode,
  Folder,
  Info,
  Layers,
  Linkedin,
  Link as LinkIcon,
  MoreHorizontal,
  Users,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import type React from "react";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { Badge } from "@/components/ui/badge";
import { getRemoteTILById, getRemoteTILs } from "@/lib/content";
import { getProjects } from "@/lib/github";
import "katex/dist/katex.min.css";

// Custom components moved inside TilPost to access local data
export const revalidate = 43200; // Refresh data every 12 hours

export async function generateStaticParams() {
  const posts = await getRemoteTILs();
  return posts.map((post) => ({
    id: post.id,
  }));
}

export default async function TilPost({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const post = await getRemoteTILById(id);

  if (!post) {
    notFound();
  }

  // Define components inside the function to access local 'post' data
  const mdxComponents = {
    h1: (props: React.ComponentPropsWithoutRef<"h1">) => (
      <h1
        className="mt-12 mb-6 text-3xl font-bold tracking-tight text-foreground"
        {...props}
      />
    ),
    h2: (props: React.ComponentPropsWithoutRef<"h2">) => (
      <h2
        className="mt-12 mb-6 text-2xl font-bold tracking-tight text-foreground flex items-center gap-2 group"
        {...props}
      >
        <span className="w-4 h-0.5 bg-primary/40 group-hover:bg-primary transition-colors" />
        {props.children}
      </h2>
    ),
    h3: (props: React.ComponentPropsWithoutRef<"h3">) => (
      <h3 className="mt-8 mb-4 text-xl font-bold text-foreground" {...props} />
    ),
    p: (props: React.ComponentPropsWithoutRef<"p">) => (
      <p
        className="my-4 leading-relaxed text-muted-foreground/90 text-lg"
        {...props}
      />
    ),
    ul: (props: React.ComponentPropsWithoutRef<"ul">) => (
      <ul
        className="mb-8 ml-6 list-disc space-y-3 text-muted-foreground/90 text-lg"
        {...props}
      />
    ),
    ol: (props: React.ComponentPropsWithoutRef<"ol">) => (
      <ol
        className="mb-8 ml-6 list-decimal space-y-3 text-muted-foreground/90 text-lg"
        {...props}
      />
    ),
    li: (props: React.ComponentPropsWithoutRef<"li">) => (
      <li className="pl-2" {...props} />
    ),
    blockquote: (props: React.ComponentPropsWithoutRef<"blockquote">) => (
      <blockquote
        className="border-l-2 border-primary/50 bg-primary/5 px-6 py-4 my-8 rounded-r-md italic text-muted-foreground/90"
        {...props}
      />
    ),
    code: (props: React.ComponentPropsWithoutRef<"code">) => (
      <code
        className="bg-primary/10 text-primary px-1.5 py-0.5 rounded font-mono text-xs border border-primary/20"
        {...props}
      />
    ),
    pre: (props: React.ComponentPropsWithoutRef<"pre">) => {
      return (
        <div className="my-8 rounded-lg overflow-hidden border border-white/5 bg-[#0a0a0a]">
          <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
            <div className="flex items-center gap-2">
              <FileCode className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                {(props as { filename?: string }).filename ||
                  post.code_filename ||
                  "Code Block"}
              </span>
            </div>
            <MoreHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
          <pre
            className="p-6 overflow-x-auto font-mono text-sm text-[#e0e0e0] leading-relaxed"
            {...props}
          />
        </div>
      );
    },
    a: (props: React.ComponentPropsWithoutRef<"a">) => (
      <a
        className="text-primary hover:text-primary/80 underline decoration-primary/30 underline-offset-4 transition-colors font-medium text-lg"
        target={props.href?.startsWith("http") ? "_blank" : undefined}
        rel={props.href?.startsWith("http") ? "noopener noreferrer" : undefined}
        {...props}
      />
    ),
    strong: (props: React.ComponentPropsWithoutRef<"strong">) => (
      <strong className="font-bold text-foreground" {...props} />
    ),
    table: (props: React.ComponentPropsWithoutRef<"table">) => (
      <div className="my-8 overflow-x-auto border border-white/10 rounded-lg overflow-hidden">
        <table className="w-full border-collapse text-sm" {...props} />
      </div>
    ),
    thead: (props: React.ComponentPropsWithoutRef<"thead">) => (
      <thead className="bg-white/5 border-b border-white/10" {...props} />
    ),
    th: (props: React.ComponentPropsWithoutRef<"th">) => (
      <th
        className="px-6 py-4 text-left font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
        {...props}
      />
    ),
    td: (props: React.ComponentPropsWithoutRef<"td">) => (
      <td
        className="px-6 py-4 border-b border-white/5 text-muted-foreground/90 leading-relaxed"
        {...props}
      />
    ),
    tr: (props: React.ComponentPropsWithoutRef<"tr">) => (
      <tr className="hover:bg-white/[0.02] transition-colors" {...props} />
    ),
    img: (props: React.ComponentPropsWithoutRef<"img">) => {
      const { src: originalSrc, alt, ...rest } = props;
      const srcStr = typeof originalSrc === "string" ? originalSrc : "";
      const isRelative = srcStr && !srcStr.startsWith("http");
      const githubBase =
        "https://raw.githubusercontent.com/Debatreya/Debatreya-TIL-garden/master/";
      const finalSrc = isRelative ? `${githubBase}${srcStr}` : srcStr;

      return (
        <span className="block my-8 rounded-lg overflow-hidden border border-white/10 bg-white/5">
          <img
            {...rest}
            src={finalSrc}
            className="w-full h-auto object-cover max-h-[500px]"
            alt={alt || "TIL Image"}
          />
        </span>
      );
    },
  };

  // Fetch related projects for the knowledge graph
  const allProjects = await getProjects();
  const relatedProjects = allProjects.filter((p) =>
    post.related_projects?.includes(p.id),
  );

  // Fetch related TILs
  const allTILs = await getRemoteTILs();
  const relatedTILs = allTILs
    .filter(
      (t) => t.id !== post.id && t.tags.some((tag) => post.tags.includes(tag)),
    )
    .slice(0, 3);

  const readTime = post.read_time || "5 MIN_READ";

  // Resolve avatar paths
  const gardenRawUrl =
    "https://raw.githubusercontent.com/Debatreya/Debatreya-TIL-garden/master";
  const processedContributors =
    post.contributor_avatars?.map((c) => {
      // Handle both old string format and new object format
      const name = typeof c === "string" ? "Contributor" : c.name;
      const avatar = typeof c === "string" ? c : c.avatar;
      const url = avatar.startsWith("http")
        ? avatar
        : `${gardenRawUrl}${avatar.startsWith("/") ? "" : "/"}${avatar}`;

      return { name, url };
    }) || [];

  // Sanitize MDX content to prevent "acorn" parsing errors for literal braces
  const sanitizedContent = post.content
    .replace(/{/g, "&#123;")
    .replace(/}/g, "&#125;");

  return (
    <div className="flex flex-col lg:flex-row gap-12 pt-0 pb-12">
      {/* Left Column: Post Content */}
      <article className="flex-1 min-w-0">
        <div className="mb-12">
          {/* Back button with themed style */}
          <Link
            href="/writing/til"
            className="group inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" />{" "}
            [ BACK_TO_LIBRARY ]
          </Link>

          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-3">
              <Badge
                variant="default"
                className="bg-primary text-black font-mono text-[10px] tracking-widest uppercase px-2 py-0.5 rounded-none border-none hover:bg-primary"
              >
                {post.category}
              </Badge>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.05]">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 pt-2">
              <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground uppercase tracking-[0.15em]">
                <Calendar className="w-3 h-3" />
                {format(new Date(post.date), "yyyy.MM.dd")}
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground uppercase tracking-[0.15em]">
                <Clock className="w-3 h-3" />
                {readTime}
              </div>
            </div>
          </div>
        </div>

        <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-p:text-lg prose-headings:tracking-tighter prose-pre:bg-[#0a0a0a] prose-pre:border prose-pre:border-white/5">
          <MDXRemote
            source={sanitizedContent}
            components={mdxComponents}
            options={{
              mdxOptions: {
                format: "md",
                remarkPlugins: [remarkMath, remarkGfm],
                rehypePlugins: [rehypeKatex, rehypeHighlight],
              },
            }}
          />
        </div>

        {/* Post Footer */}
        <div className="mt-24 pt-8 border-t border-white/5">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] bg-white/5 border border-white/10 px-2 py-1 text-muted-foreground font-mono uppercase tracking-widest hover:text-primary transition-colors cursor-default"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </article>

      {/* Right Column: Knowledge Graph Sidebar */}
      <aside className="w-full lg:w-[350px] shrink-0">
        <div className="sticky top-6 space-y-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-5 h-5 bg-primary/20 rounded flex items-center justify-center">
              <Layers className="w-3 h-3 text-primary" />
            </div>
            <h2 className="text-sm font-mono font-black uppercase tracking-[0.25em] text-foreground">
              Knowledge Graph
            </h2>
          </div>

          {/* Related TILs */}
          <div className="space-y-6">
            <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em] border-l-2 border-white/10 pl-3">
              LINK::RELATED_TIL
            </div>
            <div className="space-y-3">
              {relatedTILs.map((item) => (
                <Link
                  key={item.id}
                  href={`/writing/til/${item.id}`}
                  className="group block p-4 bg-white/5 border border-white/5 hover:border-primary/30 transition-all cursor-pointer relative"
                >
                  <h3 className="text-xs font-bold mb-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono text-muted-foreground uppercase">
                      ID: {item.id.slice(0, 8)}
                    </span>
                    <ArrowUpRight className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </Link>
              ))}
              {relatedTILs.length === 0 && (
                <div className="text-[9px] font-mono text-muted-foreground italic">
                  NO_RELATED_NODES_FOUND
                </div>
              )}
            </div>
          </div>

          {/* Related Projects */}
          <div className="space-y-6">
            <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em] border-l-2 border-white/10 pl-3">
              LINK::RELATED_PROJECT
            </div>
            <div className="space-y-3">
              {relatedProjects.map((item) => (
                <Link
                  key={item.id}
                  href={`/projects/${item.id}`}
                  className="group block p-4 bg-white/5 border border-white/5 hover:border-primary/30 transition-all cursor-pointer"
                >
                  <h3 className="text-xs font-bold mb-2 group-hover:text-primary transition-colors">
                    {item.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono text-muted-foreground uppercase">
                      ID: {item.id.slice(0, 10)}
                    </span>
                    <Folder className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </Link>
              ))}
              {relatedProjects.length === 0 && (
                <div className="text-[9px] font-mono text-muted-foreground italic">
                  NO_LINKED_REPOS_FOUND
                </div>
              )}
            </div>
          </div>

          <div className="h-px bg-white/5 w-full" />

          {/* External Links */}
          {post.external_links && post.external_links.length > 0 && (
            <div className="space-y-4">
              <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em]">
                EXTERNAL_LINKS
              </div>
              <div className="flex items-center gap-3">
                {post.external_links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary/10 hover:border-primary/30 transition-all group"
                    title={link.name}
                  >
                    {link.name.toLowerCase() === "linkedin" ? (
                      <Linkedin
                        className="w-4 h-4 text-[#0A66C2]"
                        fill="currentColor"
                        strokeWidth={1}
                      />
                    ) : (
                      <LinkIcon className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                    )}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Contributors */}
          <div className="space-y-6">
            <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em]">
              NODE_CONTRIBUTORS
            </div>
            <div className="flex items-center gap-3">
              {processedContributors.length > 0 ? (
                processedContributors.map((c) => (
                  <div
                    key={c.url}
                    className="w-8 h-8 rounded-full border-2 border-[#121415] bg-muted overflow-hidden flex items-center justify-center relative group"
                    title={c.name}
                  >
                    <img
                      src={c.url}
                      alt={c.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))
              ) : (
                <div className="w-8 h-8 rounded-full border-2 border-[#121415] bg-muted overflow-hidden flex items-center justify-center">
                  <Users className="w-4 h-4 text-muted-foreground" />
                </div>
              )}
            </div>
          </div>

          {post.system_manifest && (
            <div className="p-6 bg-primary/5 border border-primary/20 rounded-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                <Info className="w-12 h-12 text-primary" />
              </div>
              <div className="flex items-center gap-3 mb-3">
                <Info className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-mono font-bold text-primary uppercase tracking-[0.2em]">
                  System Note
                </span>
              </div>
              <p className="text-[11px] leading-relaxed text-muted-foreground font-medium">
                Auto-sync enabled. This document is part of the{" "}
                <span className="text-primary/80 font-bold">
                  {post.system_manifest}
                </span>{" "}
                manifest.
              </p>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
