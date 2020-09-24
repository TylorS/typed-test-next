import { E, Path } from '@typed/fp'
import { lazy } from '@typed/fp/Disposable'
import { asyncEither, fromEnv, Resume, sync } from '@typed/fp/Effect'
import { Uri } from '@typed/fp/Uri'
import { writeFile } from 'fs'

import { getUrn, Urn } from '../model'
import { getPathFromUri } from './getPathFromUri'

export interface WriteDocumentEnv {
  readonly urns: ReadonlyArray<Urn>
  readonly writeDocument: (uri: Uri, contents: string) => Resume<E.Either<Error, string>>
}

export const writeDocument = (uri: Uri, contents: string) =>
  fromEnv((e: WriteDocumentEnv) => {
    const urn = getUrn(uri)

    return e.urns.includes(urn) ? e.writeDocument(uri, contents) : unsupportedUrn(urn)
  })

export function combineWriteDocumentEnvs(
  ...envs: ReadonlyArray<WriteDocumentEnv>
): WriteDocumentEnv {
  return {
    urns: Array.from(new Set(envs.flatMap((env) => env.urns))),
    writeDocument: (uri, contents) => {
      const urn = getUrn(uri)
      const env = envs.find((env) => env.urns.includes(urn))

      return env?.writeDocument(uri, contents) ?? unsupportedUrn(urn)
    },
  }
}

export function writeFileDocumentEnv(): WriteDocumentEnv {
  return {
    urns: [Urn.wrap('file')],
    writeDocument: (uri: Uri, contents) =>
      asyncEither((_, right) => {
        const path = getPathFromUri(uri)
        const disposable = lazy()

        writeFile(Path.unwrap(path), contents, () => {
          if (!disposable.disposed) {
            disposable.addDisposable(right(contents))
          }
        })

        return disposable
      }),
  }
}

function unsupportedUrn(urn: Urn) {
  return sync(E.left(new Error(`Unsupported Urn: ${urn}`)))
}
