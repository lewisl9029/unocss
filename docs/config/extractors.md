# Extractors

Extractors are used to extract the usage of utilities from your source code.

```ts
// uno.config.ts
import { defineConfig } from 'unocss'

export default defineConfig({
  extractors: [
    // your extractors
  ],
})
```

By default [extractorSplit](https://github.com/unocss/unocss/blob/main/packages/core/src/extractors/split.ts) will always be applied, which splits the source code into tokens and directly feed to the engine.

To override the default extractors, you can use `extractorDefault` option.

```ts
// uno.config.ts
import { defineConfig } from 'unocss'

export default defineConfig({
  extractors: [
    // your extractors
  ],
  // disable the default extractor
  extractorDefault: false,
  // override the default extractor with your own
  extractorDefault: myExtractor,
})
```

For example, please check the implementation of [pug extractor](https://github.com/unocss/unocss/tree/main/packages/extractor-pug) or the [attributify extractor](https://github.com/unocss/unocss/blob/main/packages/preset-attributify/src/extractor.ts).
