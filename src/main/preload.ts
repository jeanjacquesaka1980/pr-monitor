import { contextBridge, ipcRenderer } from 'electron'
import type { CheckAuthResult, FetchPRsResponse, Preferences, WorkflowRun } from '../shared/types'

contextBridge.exposeInMainWorld('api', {
  checkAuth: (): Promise<CheckAuthResult> => ipcRenderer.invoke('auth:check'),
  fetchPRs: (): Promise<FetchPRsResponse> => ipcRenderer.invoke('prs:fetch'),
  openPR: (url: string): Promise<void> => ipcRenderer.invoke('shell:openExternal', url),
  setFloat: (enabled: boolean): Promise<void> => ipcRenderer.invoke('window:setFloat', enabled),
  quit: (): Promise<void> => ipcRenderer.invoke('app:quit'),
  getPrefs: (): Promise<Preferences> => ipcRenderer.invoke('prefs:get'),
  setPrefs: (prefs: Preferences): Promise<void> => ipcRenderer.invoke('prefs:set', prefs),
  getVersion: (): Promise<string> => ipcRenderer.invoke('app:version'),
  checkUpdate: (): Promise<{ hasUpdate: boolean; latestVersion: string }> => ipcRenderer.invoke('app:check-update'),
  listRepos: (): Promise<string[]> => ipcRenderer.invoke('repos:list'),
  fetchWorkflowRuns: (repos: string[]): Promise<WorkflowRun[]> => ipcRenderer.invoke('workflows:fetch', repos),
})
