import assert from 'assert'

import { it, timeout } from '../../tests'

const test = timeout(
  1000,
  it('does things', () => {
    assert.ok(true)
  }),
)

const renamed = it.skip('can be renamed', () => {
  assert.ok(true)
})

export { test, renamed as test2, renamed as test3 }
