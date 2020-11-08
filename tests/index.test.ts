import fs from 'fs'
import path from 'path'
import { stop, lookItUp } from '../src/index'

export const cwd = process.cwd()
export const pkgPath = path.join(cwd, 'package.json')
export const barPath = path.join(cwd, 'tests/fixtures/foo/bar')

export const dirHasFile = (dir: string, file: string): string | undefined =>
  (fs.existsSync(path.join(dir, file)) && dir) || undefined

describe('index', () => {
  it('should return package.json path', async () => {
    const result = await lookItUp('package.json', barPath)
    expect(result).toBe(pkgPath)
  })

  it('should return cwd if matcher function is provided', async () => {
    const result = await lookItUp(
      dir => dirHasFile(dir, 'package.json'),
      barPath
    )
    expect(result).toBe(cwd)
  })

  it('should return cwd if async matcher function is provided', async () => {
    const result = await lookItUp(
      async dir => await Promise.resolve(dirHasFile(dir, 'package.json')),
      barPath
    )
    expect(result).toBe(cwd)
  })

  it('should return undefined if no file is found', async () => {
    const result = await lookItUp('no_such_file')
    expect(result).toBe(undefined)
  })

  it('should stop in advance if stop is returned from matcher function', async () => {
    const result = await lookItUp(dir => {
      if (dir === cwd) {
        return stop
      }
      return dirHasFile(dir, 'package.json')
    }, barPath)
    expect(result).toBe(undefined)
  })

  it('should return undefined if cwd is provided', async () => {
    const result = await lookItUp(
      dir => dirHasFile(dir, 'package.json'),
      path.join(cwd, '..')
    )
    expect(result).toBe(undefined)
  })
})
