import { promises as fs } from 'fs'
import { dirname, join } from 'path'
import { Matcher } from './types'
import { isRoot, isStop } from './utils'

const exists = async (path: string): Promise<boolean> =>
  await fs
    .access(path)
    .then(() => true)
    .catch(() => false)

export const lookItUp = async (
  matcher: Matcher,
  dir: string = process.cwd()
): Promise<string | null> => {
  if (typeof matcher === 'string') {
    const targetPath = join(dir, matcher)
    return (await exists(targetPath))
      ? targetPath
      : isRoot(dir)
      ? null
      : await lookItUp(matcher, dirname(dir))
  }

  const matcherResult = await matcher(dir)
  if (isStop(matcherResult)) {
    return null
  }
  return matcherResult ?? (isRoot(dir) ? null : await lookItUp(matcher, dirname(dir)))
}
