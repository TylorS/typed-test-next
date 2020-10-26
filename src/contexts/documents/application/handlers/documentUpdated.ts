import { diffPaths } from '@build/shared/infrastructure/diffPaths'
import {
  getDependencies,
  getVersion,
  readDocument,
  updateDependencies,
  updateVersion,
} from '@documents/application/services'
import { nextVersion } from '@documents/application/services/NextVersion'
import { Document } from '@documents/domain'
import { doEffect, Effect, EnvOf } from '@typed/fp/Effect/exports'
import { getState, HookEnv } from '@typed/fp/hooks/exports'
import { Path, pathEq } from '@typed/fp/Path/exports'
import { pipe } from 'fp-ts/function'
import { lookup } from 'fp-ts/Map'
import { getOrElse } from 'fp-ts/Option'

import { getDocumentsByPath } from '../model/DocumentsByPath'
import { sendAppEvent } from '../services/SendApplicationEvent'

const lookupPath = lookup(pathEq)

export type DocumentUpdatedEnv = HookEnv &
  EnvOf<typeof getDocumentsByPath> &
  EnvOf<typeof readDocument> &
  EnvOf<typeof getVersion> &
  EnvOf<typeof nextVersion> &
  EnvOf<typeof updateVersion> &
  EnvOf<typeof getDependencies> &
  EnvOf<typeof updateDependencies> &
  EnvOf<typeof sendAppEvent>

// TODO: setup directory level file watching
export const documentUpdated = (path: Path): Effect<DocumentUpdatedEnv, Document> => {
  const eff = doEffect(function* () {
    const state = yield* getDocumentsByPath
    const documentsByPath = getState(state)
    const currentDocument = pipe(
      documentsByPath,
      lookupPath(path),
      getOrElse(() => Document.fromPath(path)),
    )
    const currentVersion = yield* getVersion(currentDocument)
    const cachedContents = currentDocument.versions.get(currentVersion)
    const currentContents = yield* readDocument(path)

    // Ensure it really changed
    if (cachedContents === currentContents) {
      return currentDocument
    }

    const document = yield* getUpdatedDocument(currentDocument, currentContents)
    const currentDeps = yield* getDependencies(document.path)
    const updatedDeps = yield* updateDependencies(document.path)
    const removed = diffPaths(currentDeps, updatedDeps)
    const added = diffPaths(updatedDeps, currentDeps)

    if (removed.size > 0 || added.size > 0) {
      yield* sendAppEvent({
        type: 'dependencies/updated',
        document,
        dependencies: Array.from(updatedDeps),
      })
    }

    return document
  })

  return eff
}

const getUpdatedDocument = (currentDocument: Document, currentContents: string) => {
  const eff = doEffect(function* () {
    const version = yield* nextVersion(currentDocument)
    const updated: Document = {
      ...currentDocument,
      versions: new Map([...currentDocument.versions, [version, currentContents]]),
    }

    yield* updateVersion(updated, version)

    const documentsByPath = getState(yield* getDocumentsByPath)

    documentsByPath.set(updated.path, updated)

    return updated
  })

  return eff
}
