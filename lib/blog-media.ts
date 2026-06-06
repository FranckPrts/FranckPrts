/** Path prefix for static files: `public/blog-media/{slug}/...` → `/blog-media/{slug}/...` */
export const BLOG_MEDIA_PREFIX = '/blog-media' as const

export const DEFAULT_BLOG_COVER = 'cover.webp' as const

export function blogMediaUrl(slug: string, filename: string): string {
  const safeSlug = slug.replace(/^\/+|\/+$/g, '')
  const safeFile = filename.replace(/^\/+/, '')
  return `${BLOG_MEDIA_PREFIX}/${safeSlug}/${safeFile}`
}

export function blogCoverUrl(slug: string): string {
  return blogMediaUrl(slug, DEFAULT_BLOG_COVER)
}
