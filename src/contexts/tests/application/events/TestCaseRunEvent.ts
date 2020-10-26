import { CompletedTestCaseRun, TestCaseRun } from '@build/shared/domain'

export type TestCaseRunEvent = TestCaseRunStarted | TestCaseRunCompleted

export interface TestCaseRunStarted {
  readonly type: 'testCaseRun/started'
  readonly testCaseRun: TestCaseRun
}

export interface TestCaseRunCompleted {
  readonly type: 'testCaseRun/completed'
  readonly testCaseRun: CompletedTestCaseRun
}
