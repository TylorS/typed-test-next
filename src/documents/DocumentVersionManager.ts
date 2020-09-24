import { Uri } from '@typed/fp/Uri'
import { Option } from 'fp-ts/Option'
import { iso, Newtype } from 'newtype-ts'

export interface DocumentVersion
  extends Newtype<{ readonly DocumentVersion: unique symbol }, number> {}

export namespace DocumentVersion {
  export const { wrap, unwrap } = iso<DocumentVersion>()
}

export type DocumentVersionManager = {
  readonly applyChanges: () => ReadonlyArray<readonly [Uri, Option<DocumentVersion>]>
  readonly documentVersionOf: (uri: Uri, includeQueue: boolean) => Option<DocumentVersion>
  readonly removeDocumentVersion: (uri: Uri) => void
  readonly updateDocumentVersion: (uri: Uri, version: DocumentVersion) => void
}
