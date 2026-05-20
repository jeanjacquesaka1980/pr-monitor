import { contextBridge, ipcRenderer } from 'electron'
import type { CheckAuthResult, FetchPRsResponse } from '../shared/types'

contextBridge.exposeInMainWorld('api', {
  checkAuth: (): Promise<CheckAuthResult> => ipcRenderer.invoke('auth:check'),
  fetchPRs: (): Promise<FetchPRsResponse> => ipcRenderer.invoke('prs:fetch'),
  openPR: (url: string): Promise<void> => ipcRenderer.invoke('shell:openExternal', url),
  setFloat: (enabled: boolean): Promise<void> => ipcRenderer.invoke('window:setFloat', enabled),
  quit: (): Promise<void> => ipcRenderer.invoke('app:quit'),
})
