/// <reference types="vite/client" />

import type { CheckAuthResult, FetchPRsResponse } from '@shared/types'

declare global {
  interface Window {
    api: {
      checkAuth: () => Promise<CheckAuthResult>
      fetchPRs: () => Promise<FetchPRsResponse>
      openPR: (url: string) => Promise<void>
      setFloat: (enabled: boolean) => Promise<void>
      quit: () => Promise<void>
    }
  }
}
