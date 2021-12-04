import { dirname } from 'path'
import { MatcherResult } from './types'

export const isRoot = (dir: string): boolean => dir === dirname(dir)

export const stop = Symbol('stop')

export const isStop = (res: MatcherResult): res is symbol => res === stop
