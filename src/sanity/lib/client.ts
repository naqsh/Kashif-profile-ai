import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-06-01";

if (!projectId) {
  console.warn("⚠️  Sanity project ID is not configured. Blog features will not work until you set NEXT_PUBLIC_SANITY_PROJECT_ID in .env");
}

export const client = createClient({
  projectId: projectId || "dummy",
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
  stega: {
    enabled: false,
    studioUrl: "/studio",
  },
});

export const previewClient = createClient({
  projectId: projectId || "dummy",
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  perspective: "previewDrafts",
});

const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

export async function sanityFetch<T = unknown>(options: {
  query: string;
  params?: Record<string, unknown>;
  revalidate?: number | false;
  tags?: string[];
  /** Value returned when Sanity is unconfigured or the request fails. */
  fallback?: T;
}): Promise<T> {
  const { query, params = {}, revalidate, tags = [] } = options;
  const fallback = (options.fallback ?? ([] as unknown)) as T;

  if (!projectId) {
    return fallback;
  }

  try {
    // Use the pre-configured client so CDN host, perspective and stega
    // settings stay consistent (instead of hand-rolling the fetch/host).
    return await client.fetch<T>(query, params, {
      next: {
        revalidate: revalidate ?? 3600,
        tags,
      },
    });
  } catch (error) {
    console.error("Sanity fetch failed:", error);
    return fallback;
  }
}
