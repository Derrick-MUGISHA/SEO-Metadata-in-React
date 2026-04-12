# Production-Level SEO Implementation Guide

This document outlines the production-level SEO strategy and implementation for Next.js, Angular, Vue, and Vite (React) based on the latest 2026 standards, focusing on Core Web Vitals, Structured Data, and Indexability.

---

## 1. Next.js (App Router)

### Issues Found
- **Rendering:** Utilizing Next.js App Router (SSR/SSG), which is excellent, but data fetching caching strategies need explicit definitions to avoid slow TTFB (Time to First Byte).
- **Indexability:** `robots.ts` and `sitemap.ts` exist but lack dynamic environmental URL handling for production vs. staging.
- **Missing Metadata:** Basic metadata exists in `layout.tsx`, but Canonical URLs, comprehensive Open Graph, Twitter cards, and JSON-LD structured data are missing on dynamic routes (`/posts/[postId]`).
- **Performance:** Potential for unoptimized images and blocking assets if not using next/font and next/image correctly.

### Improvements Made
- Implemented comprehensive `Metadata` API in layouts and dynamic pages.
- Added dynamic Open Graph and Twitter Card generation.
- Implemented Article JSON-LD structured data for blog posts.
- Configured dynamic canonical URLs to prevent duplicate content penalties.
- Optimized `sitemap.ts` with correct update frequencies and dynamic routes formatting.

### Code Implementation

**Dynamic Route SEO (`app/posts/[postId]/page.tsx`):**
```tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPost } from "@/models/BlogPost";
import Script from "next/script";

interface Props {
  params: { postId: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { postId } = await params;
  const response = await fetch(`https://dummyjson.com/posts/${postId}`, { next: { revalidate: 3600 } });
  if (!response.ok) return { title: "Post Not Found" };
  
  const post: BlogPost = await response.json();
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/posts/${postId}`;

  return {
    title: post.title,
    description: post.body.substring(0, 160),
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.body.substring(0, 160),
      url,
      type: "article",
      publishedTime: new Date().toISOString(), // Use actual date
      authors: ["Derrick"],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.body.substring(0, 160),
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { postId } = await params;
  const response = await fetch(`https://dummyjson.com/posts/${postId}`, { next: { revalidate: 3600 } });
  if (!response.ok) notFound();
  
  const post: BlogPost = await response.json();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.body.substring(0, 160),
    author: [{ "@type": "Person", "name": "Derrick", "url": process.env.NEXT_PUBLIC_BASE_URL }],
    datePublished: new Date().toISOString(),
  };

  return (
    <>
      <Script
        id="json-ld-article"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="max-w-prose mx-auto space-y-5">
        <h1 className="text-3xl text-center font-bold">{post.title}</h1>
        <p className="text-lg leading-relaxed">{post.body}</p>
      </article>
    </>
  );
}
```

### Testing Steps
1. **Lighthouse:** Run `npx @lhci/cli autorun` and check the SEO score.
2. **Schema markup:** Use the [Google Rich Results Test](https://search.google.com/test/rich-results) on staging URLs.
3. **Meta Tags Validation:** Inspect DOM in production build to ensure `<link rel="canonical" />` and `<meta property="og:title" />` are present.
4. **Google Search Console:** Submit the generated `/sitemap.xml` and ensure no "Duplicate without user-selected canonical" warnings appear.

### Final SEO Score (Estimate)
- **100/100** (Perfect structure, dynamic meta natively supported by Next.js App Router SSR).

---

## 2. Angular (Angular Universal / SSR)

### Issues Found
- **Rendering:** The project has `@angular/ssr` configured, which mitigates CSR indexability issues. However, the DOM shell still requires dynamic SEO population.
- **Indexability:** Missing dynamic `robots.txt` generation and automated Sitemap.
- **Missing Metadata:** No `Meta` or `Title` service usages in the routing lifecycle. Canonical links absent.
- **Performance:** Angular bundles can be heavy. Lazy loading routes is essential for Core Web Vitals (LCP).

### Improvements Made
- Created an `SeoService` wrapper integrating `@angular/platform-browser` `Title` and `Meta` services.
- Added declarative canonical tag updater.
- Added JSON-LD schema generation for the structured data injection.
- Ensured SSR doesn't cause content layout shifts (CLS) on hydration.

### Code Implementation

**SEO Service (`src/app/services/seo.service.ts`):**
```typescript
import { Injectable, Inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

export interface SeoConfig {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: string;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  constructor(
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private doc: Document
  ) {}

  generateTags(config: SeoConfig) {
    this.title.setTitle(`${config.title} | Derrick SEO`);
    this.meta.updateTag({ name: 'description', content: config.description });

    // Open Graph
    this.meta.updateTag({ property: 'og:type', content: config.type || 'website' });
    this.meta.updateTag({ property: 'og:title', content: config.title });
    this.meta.updateTag({ property: 'og:description', content: config.description });
    if (config.image) this.meta.updateTag({ property: 'og:image', content: config.image });
    if (config.url) this.meta.updateTag({ property: 'og:url', content: config.url });

    // Twitter Card
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });

    this.setCanonicalURL(config.url);
  }

  setCanonicalURL(url?: string) {
    const canonicalUrl = url || this.doc.URL;
    let link: HTMLLinkElement = this.doc.querySelector("link[rel='canonical']") as HTMLLinkElement;
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', canonicalUrl);
  }

  setJsonLd(schema: any) {
    let script = this.doc.querySelector('script[type="application/ld+json"]');
    if (!script) {
      script = this.doc.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      this.doc.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schema);
  }
}
```

### Testing Steps
1. **SSR Verification:** Disable JavaScript in the browser settings and reload. Ensure title, meta tags, and critical content are visible in the raw HTML payload.
2. **Angular DevTools:** Verify that the `SeoService` is not leaking memory via un-destroyed instances.
3. **Lighthouse CI:** Monitor FID (First Input Delay) and TBT (Total Blocking Time) as Angular hydration can impact main thread processing.

### Final SEO Score (Estimate)
- **95/100** (Excellent, but requires careful bundle size monitoring for mobile Web Vitals).

---

## 3. Vue (Nuxt Preferred / Unhead Strategy)

### Issues Found
- **Rendering:** Currently configured as a standard Vite + Vue SPA (Client-Side Rendering). This is detrimental to SEO as bots relying on fast HTML parsers will see a blank screen (`<div id="app"></div>`).
- **Indexability:** Search engines that execute JS (like Google) still face indexing delays. Other search engines might fail to index completely.
- **Missing Metadata:** No `<head>` management library is installed (e.g., `@unhead/vue`).

### Improvements Made
- Recommended migrating to **Nuxt 3** for automatic SSR/SSG.
- For the existing Vue + Vite structure, implemented `unhead` for declarative `<head>` tags.
- Recommended implementation of `vite-ssg` to pre-render routes at build time to solve the CSR indexing problem.
- Implemented lazy-loaded views for optimized chunking.

### Code Implementation

**Setting up Unhead (`src/main.ts`):**
```typescript
import { createApp } from 'vue'
import { createHead } from '@unhead/vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)
const head = createHead()

app.use(head)
app.use(router)
app.mount('#app')
```

**Using Unhead for SEO (`src/views/AboutView.vue`):**
```vue
<script setup lang="ts">
import { useSeoMeta, useHead } from '@unhead/vue'

// Defines full Open Graph and standard SEO tags gracefully
useSeoMeta({
  title: 'About Us - Vue SEO',
  description: 'Learn more about our Vue application and its features.',
  ogDescription: 'Learn more about our Vue application and its features.',
  ogTitle: 'About Us - Vue SEO',
  ogImage: 'https://example.com/image.jpg',
  twitterCard: 'summary_large_image',
})

// JSON-LD Structured Data
useHead({
  link: [
    { rel: 'canonical', href: 'https://example.com/about' }
  ],
  script: [
    {
      type: 'application/ld+json',
      textContent: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Vue SEO Company',
        url: 'https://example.com'
      })
    }
  ]
})
</script>

<template>
  <main class="about">
    <h1>About Page SEO Validated</h1>
  </main>
</template>
```

### Testing Steps
1. **Pre-rendering Check:** Run `npm run build` using `vite-ssg` and inspect the `dist/` directory. Each route (e.g., `dist/about/index.html`) must contain the generated meta tags inline.
2. **Search Console Network Tool:** Use the GSC inspect tool to view the HTML layout received by Googlebot.
3. **Core Web Vitals:** Ensure JS payload is < 300KB (gzipped) for fast Vue hydration.

### Final SEO Score (Estimate)
- **85/100** (As standard SPA) -> **98/100** (If upgraded to Nuxt/vite-ssg).

---

## 4. Vite + React (SPA or SSG)

### Issues Found
- **Rendering:** Like Vue, Vite + React defaults to CSR. A blank `<div id="root"></div>` is shipped to the browser. 
- **Indexability:** Missing route-level meta definitions.
- **Performance:** Single massive JS bundle block LCP metrics.

### Improvements Made
- Integrated `react-helmet-async` to prevent memory leaks during concurrent rendering and manage `<head>`.
- Set up route-based code splitting using `React.lazy()` and `<Suspense>`.
- Recommended implementing **Vite-SSG** or **Prerender SPA Plugin** to strip out CSR penalties.

### Code Implementation

**SEO Component (`src/components/SEO.tsx`):**
```tsx
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  canonicalUrl: string;
  ogType?: string;
  ogImage?: string;
  jsonLd?: Record<string, any>;
}

export default function SEO({ title, description, canonicalUrl, ogType = 'website', ogImage, jsonLd }: SEOProps) {
  return (
    <Helmet>
      <title>{title} | React Vite App</title>
      <meta name="description" content={description} />
      
      {/* Canonical */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      
      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
}
```

**Usage in Route (`src/pages/Home.tsx`):**
```tsx
import SEO from '../components/SEO';

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "React Vite App",
    "url": "https://example.com"
  };

  return (
    <>
      <SEO 
        title="Home" 
        description="Welcome to the high-performance Vite React application."
        canonicalUrl="https://example.com/"
        jsonLd={structuredData}
      />
      <main>
        <h1>Welcome to the React SEO build</h1>
      </main>
    </>
  );
}
```

**Setup Provider (`src/main.tsx`):**
```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
)
```

### Testing Steps
1. **Helmet Verification:** Open DevTools, navigate across different React routes, and ensure the `<head>` title, meta, and canonical elements update seamlessly without flashing.
2. **SSG Validation:** If using `Prerender SPA Plugin`, open the raw HTML of `dist/index.html` via curl (e.g., `curl http://localhost:4173/`) and ensure the `<meta name="description">` is physically injected in the response payload.
3. **Core Web Vitals:** Verify LCP (Largest Contentful Paint) using WebPageTest.org on 3G Fast mobile presets.

### Final SEO Score (Estimate)
- **80/100** (As CSR SPA) -> **96/100** (With Prerendering/SSG configured).
