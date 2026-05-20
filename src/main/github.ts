import { runGh } from './auth'
import type {
  PRData,
  PullRequest,
  CIState,
  ReviewDecision,
  CheckRun,
  CheckStatus,
  CheckConclusion,
  FetchPRsResponse,
} from '../shared/types'

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
          statusCheckRollup {
            state
            contexts(first: 30) {
              nodes {
                ... on CheckRun {
                  name
                  status
                  conclusion
                  detailsUrl
                  checkSuite {
                    workflowRun {
                      workflow { name }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`

interface RawCheckRun {
  name: string
  status: CheckStatus
  conclusion: CheckConclusion
  detailsUrl: string
  checkSuite: {
    workflowRun: {
      workflow: { name: string }
    } | null
  } | null
}

interface RawContextNode {
  name?: string
  status?: CheckStatus
  conclusion?: CheckConclusion
  detailsUrl?: string
  checkSuite?: {
    workflowRun: { workflow: { name: string } } | null
  } | null
}

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
        statusCheckRollup: {
          state: CIState
          contexts: { nodes: RawContextNode[] }
        } | null
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

function isCheckRun(node: RawContextNode): node is RawCheckRun {
  return typeof node.name === 'string' && typeof node.status === 'string'
}

function normalizeCheckRun(raw: RawCheckRun): CheckRun {
  return {
    name: raw.name,
    status: raw.status,
    conclusion: raw.conclusion,
    detailsUrl: raw.detailsUrl,
    workflowName: raw.checkSuite?.workflowRun?.workflow?.name ?? null,
  }
}

function normalizePR(raw: RawPR): PullRequest {
  const commit = raw.commits.nodes[0]?.commit ?? null
  const rollup = commit?.statusCheckRollup ?? null
  const contextNodes = rollup?.contexts?.nodes ?? []
  const checkRuns = contextNodes.filter(isCheckRun).map(normalizeCheckRun)

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
    checkRuns,
  }
}

export async function fetchPRs(): Promise<FetchPRsResponse> {
  let stdout: string
  try {
    stdout = await runGh('api', 'graphql', '-f', `query=${QUERY}`)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return { ok: false, error: `gh API error: ${message}` }
  }

  let json: GraphQLResponse
  try {
    json = JSON.parse(stdout) as GraphQLResponse
  } catch {
    return { ok: false, error: 'Failed to parse GitHub API response.' }
  }

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
