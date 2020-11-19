import path from 'path'
import { cwd, pkgPath, barPath, dirHasFile } from './index.test'
import * as macher from '../src/matcher'
import { Matcher, stop, locate, runMatcher } from '../src/matcher'

const mockRunMatcher = jest.spyOn(macher, 'runMatcher')

describe('locate', () => {
  it('should return Result if path exists', () => {
    const pathToTest = pkgPath
    const result = locate(pathToTest)
    expect(result).toStrictEqual({ matched: pathToTest })
  })

  it('should return false if path does not exist', () => {
    const pathToTest = path.join(cwd, 'package-lock.json')
    const result = locate(pathToTest)
    expect(result).toBe(false)
  })

  it('should return false if path is undefined', () => {
    const result = locate()
    expect(result).toBe(false)
  })
})

describe('runMatcher', () => {
  it('should return Result if file exists', async () => {
    const result = await runMatcher('package.json', barPath, false)
    expect(result).toStrictEqual({ matched: pkgPath })
  })

  it('should be called 5 times to find package.json', async () => {
    await macher.runMatcher('package.json', barPath, false)

    expect(mockRunMatcher).toHaveBeenCalledTimes(5)

    const mockCalls = mockRunMatcher.mock.calls
    expect(mockCalls[0]).toEqual(['package.json', barPath, false])
    expect(mockCalls[1]).toEqual([
      'package.json',
      path.join(barPath, '..'),
      false
    ])
    expect(mockCalls[2]).toEqual([
      'package.json',
      path.join(barPath, '../..'),
      false
    ])
    expect(mockCalls[3]).toEqual([
      'package.json',
      path.join(cwd, '__tests__'),
      false
    ])
    expect(mockCalls[4]).toEqual(['package.json', cwd, false])
  })

  it('should be called 3 times if stop is returned from matcher function', async () => {
    const cb: Matcher<false> = (dir: string) => {
      if (dir === cwd) {
        return stop
      }
      return dirHasFile(dir, 'fixture')
    }

    await macher.runMatcher(cb, barPath, false)

    expect(mockRunMatcher).toHaveBeenCalledTimes(3)

    const mockCalls = mockRunMatcher.mock.calls
    expect(mockCalls[0]).toEqual([cb, barPath, false])
    expect(mockCalls[1]).toEqual([cb, path.join(barPath, '..'), false])
    expect(mockCalls[2]).toEqual([
      cb,
      path.join(cwd, '__tests__/fixtures'),
      false
    ])
  })

  it('should be called 6 times if directory is not found', async () => {
    const cb: Matcher<false> = (dir: string) => {
      if (dir === path.join(cwd, '..')) {
        return stop
      }
      return dirHasFile(dir, 'no_such_file')
    }

    await macher.runMatcher(cb, barPath, false)

    expect(mockRunMatcher).toHaveBeenCalledTimes(6)

    const mockCalls = mockRunMatcher.mock.calls
    expect(mockCalls[0]).toEqual([cb, barPath, false])
    expect(mockCalls[1]).toEqual([cb, path.join(barPath, '..'), false])
    expect(mockCalls[2]).toEqual([cb, path.join(barPath, '../..'), false])
    expect(mockCalls[3]).toEqual([cb, path.join(cwd, '__tests__'), false])
    expect(mockCalls[4]).toEqual([cb, cwd, false])
    expect(mockCalls[5]).toEqual([cb, path.join(cwd, '..'), false])
  })
})
