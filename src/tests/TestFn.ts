import { EffectGenerator } from '@typed/fp/Effect'

import { TestEnv } from '../model'
import { TestResultChange } from './TestResultChange'

export interface TestFn {
  (done: TestDone): void | Promise<void> | EffectGenerator<TestEnv & TestResultChange, void>
}

export type TestDone = (error?: Error) => void
