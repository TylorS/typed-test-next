import { CompletedTestRun, TestRun } from '@build/shared/domain'

export type TestRunEvent = TestRunStarted | TestRunCompleted

export interface TestRunStarted {
  readonly type: 'testRun/started'
  readonly testRun: TestRun
}

export interface TestRunCompleted {
  readonly type: 'testRun/completed'
  readonly testRun: CompletedTestRun
}
