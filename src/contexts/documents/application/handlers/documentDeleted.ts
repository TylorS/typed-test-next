import { Document } from '@documents/domain'
import { doEffect, Effect, EnvOf } from '@typed/fp/Effect/exports'
import { getState } from '@typed/fp/hooks/exports'
import { Path, pathEq } from '@typed/fp/Path/exports'
import { pipe } from 'fp-ts/function'
import { lookup } from 'fp-ts/Map'
import { Option } from 'fp-ts/Option'

import { getDocumentsByPath } from '../model/DocumentsByPath'
import { deleteDocument } from '../services'

const lookupPath = lookup(pathEq)

export type DocumentDeletedEnv = EnvOf<typeof getDocumentsByPath> & EnvOf<typeof deleteDocument>

export const documentDeleted = (path: Path): Effect<DocumentDeletedEnv, Option<Document>> => {
  const eff = doEffect(function* () {
    const documentsByPath = getState(yield* getDocumentsByPath)
    const document = pipe(documentsByPath, lookupPath(path))

    documentsByPath.delete(path)

    yield* deleteDocument(path)

    return document
  })

  return eff
}
