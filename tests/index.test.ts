import fs from 'fs'
import os from 'os'
import path from 'path'
import { stop, lookUp } from '../src/index'

export const HOME = os.homedir()

export const dirHasFile = (dir: string, file: string): string | undefined =>
  (fs.existsSync(path.join(dir, file)) && dir) || undefined

describe('index', () => {
  it('should return .zshrc path', async () => {
    const result = await lookUp('.zshrc')
    expect(result).toBe(`${HOME}/.zshrc`)
  })

  it('should return home path if matcher function is provided', async () => {
    const result = await lookUp(dir => dirHasFile(dir, '.zshrc'))
    expect(result).toBe(HOME)
  })

  it('should return home path if async matcher function is provided', async () => {
    const result = await lookUp(
      async dir => await Promise.resolve(dirHasFile(dir, '.zshrc'))
    )
    expect(result).toBe(HOME)
  })

  it('should return undefined if no file is found', async () => {
    const result = await lookUp('.nvm')
    expect(result).toBe(undefined)
  })

  it('should stop in advance if stop is returned from matcher function', async () => {
    const result = await lookUp(dir => {
      if (dir === HOME) {
        return stop
      }
      return dirHasFile(dir, '.zshrc')
    })
    expect(result).toBe(undefined)
  })

  it('should return undefined if cwd is provided', async () => {
    const result = await lookUp(
      dir => dirHasFile(dir, '.zshrc'),
      path.join(HOME, '..')
    )
    expect(result).toBe(undefined)
  })
})
