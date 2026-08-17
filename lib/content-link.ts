import {
  BLOG_REGISTRY,
  resolvePanelMode,
  type PanelMode,
} from '@/lib/blog-registry'
import { blogSlugFromPath } from '@/lib/blog-path'

export type ResolvedContentLink =
  | {
      kind: 'panel'
      href: string
      slug: string
      title: string
      /** `bite` → MorphingDialog pop-out; `window` → right rail. */
      mode: PanelMode
    }
  | { kind: 'internal'; href: string }
  | { kind: 'external'; href: string }
  | { kind: 'static' }

/** Registry slug if `linkOrSlug` is a registered id or a `/blog/{slug}` path. */
export function resolvePanelSlug(linkOrSlug: string): string | null {
  const trimmed = linkOrSlug.trim()
  if (!trimmed) return null
  if (trimmed in BLOG_REGISTRY) return trimmed
  const slug = blogSlugFromPath(trimmed)
  if (slug !== null && slug in BLOG_REGISTRY) return slug
  return null
}

/** Classify a href into panel / internal blog Link / external / empty. */
export function resolveContentLink(link: string): ResolvedContentLink {
  const href = link.trim()
  if (!href) return { kind: 'static' }

  const panelSlug = resolvePanelSlug(href)
  if (panelSlug !== null) {
    return {
      kind: 'panel',
      href,
      slug: panelSlug,
      title: BLOG_REGISTRY[panelSlug].title,
      mode: resolvePanelMode(BLOG_REGISTRY[panelSlug].mode),
    }
  }
  if (blogSlugFromPath(href) !== null) {
    return { kind: 'internal', href }
  }
  return { kind: 'external', href }
}
