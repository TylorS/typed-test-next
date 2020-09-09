import { Option } from 'fp-ts/es6/Option'

import { StackTrace } from './StackTrace'

export type TestResult =
  | PassedTestResult
  | SkippedTestResult
  | TodoTestResult
  | FailedTestResult
  | SuiteResult

export enum TestResultType {
  Pass = 'pass',
  Fail = 'fail',
  Skip = 'skip',
  Todo = 'todo',
  Suite = 'suite',
}

export interface PassedTestResult {
  readonly type: TestResultType.Pass
}

export interface FailedTestResult {
  readonly type: TestResultType.Fail
  readonly message: string
  readonly stack: Option<StackTrace>
}

export interface SkippedTestResult {
  readonly type: TestResultType.Skip
}

export interface TodoTestResult {
  readonly type: TestResultType.Todo
}

export interface SuiteResult {
  readonly type: TestResultType.Suite
  readonly results: ReadonlyArray<TestResult>
}
