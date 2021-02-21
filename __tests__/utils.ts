import fs from 'fs'
import path from 'path'

export const CWD = process.cwd()
export const PKG_PATH = path.join(CWD, 'package.json')
export const BAR_PATH = path.join(CWD, '__tests__/fixtures/foo/bar')

export const isFileInDir = (file: string, dir: string): string | null =>
  (fs.existsSync(path.join(dir, file)) && dir) || null
