import { Subject } from 'most-subject'

import { Environment } from './Environment'
import { TestEvent } from './events'
import { TestModifier } from './TestModifier'

export const TYPED_TEST = '@typed/test/TestEnv'
export type TYPED_TEST = typeof TYPED_TEST

export interface TestEnv {
  readonly [TYPED_TEST]: {
    readonly events: Subject<TestEvent, TestEvent>
    readonly environment: Environment
    readonly modifier: TestModifier
    readonly timeout: number
  }
}
