/// <reference types="vite/client" />

import type { CheckAuthResult, FetchPRsResponse, Preferences, WorkflowRun } from '@shared/types'

declare global {
  interface Window {
    api: {
      checkAuth: () => Promise<CheckAuthResult>
      fetchPRs: () => Promise<FetchPRsResponse>
      openPR: (url: string) => Promise<void>
      setFloat: (enabled: boolean) => Promise<void>
      quit: () => Promise<void>
      getPrefs: () => Promise<Preferences>
      setPrefs: (prefs: Preferences) => Promise<void>
      getVersion: () => Promise<string>
      checkUpdate: () => Promise<{ hasUpdate: boolean; latestVersion: string }>
      listRepos: () => Promise<string[]>
      fetchWorkflowRuns: (repos: string[]) => Promise<WorkflowRun[]>
    }
  }
}
