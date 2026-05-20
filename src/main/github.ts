import { getToken } from './auth'
import type {
  PRData,
  PullRequest,
  CIState,
  ReviewDecision,
  FetchPRsResponse,
} from '../shared/types'

const GRAPHQL_ENDPOINT = 'https://api.github.com/graphql'

const QUERY = `
  query {
    authored: search(query: "is:pr is:open author:@me sort:updated-desc", type: ISSUE, first: 50) {
      nodes { ...PR }
    }
    reviewing: search(query: "is:pr is:open review-requested:@me sort:updated-desc", type: ISSUE, first: 50) {
      nodes { ...PR }
    }
  }
  fragment PR on PullRequest {
    id
    number
    title
    url
    isDraft
    updatedAt
    reviewDecision
    repository { nameWithOwner }
    author { login avatarUrl }
    commits(last: 1) {
      nodes {
        commit {
          statusCheckRollup { state }
        }
      }
    }
  }
`

interface RawPR {
  id: string
  number: number
  title: string
  url: string
  isDraft: boolean
  updatedAt: string
  reviewDecision: ReviewDecision
  repository: { nameWithOwner: string }
  author: { login: string; avatarUrl: string }
  commits: {
    nodes: Array<{
      commit: {
        statusCheckRollup: { state: CIState } | null
      }
    }>
  }
}

interface GraphQLResponse {
  data?: {
    authored: { nodes: RawPR[] }
    reviewing: { nodes: RawPR[] }
  }
  errors?: Array<{ message: string }>
}

function normalizePR(raw: RawPR): PullRequest {
  const rollup = raw.commits.nodes[0]?.commit?.statusCheckRollup ?? null
  return {
    id: raw.id,
    number: raw.number,
    title: raw.title,
    url: raw.url,
    isDraft: raw.isDraft,
    updatedAt: raw.updatedAt,
    reviewDecision: raw.reviewDecision,
    repository: raw.repository,
    author: raw.author,
    ciState: rollup?.state ?? null,
  }
}

export async function fetchPRs(): Promise<FetchPRsResponse> {
  const token = await getToken()
  if (!token) {
    return { ok: false, error: 'Not authenticated. Run `gh auth login` in your terminal.' }
  }

  let res: Response
  try {
    res = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: QUERY }),
    })
  } catch (err) {
    return { ok: false, error: 'Network error — check your connection.' }
  }

  if (!res.ok) {
    return { ok: false, error: `GitHub API error: ${res.status} ${res.statusText}` }
  }

  const json = (await res.json()) as GraphQLResponse

  if (json.errors?.length) {
    return { ok: false, error: json.errors[0].message }
  }

  if (!json.data) {
    return { ok: false, error: 'Empty response from GitHub API.' }
  }

  const data: PRData = {
    authored: json.data.authored.nodes.map(normalizePR),
    reviewing: json.data.reviewing.nodes.map(normalizePR),
  }

  return { ok: true, data }
}
