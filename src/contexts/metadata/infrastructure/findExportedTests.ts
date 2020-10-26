import { Path } from '@typed/fp/Path/exports'
import { eqString } from 'fp-ts/Eq'
import * as RA from 'fp-ts/ReadonlyArray'
import { SourceFile, ts } from 'ts-morph'

import { ExportMetadata } from './ExportMetadata'
import { findExportedStatements } from './findExportedStatements'
import { findMetadataFromExportAssignments } from './findMetadataFromExportAssignments'
import { findMetadataFromExportedDeclarations } from './findMetadataFromExportedDeclarations'

const uniqStrings = RA.uniq(eqString)

export function findExportedTests(sourceFile: SourceFile): readonly ExportMetadata[] {
  const path = Path.wrap(sourceFile.getFilePath())

  const { exportAssignments, exportedDeclarations } = findExportedStatements(sourceFile)

  return deduplicateExportMetadata([
    ...findMetadataFromExportAssignments(path, exportAssignments),
    ...findMetadataFromExportedDeclarations(path, exportedDeclarations),
  ])
}

function deduplicateExportMetadata(
  exportMetadata: readonly ExportMetadata[],
): readonly ExportMetadata[] {
  const nodesSeen = new Map<ts.Node, ExportMetadata>()

  for (const metadata of exportMetadata) {
    const { node, exportNames } = metadata
    const { compilerNode } = node
    const deduplicated = nodesSeen.get(compilerNode) ?? metadata

    nodesSeen.set(compilerNode, {
      ...deduplicated,
      exportNames: uniqStrings([...deduplicated.exportNames, ...exportNames]),
    })
  }

  return Array.from(nodesSeen.values())
}
