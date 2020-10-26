import {
  CompletedDocumentRun,
  DocumentRun,
  DocumentRunId,
  Test,
  TestEnv,
  TestMetadataId,
  TestResult,
  TestRunId,
} from '@build/shared/domain/model'
import { sendAppEvent } from '@tests/application'
import { doEffect, Effect, EnvOf } from '@typed/fp/Effect'
import { SchedulerEnv } from '@typed/fp/fibers'
import { Path } from '@typed/fp/Path/exports'
import { createUuid, UuidEnv } from '@typed/fp/Uuid'
import * as O from 'fp-ts/Option'

import { runTests } from './runTests'

const some = O.some as <A>(value: A) => O.Some<A>

export type RunDocumentEnv = TestEnv & SchedulerEnv & UuidEnv & EnvOf<typeof sendAppEvent>

export const runDocument = (
  documentPath: Path,
  tests: ReadonlyArray<Test>,
  testMetadata: ReadonlyArray<TestMetadataId>,
  testRunId: TestRunId,
): Effect<RunDocumentEnv, ReadonlyArray<TestResult>> =>
  doEffect(function* () {
    const documentRun: DocumentRun = {
      id: DocumentRunId.wrap(yield* createUuid),
      documentPath,
      testRunId,
      testMetadata,
      timestamp: new Date(),
      completion: O.none,
    }

    yield* sendAppEvent({ type: 'documentRun/started', documentRun })

    const results = yield* runTests(tests, documentRun.id)

    const completed: CompletedDocumentRun = {
      ...documentRun,
      completion: some({
        timestamp: new Date(),
        results,
      }),
    }

    yield* sendAppEvent({ type: 'documentRun/completed', documentRun: completed })

    return results
  })
