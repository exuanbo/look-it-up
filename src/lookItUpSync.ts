import fs from 'fs'
import path from 'path'
import { MatcherSync } from './types'
import { isRoot, isStop } from './utils'

export const lookItUpSync = (
  matcher: MatcherSync,
  dir: string = process.cwd()
): string | undefined | never => {
  if (
    typeof matcher === 'function' &&
    (matcher(dir) as unknown) instanceof Promise
  ) {
    throw new Error('Async matcher can not be used in `lookItUpSync`')
  }

  if (typeof matcher === 'string') {
    const targetPath = path.join(dir, matcher)
    return fs.existsSync(targetPath)
      ? targetPath
      : isRoot(dir)
      ? undefined
      : lookItUpSync(matcher, path.dirname(dir))
  }

  const matcherResult = matcher(dir)
  if (isStop(matcherResult)) {
    return undefined
  }
  return (
    matcherResult ??
    (isRoot(dir) ? undefined : lookItUpSync(matcher, path.dirname(dir)))
  )
}
