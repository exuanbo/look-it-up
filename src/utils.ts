import { promises as fs } from 'fs'
import { dirname } from 'path'
import type { MatcherResult } from './types'

export const exists = async (path: string): Promise<boolean> => {
  try {
    await fs.access(path)
    return true
  } catch {
    return false
  }
}

export const isRoot = (dir: string): boolean => dir === dirname(dir)

export const stop = Symbol('stop')

export const isStop = (res: MatcherResult): res is symbol => res === stop
