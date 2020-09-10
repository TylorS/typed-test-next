import { Uuid } from '@typed/fp/Uuid'
import { Option, Some } from 'fp-ts/es6/Option'

import { DocumentRun } from './DocumentRun'
import { TestConfig } from './TestConfig'
import { TestResult } from './TestResult'

export interface TestCaseRun {
  readonly id: Uuid
  readonly documentRunId: DocumentRun['id']
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
