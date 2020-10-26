import { DependenciesUpdated } from './DependenciesUpdated'
import { DocumentDeleted } from './DocumentDeleted'
import { DocumentRenamed } from './DocumentRenamed'
import { DocumentUpdated } from './DocumentUpdated'

export type ApplicationEvent = DocumentEvent | DependenciesUpdated

export type DocumentEvent = DocumentUpdated | DocumentRenamed | DocumentDeleted
