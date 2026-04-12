# SEO & Metadata in Vue.js (Unhead)

This repository demonstrates how to handle standard Client-Side Routing metadata injection into the DOM head safely using modern Vue 3 setups.

## How SEO Works in Vue SPA
Vue applications built on Vite are traditionally Single Page Applications (SPAs). Without a framework like Nuxt doing SSG (Static Site Generation), a web crawler will only analyze the standard `index.html` file, seeing no information about the specific dynamic page requested. 

While Googlebot can now execute JavaScript and eventually parse CSR applications, it drastically delays indexability indexing and relies on perfect loading speeds. To prepare your Vue components for web crawlers (and to enable rich social-media link sharing across the web), we use `@unhead/vue`.

### Implementations in this Project:

1. **Unhead Integration (`src/main.ts`)**
   - We installed `@unhead/vue`, generated a `createUnhead()` context, and passed it natively to `app.use()`. Unhead solves the extremely common bug where SPAs "leak" memory and duplicate meta tags continuously when navigating between routes. 

2. **Declarative Route SEO (`src/views/HomeView.vue` & `AboutView.vue`)**
   - Using the Composition API (`<script setup>`), we invoked `useSeoMeta()`. This is a strongly-typed composable function that automatically maps and inserts the `<title>`, `<meta name="description">`, and `OG Tags` directly into the DOM tree natively as soon as the component loads.
   
3. **Structured Data JSON-LD (`src/views/AboutView.vue`)**
   - Using the alternative `useHead()` composable, we explicitly defined an `application/ld+json` script tag carrying a Schema.org `Organization` layout object providing search engines with precise architectural data.

## Relevant Resources
- [Vue Unhead Official Documentation](https://unhead.unjs.io/setup/vue/installation)
- [Handling SEO in standard Vue (Vue Router Docs)](https://router.vuejs.org/guide/advanced/meta.html)
- [Why Googlebot Struggles with SPAs](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
