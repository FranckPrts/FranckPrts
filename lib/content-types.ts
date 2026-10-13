import type { ComponentType } from 'react'

/** Lazy import of an MDX file, e.g. `() => import('@/app/blog/{slug}/page.mdx')`. */
export type MdxLoader = () => Promise<{ default: ComponentType }>

/** One blog post. Keyed by slug: `app/blog/{slug}/page.mdx`, `/blog/{slug}`. */
export type PostEntry = {
  title: string
  /** SEO / social description; also the homepage card text by default. */
  description: string
  /** Homepage card text when it should differ from `description`. */
  cardDescription?: string
  /** Show as a card in the homepage blog list. */
  listed: boolean
  /** Card thumbnail under `public/blog-media/{slug}/`; default social image. */
  cover?: { file: string; alt: string }
  /** Social image under `public/blog-media/{slug}/` when it differs from the cover. */
  ogImage?: string
  /** Label → URL, shown behind the rail's linked-pages toggle. */
  linkedTo?: Record<string, string>
  load: MdxLoader
}

/** Choice on a hub bite; closes the bite and opens `slug` in the right rail. */
export type BiteFork<PostSlug extends string = string> = {
  slug: PostSlug
  label: string
  blurb: string
}

/** Short MDX peek. Keyed by id: `content/bites/{id}.mdx`. */
export type BiteEntry<PostSlug extends string = string> = {
  title: string
  /** Post opened by "Read more" (full page). */
  relatedPost?: PostSlug
  forks?: BiteFork<PostSlug>[]
  load: MdxLoader
}
