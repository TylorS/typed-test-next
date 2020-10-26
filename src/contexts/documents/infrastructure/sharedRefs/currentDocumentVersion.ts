import { DocumentVersion } from '@documents/domain/model'
import { Path } from '@typed/fp/Path/exports'
import { createSharedRef, SharedRef, wrapSharedMap } from '@typed/fp/SharedRef/exports'

export const CURRENT_DOCUMENT_VERSION = '@documents/sharedRef/CurrentDocumentVersion'
export type CURRENT_DOCUMENT_VERSION = typeof CURRENT_DOCUMENT_VERSION

export interface CurrentDocumentVersion
  extends SharedRef<CURRENT_DOCUMENT_VERSION, Map<Path, DocumentVersion>> {}

export const CurrentDocumentVersion = createSharedRef<CurrentDocumentVersion>(
  CURRENT_DOCUMENT_VERSION,
)

export const currentDocumentVersion = wrapSharedMap(CurrentDocumentVersion)
