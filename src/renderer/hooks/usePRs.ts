import { useState, useEffect, useCallback, useRef } from 'react'
import type { PRData } from '@shared/types'

const POLL_INTERVAL = 60_000

export type LoadingKind = 'manual' | 'auto' | null

interface PRsState {
  data: PRData | null
  error: string | null
  loading: boolean
  loadingKind: LoadingKind
  lastUpdated: Date | null
}

interface UsePRsResult extends PRsState {
  refresh: () => void
}

export function usePRs(enabled: boolean): UsePRsResult {
  const [state, setState] = useState<PRsState>({
    data: null,
    error: null,
    loading: false,
    loadingKind: null,
    lastUpdated: null,
  })
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const manualRef = useRef(false)

  const fetch = useCallback(async () => {
    const kind: LoadingKind = manualRef.current ? 'manual' : 'auto'
    manualRef.current = false
    setState((prev) => ({ ...prev, loading: true, loadingKind: kind, error: null }))
    const result = await window.api.fetchPRs()
    if (result.ok) {
      setState({ data: result.data, error: null, loading: false, loadingKind: null, lastUpdated: new Date() })
    } else {
      setState((prev) => ({ ...prev, error: result.error, loading: false, loadingKind: null }))
    }
  }, [])

  const refresh = useCallback(() => {
    manualRef.current = true
    fetch()
  }, [fetch])

  useEffect(() => {
    if (!enabled) return

    fetch()

    intervalRef.current = setInterval(fetch, POLL_INTERVAL)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [enabled, fetch])

  return { ...state, refresh }
}
