import { Uri } from '@typed/fp/Uri'

import { CompletedDocumentRun, DocumentRun } from './DocumentRun'
import { CompletedTestCaseRun, TestCaseRun } from './TestCaseRun'
import { TestMetadata } from './TestMetadata'
import { CompletedTestRun, TestRun } from './TestRun'
import { CompletedTestSuiteRun, TestSuiteRun } from './TestSuiteRun'

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
  TestRunStarted = 'TestRun/Started',
  TestRunCompleted = 'TestRun/Completed',

  // Document Run
  DocumentRunStarted = 'DocumentRun/Started',
  DocumentRunCompleted = 'DocumentRun/Completed',

  // TestSuite Run
  TestSuiteRunStarted = 'TestSuiteRun/Started',
  TestSuiteRunCompleted = 'TestSuiteRun/Completed',

  // TestCase Run
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
  readonly testMetadata: ReadonlyArray<TestMetadata['id']> // What module was created from
}
// #endregion

// #startregion Test Run
export type TestRunEvent = TestRunStarted | TestRunCompleted

export interface TestRunStarted {
  readonly type: TestEventType.TestRunStarted
  readonly testRun: TestRun
}

export interface TestRunCompleted {
  readonly type: TestEventType.TestRunCompleted
  readonly testRun: CompletedTestRun
}
// #endregion

// #startregion Document Run
export type DocumentRunEvent = DocumentRunStarted | DocumentRunCompleted

export interface DocumentRunStarted {
  readonly type: TestEventType.DocumentRunStarted
  readonly documentRun: DocumentRun
}

export interface DocumentRunCompleted {
  readonly type: TestEventType.DocumentRunCompleted
  readonly documentRun: CompletedDocumentRun
}
// #endregion

// #startregion TestSuite Run
export type TestSuiteRunEvent = TestSuiteRunStarted | TestSuiteRunCompleted

export interface TestSuiteRunStarted {
  readonly type: TestEventType.TestSuiteRunStarted
  readonly testSuiteRun: TestSuiteRun
}

export interface TestSuiteRunCompleted {
  readonly type: TestEventType.TestSuiteRunCompleted
  readonly testSuiteRun: CompletedTestSuiteRun
}
// #endregion

// #startregion TestCase Run
export type TestCaseRunEvent = TestCaseRunStarted | TestCaseRunCompleted

export interface TestCaseRunStarted {
  readonly type: TestEventType.TestCaseRunStarted
  readonly testCaseRun: TestCaseRun
}

export interface TestCaseRunCompleted {
  readonly type: TestEventType.TestCaseRunCompleted
  readonly testCaseRun: CompletedTestCaseRun
}
// #endregion
