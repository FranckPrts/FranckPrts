import React from 'react'

/** Presentation mode for registered MDX. MDX `metadata.panelMode` is canonical; registry is the pre-load mirror. */
export type PanelMode = 'bite' | 'window'

export const DEFAULT_PANEL_MODE: PanelMode = 'window'

export function resolvePanelMode(value: unknown): PanelMode {
  return value === 'bite' ? 'bite' : DEFAULT_PANEL_MODE
}

export type BlogRegistryEntry = {
  title: string
  /**
   * How this post opens from chips / cards.
   * `bite` → MorphingDialog pop-out; `window` → right rail. Omit → `window`.
   * Keep in sync with MDX `metadata.panelMode`.
   */
  mode?: PanelMode
  component: () => Promise<{ default: React.ComponentType }>
}

export const BLOG_REGISTRY: Record<string, BlogRegistryEntry> = {
  'my-role-at-mindhive': {
    title: 'What I spend the most time on',
    mode: 'bite',
    component: () => import('@/app/blog/my-role-at-mindhive/page.mdx'),
  },
  'neuro-theater-eeg-worshop-jhu-mica-2026': {
    title: 'Neurotheater — EEG streams for a live performance',
    mode: 'bite',
    component: () => import('@/app/blog/neuro-theater-eeg-worshop-jhu-mica-2026/page.mdx'),
  },
  'neuro-theater-eeg-performance-dc-2026': {
    title: "'hyper_object' a neuro-theater live performance",
    component: () => import('@/app/blog/neuro-theater-eeg-performance-dc-2026/page.mdx'),
  },
}
