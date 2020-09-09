import { Uri } from '@typed/fp/Uri'
import { Uuid } from '@typed/fp/Uuid'
import { None, Option, Some } from 'fp-ts/es6/Option'

import { Environment } from './Environment'
import { TestResult } from './TestResult'

export interface TestRun {
  readonly id: Uuid
  readonly environment: Environment
  readonly documentUris: ReadonlyArray<Uri>
  readonly createdAt: Date
  readonly states: readonly [Option<TestRunStart>, Option<TestRunCompletion>]
}

export interface QueuedTestRun extends TestRun {
  readonly states: readonly [None, None]
}

export interface ActiveTestRun extends TestRun {
  readonly states: readonly [Some<TestRunStart>, None]
}

export interface CompletedTestRun extends TestRun {
  readonly states: readonly [Some<TestRunStart>, Some<TestRunCompletion>]
}

export enum TestRunStateType {
  Start = 'start',
  Completion = 'completion',
}

export interface TestRunStart {
  readonly type: TestRunStateType.Start
  readonly timestamp: Date
}

export interface TestRunCompletion {
  readonly type: TestRunStateType.Completion
  readonly timestamp: Date
  readonly results: ReadonlyArray<TestResult>
}
