'use client'

import { useEffect, useState } from 'react'
import { TextMorph } from '@/components/ui/text-morph'

const DEFAULT_CLASS =
  'flex items-center gap-1 text-sm text-zinc-400 transition-colors hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-200 tonal:text-[var(--tonal-fg-muted)] tonal:hover:text-[var(--tonal-fg)]'

type CopyUrlButtonProps = {
  /** Site path to copy (e.g. `/blog/{slug}`); omit to copy the current page URL. */
  path?: string
  /** Replaces the default classes. */
  className?: string
}

export function CopyUrlButton({
  path,
  className = DEFAULT_CLASS,
}: CopyUrlButtonProps) {
  const [text, setText] = useState('Copy')

  useEffect(() => {
    if (text === 'Copy') return
    const timer = setTimeout(() => setText('Copy'), 2000)
    return () => clearTimeout(timer)
  }, [text])

  const handleCopy = () => {
    // Read at click time: the blog layout persists across post navigations.
    const url = path ? `${window.location.origin}${path}` : window.location.href
    navigator.clipboard
      .writeText(url)
      .then(() => setText('Copied'))
      .catch(() => {
        // Clipboard blocked (permission or insecure context): keep the label.
      })
  }

  return (
    <button type="button" onClick={handleCopy} className={className}>
      <TextMorph>{text}</TextMorph>
      <span>URL</span>
    </button>
  )
}
