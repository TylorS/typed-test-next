import { StackFrame, StackTrace } from '@build/shared/domain/model'
import { fromTask, map, Pure } from '@typed/fp/Effect'
import { none, Option, some } from 'fp-ts/Option'
import * as RA from 'fp-ts/ReadonlyArray'
import * as STJS from 'stacktrace-js'

export const parseStackTrace = (error: unknown): Pure<StackTrace> => {
  const getStackFrames: Pure<ReadonlyArray<STJS.StackFrame>> = fromTask(
    error instanceof Error ? () => STJS.fromError(error) : STJS.get,
  )

  return map(RA.map(convertStackFrame), getStackFrames)
}

const fromString = (s: string): Option<string> => (s.length === 0 ? none : some(s))

function convertStackFrame(frame: STJS.StackFrame): StackFrame {
  return {
    columnNumber: frame.getColumnNumber(),
    lineNumber: frame.getLineNumber(),
    fileName: frame.getFileName(),
    functionName: fromString(frame.getFunctionName()),
    source: frame.getSource(),
  }
}
