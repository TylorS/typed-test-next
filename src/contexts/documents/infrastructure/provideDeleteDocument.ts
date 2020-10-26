import { DeleteDocument } from '@documents/application/services'
import { doEffect } from '@typed/fp/Effect/exports'
import { provideOp } from '@typed/fp/Op/exports'

import { currentDocumentContent, currentDocumentVersion, dependencyMap } from './sharedRefs'

export const provideDeleteDocument = provideOp(DeleteDocument, (path) => {
  const eff = doEffect(function* () {
    yield* currentDocumentVersion.delete(path)
    yield* currentDocumentContent.delete(path)
    yield* dependencyMap.delete(path)
  })

  return eff
})
