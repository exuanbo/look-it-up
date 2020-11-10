import fs from 'fs'
import path from 'path'

export const stop = Symbol('lookUp.stop')

type MatcherResult = string | undefined | typeof stop
type MatcherFn<S> = (
  dir: string
) => S extends true ? MatcherResult : MatcherResult | Promise<MatcherResult>
export type Matcher<S> = string | MatcherFn<S>

interface MatchResult {
  dir?: string
  matched?: string
}
type Result<S> = S extends true ? MatchResult : Promise<MatchResult>

export const locate = (
  path?: string
): false | Pick<Required<MatchResult>, 'matched'> =>
  path !== undefined && fs.existsSync(path) && { matched: path }

export const runMatcher = <S extends boolean>(
  matcher: Matcher<S>,
  dir: string,
  sync: S
): Result<S> => {
  if (dir === path.parse(dir).root) {
    if (sync) {
      return ({} as unknown) as Result<S>
    }
    return Promise.resolve({}) as Result<S>
  }

  if (typeof matcher === 'string') {
    const matcherRes = path.join(dir, matcher)
    const match = locate(matcherRes)
    if (match !== false) {
      return match as Result<S>
    }
    return runMatcher(matcher, path.dirname(dir), sync)
  }

  if (!sync) {
    const matcherRes = matcher(dir) as Promise<MatcherResult>
    return Promise.all([matcherRes])
      .then(res => res[0])
      .then(matcherRes => {
        if (matcherRes === stop) {
          return {}
        }
        const match = locate(matcherRes)
        if (match !== false) {
          return match
        }
        return runMatcher(matcher, path.dirname(dir), sync)
      }) as Result<S>
  }

  const matcherRes = matcher(dir) as MatcherResult
  if (matcherRes === stop) {
    return ({} as unknown) as Result<S>
  }
  const match = locate(matcherRes)
  if (match !== false) {
    return match as Result<S>
  }
  return runMatcher(matcher, path.dirname(dir), sync)
}
