import fs from 'fs'
import path from 'path'

export const stop = Symbol('lookUp.stop')

type MatcherFnResult = string | undefined | typeof stop
type MatcherFn<S extends boolean> = (
  dir: string
) => S extends true ? MatcherFnResult : MatcherFnResult | Promise<MatcherFnResult>
export type Matcher<S extends boolean> = string | MatcherFn<S>

interface MatchResult {
  dir?: string
  matched?: string
}
type Result<S extends boolean> = S extends true ? MatchResult : Promise<MatchResult>

export const locate = (
  path?: string
): false | Pick<Required<MatchResult>, 'matched'> =>
  path !== undefined && fs.existsSync(path) && { matched: path }

export const runMatcher = <S extends boolean>(
  matcher: Matcher<S>,
  dir: string,
  sync: S
): Result<S> => {
  if (dir === path.dirname(dir)) {
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
    const matcherRes = matcher(dir) as Promise<MatcherFnResult>
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

  const matcherRes = matcher(dir) as MatcherFnResult
  if (matcherRes === stop) {
    return ({} as unknown) as Result<S>
  }
  const match = locate(matcherRes)
  if (match !== false) {
    return match as Result<S>
  }
  return runMatcher(matcher, path.dirname(dir), sync)
}
