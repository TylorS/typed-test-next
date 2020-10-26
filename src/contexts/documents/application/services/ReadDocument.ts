import { Pure } from '@typed/fp/Effect'
import { callOp, createOp, Op } from '@typed/fp/Op'
import { Path } from '@typed/fp/Path/exports'

export const READ_DOCUMENT = Symbol()
export type READ_DOCUMENT = typeof READ_DOCUMENT

export interface ReadDocument extends Op<READ_DOCUMENT, (path: Path) => Pure<string>> {}

export const ReadDocument = createOp<ReadDocument>(READ_DOCUMENT)

export const readDocument = callOp(ReadDocument)
