import { TestResult } from '@build/shared/domain/model'
import { catchError, Effect, fail, FailEnv } from '@typed/fp/Effect'
import { identity } from 'fp-ts/function'

export const TestResultChange = '@typed/test/TestResultChange'
export interface TestResultChange extends FailEnv<typeof TestResultChange, TestResult> {}

export const testResultChange = (result: TestResult): Effect<TestResultChange, never> =>
  fail(TestResultChange, result)

export const catchTestResultChange = catchError(TestResultChange, identity) as <E>(
  effect: Effect<E & TestResultChange, TestResult>,
) => Effect<E, TestResult>
