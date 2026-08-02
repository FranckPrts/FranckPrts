/** Slug segment for `/blog/{slug}` paths; null if not an internal blog URL. */
export function blogSlugFromPath(link: string): string | null {
  const trimmed = link.trim()
  if (!trimmed.startsWith('/blog/')) return null
  const slug = trimmed.slice('/blog/'.length).replace(/\/+$/, '')
  return slug.length > 0 ? slug : null
}
