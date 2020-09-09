import { Stream } from '@most/types'
import { Effect } from '@typed/fp/Effect'
import { Uri } from '@typed/fp/Uri'

import { Urn } from '../model'

export interface DocumentWatcher<E> {
  readonly urns: ReadonlyArray<Urn> // URNs that are supported by document watcher
  readonly watchDirectory: (directory: Uri) => Effect<E, Stream<DocumentEvent>>
}
