import { useState, useEffect, useCallback } from 'react'
import type { AuthStatus } from '@shared/types'

interface AuthState {
  status: AuthStatus
  username: string | undefined
  recheck: () => void
}

export function useAuth(): AuthState {
  const [state, setState] = useState<{ status: AuthStatus; username: string | undefined }>({
    status: 'unknown',
    username: undefined,
  })

  const recheck = useCallback(() => {
    setState({ status: 'unknown', username: undefined })
    window.api.checkAuth().then((result) => {
      setState({ status: result.status, username: result.username })
    })
  }, [])

  useEffect(() => {
    recheck()
  }, [recheck])

  return { ...state, recheck }
}
