import { Uri } from '@typed/fp/Uri'
import { fromNullable } from 'fp-ts/Option'

import { DependencyManager } from './DependencyManager'
import { DocumentVersion } from './DocumentVersionManager'

export function createDependencyManager(): DependencyManager {
  const dependencyMap: Map<Uri, readonly Uri[]> = new Map()
  const dependentMap: Map<Uri, Uri[]> = new Map()
  const dependencyVersionMap: Map<Uri, DocumentVersion> = new Map()

  function setDependenciesOfDocument(uri: Uri, dependencies: readonly Uri[]) {
    dependencyMap.set(uri, dependencies)

    dependencies.forEach((dependency) => addToTree(dependency, uri, dependentMap))
  }

  function getDependenciesOfDocument(uri: Uri): readonly Uri[] {
    return dependencyMap.get(uri) ?? []
  }

  function getDependentsOfDocument(uri: Uri): readonly Uri[] {
    const dependents = dependentMap.get(uri) ?? []
    const documentsToProcess = dependents.slice()

    while (documentsToProcess.length > 0) {
      const documentToProcess = documentsToProcess.shift() as Uri
      const documentDependents = (dependentMap.get(documentToProcess) || []).filter(
        (x) => !dependents.includes(x),
      )

      if (documentDependents.length > 0) {
        dependents.push(...documentDependents)
        documentsToProcess.push(...documentDependents)
      }
    }

    return dependents
  }

  function removeDocument(uri: Uri) {
    dependencyMap.delete(uri)
    dependentMap.delete(uri)
    dependencyVersionMap.delete(uri)
  }

  function getDocumentVersion(uri: Uri) {
    return fromNullable(dependencyVersionMap.get(uri))
  }

  function updateDocumentVersion(uri: Uri, version: DocumentVersion) {
    dependencyVersionMap.set(uri, version)
  }

  return {
    setDependenciesOfDocument,
    getDependenciesOfDocument,
    getDependentsOfDocument,
    removeDocument,
    getDocumentVersion,
    updateDocumentVersion,
  }
}

function addToTree(parent: Uri, child: Uri, map: Map<Uri, Uri[]>) {
  if (!map.has(parent)) {
    map.set(parent, [])
  }

  const values = map.get(parent)!

  if (!values.includes(child)) {
    values.push(child)
  }
}
