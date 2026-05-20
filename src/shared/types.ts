export type CIState =
  | 'SUCCESS'
  | 'FAILURE'
  | 'PENDING'
  | 'ERROR'
  | 'EXPECTED'
  | 'STALE'
  | null

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
