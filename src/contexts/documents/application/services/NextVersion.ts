import { Document, DocumentVersion } from '@documents/domain'
import { Pure } from '@typed/fp/Effect'
import { callOp, createOp, Op } from '@typed/fp/Op'

export const NEXT_VERSION = Symbol()
export type NEXT_VERSION = typeof NEXT_VERSION

export interface NextVersion
  extends Op<NEXT_VERSION, (document: Document) => Pure<DocumentVersion>> {}

export const NextVersion = createOp<NextVersion>(NEXT_VERSION)

export const nextVersion = callOp(NextVersion)
