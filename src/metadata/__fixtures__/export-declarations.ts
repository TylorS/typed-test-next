import assert from 'assert'

import { it } from '../../tests'

const test = it('does things', () => {
  assert.ok(true)
})

const renamed = it('can be renamed', () => {
  assert.ok(true)
})

export { test, renamed as test2, renamed as test3 }
