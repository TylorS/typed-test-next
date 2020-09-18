import { catchError, Effect, fail, FailEnv } from '@typed/fp/Effect'
import { identity } from 'fp-ts/function'

import { TestResult } from '../model'

export const TestResultChange = Symbol('@typed/test/TestFailure')
export interface TestResultChange extends FailEnv<typeof TestResultChange, TestResult> {}

export const testResultChange = (result: TestResult): Effect<TestResultChange, never> =>
  fail(TestResultChange, result)

export const catchTestResultChange = catchError(TestResultChange, identity) as <E>(
  effect: Effect<E & TestResultChange, TestResult>,
) => Effect<E, TestResult>
