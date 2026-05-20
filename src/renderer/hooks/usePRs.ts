import { useState, useEffect, useCallback, useRef } from 'react'
import type { PRData } from '@shared/types'

const POLL_INTERVAL = 60_000

interface PRsState {
  data: PRData | null
  error: string | null
  loading: boolean
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
    lastUpdated: null,
  })
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const fetch = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    const result = await window.api.fetchPRs()
    if (result.ok) {
      setState({ data: result.data, error: null, loading: false, lastUpdated: new Date() })
    } else {
      setState((prev) => ({ ...prev, error: result.error, loading: false }))
    }
  }, [])

  useEffect(() => {
    if (!enabled) return

    fetch()

    intervalRef.current = setInterval(fetch, POLL_INTERVAL)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [enabled, fetch])

  return { ...state, refresh: fetch }
}
