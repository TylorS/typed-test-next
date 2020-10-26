import { CompletedTestSuiteRun, TestSuiteRun } from '@build/shared/domain'

export type TestSuiteRunEvent = TestSuiteRunStarted | TestSuiteRunCompleted

export interface TestSuiteRunStarted {
  readonly type: 'testSuiteRun/started'
  readonly testSuiteRun: TestSuiteRun
}

export interface TestSuiteRunCompleted {
  readonly type: 'testSuiteRun/completed'
  readonly testSuiteRun: CompletedTestSuiteRun
}
