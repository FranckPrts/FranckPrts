import { useEffect, useState, type ComponentType } from 'react'
import type { MdxLoader } from '@/lib/content-types'

export type MdxModuleState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; Content: ComponentType }

/**
 * Loads a post or bite MDX file (`getPost(slug)?.load`, `getBite(id)?.load`).
 * Pass the entry's loader itself so it stays stable across renders;
 * `undefined` (unknown id) resolves to `error`.
 */
export function useMdxModule(load: MdxLoader | undefined): MdxModuleState {
  const [state, setState] = useState<MdxModuleState>(
    load ? { status: 'loading' } : { status: 'error' },
  )

  useEffect(() => {
    if (!load) {
      setState({ status: 'error' })
      return
    }

    setState({ status: 'loading' })
    let cancelled = false
    load()
      .then((mod) => {
        if (!cancelled) setState({ status: 'ready', Content: mod.default })
      })
      .catch(() => {
        if (!cancelled) setState({ status: 'error' })
      })

    return () => {
      cancelled = true
    }
  }, [load])

  return state
}
