import { Environment, TestResult } from '@build/shared'
import { getUuidKeyIso, UuidKey } from '@typed/fp/Key'
import { Path } from '@typed/fp/Path/exports'
import { Option, Some } from 'fp-ts/Option'

export interface TestRunId extends UuidKey<TestRun> {}

export namespace TestRunId {
  export const { wrap, unwrap } = getUuidKeyIso<TestRun>()
}

export interface TestRun {
  readonly id: TestRunId
  readonly testModulePath: Path
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
