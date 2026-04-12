# SEO & Metadata in Angular (SSR / Universal)

This repository demonstrates how to implement dynamic SEO tagging and structured data across an Angular application using server-side rendering conventions.

## How SEO Works in Angular
Historically, Angular is a Client-Side Rendering (CSR) framework. This means Googlebot originally sees a shell like `<app-root></app-root>` instead of content. Modern Angular offsets this using SSR (Server-Side Rendering). However, even with SSR, Angular doesn't instinctively update the DOM `<head>` tags when users click around between routes.

To fix this, we have to leverage the `@angular/platform-browser` libraries safely using an injected Service, bridging the gap between Angular's component lifecycle and the raw DOM layer.

### Implementations in this Project:

1. **The Centralized `SeoService` (`src/app/services/seo.service.ts`)**
   - We created a dedicated Angular Service acting as a wrapper for Angular's native `Title` and `Meta` services.
   - This service is responsible for updating document `<title>` strings and overwriting `og:title`, `og:description`, and `twitter:card` metatags efficiently without duplicating DOM entities.

2. **Canonical Links (`src/app/services/seo.service.ts`)**
   - Because Angular's standard `Meta` service doesn't cover `<link>` tags, we injected the native `DOCUMENT` context directly into the `SeoService` to safely parse and append `rel="canonical"` nodes natively on route transitions.

3. **JSON-LD Injection (`src/app/app.ts`)**
   - Through the `SeoService`, we enabled `setJsonLd()`. When the `app-root` initializes (`ngOnInit`), it generates a Schema.org `application/ld+json` Script tag allowing Google to understand the application explicitly.

## Relevant Resources
- [Angular Official Docs: Title Service](https://angular.io/api/platform-browser/Title)
- [Angular Official Docs: Meta Service](https://angular.io/api/platform-browser/Meta)
- [Angular SSR Execution and Hydration](https://angular.dev/guide/ssr)
- [Schema.org Official Vocabulary Definitions](https://schema.org/)
