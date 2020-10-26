import { TestEnv } from '@build/shared/domain/model'
import { EffectGenerator } from '@typed/fp/Effect'

import { TestResultChange } from './TestResultChange'

export type TestFn = DeclarativeTestFn | ImperativeTestFn

export interface DeclarativeTestFn {
  (): void | Promise<void> | EffectGenerator<TestEnv & TestResultChange, void>
}

export interface ImperativeTestFn {
  (done: TestDone): void
}

export type TestDone = (error?: Error) => void
