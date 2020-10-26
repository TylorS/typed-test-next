import { Pure } from '@typed/fp/Effect'
import { callOp, createOp, Op } from '@typed/fp/Op'
import { Path } from '@typed/fp/Path/exports'

export const DELETE_DOCUMENT = Symbol()
export type DELETE_DOCUMENT = typeof DELETE_DOCUMENT

export interface DeleteDocument extends Op<DELETE_DOCUMENT, (path: Path) => Pure<void>> {}

export const DeleteDocument = createOp<DeleteDocument>(DELETE_DOCUMENT)

export const deleteDocument = callOp(DeleteDocument)
