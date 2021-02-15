import fs from 'fs'
import path from 'path'
import { Matcher } from './types'
import { isRoot, isStop } from './utils'

export const lookItUp = async (
  matcher: Matcher,
  dir: string = process.cwd()
): Promise<string | undefined> => {
  if (typeof matcher === 'string') {
    const targetPath = path.join(dir, matcher)
    return fs.existsSync(targetPath)
      ? targetPath
      : isRoot(dir)
      ? undefined
      : await lookItUp(matcher, path.dirname(dir))
  }

  const matcherResult = await matcher(dir)
  if (isStop(matcherResult)) {
    return undefined
  }
  return (
    matcherResult ??
    (isRoot(dir) ? undefined : await lookItUp(matcher, path.dirname(dir)))
  )
}
