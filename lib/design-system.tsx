import { cn } from '@/lib/utils'

/** CSS custom properties from `app/globals.css` (`:root`). */
export const ICONS = {
  github: 'var(--icon-github)',
  linkedin: 'var(--icon-linkedin)',
} as const

export type DesignIconName = keyof typeof ICONS

export function DesignIcon({
  name,
  className,
}: {
  name: DesignIconName
  className?: string
}) {
  return (
    <span
      aria-hidden
      className={cn('block bg-current', className)}
      style={{
        maskImage: ICONS[name],
        WebkitMaskImage: ICONS[name],
        maskSize: 'contain',
        WebkitMaskSize: 'contain',
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskPosition: 'center',
      }}
    />
  )
}
