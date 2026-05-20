import { runGh } from './auth'
import type {
  PullRequest,
  CIState,
  ReviewDecision,
  CheckRun,
  CheckStatus,
  CheckConclusion,
  FetchPRsResponse,
} from '../shared/types'

const PR_FRAGMENT = `
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
                  startedAt
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

// Pass 1: discover repos via authored + review-requested
const DISCOVERY_QUERY = `
  query {
    authored: search(query: "is:pr is:open author:@me sort:updated-desc", type: ISSUE, first: 50) {
      nodes { ...PR }
    }
    reviewing: search(query: "is:pr is:open review-requested:@me sort:updated-desc", type: ISSUE, first: 50) {
      nodes { ...PR }
    }
  }
  ${PR_FRAGMENT}
`

// Pass 2: fetch ALL open PRs from the discovered repos
function buildAllPRsQuery(repos: string[]): string {
  const repoFilter = repos.map((r) => `repo:${r}`).join(' ')
  return `
    query {
      all: search(query: "is:pr is:open ${repoFilter} sort:updated-desc", type: ISSUE, first: 100) {
        nodes { ...PR }
      }
    }
    ${PR_FRAGMENT}
  `
}

interface RawCheckRun {
  name: string
  status: CheckStatus
  conclusion: CheckConclusion
  detailsUrl: string
  startedAt: string | null
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
  startedAt?: string | null
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

interface DiscoveryResponse {
  data?: {
    authored: { nodes: RawPR[] }
    reviewing: { nodes: RawPR[] }
  }
  errors?: Array<{ message: string }>
}

interface AllPRsResponse {
  data?: {
    all: { nodes: RawPR[] }
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

  // Deduplicate by name — keep the run with the latest startedAt (most recent re-run)
  const checkRunMap = new Map<string, RawCheckRun>()
  for (const node of contextNodes) {
    if (isCheckRun(node)) {
      const existing = checkRunMap.get(node.name)
      if (!existing || (node.startedAt ?? '') > (existing.startedAt ?? '')) {
        checkRunMap.set(node.name, node)
      }
    }
  }
  const checkRuns = Array.from(checkRunMap.values()).map(normalizeCheckRun)

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

async function runQuery<T>(query: string): Promise<T> {
  const stdout = await runGh('api', 'graphql', '-f', `query=${query}`)
  return JSON.parse(stdout) as T
}

export async function fetchPRs(): Promise<FetchPRsResponse> {
  // Pass 1 — discover authored PRs and repos via review-requested
  let discovery: DiscoveryResponse
  try {
    discovery = await runQuery<DiscoveryResponse>(DISCOVERY_QUERY)
  } catch (err) {
    return { ok: false, error: `gh API error: ${err instanceof Error ? err.message : String(err)}` }
  }

  if (discovery.errors?.length) return { ok: false, error: discovery.errors[0].message }
  if (!discovery.data) return { ok: false, error: 'Empty response from GitHub API.' }

  const authored = discovery.data.authored.nodes.map(normalizePR)
  const authoredIds = new Set(authored.map((pr) => pr.id))

  // Collect all repos discovered in pass 1
  const repos = new Set([
    ...discovery.data.authored.nodes.map((pr) => pr.repository.nameWithOwner),
    ...discovery.data.reviewing.nodes.map((pr) => pr.repository.nameWithOwner),
  ])

  if (repos.size === 0) {
    return { ok: true, data: { authored, reviewing: [] } }
  }

  // Pass 2 — fetch ALL open PRs from discovered repos
  let allPRs: AllPRsResponse
  try {
    allPRs = await runQuery<AllPRsResponse>(buildAllPRsQuery(Array.from(repos)))
  } catch {
    // If pass 2 fails, fall back to pass 1 review-requested results
    const reviewing = discovery.data.reviewing.nodes
      .map(normalizePR)
      .filter((pr) => !authoredIds.has(pr.id))
    return { ok: true, data: { authored, reviewing } }
  }

  if (!allPRs.data) {
    return { ok: true, data: { authored, reviewing: [] } }
  }

  // REVIEWING = all open PRs from those repos, minus the ones you authored
  const reviewing = allPRs.data.all.nodes
    .map(normalizePR)
    .filter((pr) => !authoredIds.has(pr.id))

  return { ok: true, data: { authored, reviewing } }
}
