import React from 'react'

export type BiteFork = {
  /** `BLOG_REGISTRY` slug opened in the right rail after the bite closes. */
  slug: string
  label: string
  blurb: string
}

export type BiteMetadata = {
  title?: string
  relatedPost?: string
  forks?: BiteFork[]
}

export type BiteRegistryEntry = {
  title: string
  /**
   * Blog slug to open on maximize. Keep in sync with MDX `metadata.relatedPost`.
   */
  relatedPost?: string
  /** Pre-load mirror of MDX `metadata.forks`. */
  forks?: BiteFork[]
  component: () => Promise<{
    default: React.ComponentType
    metadata?: BiteMetadata
  }>
}





const MINDHIVE_FORKS: BiteFork[] = [
  {
    slug: "mindhive-product-engineering",
    label: 'UX researcher and product developer',
    blurb:
      'I design and ship the platform educators and students use to run real studies.',
  },
  {
    slug: "mindhive-core-research",
    label: 'Core researcher',
    blurb: 'I help run studies, protocols, and analysis for the research team.',
  },
  {
    slug: "mindhive-lead-implementation",
    label: 'Lead program coordinator',
    blurb: 'I coordinate programs that put classroom science into the field.',
  },
]

export const BITE_REGISTRY: Record<string, BiteRegistryEntry> = {
  mindhive: {
    title: 'MindHive',
    relatedPost: "mindhive-product-engineering",
    forks: MINDHIVE_FORKS,
    component: () => import('@/content/bites/mindhive.mdx'),
  },
  'neuro-theater-eeg-worshop-jhu-mica-2026': {
    title: 'Neurotheater — EEG streams for a live performance',
    relatedPost: 'neuro-theater-eeg-worshop-jhu-mica-2026',
    component: () =>
      import('@/content/bites/neuro-theater-eeg-worshop-jhu-mica-2026.mdx'),
  },
}
