import { Option } from 'fp-ts/Option'

/**
 * JSON-serializable stack trace
 */
export interface StackTrace extends ReadonlyArray<StackFrame> {}

export interface StackFrame {
  readonly columnNumber: number
  readonly lineNumber: number
  readonly fileName: string // TODO: can/should this be NonEmptyString
  readonly functionName: Option<string>
  readonly source: string // TODO: can/should this be NonEmptyString
}
