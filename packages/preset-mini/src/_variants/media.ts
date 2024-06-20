import type { VariantContext, VariantObject } from '@unocss/core'
import type { Theme } from '../theme'
import { h, variantGetParameter, variantParentMatcher } from '../utils'

export const variantPrint: VariantObject = variantParentMatcher('print', '@media print')

export const variantCustomMedia: VariantObject = {
  name: 'media',
  match(matcher, ctx: VariantContext<Theme>) {
    const variant = variantGetParameter('media-', matcher, ctx.generator.config.separators)
    if (variant) {
      const [match, rest] = variant

      let media = h.bracket(match) ?? ''
      if (media === '')
        media = ctx.theme.media?.[match] ?? ''

      if (media) {
        return {
          matcher: rest,
          handle: (input, next) => next({
            ...input,
            parent: `${input.parent ? `${input.parent} $$ ` : ''}@media ${media}`,
          }),
        }
      }
    }

    const separatorIndex = matcher.indexOf(':')

    if (separatorIndex === -1)
      return

    const prefix = matcher.slice(0, separatorIndex)
    const rest = matcher.slice(separatorIndex + 1)

    // @ts-expect-error fixme: types
    const breakpointRaw = ctx.theme.breakpoints?.[prefix]?.raw
    if (!breakpointRaw)
      return
    return {
      matcher: rest,
      handle: (input, next) => next({
        ...input,
        parent: `${input.parent ? `${input.parent} $$ ` : ''}@media ${breakpointRaw}`,
      }),
    }
  },
  multiPass: true,
}
