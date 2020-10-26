import { Document, DocumentVersion } from '@documents/domain'
import { Pure } from '@typed/fp/Effect'
import { callOp, createOp, Op } from '@typed/fp/Op'

export const GET_VERSION = Symbol()
export type GET_VERSION = typeof GET_VERSION

export interface GetVersion
  extends Op<GET_VERSION, (document: Document) => Pure<DocumentVersion>> {}

export const GetVersion = createOp<GetVersion>(GET_VERSION)

export const getVersion = callOp(GetVersion)
