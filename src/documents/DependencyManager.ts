import { Uri } from '@typed/fp/Uri'
import { Option } from 'fp-ts/Option'

import { DocumentVersion } from './DocumentVersionManager'

export interface DependencyManager {
  readonly getDependenciesOfDocument: (uri: Uri) => readonly Uri[]
  readonly getDependentsOfDocument: (uri: Uri) => readonly Uri[]
  readonly getDocumentVersion: (uri: Uri) => Option<DocumentVersion>
  readonly removeDocument: (uri: Uri) => void
  readonly setDependenciesOfDocument: (uri: Uri, dependencies: readonly Uri[]) => void
  readonly updateDocumentVersion: (uri: Uri, version: DocumentVersion) => void
}
