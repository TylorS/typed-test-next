import { NextVersion } from '@documents/application/services/NextVersion'
import { DocumentVersion } from '@documents/domain'
import { doEffect } from '@typed/fp/Effect/exports'
import { provideOp } from '@typed/fp/Op/exports'
import { flow, increment, pipe } from 'fp-ts/function'
import { fold } from 'fp-ts/Option'

import { currentDocumentVersion } from './sharedRefs/currentDocumentVersion'

export const provideNextVersion = provideOp(NextVersion, (doc) =>
  doEffect(function* () {
    const version = yield* currentDocumentVersion.get(doc.path)

    return pipe(
      version,
      fold(
        () => DocumentVersion.wrap(1),
        flow(DocumentVersion.unwrap, increment, DocumentVersion.wrap),
      ),
    )
  }),
)
