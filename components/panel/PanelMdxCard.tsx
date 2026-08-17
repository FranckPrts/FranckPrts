'use client'

import React, { Suspense, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { MaximizeIcon, NetworkIcon, XIcon } from 'lucide-react'
import { BLOG_REGISTRY, type PanelMode } from '@/lib/blog-registry'
import { cn } from '@/lib/utils'
import { TextMorph } from '@/components/ui/text-morph'
import { MagneticSocialLink } from '@/components/ui/magnetic-social-link'
import { ProseContent } from '@/components/mdx/ProseContent'

type MdxBlogModule = {
  default: React.ComponentType
  metadata?: { linkedTo?: Record<string, unknown>; panelMode?: PanelMode }
}

const MAX_LINKED_TO = 12

function normalizeLinkedTo(raw: unknown): [string, string][] {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return []
  return Object.entries(raw as Record<string, unknown>)
    .filter(([, v]) => typeof v === 'string' && v.trim().length > 0)
    .map(([k, v]) => [k, v as string])
}

function CopyButton({ id }: { id: string }) {
  const [text, setText] = useState('Copy')

  useEffect(() => {
    const timer = setTimeout(() => setText('Copy'), 2000)
    return () => clearTimeout(timer)
  }, [text])

  const handleCopy = () => {
    const url = `${window.location.origin}/blog/${id}`
    navigator.clipboard.writeText(url)
    setText('Copied')
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="flex items-center gap-1 text-sm text-zinc-400 transition-colors hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-200 tonal:text-[var(--tonal-fg-muted)] tonal:hover:text-[var(--tonal-fg)]"
    >
      <TextMorph>{text}</TextMorph>
      <span>URL</span>
    </button>
  )
}

function ContentBody({ Content }: { Content: React.ComponentType }) {
  return (
    <ProseContent context="panel">
      <Content />
    </ProseContent>
  )
}

export type PanelMdxCardProps = {
  id: string
  title: string
  onClose: () => void
  /** Called before navigating to the full blog page (e.g. close rail items). */
  onBeforeExpand?: () => void
  /** Tighter header + default shell for morph pop-outs. */
  compact?: boolean
  className?: string
}

export function PanelMdxCard({
  id,
  title,
  onClose,
  onBeforeExpand,
  compact = false,
  className,
}: PanelMdxCardProps) {
  const router = useRouter()
  const [Content, setContent] = useState<React.ComponentType | null>(null)
  const [linkEntries, setLinkEntries] = useState<[string, string][]>([])
  const [error, setError] = useState(false)
  const [linkedOpen, setLinkedOpen] = useState(false)

  useEffect(() => {
    setLinkedOpen(false)
  }, [id])

  useEffect(() => {
    const entry = BLOG_REGISTRY[id]
    if (!entry) {
      setError(true)
      return
    }
    let cancelled = false
    entry
      .component()
      .then((mod) => {
        if (cancelled) return
        const m = mod as MdxBlogModule
        setContent(() => m.default)
        setLinkEntries(normalizeLinkedTo(m.metadata?.linkedTo).slice(0, MAX_LINKED_TO))
        setError(false)
      })
      .catch(() => {
        if (!cancelled) setError(true)
      })
    return () => {
      cancelled = true
    }
  }, [id])

  const hasLinks = linkEntries.length > 0

  const handleExpand = () => {
    onBeforeExpand?.()
    onClose()
    router.push(`/blog/${id}`)
  }

  return (
    <div
      className={cn(
        'flex min-h-0 w-full flex-col overflow-hidden rounded-3xl border border-zinc-100 bg-white dark:border-zinc-800 dark:bg-zinc-950 tonal:border-[var(--tonal-border)] tonal:bg-[var(--tonal-surface)]',
        className,
      )}
    >
      {linkedOpen && hasLinks ? (
        <div className="w-full flex-shrink-0 border-b border-zinc-200/60 bg-zinc-100/50 px-4 py-2 backdrop-blur-sm dark:border-zinc-800/60 dark:bg-zinc-900/50 tonal:border-[var(--tonal-border)] tonal:bg-[var(--tonal-surface-sun)]/60">
          <div
            className="grid w-full justify-start gap-2"
            style={{
              gridAutoFlow: 'column',
              gridTemplateRows: 'repeat(2, auto)',
              gridAutoColumns: 'max-content',
            }}
          >
            {linkEntries.map(([label, url]) => (
              <MagneticSocialLink key={`${label}-${url}`} link={url}>
                <span>{label}</span>
              </MagneticSocialLink>
            ))}
          </div>
        </div>
      ) : null}

      <div
        className={cn(
          'flex flex-shrink-0 items-center justify-between gap-3 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 tonal:border-[var(--tonal-border)] tonal:bg-[var(--tonal-surface)]',
          compact ? 'px-4 py-2' : 'px-4 py-3',
        )}
      >
        <h2 className="line-clamp-1 min-w-0 flex-1 text-m font-medium text-zinc-800 dark:text-zinc-200 tonal:text-[var(--tonal-fg-muted)]">
          {title}
        </h2>
        <div className="flex flex-shrink-0 items-center gap-2">
          <CopyButton id={id} />
          <button
            type="button"
            onClick={handleExpand}
            aria-label={`Open ${title} full page`}
            className="rounded-md p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 tonal:text-[var(--tonal-fg-muted)] tonal:hover:bg-[var(--tonal-surface-raised)] tonal:hover:text-[var(--tonal-fg)]"
          >
            <MaximizeIcon size={15} />
          </button>
          {hasLinks ? (
            <button
              type="button"
              onClick={() => setLinkedOpen((o) => !o)}
              aria-expanded={linkedOpen}
              aria-label={linkedOpen ? 'Hide linked pages' : 'Show linked pages'}
              className={`rounded-md p-1 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 tonal:hover:bg-[var(--tonal-surface-raised)] tonal:hover:text-[var(--tonal-fg)] ${
                linkedOpen
                  ? 'text-zinc-700 dark:text-zinc-200 tonal:text-[var(--tonal-fg)]'
                  : 'text-zinc-400 tonal:text-[var(--tonal-fg-muted)]'
              }`}
            >
              <NetworkIcon size={15} />
            </button>
          ) : null}
          <button
            type="button"
            onClick={onClose}
            aria-label={`Close ${title}`}
            className="rounded-md p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 tonal:text-[var(--tonal-fg-muted)] tonal:hover:bg-[var(--tonal-surface-raised)] tonal:hover:text-[var(--tonal-fg)]"
          >
            <XIcon size={15} />
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-1 pt-4">
        {error ? (
          <p className="p-4 text-sm text-zinc-500 dark:text-zinc-400">
            Content could not be loaded.
          </p>
        ) : !Content ? (
          <div className="flex h-32 items-center justify-center">
            <span className="text-sm text-zinc-400 dark:text-zinc-500">Loading…</span>
          </div>
        ) : (
          <Suspense
            fallback={
              <div className="flex h-32 items-center justify-center">
                <span className="text-sm text-zinc-400 dark:text-zinc-500">Loading…</span>
              </div>
            }
          >
            <ContentBody Content={Content} />
          </Suspense>
        )}
      </div>
    </div>
  )
}
