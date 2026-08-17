import React from 'react'

export type BlogRegistryEntry = {
  title: string
  component: () => Promise<{ default: React.ComponentType }>
}

export const BLOG_REGISTRY: Record<string, BlogRegistryEntry> = {
  'my-role-at-mindhive': {
    title: 'What I spend the most time on',
    component: () => import('@/app/blog/my-role-at-mindhive/page.mdx'),
  },
  'neuro-theater-eeg-worshop-jhu-mica-2026': {
    title: 'Neurotheater — EEG streams for a live performance',
    component: () =>
      import('@/app/blog/neuro-theater-eeg-worshop-jhu-mica-2026/page.mdx'),
  },
  'neuro-theater-eeg-performance-dc-2026': {
    title: "'hyper_object' a neuro-theater live performance",
    component: () =>
      import('@/app/blog/neuro-theater-eeg-performance-dc-2026/page.mdx'),
  },
}
