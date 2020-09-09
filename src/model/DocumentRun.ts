import { Uri } from '@typed/fp/Uri'
import { Uuid } from '@typed/fp/Uuid'
import { None, Option, Some } from 'fp-ts/es6/Option'

import { Environment } from './Environment'
import { TestMetadata } from './TestMetadata'
import { TestResult } from './TestResult'
import { TestRun } from './TestRun'

export interface DocumentRun {
  readonly id: Uuid
  readonly testRun: TestRun['id']
  readonly environment: Environment
  readonly documentUri: Uri
  readonly createdAt: Date
  readonly testMetadata: ReadonlyArray<TestMetadata['id']>
  readonly states: readonly [Option<DocumentRunStart>, Option<DocumentRunCompletion>]
}

export interface QueuedDocumentRun extends DocumentRun {
  readonly states: readonly [None, None]
}

export interface ActiveDocumentRun extends DocumentRun {
  readonly states: readonly [Some<DocumentRunStart>, None]
}

export interface CompletedDocumentRun extends DocumentRun {
  readonly states: readonly [Some<DocumentRunStart>, Some<DocumentRunCompletion>]
}
export enum DocumentRunStateType {
  Start = 'start',
  Completion = 'completion',
}

export interface DocumentRunStart {
  readonly type: DocumentRunStateType.Start
  readonly timestamp: Date
}

export interface DocumentRunCompletion {
  readonly type: DocumentRunStateType.Completion
  readonly timestamp: Date
  readonly results: ReadonlyArray<TestResult>
}
