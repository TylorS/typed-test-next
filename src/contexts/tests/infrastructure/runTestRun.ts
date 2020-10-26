import { getTestEnv } from '@build/shared/domain'
import {
  CompletedTestRun,
  Test,
  TestEnv,
  TestMetadataId,
  TestResult,
  TestRun,
  TestRunId,
} from '@build/shared/domain/model'
import { sendAppEvent } from '@tests/application'
import { doEffect, Effect, EnvOf, zip } from '@typed/fp/Effect'
import { SchedulerEnv } from '@typed/fp/fibers'
import { Path } from '@typed/fp/Path/exports'
import { createUuid, UuidEnv } from '@typed/fp/Uuid'
import * as O from 'fp-ts/Option'
import { flatten } from 'fp-ts/ReadonlyArray'

import { runDocument } from './runDocument'

const some = O.some as <A>(value: A) => O.Some<A>

export type RunTestRunEnv = TestEnv & SchedulerEnv & UuidEnv & EnvOf<typeof sendAppEvent>

export const runTestRun = (
  testsByDocument: ReadonlyArray<
    readonly [Path, ReadonlyArray<Test>, ReadonlyArray<TestMetadataId>]
  >,
  testModulePath: Path,
): Effect<RunTestRunEnv, ReadonlyArray<TestResult>> => {
  const eff = doEffect(function* () {
    const { environment } = yield* getTestEnv

    const testRun: TestRun = {
      id: TestRunId.wrap(yield* createUuid),
      testModulePath,
      environment,
      timestamp: new Date(),
      completion: O.none,
    }

    const effects = testsByDocument.map(([path, tests, testMetadata]) =>
      runDocument(path, tests, testMetadata, testRun.id),
    )

    yield* sendAppEvent({ type: 'testRun/started', testRun })

    const results: ReadonlyArray<TestResult> = flatten(yield* zip(effects))

    const completed: CompletedTestRun = {
      ...testRun,
      completion: some({
        timestamp: new Date(),
        results,
      }),
    }

    yield* sendAppEvent({ type: 'testRun/completed', testRun: completed })

    return results
  })

  return eff
}
