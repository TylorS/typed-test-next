import { Path } from '@typed/fp/Path/exports'
import { createSharedRef, SharedRef, wrapSharedMap } from '@typed/fp/SharedRef/exports'

export const CURRENT_DOCUMENT_CONTENT = '@documents/sharedRef/CurrentDocumentContent'
export type CURRENT_DOCUMENT_CONTENT = typeof CURRENT_DOCUMENT_CONTENT

export interface CurrentDocumentContent
  extends SharedRef<CURRENT_DOCUMENT_CONTENT, Map<Path, string>> {}

export const CurrentDocumentContent = createSharedRef<CurrentDocumentContent>(
  CURRENT_DOCUMENT_CONTENT,
)

export const currentDocumentContent = wrapSharedMap(CurrentDocumentContent)
