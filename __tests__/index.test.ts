import path from 'path'
import { stop, lookItUp, lookItUpSync } from '../src'
import { CWD, PKG_PATH, BAR_PATH, isFileInDir } from './utils'

const hasPkgJson = (dir: string): string | null =>
  isFileInDir('package.json', dir)

describe('lookItUp', () => {
  it('should return package.json path', async () => {
    const result = await lookItUp('package.json', BAR_PATH)
    expect(result).toBe(PKG_PATH)
  })

  it('should return CWD if matcher function is provided', async () => {
    const result = await lookItUp(dir => hasPkgJson(dir), BAR_PATH)
    expect(result).toBe(CWD)
  })

  it('should return CWD if async matcher function is provided', async () => {
    const result = await lookItUp(async dir => hasPkgJson(dir), BAR_PATH)
    expect(result).toBe(CWD)
  })

  it('should return null if no file is found', async () => {
    const result = await lookItUp('no_such_file')
    expect(result).toBe(null)
  })

  it('should stop in advance if stop is returned from matcher function', async () => {
    const result = await lookItUp(dir => {
      if (dir === CWD) {
        return stop
      }
      return hasPkgJson(dir)
    }, BAR_PATH)
    expect(result).toBe(null)
  })

  it('should return null if dir is provided', async () => {
    const result = await lookItUp(dir => hasPkgJson(dir), path.join(CWD, '..'))
    expect(result).toBe(null)
  })
})

describe('lookItUpSync', () => {
  it('should return package.json path', () => {
    const result = lookItUpSync('package.json', BAR_PATH)
    expect(result).toBe(PKG_PATH)
  })

  it('should return CWD if matcher function is provided', () => {
    const result = lookItUpSync(dir => hasPkgJson(dir), BAR_PATH)
    expect(result).toBe(CWD)
  })

  it('should return null if no file is found', () => {
    const result = lookItUpSync('no_such_file')
    expect(result).toBe(null)
  })

  it('should stop in advance if stop is returned from matcher function', () => {
    const result = lookItUpSync(dir => {
      if (dir === CWD) {
        return stop
      }
      return hasPkgJson(dir)
    }, BAR_PATH)
    expect(result).toBe(null)
  })

  it('should return null if dir is provided', () => {
    const result = lookItUpSync(dir => hasPkgJson(dir), path.join(CWD, '..'))
    expect(result).toBe(null)
  })

  it('should throw an error if async matcher is provided', () => {
    expect.assertions(1)
    try {
      lookItUpSync(
        // @ts-expect-error throw new Error(ERROR_MSG)
        async (dir: string) => hasPkgJson(dir),
        path.join(CWD, '..')
      )
    } catch (err) {
      expect(err.message).toBe(
        'Async matcher can not be used in `lookItUpSync`'
      )
    }
  })
})
