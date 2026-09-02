import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const component = await readFile(
  new URL('../app/components/clock-focus.vue', import.meta.url),
  'utf8'
)
const clockExpression = component.match(
  /<!-- Clock -->[\s\S]*?<span[\s\S]*?\{\{([\s\S]*?)\}\}/
)?.[1]

test('clock renders the standard colon separator directly', () => {
  assert.ok(clockExpression, 'clock interpolation should be present')
  assert.doesNotMatch(
    component,
    /꞉|\\u\{?0*A789/iu,
    'modifier colon must not return anywhere in the component'
  )
  assert.match(clockExpression, /nowStr|formatted/)
  assert.doesNotMatch(clockExpression, /\.replace\s*\(/)
})
