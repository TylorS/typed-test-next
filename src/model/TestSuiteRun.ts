import { Uuid } from '@typed/fp/Uuid'
import { Option, Some } from 'fp-ts/es6/Option'

import { DocumentRun } from './DocumentRun'
import { TestConfig } from './TestConfig'
import { TestResult } from './TestResult'

export interface TestSuiteRun {
  readonly id: Uuid
  readonly documentRunId: DocumentRun['id']
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
