import { newDefaultScheduler } from '@most/scheduler'
import { isBrowser } from '@typed/fp/common/exports'
import { Effect } from '@typed/fp/Effect/Effect'
import { provideSome } from '@typed/fp/Effect/provide'
import { SchedulerEnv } from '@typed/fp/fibers'
import { UuidEnv } from '@typed/fp/Uuid/common'
import { createBrowserUuidEnv } from '@typed/fp/Uuid/exports'
import { createNodeUuidEnv } from '@typed/fp/Uuid/randomUuidSeed/createNodeUuidEnv'
import { pipe } from 'fp-ts/function'

import { Environment } from './Environment'
import { TestModifier } from './TestModifier'

export const TYPED_TEST = '@typed/test/TestEnv'
export type TYPED_TEST = typeof TYPED_TEST

export type TestEnv = SchedulerEnv &
  UuidEnv & {
    readonly [TYPED_TEST]: {
      readonly environment: Environment
      readonly modifier: TestModifier
      readonly timeout: number
    }
  }

export function provideTestEnv(environment: Environment) {
  return <E, A>(eff: Effect<E & TestEnv, A>): Effect<E, A> => {
    const uuidEnv: UuidEnv = isBrowser ? createBrowserUuidEnv() : createNodeUuidEnv()
    const testEnv: TestEnv = {
      ...uuidEnv,
      scheduler: newDefaultScheduler(),
      [TYPED_TEST]: {
        environment,
        modifier: 'default',
        timeout: 200,
      },
    }

    return pipe(eff, provideSome<TestEnv>(testEnv))
  }
}
