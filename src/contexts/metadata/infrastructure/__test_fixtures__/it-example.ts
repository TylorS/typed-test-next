import { getTestEnv } from '@build/contexts/common/getTestEnv'
import { it } from '@build/tests'
import * as assert from 'assert'

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
  runTests: void 0,
}
