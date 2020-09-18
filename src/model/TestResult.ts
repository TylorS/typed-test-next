import { none, Option } from 'fp-ts/Option'

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

export const PassedTestResult: PassedTestResult = {
  type: TestResultType.Pass,
}

export interface FailedTestResult {
  readonly type: TestResultType.Fail
  readonly message: string
  readonly stack: Option<StackTrace>
}

export const FailedTestResult = (
  message: string,
  stack: Option<StackTrace> = none,
): FailedTestResult => ({
  type: TestResultType.Fail,
  message,
  stack,
})

export interface SkippedTestResult {
  readonly type: TestResultType.Skip
}

export const SkippedTestResult: SkippedTestResult = {
  type: TestResultType.Skip,
}

export interface TodoTestResult {
  readonly type: TestResultType.Todo
}

export const TodoTestResult: TodoTestResult = {
  type: TestResultType.Todo,
}

export interface SuiteResult {
  readonly type: TestResultType.Suite
  readonly results: ReadonlyArray<TestResult>
}

export const SuiteResult = (results: ReadonlyArray<TestResult>): SuiteResult => ({
  type: TestResultType.Suite,
  results,
})
