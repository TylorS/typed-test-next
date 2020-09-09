import { Uri } from '@typed/fp/Uri'

import { ActiveDocumentRun, CompletedDocumentRun, QueuedDocumentRun } from './DocumentRun'
import { ActiveTestCaseRun, CompletedTestCaseRun, QueuedTestCaseRun } from './TestCaseRun'
import { TestMetadata } from './TestMetadata'
import { ActiveTestRun, CompletedTestRun, QueuedTestRun } from './TestRun'
import { ActiveTestSuiteRun, CompletedTestSuiteRun, QueuedTestSuiteRun } from './TestSuiteRun'

export type TestEvent =
  | DocumentEvent
  | TestMetadataEvent
  | TestModuleEvent
  | TestRunEvent
  | DocumentRunEvent
  | TestSuiteRunEvent
  | TestCaseRunEvent

export enum TestEventType {
  // Documents
  DocumentUpdated = 'Document/Updated',
  DocumentRenamed = 'Document/Renamed',
  DocumentDeleted = 'Document/Deleted',

  // TestMetadata
  TestMetadataParsed = 'TestMetadata/Parsed',

  // TestModule
  TestModuleCreated = 'TestBundle/Created',

  // Test Run
  TestRunQueued = 'TestRun/Queued',
  TestRunStarted = 'TestRun/Started',
  TestRunCompleted = 'TestRun/Completed',

  // Document Run
  DocumentRunQueued = 'DocumentRun/Queued',
  DocumentRunStarted = 'DocumentRun/Started',
  DocumentRunCompleted = 'DocumentRun/Completed',

  // TestSuite Run
  TestSuiteRunQueued = 'TestSuiteRun/Queued',
  TestSuiteRunStarted = 'TestSuiteRun/Started',
  TestSuiteRunCompleted = 'TestSuiteRun/Completed',

  // TestCase Run
  TestCaseRunQueued = 'TestCaseRun/Queued',
  TestCaseRunStarted = 'TestCaseRun/Started',
  TestCaseRunCompleted = 'TestCaseRun/Completed',
}

// #startregion Documents
export type DocumentEvent = DocumentUpdated | DocumentRenamed | DocumentDeleted

export interface DocumentUpdated {
  readonly type: TestEventType.DocumentUpdated
  readonly uri: Uri
}

export interface DocumentRenamed {
  readonly type: TestEventType.DocumentRenamed
  readonly previousUri: Uri
  readonly uri: Uri
}

export interface DocumentDeleted {
  readonly type: TestEventType.DocumentDeleted
  readonly uri: Uri
}
// #endregion

// #startregion TestMetadata
export type TestMetadataEvent = TestMetdataParsed

export interface TestMetdataParsed {
  readonly type: TestEventType.TestMetadataParsed
  readonly testMetadata: ReadonlyArray<TestMetadata>
}
// #endregion

// #startregion TestMetadata
export type TestModuleEvent = TestModuleCreated

export interface TestModuleCreated {
  readonly type: TestEventType.TestModuleCreated
  readonly uri: Uri // Must point to a file which can be imported as a ES Module
}
// #endregion

// #startregion Test Run
export type TestRunEvent = TestRunQueued | TestRunStarted | TestRunCompleted

export interface TestRunQueued {
  readonly type: TestEventType.TestRunQueued
  readonly testRun: QueuedTestRun
}

export interface TestRunStarted {
  readonly type: TestEventType.TestRunStarted
  readonly testRun: ActiveTestRun
}

export interface TestRunCompleted {
  readonly type: TestEventType.TestRunCompleted
  readonly testRun: CompletedTestRun
}
// #endregion

// #startregion Document Run
export type DocumentRunEvent = DocumentRunQueued | DocumentRunStarted | DocumentRunCompleted

export interface DocumentRunQueued {
  readonly type: TestEventType.DocumentRunQueued
  readonly documentRun: QueuedDocumentRun
}

export interface DocumentRunStarted {
  readonly type: TestEventType.DocumentRunStarted
  readonly documentRun: ActiveDocumentRun
}

export interface DocumentRunCompleted {
  readonly type: TestEventType.DocumentRunCompleted
  readonly documentRun: CompletedDocumentRun
}
// #endregion

// #startregion TestSuite Run
export type TestSuiteRunEvent = TestSuiteRunQueued | TestSuiteRunStarted | TestSuiteRunCompleted

export interface TestSuiteRunQueued {
  readonly type: TestEventType.TestSuiteRunQueued
  readonly TestSuiteRun: QueuedTestSuiteRun
}

export interface TestSuiteRunStarted {
  readonly type: TestEventType.TestSuiteRunStarted
  readonly TestSuiteRun: ActiveTestSuiteRun
}

export interface TestSuiteRunCompleted {
  readonly type: TestEventType.TestSuiteRunCompleted
  readonly TestSuiteRun: CompletedTestSuiteRun
}
// #endregion

// #startregion TestCase Run
export type TestCaseRunEvent = TestCaseRunQueued | TestCaseRunStarted | TestCaseRunCompleted

export interface TestCaseRunQueued {
  readonly type: TestEventType.TestCaseRunQueued
  readonly TestCaseRun: QueuedTestCaseRun
}

export interface TestCaseRunStarted {
  readonly type: TestEventType.TestCaseRunStarted
  readonly TestCaseRun: ActiveTestCaseRun
}

export interface TestCaseRunCompleted {
  readonly type: TestEventType.TestCaseRunCompleted
  readonly TestCaseRun: CompletedTestCaseRun
}
// #endregion
