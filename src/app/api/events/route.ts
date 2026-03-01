import { getGithubEvents } from "@/lib/github";
import { getRemoteTILs } from "@/lib/content";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const typesParam = searchParams.get("types");
  const types = typesParam ? typesParam.split(",") : null;
  const perPage = 10;

  try {
    // Always fetch a large pool from GitHub (page 1) and paginate client-side.
    // The Events API returns at most 300 events from the last 30 days.
    const githubEvents = await getGithubEvents(1, 100);
    const remoteTils = await getRemoteTILs();

    const tils = remoteTils.map((post) => ({
      id: post.id,
      type: "TIL" as const,
      title: post.title,
      date: post.date,
      link: `/writing/til/${post.id}`,
      repo: null,
    }));

    // Merge all sources and sort by date
    let combined = [...tils, ...githubEvents];

    // Server-side type filtering
    if (types && types.length > 0) {
      combined = combined.filter((item) => types.includes(item.type));
    }

    combined.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    // Paginate from the full sorted list
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedData = combined.slice(startIndex, endIndex);
    const hasMore = endIndex < combined.length;

    return NextResponse.json({
      events: paginatedData,
      hasMore,
      page,
      total: combined.length,
    });
  } catch (error) {
    console.error("API Event Fetch Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 },
    );
  }
}
