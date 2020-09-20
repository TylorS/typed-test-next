import { SourceFile } from 'ts-morph'

export function findExportedStatements(sourceFile: SourceFile) {
  const exportAssignments = sourceFile.getExportAssignments()
  const exportedDeclarations = sourceFile.getExportedDeclarations()

  return {
    exportAssignments,
    exportedDeclarations,
  } as const
}
