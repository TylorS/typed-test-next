import { ReadDocument } from '@documents/application/services'
import { lazy } from '@typed/fp/Disposable/exports'
import { doEffect } from '@typed/fp/Effect/exports'
import { fromEnv } from '@typed/fp/Effect/fromEnv'
import { provideOp } from '@typed/fp/Op/exports'
import { Path } from '@typed/fp/Path/exports'
import { asyncEither } from '@typed/fp/Resume/exports'
import { readFile } from 'fs'

export const provideReadDocument = provideOp(ReadDocument, (path) =>
  doEffect(function* () {
    const buffer = yield* read(Path.unwrap(path))

    return buffer.toString()
  }),
)

const read = (filePath: string) =>
  fromEnv(() =>
    asyncEither<Error, Buffer>((l, r) => {
      const disposable = lazy()

      readFile(filePath, (err, result) => {
        if (disposable.disposed) {
          return
        }

        if (err) {
          return disposable.addDisposable(l(err))
        }

        disposable.addDisposable(r(result))
      })

      return disposable
    }),
  )
