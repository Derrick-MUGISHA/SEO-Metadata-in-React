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

/**
 * SeoService acts as a centralized manager for all Angular SEO operations.
 * Since Angular is often a SPA (Single Page Application), page transitions don't reload the <html> document.
 * This service hooks into Angular's Meta and Title APIs to dynamically rewrite the <head> 
 * on every route change, ensuring that search engines analyzing the DOM get the correct context.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  constructor(
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private doc: Document
  ) {}

  /**
   * Updates standard SEO tags and Open Graph representations.
   * Open Graph (og:) tags dictate how the page appears when pasted into social media or messengers.
   */
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

  /**
   * Sets the canonical URL to prevent SEO dilution from duplicate parameters (e.g. ?utm_source=xyz or /page/ vs /page).
   * It creates or updates the <link rel="canonical" href="..."> natively in the DOM.
   */
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

  /**
   * Injects JSON-LD (Schema.org) structured data into the <head>.
   * This is read by search engines to understand complex relationships in your data
   * (e.g. Products, Articles, Breadcrumbs) to display Rich Snippets in search results.
   */
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
