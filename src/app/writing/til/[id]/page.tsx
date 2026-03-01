import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Badge } from "@/components/ui/badge";
import { getPostById, getPostsByType } from "@/lib/content";

// Provide custom components to the MDX remote renderer based on UI preferences
const mdxComponents = {
  h1: (props: any) => (
    <h1
      className="mt-8 mb-4 text-3xl font-black font-serif tracking-tight"
      {...props}
    />
  ),
  h2: (props: any) => (
    <h2
      className="mt-8 mb-4 text-2xl font-bold font-serif tracking-tight border-b pb-2"
      {...props}
    />
  ),
  h3: (props: any) => (
    <h3 className="mt-6 mb-3 text-xl font-semibold font-serif" {...props} />
  ),
  p: (props: any) => (
    <p
      className="mb-6 leading-relaxed text-muted-foreground/90 font-serif text-lg"
      {...props}
    />
  ),
  ul: (props: any) => (
    <ul
      className="mb-6 ml-6 list-disc space-y-2 text-muted-foreground/90 font-serif text-lg"
      {...props}
    />
  ),
  ol: (props: any) => (
    <ol
      className="mb-6 ml-6 list-decimal space-y-2 text-muted-foreground/90 font-serif text-lg"
      {...props}
    />
  ),
  li: (props: any) => <li className="pl-1" {...props} />,
  blockquote: (props: any) => (
    <blockquote
      className="border-l-4 border-primary pl-4 italic my-6 text-muted-foreground/80 font-serif"
      {...props}
    />
  ),
  code: (props: any) => (
    <code
      className="bg-muted px-1.5 py-0.5 rounded-md font-mono text-sm"
      {...props}
    />
  ),
  pre: (props: any) => (
    <pre
      className="bg-[#1e1e1e] text-[#d4d4d4] p-4 rounded-xl overflow-x-auto my-6 font-mono text-sm shadow-lg border border-white/10"
      {...props}
    />
  ),
  a: (props: any) => (
    <a
      className="text-primary underline underline-offset-4 font-medium hover:text-primary/80 transition-colors"
      {...props}
    />
  ),
};

export async function generateStaticParams() {
  const posts = getPostsByType("til");
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
  const post = getPostById("til", id);

  if (!post) {
    notFound();
  }

  return (
    <article className="max-w-2xl mx-auto py-12 px-6 flex flex-col relative">
      <div className="mb-8">
        <Link
          href="/writing/til"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Base
        </Link>
        <div className="flex items-center gap-3 mb-4">
          <time className="text-sm font-mono text-muted-foreground">
            {format(new Date(post.date), "MMMM dd, yyyy")}
          </time>
          <Badge
            variant="secondary"
            className="font-mono text-[10px] bg-muted/50"
          >
            {post.category}
          </Badge>
        </div>
        <h1 className="text-4xl md:text-5xl font-black font-serif tracking-tight mb-6">
          {post.title}
        </h1>
        <div className="flex flex-wrap gap-2 mb-8">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs text-muted-foreground/60 font-mono"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <div className="prose prose-invert max-w-none">
        <MDXRemote source={post.content} components={mdxComponents} />
      </div>

      <footer className="mt-16 pt-8 border-t flex justify-between items-center text-sm text-muted-foreground">
        <span>© {new Date().getFullYear()} Debatreya Das</span>
        <div className="flex items-center gap-2">
          <span>Was this helpful?</span>
          <span className="cursor-pointer hover:text-foreground">Yes</span> /{" "}
          <span className="cursor-pointer hover:text-foreground">No</span>
        </div>
      </footer>
    </article>
  );
}
