'use client'

import React, { Suspense, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  BITE_REGISTRY,
  type BiteFork,
  type BiteMetadata,
} from '@/lib/bite-registry'
import { BLOG_REGISTRY } from '@/lib/blog-registry'
import { ProseContent } from '@/components/mdx/ProseContent'
import { usePanel } from '@/components/panel/PanelContext'

type BiteMdxModule = {
  default: React.ComponentType
  metadata?: BiteMetadata
}

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

function ContentBody({ Content }: { Content: React.ComponentType }) {
  return (
    <ProseContent context="bite">
      <Content />
    </ProseContent>
  )
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
  const [Content, setContent] = useState<React.ComponentType | null>(null)
  const [forks, setForks] = useState<BiteFork[]>(() => entry?.forks ?? [])
  const [relatedPost, setRelatedPost] = useState<string | undefined>(
    () => entry?.relatedPost,
  )
  const [error, setError] = useState(!entry)

  useEffect(() => {
    const next = BITE_REGISTRY[id]
    if (!next) {
      setError(true)
      setContent(null)
      setForks([])
      setRelatedPost(undefined)
      return
    }

    setForks(next.forks ?? [])
    setRelatedPost(next.relatedPost)
    setContent(null)
    setError(false)

    let cancelled = false
    next
      .component()
      .then((mod) => {
        if (cancelled) return
        const m = mod as BiteMdxModule
        setContent(() => m.default)
        const metaForks = normalizeForks(m.metadata?.forks)
        if (metaForks !== null) setForks(metaForks)
        if (typeof m.metadata?.relatedPost === 'string') {
          const related = m.metadata.relatedPost.trim()
          if (related) setRelatedPost(related)
        }
        setError(false)
      })
      .catch(() => {
        if (!cancelled) setError(true)
      })

    return () => {
      cancelled = true
    }
  }, [id])

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
    <div className="flex min-h-0 w-full flex-col overflow-hidden rounded-3xl bg-white dark:bg-zinc-950 tonal:bg-[var(--tonal-surface)]">
      <div className="flex flex-shrink-0 items-center justify-between gap-3 bg-zinc-100 px-4 py-2 dark:bg-zinc-900 tonal:bg-[var(--tonal-surface)]">
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

      <div className="min-h-0 overflow-y-auto px-1 pt-3 pb-4">
        {error ? (
          <p className="p-4 text-sm text-zinc-500 dark:text-zinc-400">
            Content could not be loaded.
          </p>
        ) : !Content ? (
          <div className="flex h-24 items-center justify-center">
            <span className="text-sm text-zinc-400 dark:text-zinc-500">
              Loading…
            </span>
          </div>
        ) : (
          <Suspense
            fallback={
              <div className="flex h-24 items-center justify-center">
                <span className="text-sm text-zinc-400 dark:text-zinc-500">
                  Loading…
                </span>
              </div>
            }
          >
            <ContentBody Content={Content} />
          </Suspense>
        )}

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
