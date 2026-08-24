import React from 'react'

export type BlogRegistryEntry = {
  title: string
  component: () => Promise<{ default: React.ComponentType }>
}

export const BLOG_REGISTRY: Record<string, BlogRegistryEntry> = {
  'mindhive-product-engineering': {
    title: 'What I spend the most time on',
    component: () => import('@/app/blog/mindhive-product-engineering/page.mdx'),
  },
  'mindhive-core-research': {
    title: 'Core research at MindHive',
    component: () => import('@/app/blog/mindhive-core-research/page.mdx'),
  },
  'mindhive-lead-implementation': {
    title: 'Lead implementation at MindHive',
    component: () =>
      import('@/app/blog/mindhive-lead-implementation/page.mdx'),
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
