import React, { Suspense } from 'react'
import { ProseContent } from '@/components/mdx/ProseContent'
import type { MdxModuleState } from '@/hooks/useMdxModule'
import { cn } from '@/lib/utils'

type MdxModuleContentProps = {
  state: MdxModuleState
  context: React.ComponentProps<typeof ProseContent>['context']
  /** Height of the loading placeholder (e.g. `h-24`). */
  placeholderClassName: string
}

function LoadingPlaceholder({ className }: { className: string }) {
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <span className="text-sm text-zinc-400 dark:text-zinc-500">
        Loading…
      </span>
    </div>
  )
}

/** Error / loading / prose states for an MDX module from `useMdxModule`. */
export function MdxModuleContent({
  state,
  context,
  placeholderClassName,
}: MdxModuleContentProps) {
  if (state.status === 'error') {
    return (
      <p className="p-4 text-sm text-zinc-500 dark:text-zinc-400">
        Content could not be loaded.
      </p>
    )
  }

  if (state.status === 'loading') {
    return <LoadingPlaceholder className={placeholderClassName} />
  }

  const { Content } = state
  return (
    <Suspense fallback={<LoadingPlaceholder className={placeholderClassName} />}>
      <ProseContent context={context}>
        <Content />
      </ProseContent>
    </Suspense>
  )
}
