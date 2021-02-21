# look-it-up

> Find a file or directory by walking up parent directories recursively. Zero dependency.

[![npm](https://img.shields.io/npm/v/look-it-up)](https://www.npmjs.com/package/look-it-up)
[![github workflow](https://img.shields.io/github/workflow/status/exuanbo/look-it-up/Node.js%20CI/main)](https://github.com/exuanbo/look-it-up/actions?query=workflow%3A%22Node.js+CI%22)
[![Codecov branch](https://img.shields.io/codecov/c/gh/exuanbo/look-it-up/main?token=speJkwSMKd)](https://codecov.io/gh/exuanbo/look-it-up)
[![libera manifesto](https://img.shields.io/badge/libera-manifesto-lightgrey.svg)](https://liberamanifesto.com)

## Install

```sh
npm install look-it-up
```

### Usage

```js
import fs from 'fs'
import path from 'path'
import { lookItUp, lookItUpSync } from 'look-it-up'

const isFileInDir = (file, dir) =>
  (fs.existsSync(path.join(dir, file)) && dir) || null

;(async () => {
  await lookItUp('.zshrc')
  // => '~/.zshrc'

  await lookItUp(dir => isFileInDir('.zshrc', dir))
  // => '~'

  await lookItUp(async dir => isFileInDir('.zshrc', dir))
  // => '~'
})()

lookItUpSync('.zshrc')
// -> '~/.zshrc'

lookItUpSync(dir => isFileInDir('.zshrc', dir))
// => '~'
```

## API

```ts
declare type MatcherResult = string | null | symbol
declare type Matcher =
  | string
  | ((dir: string) => MatcherResult | Promise<MatcherResult>)
declare type MatcherSync = string | ((dir: string) => MatcherResult)

declare const lookItUp: (
  matcher: Matcher,
  dir?: string
) => Promise<string | null>

declare const lookItUpSync: (
  matcher: MatcherSync,
  dir?: string
) => string | null | never

declare const stop: unique symbol

export { lookItUp, lookItUpSync, stop }
```

## License

[MIT License](https://github.com/exuanbo/look-it-up/blob/main/LICENSE) © 2020 [Exuanbo](https://github.com/exuanbo)
