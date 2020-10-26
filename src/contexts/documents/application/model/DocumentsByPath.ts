import { Document } from '@documents/domain'
import { State } from '@typed/fp/hooks/exports'
import { Path } from '@typed/fp/Path/exports'
import { createSharedRef, readSharedRef, SharedRef } from '@typed/fp/SharedRef/exports'

export const DOCUMENT_BY_PATH = '@documents/sharedRef/DocumentsByPath'
export type DOCUMENT_BY_PATH = typeof DOCUMENT_BY_PATH

export interface DocumentsByPath extends SharedRef<DOCUMENT_BY_PATH, State<Map<Path, Document>>> {}

export const DocumentsByPath = createSharedRef<DocumentsByPath>(DOCUMENT_BY_PATH)

export const getDocumentsByPath = readSharedRef(DocumentsByPath)
