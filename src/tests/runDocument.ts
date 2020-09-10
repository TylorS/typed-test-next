import { doEffect, Effect } from '@typed/fp/Effect'
import { SchedulerEnv } from '@typed/fp/fibers'
import { Uri } from '@typed/fp/Uri'
import { createUuid, UuidEnv } from '@typed/fp/Uuid'
import * as O from 'fp-ts/es6/Option'

import { sendTestEvent } from '../common/sendTestEvent'
import {
  CompletedDocumentRun,
  DocumentRun,
  Test,
  TestEnv,
  TestEventType,
  TestMetadata,
  TestResult,
  TestRun,
} from '../model'
import { runTests } from './runTests'

const some = O.some as <A>(value: A) => O.Some<A>

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
