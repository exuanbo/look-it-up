import path from 'path'
import { stop, lookItUp, lookItUpSync } from '../src'
import { CWD, PKG_PATH, BAR_PATH, doesDirHaveFile } from './utils'

describe('lookItUp', () => {
  it('should return package.json path', async () => {
    const result = await lookItUp('package.json', BAR_PATH)
    expect(result).toBe(PKG_PATH)
  })

  it('should return CWD if matcher function is provided', async () => {
    const result = await lookItUp(
      dir => doesDirHaveFile(dir, 'package.json'),
      BAR_PATH
    )
    expect(result).toBe(CWD)
  })

  it('should return CWD if async matcher function is provided', async () => {
    const result = await lookItUp(
      async dir => doesDirHaveFile(dir, 'package.json'),
      BAR_PATH
    )
    expect(result).toBe(CWD)
  })

  it('should return undefined if no file is found', async () => {
    const result = await lookItUp('no_such_file')
    expect(result).toBe(undefined)
  })

  it('should stop in advance if stop is returned from matcher function', async () => {
    const result = await lookItUp(dir => {
      if (dir === CWD) {
        return stop
      }
      return doesDirHaveFile(dir, 'package.json')
    }, BAR_PATH)
    expect(result).toBe(undefined)
  })

  it('should return undefined if dir is provided', async () => {
    const result = await lookItUp(
      dir => doesDirHaveFile(dir, 'package.json'),
      path.join(CWD, '..')
    )
    expect(result).toBe(undefined)
  })
})

describe('lookItUpSync', () => {
  it('should return package.json path', () => {
    const result = lookItUpSync('package.json', BAR_PATH)
    expect(result).toBe(PKG_PATH)
  })

  it('should return CWD if matcher function is provided', () => {
    const result = lookItUpSync(
      dir => doesDirHaveFile(dir, 'package.json'),
      BAR_PATH
    )
    expect(result).toBe(CWD)
  })

  it('should return undefined if no file is found', () => {
    const result = lookItUpSync('no_such_file')
    expect(result).toBe(undefined)
  })

  it('should stop in advance if stop is returned from matcher function', () => {
    const result = lookItUpSync(dir => {
      if (dir === CWD) {
        return stop
      }
      return doesDirHaveFile(dir, 'package.json')
    }, BAR_PATH)
    expect(result).toBe(undefined)
  })

  it('should return undefined if dir is provided', () => {
    const result = lookItUpSync(
      dir => doesDirHaveFile(dir, 'package.json'),
      path.join(CWD, '..')
    )
    expect(result).toBe(undefined)
  })

  it('should throw an error if async matcher is provided', () => {
    expect.assertions(1)
    try {
      lookItUpSync(
        // @ts-expect-error throw new Error(ERROR_MSG)
        async (dir: string) => doesDirHaveFile(dir, 'package.json'),
        path.join(CWD, '..')
      )
    } catch (err) {
      expect(err.message).toBe(
        'Async matcher can not be used in `lookItUpSync`'
      )
    }
  })
})
