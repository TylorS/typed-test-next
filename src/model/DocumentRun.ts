import { Uri } from '@typed/fp/Uri'
import { Uuid } from '@typed/fp/Uuid'
import { Option, Some } from 'fp-ts/es6/Option'

import { TestMetadata } from './TestMetadata'
import { TestResult } from './TestResult'
import { TestRun } from './TestRun'

export interface DocumentRun {
  readonly id: Uuid
  readonly testRunId: TestRun['id']
  readonly documentUri: Uri
  readonly testMetadata: ReadonlyArray<TestMetadata['id']>
  readonly timestamp: Date
  readonly completion: Option<DocumentRunCompletion>
}

export interface CompletedDocumentRun extends DocumentRun {
  readonly completion: Some<DocumentRunCompletion>
}

export interface DocumentRunCompletion {
  readonly timestamp: Date
  readonly results: ReadonlyArray<TestResult>
}
