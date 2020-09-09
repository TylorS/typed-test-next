import { Uri } from '@typed/fp/Uri'
import { Uuid } from '@typed/fp/Uuid'
import { None, Option, Some } from 'fp-ts/es6/Option'

import { DocumentRun } from './DocumentRun'
import { Environment } from './Environment'
import { TestConfig } from './TestConfig'
import { NodeMetadata } from './TestMetadata'
import { TestResult } from './TestResult'

export interface TestCaseRun {
  readonly id: Uuid
  readonly documentRunId: DocumentRun['id']
  readonly environment: Environment
  readonly documentUri: Uri
  readonly createdAt: Date
  readonly config: TestConfig
  readonly metadataId: NodeMetadata['id']
  readonly states: readonly [Option<TestCaseRunStart>, Option<TestCaseRunCompletion>]
}

export interface QueuedTestCaseRun extends TestCaseRun {
  readonly states: readonly [None, None]
}

export interface ActiveTestCaseRun extends TestCaseRun {
  readonly states: readonly [Some<TestCaseRunStart>, None]
}

export interface CompletedTestCaseRun extends TestCaseRun {
  readonly states: readonly [Some<TestCaseRunStart>, Some<TestCaseRunCompletion>]
}
export enum TestCaseRunStateType {
  Start = 'start',
  Completion = 'completion',
}

export interface TestCaseRunStart {
  readonly type: TestCaseRunStateType.Start
  readonly timestamp: Date
}

export interface TestCaseRunCompletion {
  readonly type: TestCaseRunStateType.Completion
  readonly timestamp: Date
  readonly result: TestResult
}
