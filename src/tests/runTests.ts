import { doEffect, Effect, zip } from '@typed/fp/Effect'
import { SchedulerEnv } from '@typed/fp/fibers'
import { createUuid, UuidEnv } from '@typed/fp/Uuid'
import * as O from 'fp-ts/Option'

import { sendTestEvent } from '../common/sendTestEvent'
import {
  CompletedTestCaseRun,
  CompletedTestSuiteRun,
  DocumentRun,
  SuiteResult,
  Test,
  TestCase,
  TestCaseRun,
  TestCaseRunId,
  TestEnv,
  TestEventType,
  TestResult,
  TestResultType,
  TestSuite,
  TestSuiteRun,
  TestSuiteRunId,
  TestType,
} from '../model'

const some = O.some as <A>(value: A) => O.Some<A>

export const runTests = (
  tests: ReadonlyArray<Test>,
  documentRunId: DocumentRun['id'],
): Effect<TestEnv & SchedulerEnv & UuidEnv, ReadonlyArray<TestResult>> =>
  zip(
    tests.map((test) =>
      test.type === TestType.TestCase
        ? runTestCase(test, documentRunId)
        : runTestSuite(test, documentRunId),
    ),
  )

export const runTestCase = (
  testCase: TestCase,
  documentRunId: DocumentRun['id'],
): Effect<UuidEnv & TestEnv & SchedulerEnv, TestResult> =>
  doEffect(function* () {
    const testCaseRun: TestCaseRun = {
      id: TestCaseRunId.wrap(yield* createUuid),
      documentRunId,
      timestamp: new Date(),
      config: testCase.config,
      completion: O.none,
    }
    yield* sendTestEvent({ type: TestEventType.TestCaseRunStarted, testCaseRun })

    const result = yield* testCase.runTestCase

    const completed: CompletedTestCaseRun = {
      ...testCaseRun,
      completion: some({
        timestamp: new Date(),
        result,
      }),
    }

    yield* sendTestEvent({ type: TestEventType.TestCaseRunCompleted, testCaseRun: completed })

    return result
  })

export const runTestSuite = (
  testSuite: TestSuite,
  documentRunId: DocumentRun['id'],
): Effect<TestEnv & SchedulerEnv & UuidEnv, TestResult> =>
  doEffect(function* () {
    const testSuiteRun: TestSuiteRun = {
      id: TestSuiteRunId.wrap(yield* createUuid),
      documentRunId,
      timestamp: new Date(),
      config: testSuite.config,
      completion: O.none,
    }

    yield* sendTestEvent({ type: TestEventType.TestSuiteRunStarted, testSuiteRun })

    const results = yield* runTests(testSuite.tests, documentRunId)

    const completed: CompletedTestSuiteRun = {
      ...testSuiteRun,
      completion: some({
        timestamp: new Date(),
        results,
      }),
    }

    yield* sendTestEvent({ type: TestEventType.TestSuiteRunCompleted, testSuiteRun: completed })

    const result: SuiteResult = {
      type: TestResultType.Suite,
      results,
    }

    return result
  })
