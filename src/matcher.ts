import fs from 'fs'
import path from 'path'

export const stop = Symbol('stop')
const isStop = (res: MatcherFnResult): res is symbol => res === stop

type MatcherFnResult = string | undefined | symbol
type MatcherFn<S> = (
  dir: string
) => MatcherFnResult | (S extends true ? never : Promise<MatcherFnResult>)
export type Matcher<S> = string | MatcherFn<S>

const isString = <S>(m: Matcher<S>): m is string => typeof m === 'string'

interface MatchResult {
  dir?: string
  matched?: string
}
type Result<S> = S extends true ? MatchResult : Promise<MatchResult>

const notFound = <S>(): Result<S> => (({} as unknown) as Result<S>)

type LocateResult = false | MatchResult
export const locate = (path?: string): LocateResult =>
  path !== undefined && fs.existsSync(path) && { matched: path }

export const runMatcher = <S extends boolean>(
  matcher: Matcher<S>,
  dir: string,
  sync: S
): Result<S> => {
  if (dir === path.dirname(dir)) {
    return notFound()
  }

  if (isString(matcher) || sync) {
    const matcherRes = isString(matcher)
      ? path.join(dir, matcher)
      : (matcher(dir) as MatcherFnResult)

    if (isStop(matcherRes)) {
      return notFound()
    }

    const match = locate(matcherRes)
    return match === false
      ? runMatcher(matcher, path.dirname(dir), sync)
      : (match as Result<S>)
  }

  return Promise.all([matcher(dir)])
    .then(res => res[0])
    .then(matcherRes => {
      if (isStop(matcherRes)) {
        return notFound<S>()
      }
      const match = locate(matcherRes)
      return match === false
        ? runMatcher(matcher, path.dirname(dir), sync)
        : match
    }) as Result<S>
}
