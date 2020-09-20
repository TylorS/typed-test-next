import { Uri } from '@typed/fp/Uri'
import { pipe } from 'fp-ts/lib/function'
import * as RA from 'fp-ts/ReadonlyArray'
import { ExportAssignment } from 'ts-morph'

import { ExportMetadata } from './ExportMetadata'
import { findNodesIfIdentifier } from './findNodeIfIdentifier'
import { isTypedTest } from './isTypedTest'

export const EXPORT_ASSIGNMENT_EXPORT_NAME = '__EXPORT_ASSIGNMENT__'

export function findMetadataFromExportAssignments(
  documentUri: Uri,
  exportAssignments: readonly ExportAssignment[],
): readonly ExportMetadata[] {
  return pipe(
    exportAssignments,
    RA.map((assignment) => assignment.getExpression()),
    RA.filter(isTypedTest),
    RA.chain(findNodesIfIdentifier),
    RA.map((node) => ({
      documentUri,
      exportNames: [EXPORT_ASSIGNMENT_EXPORT_NAME],
      node,
    })),
  )
}
