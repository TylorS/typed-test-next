import { doEffect, Effect, zip } from '@typed/fp/Effect'
import { SchedulerEnv } from '@typed/fp/fibers'
import { Uri } from '@typed/fp/Uri'
import { createUuid, UuidEnv } from '@typed/fp/Uuid'
import * as O from 'fp-ts/es6/Option'
import { flatten } from 'fp-ts/lib/ReadonlyArray'

import { sendTestEvent } from '../common/sendTestEvent'
import {
  CompletedDocumentRun,
  CompletedTestCaseRun,
  CompletedTestRun,
  CompletedTestSuiteRun,
  DocumentRun,
  Environment,
  SuiteResult,
  Test,
  TestCase,
  TestCaseRun,
  TestEnv,
  TestEventType,
  TestMetadata,
  TestResult,
  TestResultType,
  TestRun,
  TestSuite,
  TestSuiteRun,
  TestType,
} from '../model'

const some = O.some as <A>(value: A) => O.Some<A>

export const runTestRun = (
  testsByDocument: ReadonlyArray<
    readonly [Uri, ReadonlyArray<Test>, ReadonlyArray<TestMetadata['id']>]
  >,
  testModuleUri: Uri, // Uri of TestModule,
  environment: Environment,
): Effect<TestEnv & SchedulerEnv & UuidEnv, ReadonlyArray<TestResult>> =>
  doEffect(function* () {
    const testRun: TestRun = {
      id: yield* createUuid,
      testModuleUri,
      environment,
      timestamp: new Date(),
      completion: O.none,
    }

    const effects = testsByDocument.map(([documentUri, tests, testMetadata]) =>
      runDocument(documentUri, tests, testMetadata, testRun.id),
    )

    yield* sendTestEvent({ type: TestEventType.TestRunStarted, testRun })

    const results: ReadonlyArray<TestResult> = flatten(yield* zip(effects))

    const completed: CompletedTestRun = {
      ...testRun,
      completion: some({
        timestamp: new Date(),
        results,
      }),
    }

    yield* sendTestEvent({ type: TestEventType.TestRunCompleted, testRun: completed })

    return results
  })

export const runDocument = (
  documentUri: Uri,
  tests: ReadonlyArray<Test>,
  testMetadata: ReadonlyArray<TestMetadata['id']>,
  testRunId: TestRun['id'],
): Effect<TestEnv & SchedulerEnv & UuidEnv, ReadonlyArray<TestResult>> =>
  doEffect(function* () {
    const documentRun: DocumentRun = {
      id: yield* createUuid,
      documentUri,
      testRunId,
      testMetadata,
      timestamp: new Date(),
      completion: O.none,
    }

    yield* sendTestEvent({ type: TestEventType.DocumentRunStarted, documentRun })

    const results = yield* runTests(tests, documentRun.id)

    const completed: CompletedDocumentRun = {
      ...documentRun,
      completion: some({
        timestamp: new Date(),
        results,
      }),
    }

    yield* sendTestEvent({ type: TestEventType.DocumentRunCompleted, documentRun: completed })

    return results
  })

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
): Effect<TestEnv & SchedulerEnv & UuidEnv, TestResult> =>
  doEffect(function* () {
    const testCaseRun: TestCaseRun = {
      id: yield* createUuid,
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
): Effect<TestEnv & SchedulerEnv, TestResult> =>
  doEffect(function* () {
    const testSuiteRun: TestSuiteRun = {
      id: yield* createUuid,
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
