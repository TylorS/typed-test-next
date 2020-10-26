import { UpdateVersion } from '@documents/application/services'
import { provideOp } from '@typed/fp/Op/exports'

import { currentDocumentVersion } from './sharedRefs/currentDocumentVersion'

export const provideUpdateVersion = provideOp(UpdateVersion, (doc, version) =>
  currentDocumentVersion.set(doc.path, version),
)
