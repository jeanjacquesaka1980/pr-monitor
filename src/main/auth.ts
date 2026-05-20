import { execFile } from 'child_process'
import { promisify } from 'util'
import type { AuthStatus, CheckAuthResult } from '../shared/types'

const execFileAsync = promisify(execFile)

const GH_PATH_CANDIDATES = [
  '/usr/local/bin/gh',   // Homebrew Intel
  '/opt/homebrew/bin/gh', // Homebrew Apple Silicon
  '/usr/bin/gh',
]

async function findGh(): Promise<string> {
  for (const candidate of GH_PATH_CANDIDATES) {
    try {
      await execFileAsync(candidate, ['--version'], { timeout: 5_000 })
      return candidate
    } catch {
      continue
    }
  }
  throw new Error('gh CLI not found')
}

let ghPath: string | null = null

async function runGh(...args: string[]): Promise<string> {
  if (!ghPath) ghPath = await findGh()
  const { stdout } = await execFileAsync(ghPath, args, { timeout: 10_000 })
  return stdout.trim()
}

export async function checkAuth(): Promise<CheckAuthResult> {
  try {
    const username = await runGh('api', 'user', '--jq', '.login')
    if (username) {
      return { status: 'authenticated' as AuthStatus, username }
    }
    return { status: 'unauthenticated' as AuthStatus }
  } catch {
    return { status: 'unauthenticated' as AuthStatus }
  }
}

export async function getToken(): Promise<string | null> {
  try {
    const token = await runGh('auth', 'token')
    return token || null
  } catch {
    return null
  }
}
