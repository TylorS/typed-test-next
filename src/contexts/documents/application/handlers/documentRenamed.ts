import { doEffect, Effect, EnvOf, zip } from '@typed/fp/Effect/exports'
import { Path } from '@typed/fp/Path/exports'
import { Option } from 'fp-ts/Option'

import { Document } from '../../domain'
import { documentDeleted } from './documentDeleted'
import { documentUpdated } from './documentUpdated'

export type DocumentRenamedEnv = EnvOf<typeof documentDeleted> & EnvOf<typeof documentUpdated>

// TODO: optimize by transferring dependencies and updating
// dependents in a way that doesn't just throw it away and recreate.
export const documentRenamed = (
  previous: Path,
  path: Path,
): Effect<
  DocumentRenamedEnv,
  { readonly previousDocument: Option<Document>; readonly document: Document }
> => {
  const eff = doEffect(function* () {
    const [previousDocument, document] = yield* zip([
      documentDeleted(previous),
      documentUpdated(path),
    ] as const)

    return {
      previousDocument,
      document,
    } as const
  })

  return eff
}
