import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Metadata } from "next";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function constructMetadata({
  title = "Debatreya Das | Developer OS",
  description = "A Manifest-Driven Developer Portfolio and Digital Garden",
  image,
  icons = "/favicon.ico",
  noIndex = false,
  label,
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
  label?: string;
} = {}): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://debatreyadas.dev";

  // If no explicitly provided image, auto-generate one
  let ogImageUrl = image;
  if (!ogImageUrl) {
    const searchParams = new URLSearchParams();
    searchParams.set("title", title);
    if (description) searchParams.set("description", description);
    if (label) searchParams.set("label", label);

    ogImageUrl = `${baseUrl}/api/og?${searchParams.toString()}`;
  } else if (ogImageUrl.startsWith("/")) {
    ogImageUrl = `${baseUrl}${ogImageUrl}`;
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
    icons,
    metadataBase: new URL(baseUrl),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
