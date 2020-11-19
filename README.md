# look-it-up

> Find a file or directory by walking up parent directories recursively. Zero dependency.

[![npm](https://img.shields.io/npm/v/look-it-up?style=flat-square)](https://www.npmjs.com/package/look-it-up)
[![github workflow](https://img.shields.io/github/workflow/status/exuanbo/look-it-up/Node.js%20CI/main?style=flat-square)](https://github.com/exuanbo/look-it-up/actions?query=workflow%3A%22Node.js+CI%22)
[![codecov](https://img.shields.io/codecov/c/gh/exuanbo/look-it-up?style=flat-square&token=speJkwSMKd)](https://codecov.io/gh/exuanbo/look-it-up)

## Install

```sh
npm install look-it-up
```

### Usage

```js
import fs from 'fs'
import path from 'path'
import { lookItUp, lookItUpSync } from 'look-it-up'

const dirHasFile = (dir, file) =>
  (fs.existsSync(path.join(dir, file)) && dir) || undefined

;(async () => {
  await lookItUp('.zshrc') // => '~/.zshrc'

  await lookItUp(dir => dirHasFile(dir, '.zshrc')) // => '~'

  await lookItUp(async dir => dirHasFile(dir, '.zshrc')) // => '~'
})()

lookItUpSync('.zshrc') // -> '~/.zshrc'

lookItUpSync(dir => dirHasFile(dir, '.zshrc')) // => '~'
```

## API

```ts
declare const stop: unique symbol

declare type MatcherFnResult = string | undefined | symbol
declare type MatcherFn<S> = (dir: string) =>
  MatcherFnResult | (S extends true ? never : Promise<MatcherFnResult>)
declare type Matcher<S> = string | MatcherFn<S>

declare const lookItUp: (
  matcher: Matcher<false>,
  cwd?: string
) => Promise<string | undefined>

declare const lookItUpSync: (
  matcher: Matcher<true>,
  cwd?: string
) => string | undefined

export { lookItUp, lookItUpSync, stop }
```

## Todo

- [ ] Documentation

## License

[MIT License](https://github.com/exuanbo/look-it-up/blob/main/LICENSE) © 2020 [Exuanbo](https://github.com/exuanbo)
