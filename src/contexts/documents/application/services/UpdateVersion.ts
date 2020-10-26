import { Document, DocumentVersion } from '@documents/domain'
import { Pure } from '@typed/fp/Effect'
import { callOp, createOp, Op } from '@typed/fp/Op'

export const UPDATE_VERSION = Symbol()
export type UPDATE_VERSION = typeof UPDATE_VERSION

export interface UpdateVersion
  extends Op<
    UPDATE_VERSION,
    (document: Document, version: DocumentVersion) => Pure<DocumentVersion>
  > {}

export const UpdateVersion = createOp<UpdateVersion>(UPDATE_VERSION)

export const updateVersion = callOp(UpdateVersion)
