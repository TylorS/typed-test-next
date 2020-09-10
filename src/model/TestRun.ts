import { Uri } from '@typed/fp/Uri'
import { Uuid } from '@typed/fp/Uuid'
import { Option, Some } from 'fp-ts/es6/Option'

import { Environment } from './Environment'
import { TestResult } from './TestResult'

export interface TestRun {
  readonly id: Uuid
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
