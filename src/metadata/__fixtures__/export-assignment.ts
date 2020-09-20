import assert from 'assert'

import { describe, it, timeout } from '../../tests'

export = timeout(
  1000,
  describe(`whatever`, [
    it(`is great`, () => {
      assert.ok(true)
    }),
  ]),
)
