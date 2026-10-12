import { useEffect, useState, type ComponentType } from 'react'

export type MdxModule<Meta> = {
  default: ComponentType
  metadata?: Meta
}

export type MdxModuleState<Meta> =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; Content: ComponentType; metadata?: Meta }

/**
 * Loads a registry MDX module (`BLOG_REGISTRY[id].component`,
 * `BITE_REGISTRY[id].component`). Pass the registry loader itself so it stays
 * stable across renders; `undefined` (unknown id) resolves to `error`.
 */
export function useMdxModule<Meta = unknown>(
  load: (() => Promise<MdxModule<Meta>>) | undefined,
): MdxModuleState<Meta> {
  const [state, setState] = useState<MdxModuleState<Meta>>(
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
        if (cancelled) return
        setState({
          status: 'ready',
          Content: mod.default,
          metadata: mod.metadata,
        })
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
