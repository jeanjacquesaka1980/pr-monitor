export type CIState =
  | 'SUCCESS'
  | 'FAILURE'
  | 'PENDING'
  | 'ERROR'
  | 'EXPECTED'
  | 'STALE'
  | null

export type CheckStatus = 'QUEUED' | 'IN_PROGRESS' | 'COMPLETED' | 'WAITING' | 'PENDING' | 'REQUESTED'

export type CheckConclusion =
  | 'SUCCESS'
  | 'FAILURE'
  | 'CANCELLED'
  | 'SKIPPED'
  | 'TIMED_OUT'
  | 'ACTION_REQUIRED'
  | 'NEUTRAL'
  | 'STALE'
  | null

export interface CheckRun {
  name: string
  status: CheckStatus
  conclusion: CheckConclusion
  detailsUrl: string
  workflowName: string | null
}

export interface PRRepository {
  nameWithOwner: string
}

export interface PRAuthor {
  login: string
  avatarUrl: string
}

export type ReviewDecision =
  | 'APPROVED'
  | 'CHANGES_REQUESTED'
  | 'REVIEW_REQUIRED'
  | null

export interface UnresolvedComments {
  bots: number
  humans: number
}

export interface PullRequest {
  id: string
  number: number
  title: string
  url: string
  isDraft: boolean
  updatedAt: string
  repository: PRRepository
  author: PRAuthor
  reviewDecision: ReviewDecision
  ciState: CIState
  checkRuns: CheckRun[]
  unresolvedComments: UnresolvedComments
}

export interface PRData {
  authored: PullRequest[]
  reviewing: PullRequest[]
}

export type AuthStatus = 'authenticated' | 'unauthenticated' | 'unknown'

export interface FetchPRsResult {
  ok: true
  data: PRData
}

export interface FetchPRsError {
  ok: false
  error: string
}

export type FetchPRsResponse = FetchPRsResult | FetchPRsError

export interface CheckAuthResult {
  status: AuthStatus
  username?: string
}

export interface Preferences {
  launchAtLogin: boolean
  startMinimised: boolean
  hiddenRepos: string[]
  watchedUsers: string[]
  showUnresolvedComments: boolean
}
