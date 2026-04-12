# SEO & Metadata in Next.js (App Router)

This repository demonstrates how to implement a production-grade SEO strategy natively in Next.js using the modern App Router (`app` directory) paradigm. 

## How SEO Works in Next.js
Unlike traditional Single Page Applications (SPAs) which rely on client-side JavaScript to render the DOM, Next.js natively builds pages on the Server (SSR) or at Build Time (SSG). Because of this, web crawlers (like Googlebot) receive fully populated HTML documents without having to execute JavaScript or wait for the page to load.

### Implementations in this Project:

1. **Dynamic Route Metadata (`app/posts/[postId]/page.tsx`)**
   - We utilized the `generateMetadata` function. Before the page renders, Next.js looks at this function, fetches the necessary API data, and explicitly writes `<title>`, `<meta name="description">`, and `OG Tags` directly into the `<head>` of the server response.
   - We also configured canonical tags (`alternates.canonical`) to prevent duplicate content indexing.

2. **JSON-LD Structured Data (`app/posts/[postId]/page.tsx`)**
   - We injected a `<Script type="application/ld+json">` tag into the markup. This passes a structured `BlogPosting` schema object to search engines, making the post eligible for Google's "Rich Results" (e.g., Top Stories Carousels).

3. **Dynamic Sitemaps (`app/sitemap.ts`)**
   - Sitemaps are crucial for crawler discovery. The `sitemap.ts` file automatically fetches all posts from the API and dynamically exposes a `sitemap.xml` endpoint containing every route, complete with `<changefreq>` and `<priority>` weightings.

## Relevant Resources
- [Next.js Official Metadata Docs](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Next.js sitemap.xml Generating Guide](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)
- [Google Search Central: JSON-LD Structured Data](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)
- [Google Search Central: Canonical URLs](https://developers.google.com/search/docs/advanced/crawling/consolidate-duplicate-urls)
