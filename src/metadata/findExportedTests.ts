import { Uri } from '@typed/fp/Uri'
import { SourceFile } from 'ts-morph'

import { ExportMetadata } from './ExportMetadata'
import { findExportedStatements } from './findExportedStatements'
import { findMetadataFromExportAssignments } from './findMetadataFromExportAssignments'
import { findMetadataFromExportDeclarations } from './findMetadataFromExportDeclarations'
import { findMetadataFromExportedDeclarations } from './findMetadataFromExportedDeclarations'

export function findExportedTests(sourceFile: SourceFile): readonly ExportMetadata[] {
  const documentUri = Uri.wrap(`file://${sourceFile.getFilePath()}`)

  const { exportAssignments, exportDeclarations, exportedDeclarations } = findExportedStatements(
    sourceFile,
  )

  return [
    ...findMetadataFromExportAssignments(documentUri, exportAssignments),
    ...findMetadataFromExportDeclarations(documentUri, exportDeclarations),
    ...findMetadataFromExportedDeclarations(documentUri, exportedDeclarations),
  ]
}
