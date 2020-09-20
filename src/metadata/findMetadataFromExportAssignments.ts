import { Uri } from '@typed/fp/Uri'
import { ExportAssignment, TypeGuards } from 'ts-morph'

import { ExportMetadata } from './ExportMetadata'
import { isTypedTest } from './isTypedTest'

export const EXPORT_EQUAL_EXPORT_NAME = 'export'

export function findMetadataFromExportAssignments(
  documentUri: Uri,
  exportAssignments: readonly ExportAssignment[],
): readonly ExportMetadata[] {
  return exportAssignments.flatMap((assignment): readonly ExportMetadata[] => {
    const statement = assignment.getExpression()

    if (!isTypedTest(statement)) {
      return []
    }

    if (TypeGuards.isIdentifier(statement)) {
      return statement
        .getImplementations()
        .map((i) => ({ documentUri, exportNames: [EXPORT_EQUAL_EXPORT_NAME], node: i.getNode() }))
    }

    return [
      {
        documentUri,
        exportNames: [EXPORT_EQUAL_EXPORT_NAME],
        node: statement,
      },
    ]
  })
}
