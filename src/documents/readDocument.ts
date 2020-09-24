import { Path } from '@typed/fp'
import { lazy } from '@typed/fp/Disposable'
import { asyncEither, fromEnv, Resume, sync } from '@typed/fp/Effect'
import { Uri } from '@typed/fp/Uri'
import { Either, left } from 'fp-ts/Either'
import { readFile } from 'fs'

import { getUrn, Urn } from '../model'
import { getPathFromUri } from './getPathFromUri'

export interface ReadDocumentEnv {
  readonly urns: ReadonlyArray<Urn>
  readonly readDocument: (uri: Uri) => Resume<Either<Error, string>>
}

export const readDocument = (uri: Uri) =>
  fromEnv((e: ReadDocumentEnv) => {
    const urn = getUrn(uri)

    return e.urns.includes(urn) ? e.readDocument(uri) : unsupportedUrn(urn)
  })

export function combineReadDocumentEnvs(...envs: ReadonlyArray<ReadDocumentEnv>): ReadDocumentEnv {
  return {
    urns: Array.from(new Set(envs.flatMap((env) => env.urns))),
    readDocument: (uri) => {
      const urn = getUrn(uri)
      const env = envs.find((env) => env.urns.includes(urn))

      return env?.readDocument(uri) ?? unsupportedUrn(urn)
    },
  }
}

export function readFileDocumentEnv(): ReadDocumentEnv {
  return {
    urns: [Urn.wrap('file')],
    readDocument: (uri: Uri) =>
      asyncEither((left, right) => {
        const path = getPathFromUri(uri)
        const disposable = lazy()

        readFile(Path.unwrap(path), (err, buffer) => {
          if (!disposable.disposed) {
            disposable.addDisposable(err ? left(err) : right(buffer.toString()))
          }
        })

        return disposable
      }),
  }
}

function unsupportedUrn(urn: Urn) {
  return sync(left(new Error(`Unsupported Urn: ${urn}`)))
}
