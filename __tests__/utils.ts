import fs from 'fs'
import path from 'path'

export const CWD = process.cwd()
export const PKG_PATH = path.join(CWD, 'package.json')
export const BAR_PATH = path.join(CWD, '__tests__/fixtures/foo/bar')

export const doesDirHaveFile = (
  dir: string,
  file: string
): string | undefined =>
  (fs.existsSync(path.join(dir, file)) && dir) || undefined
