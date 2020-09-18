import { doEffect, Effect } from '@typed/fp/Effect'
import { SchedulerEnv } from '@typed/fp/fibers'
import { Uri } from '@typed/fp/Uri'
import { createUuid, UuidEnv } from '@typed/fp/Uuid'
import * as O from 'fp-ts/Option'

import { sendTestEvent } from '../common/sendTestEvent'
import {
  CompletedDocumentRun,
  DocumentRun,
  DocumentRunId,
  Test,
  TestEnv,
  TestEventType,
  TestMetadataId,
  TestResult,
  TestRunId,
} from '../model'
import { runTests } from './runTests'

const some = O.some as <A>(value: A) => O.Some<A>

export const runDocument = (
  documentUri: Uri,
  tests: ReadonlyArray<Test>,
  testMetadata: ReadonlyArray<TestMetadataId>,
  testRunId: TestRunId,
): Effect<TestEnv & SchedulerEnv & UuidEnv, ReadonlyArray<TestResult>> =>
  doEffect(function* () {
    const documentRun: DocumentRun = {
      id: DocumentRunId.wrap(yield* createUuid),
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
