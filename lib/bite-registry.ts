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
    slug: 'mindhive-product-engineering',
    label: 'Product Engineer',
    blurb:
      "This is where I wear my builder's hat; full-stack platform work, from data infrastructure to the tools five user personas use every day.",
  },
  {
    slug: 'mindhive-core-research',
    label: 'Core Researcher',
    blurb:
      "I design and run experimental validation protocols for physiological data collection tool validation and ensure MindHive's NSF-funded data stewardship and enable the tool to collect critical data for core research work.",
  },
  {
    slug: 'mindhive-lead-implementation',
    label: 'Lead Implementation Coordinator',
    blurb:
      "I guarantee MindHive's DOE and IRB compliance, cross-team leadership, and program delivery across 60+ deployments worldwide.",
  },
]

const NEUROTHEATER_FORKS: BiteFork[] = [
  {
    slug: 'neuro-theater-eeg-performance-dc-2026',
    label: 'Hyper_Object — JHU Bloomberg Center, DC',
    blurb:
      "I engineered the live EEG pipeline behind hyper_object, streaming performer and audience brain signals in real time to drive the show's generative visuals and sound — performed at the JHU Bloomberg Center.",
  },
  {
    slug: 'neuro-theater-eeg-worshop-jhu-mica-2026',
    label: 'JHU-MICA Workshop — Baltimore',
    blurb:
      'I designed the hardware and software architecture for an EEG system linking performer and audience signals to every artistic department, during a week-long technical residency at the JHU/MICA Film Centre.',
  },
]

export const BITE_REGISTRY: Record<string, BiteRegistryEntry> = {
  mindhive: {
    title: 'MindHive',
    relatedPost: 'mindhive-product-engineering',
    forks: MINDHIVE_FORKS,
    component: () => import('@/content/bites/mindhive.mdx'),
  },
  'neuro-theater-eeg-worshop-jhu-mica-2026': {
    title: 'Neurotheater',
    relatedPost: 'neuro-theater-eeg-performance-dc-2026',
    forks: NEUROTHEATER_FORKS,
    component: () =>
      import('@/content/bites/neuro-theater-eeg-worshop-jhu-mica-2026.mdx'),
  },
}
