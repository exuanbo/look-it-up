import fs from 'fs'
import path from 'path'

export const stop = Symbol('lookUp.stop')

export const matchExist = (path?: string): false | { matched: string } =>
  path !== undefined && fs.existsSync(path) && { matched: path }

type MatcherResult = string | undefined | typeof stop

type MatcherFn = (dir: string) => Promise<MatcherResult> | MatcherResult

export type Matcher = string | MatcherFn

type Result = { dir?: string; matched?: string }

export const runMatcher = async (
  matcher: Matcher,
  { dir, matched }: Result
): Promise<Result> => {
  if (matched || !dir || dir === path.parse(dir).root) {
    return { dir: undefined, matched }
  }

  if (typeof matcher === 'string') {
    const pathToMatch = path.join(dir, matcher)
    const match = matchExist(pathToMatch)
    if (match) {
      return match
    }
  } else {
    const matchedPath = await matcher(dir)
    if (matchedPath === stop) {
      return { dir: undefined }
    }
    const match = matchExist(matchedPath)
    if (match) {
      return match
    }
  }

  return await runMatcher(matcher, { dir: path.dirname(dir) })
}
