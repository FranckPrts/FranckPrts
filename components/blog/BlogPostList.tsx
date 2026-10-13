'use client'

import { Spotlight } from '@/components/ui/spotlight'
import { usePanel } from '@/components/panel/PanelContext'
import { blogMediaUrl } from '@/lib/blog-media'
import { LISTED_POSTS, type ListedPost } from '@/lib/content'

const CARD_CLASS =
  'relative block w-full cursor-pointer overflow-hidden rounded-2xl bg-zinc-300/30 p-[1px] text-left dark:bg-zinc-600/30 tonal:bg-stone-400/35'

function BlogCardInner({
  post,
  isOpen,
}: {
  post: ListedPost
  isOpen?: boolean
}) {
  return (
    <div
      className={
        post.cover
          ? 'flex flex-row items-start gap-4'
          : 'flex flex-col space-y-1'
      }
    >
      {post.cover ? (
        <div className="relative aspect-video w-28 shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900 tonal:bg-[var(--tonal-surface-raised)]">
          <img
            src={blogMediaUrl(post.slug, post.cover.file)}
            alt={post.cover.alt}
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
          {post.cardDescription ?? post.description}
        </p>
      </div>
    </div>
  )
}

/** Spotlight border + card body; must be a direct child of the card element. */
function BlogCardFrame({ post, isOpen }: { post: ListedPost; isOpen?: boolean }) {
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

/** Opens the post in the right rail. */
function BlogPostCard({ post }: { post: ListedPost }) {
  const { open: openPanel, items } = usePanel()
  const isOpen = items.some((item) => item.id === post.slug)

  return (
    <button
      type="button"
      data-id={post.slug}
      onClick={() => openPanel({ id: post.slug, title: post.title })}
      className={CARD_CLASS}
    >
      <BlogCardFrame post={post} isOpen={isOpen} />
    </button>
  )
}

export function BlogPostList() {
  return (
    <div className="flex flex-col space-y-2">
      {LISTED_POSTS.map((post) => (
        <BlogPostCard key={post.slug} post={post} />
      ))}
    </div>
  )
}
