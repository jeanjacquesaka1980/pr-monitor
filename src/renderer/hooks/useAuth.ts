import { useState, useEffect } from 'react'
import type { AuthStatus } from '@shared/types'

interface AuthState {
  status: AuthStatus
  username: string | undefined
}

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({ status: 'unknown', username: undefined })

  useEffect(() => {
    window.api.checkAuth().then((result) => {
      setState({ status: result.status, username: result.username })
    })
  }, [])

  return state
}
