'use client'

import { getMermaidInitializeConfig } from '@/lib/mermaid-site-theme'
import { useTheme } from 'next-themes'
import { useEffect, useId, useRef } from 'react'

type MermaidBlockProps = {
  source: string
}

export function MermaidBlock({ source }: MermaidBlockProps) {
  const ref = useRef<HTMLDivElement>(null)
  const baseId = useId().replace(/:/g, '')
  const { resolvedTheme } = useTheme()
  const trimmed = source.trim()

  useEffect(() => {
    if (!trimmed) return
    const host = ref.current
    if (!host) return

    let cancelled = false

    void (async () => {
      const mermaid = (await import('mermaid')).default
      mermaid.initialize(getMermaidInitializeConfig(resolvedTheme))
      const graphId = `mermaid-${baseId}`
      try {
        const { svg } = await mermaid.render(graphId, trimmed)
        if (!cancelled && ref.current) {
          ref.current.innerHTML = svg
        }
      } catch {
        if (!cancelled && ref.current) {
          ref.current.textContent = 'Diagram could not be rendered.'
        }
      }
    })()

    return () => {
      cancelled = true
      if (host) host.innerHTML = ''
    }
  }, [trimmed, resolvedTheme, baseId])

  if (!trimmed) return null

  return (
    <div
      ref={ref}
      className="my-6 w-full overflow-x-auto [&_svg]:h-auto [&_svg]:max-w-full"
      role="img"
      aria-label="Mermaid diagram"
    />
  )
}
