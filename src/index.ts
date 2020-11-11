import { Matcher, runMatcher } from './matcher'

const _cwd = process.cwd()

export const lookItUp = async (
  matcher: Matcher<false>,
  cwd = _cwd
): Promise<string | undefined> => {
  const { matched } = await runMatcher(matcher, cwd, false)
  return matched
}

const ERROR_MSG = 'Async matcher can not be used in `lookItUpSync()`'

export const lookItUpSync = (
  matcher: Matcher<true>,
  cwd = _cwd
): string | undefined => {
  if (
    typeof matcher === 'function' &&
    (matcher(cwd) as unknown) instanceof Promise
  ) {
    throw new Error(ERROR_MSG)
  }
  const { matched } = runMatcher(matcher, cwd, true)
  return matched
}

export { stop } from './matcher'
