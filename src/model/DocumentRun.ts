import { UuidKey } from '@typed/fp/Key'
import { Uri } from '@typed/fp/Uri'
import { Option, Some } from 'fp-ts/Option'

import { TestMetadataId } from './TestMetadata'
import { TestResult } from './TestResult'
import { TestRunId } from './TestRun'

export interface DocumentRunId extends UuidKey<DocumentRun> {}

export interface DocumentRun {
  readonly id: DocumentRunId
  readonly testRunId: TestRunId
  readonly documentUri: Uri
  readonly testMetadata: ReadonlyArray<TestMetadataId>
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
