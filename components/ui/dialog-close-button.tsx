'use client'

import { XIcon } from 'lucide-react'
import { MorphingDialogClose } from '@/components/ui/morphing-dialog'

const CLOSE_VARIANTS = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { delay: 0.3, duration: 0.1 },
  },
  exit: { opacity: 0, transition: { duration: 0 } },
}

/** Fixed top-right close for MorphingDialog pop-ups (bites, media zoom). */
export function DialogCloseButton() {
  return (
    <MorphingDialogClose
      className="fixed top-6 right-6 h-fit w-fit rounded-full bg-white p-1 tonal:bg-[var(--tonal-surface-raised)]"
      variants={CLOSE_VARIANTS}
    >
      <XIcon className="h-5 w-5 text-zinc-500" />
    </MorphingDialogClose>
  )
}
