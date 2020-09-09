import { catchError, Effect, fail, FailEnv } from '@typed/fp/Effect'
import { Either } from 'fp-ts/es6/Either'

import { TestResult } from '../model'

export const TestResultChange = Symbol('@typed/test/TestFailure')
export interface TestResultChange extends FailEnv<typeof TestResultChange, TestResult> {}

export const testResultChange = (result: TestResult): Effect<TestResultChange, never> =>
  fail(TestResultChange, result)

export const catchTestResultChange: <E, A>(
  effect: Effect<E & TestResultChange, A>,
) => Effect<E, Either<TestResult, A>> = catchError(TestResultChange, (result: TestResult) => result)
