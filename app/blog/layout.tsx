'use client'
import { ScrollProgress } from '@/components/ui/scroll-progress'
import { ProseContent } from '@/components/mdx/ProseContent'
import { CopyUrlButton } from '@/components/ui/copy-url-button'

export default function LayoutBlogPost({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <div className="pointer-events-none fixed left-0 top-0 z-10 h-12 w-full bg-gray-100 to-transparent backdrop-blur-xl [-webkit-mask-image:linear-gradient(to_bottom,black,transparent)] dark:bg-zinc-950 tonal:bg-[var(--tonal-surface)]" />
      <ScrollProgress
        className="fixed top-0 z-20 h-0.5 bg-gray-300 dark:bg-zinc-600 tonal:bg-[var(--tonal-progress)]"
        springOptions={{
          bounce: 0,
        }}
      />

      <div className="absolute right-4 top-24">
        <CopyUrlButton className="font-base flex items-center gap-1 text-center text-sm text-zinc-500 transition-colors dark:text-zinc-400 tonal:text-[var(--tonal-fg-muted)]" />
      </div>
      <ProseContent context="article">{children}</ProseContent>
    </>
  )
}
