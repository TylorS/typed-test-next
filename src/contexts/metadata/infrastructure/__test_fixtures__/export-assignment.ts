import { describe, it, timeout } from '@build/tests'
import * as assert from 'assert'

export = timeout(
  1000,
  describe(`whatever`, [
    it(`is great`, () => {
      assert.ok(true)
    }),
  ]),
)
