import { doEffect, Effect, zip } from '@typed/fp/Effect'
import { SchedulerEnv } from '@typed/fp/fibers'
import { Uri } from '@typed/fp/Uri'
import { createUuid, UuidEnv } from '@typed/fp/Uuid'
import * as O from 'fp-ts/Option'
import { flatten } from 'fp-ts/ReadonlyArray'

import { getTestEnv } from '../common/getTestEnv'
import { sendTestEvent } from '../common/sendTestEvent'
import {
  CompletedTestRun,
  Test,
  TestEnv,
  TestEventType,
  TestMetadataId,
  TestResult,
  TestRun,
  TestRunId,
} from '../model'
import { runDocument } from './runDocument'

const some = O.some as <A>(value: A) => O.Some<A>

export const runTestRun = (
  testsByDocument: ReadonlyArray<
    readonly [Uri, ReadonlyArray<Test>, ReadonlyArray<TestMetadataId>]
  >,
  testModuleUri: Uri,
): Effect<TestEnv & SchedulerEnv & UuidEnv, ReadonlyArray<TestResult>> => {
  const eff = doEffect(function* () {
    const { environment } = yield* getTestEnv

    const testRun: TestRun = {
      id: TestRunId.wrap(yield* createUuid),
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

  return eff
}
