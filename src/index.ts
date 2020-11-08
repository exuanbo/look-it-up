import { Matcher, runMatcher } from './matcher'

export const lookItUp = async (
  matcher: Matcher,
  cwd = process.cwd()
): Promise<string | undefined> => {
  const result = await runMatcher(matcher, cwd, false)
  return result.matched
}

export const lookItUpSync = (
  matcher: Matcher,
  cwd = process.cwd()
): string | undefined => {
  const result = runMatcher(matcher, cwd, true)
  return result.matched
}

export { stop } from './matcher'
