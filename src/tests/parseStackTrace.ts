import { fromTask, map, Pure } from '@typed/fp/Effect'
import { none, Option, some } from 'fp-ts/es6/Option'
import * as STJS from 'stacktrace-js'

import { StackFrame, StackTrace } from '../model'

export const parseStackTrace = (error: unknown): Pure<StackTrace> => {
  const getStackFrames: Pure<ReadonlyArray<StackFrame>> = fromTask(
    error instanceof Error ? () => STJS.fromError(error) : STJS.get,
  )

  return map(convertStackFrames, getStackFrames)
}

const fromString = (s: string): Option<string> => (s.length === 0 ? none : some(s))

function convertStackFrames(frame: STJS.StackFrame): StackFrame {
  return {
    columnNumber: frame.getColumnNumber(),
    lineNumber: frame.getLineNumber(),
    fileName: frame.getFileName(),
    functionName: fromString(frame.getFunctionName()),
    source: frame.getSource(),
  }
}
