import assert from 'assert'
import { any } from 'io-ts'

import { getTestEnv } from '../../common/getTestEnv'
import { it } from '../../tests'

export const sync = it('can be synchronous', () => {
  assert.ok(true)
})

export const async = it('can be asynchronous', (done) => {
  setTimeout(() => done())
})

export const duplicate = async

export const promise = it('can be a promise', async () => {
  assert.ok(true)
})

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
