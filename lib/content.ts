import type { Metadata } from 'next'
import { BITES, POSTS, type BiteId, type PostSlug } from '@/app/data'
import { blogMediaUrl } from '@/lib/blog-media'
import type { BiteEntry, PostEntry } from '@/lib/content-types'

export type { BiteId, PostSlug }

const posts: Record<PostSlug, PostEntry> = POSTS
const bites: Record<BiteId, BiteEntry<PostSlug>> = BITES

export function isPostSlug(id: string): id is PostSlug {
  return Object.hasOwn(posts, id)
}

export function isBiteId(id: string): id is BiteId {
  return Object.hasOwn(bites, id)
}

export function getPost(slug: string): PostEntry | undefined {
  return isPostSlug(slug) ? posts[slug] : undefined
}

export function getBite(id: string): BiteEntry<PostSlug> | undefined {
  return isBiteId(id) ? bites[id] : undefined
}

export type ListedPost = PostEntry & { slug: PostSlug }

/** Posts shown on the homepage, in `POSTS` order. */
export const LISTED_POSTS: ListedPost[] = (Object.keys(posts) as PostSlug[])
  .filter((slug) => posts[slug].listed)
  .map((slug) => ({ ...posts[slug], slug }))

/** SEO metadata for a post page: `export const metadata = postMetadata('{slug}')`. */
export function postMetadata(slug: PostSlug): Metadata {
  const post = posts[slug]
  const imageFile = post.ogImage ?? post.cover?.file
  const images = imageFile ? [blogMediaUrl(slug, imageFile)] : undefined

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${slug}` },
    ...(images && {
      openGraph: { images },
      twitter: { card: 'summary_large_image', images },
    }),
  }
}
