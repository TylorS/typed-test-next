import {
  SuiteResult,
  Test,
  TestCase,
  TestEnv,
  TestResult,
  TestResultType,
  TestSuite,
} from '@build/shared/domain/model'
import { sendAppEvent } from '@tests/application/services'
import {
  CompletedTestCaseRun,
  CompletedTestSuiteRun,
  DocumentRun,
  TestCaseRun,
  TestCaseRunId,
  TestSuiteRun,
  TestSuiteRunId,
} from '@tests/domain'
import { doEffect, Effect, EnvOf, zip } from '@typed/fp/Effect'
import { SchedulerEnv } from '@typed/fp/fibers'
import { createUuid, UuidEnv } from '@typed/fp/Uuid'
import * as O from 'fp-ts/Option'

const some = O.some as <A>(value: A) => O.Some<A>

export type RunTestsEnv = UuidEnv & TestEnv & SchedulerEnv & EnvOf<typeof sendAppEvent>

export const runTests = (
  tests: ReadonlyArray<Test>,
  documentRunId: DocumentRun['id'],
): Effect<RunTestsEnv, ReadonlyArray<TestResult>> =>
  zip(
    tests.map((test) =>
      test.type === 'test-case'
        ? runTestCase(test, documentRunId)
        : runTestSuite(test, documentRunId),
    ),
  )

export const runTestCase = (
  testCase: TestCase,
  documentRunId: DocumentRun['id'],
): Effect<RunTestsEnv, TestResult> =>
  doEffect(function* () {
    const testCaseRun: TestCaseRun = {
      id: TestCaseRunId.wrap(yield* createUuid),
      documentRunId,
      timestamp: new Date(),
      config: testCase.config,
      completion: O.none,
    }
    yield* sendAppEvent({ type: 'testCaseRun/started', testCaseRun })

    const result = yield* testCase.runTestCase

    const completed: CompletedTestCaseRun = {
      ...testCaseRun,
      completion: some({
        timestamp: new Date(),
        result,
      }),
    }

    yield* sendAppEvent({ type: 'testCaseRun/completed', testCaseRun: completed })

    return result
  })

export const runTestSuite = (
  testSuite: TestSuite,
  documentRunId: DocumentRun['id'],
): Effect<RunTestsEnv, TestResult> =>
  doEffect(function* () {
    const testSuiteRun: TestSuiteRun = {
      id: TestSuiteRunId.wrap(yield* createUuid),
      documentRunId,
      timestamp: new Date(),
      config: testSuite.config,
      completion: O.none,
    }

    yield* sendAppEvent({ type: 'testSuiteRun/started', testSuiteRun })

    const results = yield* runTests(testSuite.tests, documentRunId)

    const completed: CompletedTestSuiteRun = {
      ...testSuiteRun,
      completion: some({
        timestamp: new Date(),
        results,
      }),
    }

    yield* sendAppEvent({ type: 'testSuiteRun/completed', testSuiteRun: completed })

    const result: SuiteResult = {
      type: TestResultType.Suite,
      results,
    }

    return result
  })
