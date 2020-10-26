import { TestConfig, TestResult } from '@build/shared'
import { getUuidKeyIso, UuidKey } from '@typed/fp/Key'
import { Option, Some } from 'fp-ts/Option'

import { DocumentRunId } from './DocumentRun'

export interface TestCaseRunId extends UuidKey<TestCaseRun> {}

export namespace TestCaseRunId {
  export const { wrap, unwrap } = getUuidKeyIso<TestCaseRun>()
}

export interface TestCaseRun {
  readonly id: TestCaseRunId
  readonly documentRunId: DocumentRunId
  readonly timestamp: Date
  readonly config: TestConfig
  readonly completion: Option<TestCaseRunCompletion>
}

export interface CompletedTestCaseRun extends TestCaseRun {
  readonly completion: Some<TestCaseRunCompletion>
}

export interface TestCaseRunCompletion {
  readonly timestamp: Date
  readonly result: TestResult
}
