import fs from 'fs'
import path from 'path'

export const stop = Symbol('stop')
const isStop = (res: MatcherFnResult): res is symbol => res === stop

type MatcherFnResult = string | undefined | symbol
type MatcherFn<S extends boolean> = (
  dir: string
) => MatcherFnResult | (S extends true ? never : Promise<MatcherFnResult>)
export type Matcher<S extends boolean> = string | MatcherFn<S>

interface MatchResult {
  dir?: string
  matched?: string
}
type Result<S extends boolean> = S extends true
  ? MatchResult
  : Promise<MatchResult>

type LocateResult = false | MatchResult
export const locate = (path?: string): LocateResult =>
  path !== undefined && fs.existsSync(path) && { matched: path }

export const runMatcher = <S extends boolean>(
  matcher: Matcher<S>,
  dir: string,
  sync: S
): Result<S> => {
  if (dir === path.dirname(dir)) {
    return ({} as unknown) as Result<S>
  }

  if (typeof matcher === 'string') {
    const matcherRes = path.join(dir, matcher)
    const match = locate(matcherRes)
    return match === false
      ? runMatcher(matcher, path.dirname(dir), sync)
      : (match as Result<S>)
  }

  if (!sync) {
    return Promise.all([matcher(dir)])
      .then(res => res[0])
      .then(matcherRes => {
        if (isStop(matcherRes)) {
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
  if (isStop(matcherRes)) {
    return ({} as unknown) as Result<S>
  }
  const match = locate(matcherRes)
  return match === false
    ? runMatcher(matcher, path.dirname(dir), sync)
    : (match as Result<S>)
}
