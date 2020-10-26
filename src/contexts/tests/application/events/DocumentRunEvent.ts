import { CompletedDocumentRun, DocumentRun } from '@tests/domain'

export type DocumentRunEvent = DocumentRunStarted | DocumentRunCompleted

export interface DocumentRunStarted {
  readonly type: 'documentRun/started'
  readonly documentRun: DocumentRun
}

export interface DocumentRunCompleted {
  readonly type: 'documentRun/completed'
  readonly documentRun: CompletedDocumentRun
}
