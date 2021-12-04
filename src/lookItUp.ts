import fs from 'fs'
import path from 'path'
import { Matcher } from './types'
import { isRoot, isStop } from './utils'

export const lookItUp = async (
  matcher: Matcher,
  dir: string = process.cwd()
): Promise<string | null> => {
  if (typeof matcher === 'string') {
    const targetPath = path.join(dir, matcher)
    return fs.existsSync(targetPath)
      ? targetPath
      : isRoot(dir)
      ? null
      : await lookItUp(matcher, path.dirname(dir))
  }

  const matcherResult = await matcher(dir)
  if (isStop(matcherResult)) {
    return null
  }
  return matcherResult ?? (isRoot(dir) ? null : await lookItUp(matcher, path.dirname(dir)))
}
