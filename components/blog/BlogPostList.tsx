'use client'

import Link from 'next/link'
import { BLOG_POSTS } from '@/app/data'
import { Spotlight } from '@/components/ui/spotlight'
import { usePanel } from '@/components/panel/PanelContext'
import { resolveContentLink } from '@/lib/content-link'

type BlogPost = (typeof BLOG_POSTS)[number]

const CARD_CLASS =
  'relative block w-full cursor-pointer overflow-hidden rounded-2xl bg-zinc-300/30 p-[1px] text-left dark:bg-zinc-600/30 tonal:bg-stone-400/35'

function BlogCardInner({
  post,
  isOpen,
}: {
  post: BlogPost
  isOpen?: boolean
}) {
  return (
    <div
      className={
        post.coverImage
          ? 'flex flex-row items-start gap-4'
          : 'flex flex-col space-y-1'
      }
    >
      {post.coverImage ? (
        <div className="relative aspect-video w-28 shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900 tonal:bg-[var(--tonal-surface-raised)]">
          <img
            src={post.coverImage}
            alt={post.coverAlt ?? ''}
            className="h-full w-full object-cover"
          />
        </div>
      ) : null}
      <div className="min-w-0 flex-1 space-y-1">
        <h4 className="font-normal dark:text-zinc-100 tonal:text-[var(--tonal-fg)]">
          {post.title}
          {isOpen && (
            <span className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-zinc-400 align-middle dark:bg-zinc-500" />
          )}
        </h4>
        <p className="text-zinc-500 dark:text-zinc-400 tonal:text-[var(--tonal-fg-muted)]">
          {post.description}
        </p>
      </div>
    </div>
  )
}

/** Spotlight border + card body; must be a direct child of the card element. */
function BlogCardFrame({ post, isOpen }: { post: BlogPost; isOpen?: boolean }) {
  return (
    <>
      <Spotlight
        className="from-zinc-900 via-zinc-800 to-zinc-700 blur-2xl dark:from-zinc-100 dark:via-zinc-200 dark:to-zinc-50 tonal:from-stone-700 tonal:via-stone-600 tonal:to-stone-500"
        size={64}
      />
      <div className="relative h-full w-full rounded-[15px] bg-white p-4 dark:bg-zinc-950 tonal:bg-[var(--tonal-surface)]">
        <BlogCardInner post={post} isOpen={isOpen} />
      </div>
    </>
  )
}

/** Registered posts open in the right rail; anything else navigates. */
function BlogPostCard({ post }: { post: BlogPost }) {
  const { open: openPanel, items } = usePanel()
  const resolved = resolveContentLink(post.link)

  if (resolved.kind === 'panel') {
    const isOpen = items.some((item) => item.id === resolved.slug)
    return (
      <button
        type="button"
        data-id={post.uid}
        onClick={() => openPanel({ id: resolved.slug, title: post.title })}
        className={CARD_CLASS}
      >
        <BlogCardFrame post={post} isOpen={isOpen} />
      </button>
    )
  }

  return (
    <Link className={CARD_CLASS} href={post.link} data-id={post.uid}>
      <BlogCardFrame post={post} />
    </Link>
  )
}

export function BlogPostList() {
  return (
    <div className="flex flex-col space-y-2">
      {BLOG_POSTS.map((post) => (
        <BlogPostCard key={post.uid} post={post} />
      ))}
    </div>
  )
}
