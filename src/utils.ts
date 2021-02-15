import path from 'path'
import { MatcherResult } from './types'

export const isRoot = (dir: string): boolean => dir === path.dirname(dir)

export const stop = Symbol('stop')
export const isStop = (res: MatcherResult): res is symbol => res === stop
