import assert from 'assert'
import { any } from 'io-ts'

import { getTestEnv } from '../../common/getTestEnv'
import { it } from '../../tests'

export const sync = it('can be synchronous', () => {
  assert.ok(true)
})

export const async = it('can be asynchronous', async () => {
  assert.ok(true)
})

export const duplicate = async

export const generator = it('can be a generator', function* () {
  const { environment } = yield* getTestEnv

  assert.ok(typeof environment === 'string')
})

export const whatever = 1

export const whatever2 = {}

export const foo = {
  type: 'whatever',
  config: {},
  runTests: any,
}
