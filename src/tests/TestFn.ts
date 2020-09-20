import { EffectGenerator } from '@typed/fp/Effect'

import { TestEnv } from '../model'
import { TestResultChange } from './TestResultChange'

export type TestFn = DeclarativeTestFn | ImperativeTestFn

export interface DeclarativeTestFn {
  (): void | Promise<void> | EffectGenerator<TestEnv & TestResultChange, void>
}

export interface ImperativeTestFn {
  (done: TestDone): void
}

export type TestDone = (error?: Error) => void
