import { cn } from '@/lib/utils'

export const PROSE_WIDE = 'not-prose prose-wide'

const SHARED_PROSE =
  'prose prose-gray prose-measure prose-h1:text-xl prose-h1:font-medium prose-h2:text-lg prose-h2:font-medium prose-h3:text-base prose-h3:font-medium prose-h4:font-medium prose-strong:font-medium dark:prose-invert tonal:prose-invert'

const CONTEXT_VARIANTS = {
  panel: 'pb-10 prose-h2:mt-10',
  article:
    'mt-24 pb-20 prose-h4:prose-base prose-h2:mt-12 prose-h2:scroll-m-20 prose-h5:text-base prose-h5:font-medium prose-h6:text-base prose-h6:font-medium',
} as const

type ProseContentProps = {
  children: React.ReactNode
  className?: string
  context: keyof typeof CONTEXT_VARIANTS
}

export function ProseContent({
  children,
  className,
  context,
}: ProseContentProps) {
  const Wrapper = context === 'article' ? 'main' : 'div'

  return (
    <Wrapper className={cn('prose-content px-4', className)}>
      <div className={cn(SHARED_PROSE, CONTEXT_VARIANTS[context])}>
        {children}
      </div>
    </Wrapper>
  )
}
