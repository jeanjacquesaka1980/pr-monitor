interface ParsedError {
  message: string
  detail: string | null
}

export function parseError(raw: string): ParsedError {
  if (/rate limit/i.test(raw)) {
    return {
      message: 'GitHub API rate limit exceeded.',
      detail: 'Wait a few minutes then refresh. Check reset time with: gh api rate_limit',
    }
  }

  if (/ENOTFOUND|ECONNREFUSED|Could not resolve host|getaddrinfo/i.test(raw)) {
    return {
      message: 'Cannot reach GitHub.',
      detail: 'Check your internet connection or corporate proxy settings.',
    }
  }

  if (/ETIMEDOUT|timed out/i.test(raw)) {
    return {
      message: 'Request timed out.',
      detail: 'GitHub may be slow or unreachable. Try refreshing.',
    }
  }

  if (/gh CLI not found/i.test(raw)) {
    return {
      message: 'GitHub CLI (gh) is not installed.',
      detail: 'Install it with: brew install gh',
    }
  }

  if (/Bad credentials|401/i.test(raw)) {
    return {
      message: 'GitHub credentials expired.',
      detail: 'Re-authenticate with: gh auth login',
    }
  }

  if (/502|503|504|Service Unavailable|Bad Gateway/i.test(raw)) {
    return {
      message: 'GitHub is temporarily unavailable.',
      detail: 'Try again in a moment.',
    }
  }

  if (/403/i.test(raw)) {
    return {
      message: 'Access denied by GitHub.',
      detail: 'You may not have permission to access one or more repositories.',
    }
  }

  // Unknown — show the raw message so nothing is silently swallowed
  return {
    message: 'An unexpected error occurred.',
    detail: raw,
  }
}
