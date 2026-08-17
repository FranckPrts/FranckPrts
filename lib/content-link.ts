import { BITE_REGISTRY } from '@/lib/bite-registry'
import { BLOG_REGISTRY } from '@/lib/blog-registry'
import { blogSlugFromPath } from '@/lib/blog-path'

export type ResolvedContentLink =
  | {
      kind: 'bite'
      href: string
      id: string
      title: string
    }
  | {
      kind: 'panel'
      href: string
      slug: string
      title: string
    }
  | { kind: 'internal'; href: string }
  | { kind: 'external'; href: string }
  | { kind: 'static' }

/** Bite registry id if `linkOrId` is a registered bite key. */
export function resolveBiteId(linkOrId: string): string | null {
  const trimmed = linkOrId.trim()
  if (!trimmed) return null
  if (trimmed in BITE_REGISTRY) return trimmed
  return null
}

/** Registry slug if `linkOrSlug` is a registered id or a `/blog/{slug}` path. */
export function resolvePanelSlug(linkOrSlug: string): string | null {
  const trimmed = linkOrSlug.trim()
  if (!trimmed) return null
  if (trimmed in BLOG_REGISTRY) return trimmed
  const slug = blogSlugFromPath(trimmed)
  if (slug !== null && slug in BLOG_REGISTRY) return slug
  return null
}

/** Classify a href into bite / panel / internal blog Link / external / empty. */
export function resolveContentLink(link: string): ResolvedContentLink {
  const href = link.trim()
  if (!href) return { kind: 'static' }

  // Bare ids: bite before blog so a shared id (e.g. Neurotheater) opens the peek.
  const biteId = resolveBiteId(href)
  if (biteId !== null) {
    return {
      kind: 'bite',
      href,
      id: biteId,
      title: BITE_REGISTRY[biteId].title,
    }
  }

  const panelSlug = resolvePanelSlug(href)
  if (panelSlug !== null) {
    return {
      kind: 'panel',
      href,
      slug: panelSlug,
      title: BLOG_REGISTRY[panelSlug].title,
    }
  }
  if (blogSlugFromPath(href) !== null) {
    return { kind: 'internal', href }
  }
  return { kind: 'external', href }
}
