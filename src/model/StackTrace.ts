import { Option } from 'fp-ts/es6/Option'

/**
 * JSON-serializable stack trace
 */
export interface StackTrace extends ReadonlyArray<StackFrame> {}

export interface StackFrame {
  readonly columnNumber: number
  readonly lineNumber: number
  readonly fileName: string
  readonly functionName: Option<string>
  readonly source: string
}
