import { GetVersion } from '@documents/application/services'
import { DocumentVersion } from '@documents/domain'
import { doEffect } from '@typed/fp/Effect/exports'
import { provideOp } from '@typed/fp/Op/exports'
import { pipe } from 'fp-ts/function'
import { getOrElse } from 'fp-ts/Option'

import { currentDocumentVersion } from './sharedRefs/currentDocumentVersion'

export const provideGetVersion = provideOp(GetVersion, (doc) =>
  doEffect(function* () {
    const option = yield* currentDocumentVersion.get(doc.path)

    return pipe(
      option,
      getOrElse(() => DocumentVersion.wrap(1)),
    )
  }),
)
