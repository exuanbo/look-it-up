import { Matcher, runMatcher } from './matcher'

export const lookUp = async (
  matcher: Matcher,
  cwd?: string
): Promise<string | undefined> => {
  const directory = cwd || process.cwd()
  const result = await runMatcher(matcher, { dir: directory })
  return result.matched
}

export { stop } from './matcher'
