import { existsSync } from 'fs'
import { dirname, join } from 'path'
import { isRoot, isStop } from './utils'
import type { MatcherSync } from './types'

export const lookItUpSync = (
  matcher: MatcherSync,
  dir: string = process.cwd()
): string | null | never => {
  if (typeof matcher === 'function' && (matcher(dir) as unknown) instanceof Promise) {
    throw new Error('Async matcher can not be used in `lookItUpSync`')
  }

  if (typeof matcher === 'string') {
    const targetPath = join(dir, matcher)
    return existsSync(targetPath)
      ? targetPath
      : isRoot(dir)
      ? null
      : lookItUpSync(matcher, dirname(dir))
  }

  const matcherResult = matcher(dir)
  if (isStop(matcherResult)) {
    return null
  }
  return matcherResult ?? (isRoot(dir) ? null : lookItUpSync(matcher, dirname(dir)))
}
