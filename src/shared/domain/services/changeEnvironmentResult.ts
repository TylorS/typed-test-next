import { getTestEnv, TestResultChange, testResultChange } from '@build/shared'
import { Environment, TestEnv, TestResult, TestResultType } from '@build/shared/domain/model'
import { doEffect, Effect } from '@typed/fp/Effect'

/**
 * Change the result of a test given a set of expected environments are not matched.
 */
export const expectedEnvironments = (result: TestResult) => (
  ...expectedEnvironments: readonly [
    environment: Environment,
    ...environments: readonly Environment[]
  ]
): Effect<TestEnv & TestResultChange, void> =>
  doEffect(function* () {
    const { environment } = yield* getTestEnv

    if (!expectedEnvironments.includes(environment)) {
      return yield* testResultChange(result)
    }
  })

/**
 * Change the result of a test given a set of unexpected environments are matched.
 */
export const unexpectedEnvironments = (result: TestResult) => (
  ...unexpectedEnvironments: readonly [
    environment: Environment,
    ...environments: readonly Environment[]
  ]
): Effect<TestEnv & TestResultChange, void> =>
  doEffect(function* () {
    const { environment } = yield* getTestEnv

    if (unexpectedEnvironments.includes(environment)) {
      return yield* testResultChange(result)
    }
  })

export const skipExpectedEnvironments = expectedEnvironments({ type: TestResultType.Skip })
export const skipUnexpectedEnvironments = unexpectedEnvironments({ type: TestResultType.Skip })

export const todoExpectedEnvironments = expectedEnvironments({ type: TestResultType.Todo })
export const todoUnexpectedEnvironments = unexpectedEnvironments({ type: TestResultType.Todo })
