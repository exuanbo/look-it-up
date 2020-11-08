# look-it-up

> Find a file or directory by walking up parent directories recursively. Zero dependency.

[![npm](https://img.shields.io/npm/v/look-it-up?style=flat-square)](https://www.npmjs.com/package/look-it-up)
[![github workflow](https://img.shields.io/github/workflow/status/exuanbo/look-it-up/Node.js%20CI/main?style=flat-square)](https://github.com/exuanbo/look-it-up/actions?query=workflow%3A%22Node.js+CI%22)
[![codecov](https://img.shields.io/codecov/c/gh/exuanbo/look-it-up?style=flat-square&token=speJkwSMKd)](https://codecov.io/gh/exuanbo/look-it-up)

## Install

```sh
npm install look-it-up
```

## API

```ts
declare const stop: unique symbol
declare type MatcherResult = string | undefined | typeof stop
declare type MatcherFn = (dir: string) => Promise<MatcherResult> | MatcherResult
declare type Matcher = string | MatcherFn

declare const lookItUp: (
  matcher: Matcher,
  cwd?: string | undefined
) => Promise<string | undefined>

export { lookItUp, stop }
```

### Example

```js
import { strictEqual } from 'assert'
import fs from 'fs'
import os from 'os'
import path from 'path'
import { lookItUp } from '.'

;(async () => {
  const result = await lookItUp('.zshrc')
  strictEqual(result, path.join(os.homedir(), '.zshrc'))
})()

const dirHasFile = (dir, file) =>
  (fs.existsSync(path.join(dir, file)) && dir) || undefined

;(async () => {
  const result = await lookItUp(dir => dirHasFile(dir, '.zshrc'))
  strictEqual(result, os.homedir())
})()

;(async () => {
  const result = await lookItUp(async dir =>
    Promise.resolve(dirHasFile(dir, '.zshrc'))
  )
  strictEqual(result, os.homedir())
})()
```

## License

[MIT License](https://github.com/exuanbo/look-it-up/blob/main/LICENSE) © 2020 [Exuanbo](https://github.com/exuanbo)
