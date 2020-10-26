import { EXPORT_ASSIGNMENT_EXPORT_NAME } from '@build/shared/constants/exportAssignment'
import { Path } from '@typed/fp/Path/exports'
import { pipe } from 'fp-ts/function'
import * as RA from 'fp-ts/ReadonlyArray'
import { ExportAssignment } from 'ts-morph'

import { ExportMetadata } from './ExportMetadata'
import { findNodesIfIdentifier } from './findNodeIfIdentifier'
import { isTypedTest } from './isTypedTest'

export function findMetadataFromExportAssignments(
  path: Path,
  exportAssignments: readonly ExportAssignment[],
): readonly ExportMetadata[] {
  return pipe(
    exportAssignments,
    RA.map((assignment) => assignment.getExpression()),
    RA.filter(isTypedTest),
    RA.chain(findNodesIfIdentifier),
    RA.map((node) => ({
      path,
      exportNames: [EXPORT_ASSIGNMENT_EXPORT_NAME],
      node,
    })),
  )
}
