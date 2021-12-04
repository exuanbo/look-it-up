import { dirname, join } from 'path'
import { exists, isRoot, isStop } from './utils'
import type { Matcher } from './types'

export const lookItUp = async (matcher: Matcher, dir = process.cwd()): Promise<string | null> => {
  if (typeof matcher === 'string') {
    const targetPath = join(dir, matcher)
    return (await exists(targetPath))
      ? targetPath
      : isRoot(dir)
      ? null
      : await lookItUp(matcher, dirname(dir))
  }

  const matcherResult = await matcher(dir)
  return isStop(matcherResult)
    ? null
    : matcherResult ?? (isRoot(dir) ? null : await lookItUp(matcher, dirname(dir)))
}
