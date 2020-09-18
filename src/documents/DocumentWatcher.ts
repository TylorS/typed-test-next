import { Stream } from '@most/types'
import { Uri } from '@typed/fp/Uri'

import { DocumentEvent, Urn } from '../model'

export interface DocumentWatcher {
  readonly urns: ReadonlyArray<Urn> // URNs that are supported by document watcher
  readonly watchDirectory: (directory: Uri) => Stream<DocumentEvent>
}
