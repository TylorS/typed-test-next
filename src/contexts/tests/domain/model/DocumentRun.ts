import { TestMetadataId, TestResult } from '@build/shared'
import { getUuidKeyIso, UuidKey } from '@typed/fp/Key'
import { Path } from '@typed/fp/Path/exports'
import { Option, Some } from 'fp-ts/Option'

import { TestRunId } from './TestRun'

export interface DocumentRunId extends UuidKey<DocumentRun> {}

export namespace DocumentRunId {
  export const { wrap, unwrap } = getUuidKeyIso<DocumentRun>()
}

export interface DocumentRun {
  readonly id: DocumentRunId
  readonly testRunId: TestRunId
  readonly documentPath: Path
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
