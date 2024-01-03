import { expect, it } from 'vitest'
import { createGenerator } from '@unocss/core'
import { h } from '../_utils/index.js'
import { variantPseudoClassesAndElements } from './pseudo'

// https://github.com/unocss/unocss/issues/2713
it('pseudo variant order', async () => {
  const uno = createGenerator({
    variants: [
      variantPseudoClassesAndElements(),
    ],
    rules: [
      [/^foo-(\d)$/, ([_, a]) => ({ text: `foo-${a}` })],
    ],
  })

  const css = await uno.generate([
    'foo-1',
    'hover:foo-2',
    'focus:foo-3',
    'disabled:foo-4',
  ]).then(r => r.css)

  expect(css.indexOf('foo-1')).toBeLessThan(css.indexOf('foo-2'))
  expect(css.indexOf('foo-2')).toBeLessThan(css.indexOf('foo-3'))
  expect(css.indexOf('foo-3')).toBeLessThan(css.indexOf('foo-4'))
  expect(css)
    .toMatchInlineSnapshot(`
      "/* layer: default */
      .foo-1{text:foo-1;}
      .hover\\:foo-2:hover{text:foo-2;}
      .focus\\:foo-3:focus{text:foo-3;}
      .disabled\\:foo-4:disabled{text:foo-4;}"
    `)

  const css2 = await uno.generate([
    'foo-1',
    'hover:foo-1',
    'focus:foo-1',
    'disabled:foo-1',
  ]).then(r => r.css)

  expect(css2)
    .toMatchInlineSnapshot(`
      "/* layer: default */
      .foo-1{text:foo-1;}
      .hover\\:foo-1:hover{text:foo-1;}
      .focus\\:foo-1:focus{text:foo-1;}
      .disabled\\:foo-1:disabled{text:foo-1;}"
    `)
})

// https://github.com/unocss/unocss/issues/2733
it('focus-visible:', async () => {
  const uno = createGenerator({
    variants: [
      variantPseudoClassesAndElements(),
    ],
    rules: [
      [/^foo-(\d)$/, ([_, a]) => ({ text: `foo-${a}` })],
    ],
  })

  const result = await uno.generate([
    'focus-visible:foo-1',
    'focus:foo-2',
  ])

  expect(result.matched)
    .toMatchInlineSnapshot(`
      Set {
        "focus-visible:foo-1",
        "focus:foo-2",
      }
    `)

  expect(result.css)
    .toMatchInlineSnapshot(`
      "/* layer: default */
      .focus\\:foo-2:focus{text:foo-2;}
      .focus-visible\\:foo-1:focus-visible{text:foo-1;}"
    `)
})

it('before: and after: includes empty content for tailwind compat', async () => {
  const uno = createGenerator({
    variants: [
      variantPseudoClassesAndElements(),
    ],
    rules: [
      [/^content-(.+)$/, ([, v]) => ({ content: h.bracket.cssvar(v) })],
      ['content-empty', { content: '""' }],
      ['content-none', { content: 'none' }],
      [/^foo-(\d)$/, ([_, a]) => ({ text: `foo-${a}` })],
    ],
  })

  const result = await uno.generate([
    'before:foo-1',
    'after:foo-1',
    'before:content-none',
  ])

  expect(result.matched)
    .toMatchInlineSnapshot(`
      Set {
        "before:content-none",
        "before:foo-1",
        "after:foo-1",
      }
    `)

  expect(result.css)
    .toMatchInlineSnapshot(`
      "/* layer: default */
      .before\\\\:content-none::before{content:\\"\\";content:none;}
      .before\\\\:foo-1::before{content:\\"\\";text:foo-1;}
      .after\\\\:foo-1::after{content:\\"\\";text:foo-1;}"
    `)
})
