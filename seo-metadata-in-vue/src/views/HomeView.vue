<script setup lang="ts">
import TheWelcome from '../components/TheWelcome.vue'
import { useSeoMeta, useHead } from '@unhead/vue'

useSeoMeta({
  title: 'Home - Vue SEO',
  description: 'Welcome to the home page of our Vue application.',
  ogTitle: 'Home - Vue SEO',
  ogDescription: 'Welcome to the home page of our Vue application.',
  twitterCard: 'summary_large_image',
})

useHead({
  link: [
    { rel: 'canonical', href: 'https://example.com/' }
  ]
})
</script>

<template>
  <main>
    <TheWelcome />
  </main>
</template>
