import { Effect } from '@typed/fp/Effect'

import { TestEnv } from './TestEnv'
import { TestResult } from './TestResult'

export interface TestModule {
  readonly runTests: Effect<TestEnv, ReadonlyArray<TestResult>>
}
