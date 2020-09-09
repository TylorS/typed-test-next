import { Uri } from '@typed/fp/Uri'
import { Uuid } from '@typed/fp/Uuid'
import { None, Option, Some } from 'fp-ts/es6/Option'

import { DocumentRun } from './DocumentRun'
import { Environment } from './Environment'
import { TestConfig } from './TestConfig'
import { NodeMetadata } from './TestMetadata'
import { TestResult } from './TestResult'

export interface TestSuiteRun {
  readonly id: Uuid
  readonly documentRunId: DocumentRun['id']
  readonly environment: Environment
  readonly documentUri: Uri
  readonly createdAt: Date
  readonly config: TestConfig
  readonly metadataId: NodeMetadata['id']
  readonly states: readonly [Option<TestSuiteRunStart>, Option<TestSuiteRunCompletion>]
}

export interface QueuedTestSuiteRun extends TestSuiteRun {
  readonly states: readonly [None, None]
}

export interface ActiveTestSuiteRun extends TestSuiteRun {
  readonly states: readonly [Some<TestSuiteRunStart>, None]
}

export interface CompletedTestSuiteRun extends TestSuiteRun {
  readonly states: readonly [Some<TestSuiteRunStart>, Some<TestSuiteRunCompletion>]
}
export enum TestSuiteRunStateType {
  Start = 'start',
  Completion = 'completion',
}

export interface TestSuiteRunStart {
  readonly type: TestSuiteRunStateType.Start
  readonly timestamp: Date
}

export interface TestSuiteRunCompletion {
  readonly type: TestSuiteRunStateType.Completion
  readonly timestamp: Date
  readonly results: ReadonlyArray<TestResult>
}
