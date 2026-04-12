<script setup lang="ts">
import { useSeoMeta, useHead } from '@unhead/vue'

/**
 * useSeoMeta is a Vue composable from strictly typed '@unhead/vue'.
 * It efficiently handles 90% of SEO metadata requirements (Open Graph, standard meta).
 * Since Vue apps render on the client, unhead intelligently manages the DOM <head> tags
 * to avoid duplication when routing between pages.
 */
useSeoMeta({
  title: 'About Us - Vue SEO',
  description: 'Learn more about our Vue application and its features.',
  ogDescription: 'Learn more about our Vue application and its features.',
  ogTitle: 'About Us - Vue SEO',
  twitterCard: 'summary_large_image',
})

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
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
