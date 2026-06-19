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
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      ...(image && {
        images: [
          {
            url: image,
          },
        ],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image && {
        images: [image],
      }),
    },
    icons,
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_APP_URL || "https://debatreyadas.dev"
    ),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
