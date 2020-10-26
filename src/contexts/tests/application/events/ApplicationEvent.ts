import { DocumentRunEvent } from './DocumentRunEvent'
import { TestCaseRunEvent } from './TestCaseRunEvent'
import { TestRunEvent } from './TestRunEvent'
import { TestSuiteRunEvent } from './TestSuiteRunEvent'

export type ApplicationEvent =
  | TestRunEvent
  | DocumentRunEvent
  | TestSuiteRunEvent
  | TestCaseRunEvent
