import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  canonicalUrl: string;
  ogType?: string;
  ogImage?: string;
  jsonLd?: Record<string, any>;
}

/**
 * React SEO Component mapping tags to react-helmet-async.
 * In a traditional React SPA, page changes do not alert search engines because the HTML shell doesn't change.
 * Helmet reaches up to the document <head> and overrides tags reliably.
 * 'react-helmet-async' is preferred over 'react-helmet' to avoid thread blocking in concurrent React loading states.
 */
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
      
      {/* 
        JSON-LD Structured Data 
        Injects the schema inside a script tag for crawlers to understand page structure natively.
      */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
}
