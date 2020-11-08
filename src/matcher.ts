import fs from 'fs'
import path from 'path'

export const stop = Symbol('lookUp.stop')

export const locate = (path?: string): false | { matched: string } =>
  path !== undefined && fs.existsSync(path) && { matched: path }

type MatcherResult = string | undefined | typeof stop
type MatcherFn = (dir: string) => Promise<MatcherResult> | MatcherResult
export type Matcher = string | MatcherFn

type MatchResult = { dir?: string; matched?: string }
type Result<S> = S extends true ? MatchResult : Promise<MatchResult>

export const runMatcher = <S extends boolean>(
  matcher: Matcher,
  dir: string,
  sync: S
): Result<S> => {
  if (dir === path.parse(dir).root) {
    if (sync) {
      return {} as Result<S>
    }
    return Promise.resolve({}) as Result<S>
  }

  if (typeof matcher === 'string') {
    const pathToMatch = path.join(dir, matcher)
    const match = locate(pathToMatch)
    if (match) {
      return match as Result<S>
    }
    return runMatcher(matcher, path.dirname(dir), sync)
  }

  if (!sync) {
    const matchedPath = matcher(dir) as Promise<MatcherResult>
    return Promise.all([matchedPath])
      .then(res => res[0])
      .then(matchedPath => {
        if (matchedPath === stop) {
          return {}
        }
        const match = locate(matchedPath)
        if (match) {
          return match
        }
        return runMatcher(matcher, path.dirname(dir), sync)
      }) as Result<S>
  }

  const matchedPath = matcher(dir) as MatcherResult
  if (matchedPath === stop) {
    return {} as Result<S>
  }
  const match = locate(matchedPath)
  if (match) {
    return match as Result<S>
  }
  return runMatcher(matcher, path.dirname(dir), sync)
}
