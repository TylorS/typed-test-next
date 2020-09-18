import { getUuidKeyIso, UuidKey } from '@typed/fp/Key'
import { Option, Some } from 'fp-ts/Option'

import { DocumentRunId } from './DocumentRun'
import { TestConfig } from './TestConfig'
import { TestResult } from './TestResult'

export interface TestSuiteRunId extends UuidKey<TestSuiteRun> {}

export namespace TestSuiteRunId {
  export const { wrap, unwrap } = getUuidKeyIso<TestSuiteRun>()
}

export interface TestSuiteRun {
  readonly id: TestSuiteRunId
  readonly documentRunId: DocumentRunId
  readonly timestamp: Date
  readonly config: TestConfig
  readonly completion: Option<TestSuiteRunCompletion>
}

export interface CompletedTestSuiteRun extends TestSuiteRun {
  readonly completion: Some<TestSuiteRunCompletion>
}

export interface TestSuiteRunCompletion {
  readonly timestamp: Date
  readonly results: ReadonlyArray<TestResult>
}
