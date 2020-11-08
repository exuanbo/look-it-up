import { Matcher, runMatcher } from './matcher'

const ERROR_MSG = 'Async matcher can not be used in `lookItUpSync()`'

export const lookItUp = async (
  matcher: Matcher<false>,
  cwd = process.cwd()
): Promise<string | undefined> => {
  const result = await runMatcher(matcher, cwd, false)
  return result.matched
}

export const lookItUpSync = (
  matcher: Matcher<true>,
  cwd = process.cwd()
): string | undefined => {
  if (
    typeof matcher === 'function' &&
    (matcher(cwd) as unknown) instanceof Promise
  ) {
    throw new Error(ERROR_MSG)
  }
  const result = runMatcher(matcher, cwd, true)
  return result.matched
}

export { stop } from './matcher'
