import path from 'path'
import { HOME, dirHasFile } from './index.test'
import * as macher from '../src/matcher'
import { stop, matchExist, runMatcher } from '../src/matcher'

const cwd = process.cwd()

const mockRunMatcher = jest.spyOn(macher, 'runMatcher')

describe('matchExist', () => {
  it('should return Result if path exists', () => {
    const pathToTest = path.join(cwd, 'package.json')
    const result = matchExist(pathToTest)
    expect(result).toEqual({ matched: pathToTest })
  })

  it('should return false if path does not exist', () => {
    const pathToTest = path.join(cwd, 'package-lock.json')
    const result = matchExist(pathToTest)
    expect(result).toBe(false)
  })

  it('should return false if path is undefined', () => {
    const result = matchExist()
    expect(result).toBe(false)
  })
})

describe('runMatcher', () => {
  it('should return Result if file exists', async () => {
    const result = await runMatcher('.zshrc', { dir: cwd })
    expect(result).toEqual({ matched: path.join(HOME, '.zshrc') })
  })

  it('should be called 3 times to find .zshrc', async () => {
    await macher.runMatcher('.zshrc', { dir: cwd })

    expect(mockRunMatcher).toHaveBeenCalledTimes(3)

    const mockResults = mockRunMatcher.mock.results
    expect(mockResults[0].value).toEqual(
      Promise.resolve({ dir: path.join(cwd, '..') })
    )
    expect(mockResults[1].value).toEqual(Promise.resolve({ dir: HOME }))
    expect(mockResults[2].value).toEqual(
      Promise.resolve({ matched: path.join(HOME, '.zshrc') })
    )
  })

  it('should be called twice if stop is returned from matcher function', async () => {
    await macher.runMatcher(
      dir => {
        if (dir === path.join(cwd, '..')) {
          return stop
        }
        return dirHasFile(dir, '.zshrc')
      },
      { dir: cwd }
    )

    expect(mockRunMatcher).toHaveBeenCalledTimes(2)

    const mockResults = mockRunMatcher.mock.results
    expect(mockResults[0].value).toEqual(
      Promise.resolve({ dir: path.join(cwd, '..') })
    )
    expect(mockResults[1].value).toEqual(Promise.resolve({ dir: undefined }))
  })

  it('should be called 5 times if file is not found', async () => {
    await macher.runMatcher('.nvm', { dir: cwd })

    expect(mockRunMatcher).toHaveBeenCalledTimes(5)

    const mockResults = mockRunMatcher.mock.results
    expect(mockResults[0].value).toEqual(
      Promise.resolve({ dir: path.join(cwd, '..') })
    )
    expect(mockResults[1].value).toEqual(Promise.resolve({ dir: HOME }))
    expect(mockResults[2].value).toEqual(
      Promise.resolve({ dir: path.join(HOME, '..') })
    )
    expect(mockResults[3].value).toEqual(Promise.resolve({ dir: '/User' }))
    expect(mockResults[4].value).toEqual(Promise.resolve({ dir: undefined }))
  })
})
