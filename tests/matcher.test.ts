import path from 'path'
import { cwd, pkgPath, barPath, dirHasFile } from './index.test'
import * as macher from '../src/matcher'
import { stop, matchExist, runMatcher } from '../src/matcher'

const mockRunMatcher = jest.spyOn(macher, 'runMatcher')

describe('matchExist', () => {
  it('should return Result if path exists', () => {
    const pathToTest = pkgPath
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
    const result = await runMatcher('package.json', { dir: barPath })
    expect(result).toEqual({ matched: pkgPath })
  })

  it('should be called 5 times to find package.json', async () => {
    await macher.runMatcher('package.json', { dir: barPath })

    expect(mockRunMatcher).toHaveBeenCalledTimes(5)

    const mockCalls = mockRunMatcher.mock.calls
    expect(mockCalls[0]).toEqual(['package.json', { dir: barPath }])
    expect(mockCalls[1]).toEqual([
      'package.json',
      { dir: path.join(barPath, '..') }
    ])
    expect(mockCalls[2]).toEqual([
      'package.json',
      { dir: path.join(barPath, '../..') }
    ])
    expect(mockCalls[3]).toEqual([
      'package.json',
      { dir: path.join(cwd, 'tests') }
    ])
    expect(mockCalls[4]).toEqual(['package.json', { dir: cwd }])
  })

  it('should be called 3 times if stop is returned from matcher function', async () => {
    const cb = (dir: string) => {
      if (dir === cwd) {
        return stop
      }
      return dirHasFile(dir, 'fixture')
    }

    await macher.runMatcher(cb, { dir: barPath })

    expect(mockRunMatcher).toHaveBeenCalledTimes(3)

    const mockCalls = mockRunMatcher.mock.calls
    expect(mockCalls[0]).toEqual([cb, { dir: barPath }])
    expect(mockCalls[1]).toEqual([cb, { dir: path.join(barPath, '..') }])
    expect(mockCalls[2]).toEqual([
      cb,
      { dir: path.join(cwd, 'tests/fixtures') }
    ])
  })

  it('should be called 6 times if directory is not found', async () => {
    const cb = (dir: string) => {
      if (dir === path.join(cwd, '..')) {
        return stop
      }
      return dirHasFile(dir, 'no_such_file')
    }

    await macher.runMatcher(cb, { dir: barPath })

    expect(mockRunMatcher).toHaveBeenCalledTimes(6)

    const mockCalls = mockRunMatcher.mock.calls
    expect(mockCalls[0]).toEqual([cb, { dir: barPath }])
    expect(mockCalls[1]).toEqual([cb, { dir: path.join(barPath, '..') }])
    expect(mockCalls[2]).toEqual([cb, { dir: path.join(barPath, '../..') }])
    expect(mockCalls[3]).toEqual([cb, { dir: path.join(cwd, 'tests') }])
    expect(mockCalls[4]).toEqual([cb, { dir: cwd }])
    expect(mockCalls[5]).toEqual([cb, { dir: path.join(cwd, '..') }])
  })
})
