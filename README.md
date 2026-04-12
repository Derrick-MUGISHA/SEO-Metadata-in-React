# 🌐 The Ultimate Framework SEO & Metadata Architecture Repository

Welcome to the definitive guide and monorepo for implementing **Production-Grade Search Engine Optimization (SEO)** across the four major modern frontend JavaScript frameworks: **Next.js**, **Angular**, **Vue**, and **React (Vite)**.

## 📖 Project Overview
Modern web development relies heavily on JavaScript to build interactive user interfaces. However, traditional Single Page Applications (SPAs) ship an empty HTML shell, forcing search engines (like Googlebot) to manually execute Javascript to read the page. This historically led to terrible indexing speeds, missing metadata, and awful social media link previews (Open Graph).

This repository was architected to solve these issues. Inside, you will find four isolated sandbox projects. Each project demonstrates the **native, architecturally correct way** to inject SEO tags, Canonical URLs, and Schema.org JSON-LD structured data into that specific framework's lifecycle.

---

## 📂 Framework Directory

Click into any of the folders below to view the dedicated documentation detailing exactly how the SEO engine was constructed for that specific technology stack.

### 1. [Next.js (App Router)](./seo-metadata-in-next)
Next.js solves SEO natively using **Server-Side Rendering (SSR)**.
* **Key Concept:** Uses the native `generateMetadata` API in `page.tsx` handlers to build precise `<title>` and Open Graph tags on the server before the browser even requests them.
* **Highlights:** Fully dynamic schema injection and programmatic `sitemap.ts` generation.
* 👉 [Read the Next.js SEO Documentation](./seo-metadata-in-next/README.md)

### 2. [Angular (Universal & SSR)](./seo-metadata-in-angular)
Angular requires manual intervention to bridge its component lifecycle with the raw DOM.
* **Key Concept:** Leverages the native `@angular/platform-browser` library utilizing a central Injectable `SeoService`.
* **Highlights:** Securely mutating `<meta>` tags and natively attaching `rel="canonical"` links across the DOM tree during Angular's hydration phase.
* 👉 [Read the Angular SEO Documentation](./seo-metadata-in-angular/README.md)

### 3. [Vue 3 (Vite + Composition API)](./seo-metadata-in-vue)
Standard Vue 3 SPAs struggle heavily with tag duplication and memory leakage during route transitions.
* **Key Concept:** We integrate the **Unhead** library (`@unhead/vue`), the undisputed industry standard for controlling the document head outside of the Nuxt ecosystem.
* **Highlights:** Uses `useSeoMeta()` and `useHead()` composables inside `<script setup>` tags for type-safe, auto-garbage-collected DOM modifications.
* 👉 [Read the Vue SEO Documentation](./seo-metadata-in-vue/README.md)

### 4. [React + Vite (CSR Context)](./seo-metadata-in-vite)
Barebones React applications require robust context providers to prevent React's async rendering threads from destroying SEO DOM mappings.
* **Key Concept:** Introduces the `<HelmetProvider>` and a custom `<SEO />` wrapper component using `react-helmet-async`.
* **Highlights:** Circumvents native React 18 Concurrent Rendering race conditions, ensuring crawlers parse injected JSON-LD schema blocks reliably.
* 👉 [Read the React (Vite) SEO Documentation](./seo-metadata-in-vite/README.md)

---

## 🏗️ Core Standardized SEO Pillars Included
Every single project inside this repository was engineered targeting the following SEO mandates:
1. **Dynamic Open Graph & Twitter Cards:** Ensuring rich link-sharing across iMessage, Slack, LinkedIn, and X/Twitter.
2. **Canonical Links (`<link rel="canonical">`):** Stopping domain dilution and preventing duplicate content errors natively.
3. **Structured Data Injection (JSON-LD):** Giving explicit `schema.org/WebSite` or `schema.org/BlogPosting` variables to Google to enable Rich Snippet Carousels.
4. **Hydration Safety:** Executing meta-tag writes without triggering memory leaks across dynamic SPA routing lifecycles.
