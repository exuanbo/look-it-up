import { existsSync } from 'fs'
import { join } from 'path'

export const CWD = process.cwd()
export const PKG_PATH = join(CWD, 'package.json')
export const BAR_PATH = join(CWD, '__tests__/fixtures/foo/bar')

export const isFileInDir = (file: string, dir: string): string | null =>
  existsSync(join(dir, file)) ? dir : null
