import { blogSlugFromPath } from '@/lib/blog-path'
import {
  getBite,
  getPost,
  isBiteId,
  isPostSlug,
  type BiteId,
  type PostSlug,
} from '@/lib/content'

export type ResolvedContentLink =
  | {
      kind: 'bite'
      href: string
      id: BiteId
      title: string
    }
  | {
      kind: 'panel'
      href: string
      slug: PostSlug
      title: string
    }
  | { kind: 'internal'; href: string }
  | { kind: 'external'; href: string }
  | { kind: 'static' }

/** Bite id if `linkOrId` is a key of `BITES`. */
export function resolveBiteId(linkOrId: string): BiteId | null {
  const trimmed = linkOrId.trim()
  if (!trimmed) return null
  if (isBiteId(trimmed)) return trimmed
  return null
}

/** Post slug if `linkOrSlug` is a key of `POSTS` or a `/blog/{slug}` path. */
export function resolvePanelSlug(linkOrSlug: string): PostSlug | null {
  const trimmed = linkOrSlug.trim()
  if (!trimmed) return null
  if (isPostSlug(trimmed)) return trimmed
  const slug = blogSlugFromPath(trimmed)
  if (slug !== null && isPostSlug(slug)) return slug
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
      title: getBite(biteId)!.title,
    }
  }

  const panelSlug = resolvePanelSlug(href)
  if (panelSlug !== null) {
    return {
      kind: 'panel',
      href,
      slug: panelSlug,
      title: getPost(panelSlug)!.title,
    }
  }
  if (blogSlugFromPath(href) !== null) {
    return { kind: 'internal', href }
  }
  return { kind: 'external', href }
}
