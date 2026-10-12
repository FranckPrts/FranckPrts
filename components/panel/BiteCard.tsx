'use client'

import { useRouter } from 'next/navigation'
import { BITE_REGISTRY, type BiteFork } from '@/lib/bite-registry'
import { BLOG_REGISTRY } from '@/lib/blog-registry'
import { MdxModuleContent } from '@/components/mdx/MdxModuleContent'
import { usePanel } from '@/components/panel/PanelContext'
import { useMdxModule } from '@/hooks/useMdxModule'

function normalizeForks(raw: unknown): BiteFork[] | null {
  if (!Array.isArray(raw)) return null
  const forks: BiteFork[] = []
  for (const item of raw) {
    if (!item || typeof item !== 'object' || Array.isArray(item)) continue
    const rec = item as Record<string, unknown>
    if (
      typeof rec.slug === 'string' &&
      rec.slug.trim() &&
      typeof rec.label === 'string' &&
      rec.label.trim() &&
      typeof rec.blurb === 'string' &&
      rec.blurb.trim()
    ) {
      forks.push({
        slug: rec.slug.trim(),
        label: rec.label.trim(),
        blurb: rec.blurb.trim(),
      })
    }
  }
  return forks
}

export type BiteCardProps = {
  id: string
  title: string
  onClose: () => void
}

export function BiteCard({ id, title, onClose }: BiteCardProps) {
  const router = useRouter()
  const { open: openPanel } = usePanel()
  const entry = BITE_REGISTRY[id]
  const mdx = useMdxModule(entry?.component)
  const metadata = mdx.status === 'ready' ? mdx.metadata : undefined

  // MDX metadata wins once loaded; the registry mirror covers the first paint.
  const forks = normalizeForks(metadata?.forks) ?? entry?.forks ?? []
  const metaRelatedPost =
    typeof metadata?.relatedPost === 'string' ? metadata.relatedPost.trim() : ''
  const relatedPost = metaRelatedPost || entry?.relatedPost

  const heading = entry?.title ?? title

  const handleExpand = () => {
    if (!relatedPost) return
    onClose()
    router.push(`/blog/${relatedPost}`)
  }

  const handleFork = (slug: string) => {
    const post = BLOG_REGISTRY[slug]
    if (!post) return
    onClose()
    openPanel({ id: slug, title: post.title })
  }

  return (
    <div className="h-fit w-full overflow-hidden rounded-3xl bg-white dark:bg-zinc-950 tonal:bg-[var(--tonal-surface)]">
      <div className="flex items-center justify-between gap-3 bg-zinc-100 px-4 py-2 dark:bg-zinc-900 tonal:bg-[var(--tonal-surface)]">
        <h2 className="line-clamp-1 min-w-0 flex-1 text-base font-medium text-zinc-800 dark:text-zinc-200 tonal:text-[var(--tonal-fg)]">
          {heading}
        </h2>
        {relatedPost ? (
          <button
            type="button"
            onClick={handleExpand}
            className="flex-shrink-0 text-sm text-zinc-400 transition-colors hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-200 tonal:text-[var(--tonal-fg-muted)] tonal:hover:text-[var(--tonal-fg)]"
          >
            Read more
          </button>
        ) : null}
      </div>

      <div className="px-1 pt-3 pb-4">
        <MdxModuleContent
          state={mdx}
          context="bite"
          placeholderClassName="h-24"
        />

        {forks.length > 0 ? (
          <div className="flex flex-col gap-2 px-4 pt-2">
            {forks.map((fork) => (
              <button
                key={`${fork.slug}-${fork.label}`}
                type="button"
                onClick={() => handleFork(fork.slug)}
                className="w-full rounded-xl bg-zinc-100 px-4 py-3 text-left transition-colors hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 tonal:bg-[var(--tonal-surface-raised)] tonal:hover:bg-[var(--tonal-surface-sunken)]"
              >
                <span className="block text-base font-medium leading-6 text-zinc-800 dark:text-zinc-100 tonal:text-[var(--tonal-fg)]">
                  {fork.label}
                </span>
                <span className="mt-0.5 block text-base text-zinc-500 dark:text-zinc-400 tonal:text-[var(--tonal-fg-muted)]">
                  {fork.blurb}
                </span>
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}
