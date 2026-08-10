import { BLOG_REGISTRY } from '@/lib/blog-registry'
import { blogSlugFromPath } from '@/lib/blog-path'

export type ResolvedContentLink =
  | { kind: 'panel'; href: string; slug: string; title: string }
  | { kind: 'internal'; href: string }
  | { kind: 'external'; href: string }
  | { kind: 'static' }

/** Classify a href into panel / internal blog Link / external / empty. */
export function resolveContentLink(link: string): ResolvedContentLink {
  const href = link.trim()
  if (!href) return { kind: 'static' }

  const slug = blogSlugFromPath(href)
  if (slug !== null && slug in BLOG_REGISTRY) {
    return {
      kind: 'panel',
      href,
      slug,
      title: BLOG_REGISTRY[slug].title,
    }
  }
  if (slug !== null) {
    return { kind: 'internal', href }
  }
  return { kind: 'external', href }
}
