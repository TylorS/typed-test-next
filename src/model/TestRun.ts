import { getUuidKeyIso, UuidKey } from '@typed/fp/Key'
import { Uri } from '@typed/fp/Uri'
import { Option, Some } from 'fp-ts/Option'

import { Environment } from './Environment'
import { TestResult } from './TestResult'

export interface TestRunId extends UuidKey<TestRun> {}

export namespace TestRunId {
  export const { wrap, unwrap } = getUuidKeyIso<TestRun>()
}

export interface TestRun {
  readonly id: TestRunId
  readonly testModuleUri: Uri
  readonly environment: Environment
  readonly timestamp: Date
  readonly completion: Option<TestRunCompletion>
}

export interface CompletedTestRun extends TestRun {
  readonly completion: Some<TestRunCompletion>
}

export interface TestRunCompletion {
  readonly timestamp: Date
  readonly results: ReadonlyArray<TestResult>
}
