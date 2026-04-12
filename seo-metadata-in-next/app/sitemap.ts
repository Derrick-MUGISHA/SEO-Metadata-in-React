import { BlogPostsResponse } from "@/models/BlogPost";
import { MetadataRoute } from "next";

/**
 * Generating a sitemap.xml dynamically natively in Next.js
 * Search engines use sitemaps to discover new pages.
 * By mapping over our database/API responses, we can automatically feed
 * updated URLs, priorities, and change frequencies to web crawlers.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const response = await fetch("https://dummyjson.com/posts");
  const { posts }: BlogPostsResponse = await response.json();

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  const postEntries: MetadataRoute.Sitemap = posts.map(({ id }) => ({
    url: `${baseUrl}/posts/${id}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    {
      url: `${baseUrl}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...postEntries,
  ];
}