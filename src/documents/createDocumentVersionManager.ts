import { O } from '@typed/fp'
import { Uri } from '@typed/fp/Uri'
import { pipe } from 'fp-ts/lib/function'

import { DocumentVersion, DocumentVersionManager } from './DocumentVersionManager'

export function createDocumentVersionManager(): DocumentVersionManager {
  const documentVersions: Map<Uri, DocumentVersion> = new Map()
  const queue: Map<Uri, O.Option<DocumentVersion>> = new Map()

  function updateDocumentVersion(uri: Uri, version: DocumentVersion) {
    queue.set(uri, O.some(version))
  }

  function removeDocumentVersion(uri: Uri) {
    queue.set(uri, O.none)
  }

  function applyChanges(): ReadonlyArray<readonly [Uri, O.Option<DocumentVersion>]> {
    const currentQueue = new Map(Array.from(queue.entries()))

    queue.clear()

    const keys = Array.from(currentQueue.keys())

    return keys.map((key) => {
      const version = currentQueue.get(key)!

      if (O.isNone(version)) {
        documentVersions.delete(key)
      } else {
        documentVersions.set(key, version.value)
      }

      return [key, version]
    })
  }

  function documentVersionOf(uri: Uri, includeQueue?: boolean): O.Option<DocumentVersion> {
    if (includeQueue) {
      return pipe(
        O.fromNullable(queue.get(uri)),
        O.flatten,
        O.alt(() => O.fromNullable(documentVersions.get(uri))),
      )
    }

    return O.fromNullable(documentVersions.get(uri))
  }

  return {
    updateDocumentVersion,
    removeDocumentVersion,
    applyChanges,
    documentVersionOf,
  }
}
