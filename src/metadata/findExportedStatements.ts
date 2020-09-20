import { SourceFile } from 'ts-morph'

export function findExportedStatements(sourceFile: SourceFile) {
  const exportAssignments = sourceFile.getExportAssignments()
  const exportDeclarations = sourceFile.getExportDeclarations()
  const exportedDeclarations = Array.from(sourceFile.getExportedDeclarations().values()).flatMap(
    (s) => s,
  )

  return {
    exportAssignments,
    exportDeclarations,
    exportedDeclarations,
  } as const
}
