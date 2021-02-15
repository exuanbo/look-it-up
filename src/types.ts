export type MatcherResult = string | undefined | symbol

export type Matcher =
  | string
  | ((dir: string) => MatcherResult | Promise<MatcherResult>)

export type MatcherSync = string | ((dir: string) => MatcherResult)
