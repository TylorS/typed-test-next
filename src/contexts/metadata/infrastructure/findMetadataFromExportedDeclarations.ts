import { Path } from '@typed/fp/Path/exports'
import { pipe } from 'fp-ts/function'
import { ordString } from 'fp-ts/Ord'
import * as RA from 'fp-ts/ReadonlyArray'
import * as RM from 'fp-ts/ReadonlyMap'
import { ExportedDeclarations, TypeGuards, VariableDeclaration } from 'ts-morph'

import { ExportMetadata } from './ExportMetadata'
import { findNodesIfIdentifier } from './findNodeIfIdentifier'
import { getNodeFromVariableDeclaration } from './getNodeFromVariableDeclaration'
import { isTypedTest } from './isTypedTest'

export function findMetadataFromExportedDeclarations(
  path: Path,
  exportDeclarationsByExportName: ReadonlyMap<string, ExportedDeclarations[]>,
): readonly ExportMetadata[] {
  return pipe(
    exportDeclarationsByExportName,
    RM.map((declarations) =>
      pipe(
        declarations,
        RA.filter(TypeGuards.isVariableDeclaration),
        RA.filter(isTypedTest),
        RA.chain(findExportMetadataFromVariableDeclaration(path)),
      ),
    ),
    RM.toReadonlyArray(ordString),
    RA.chain(([exportName, metadata]) =>
      metadata.map((m) => ({ ...m, exportNames: [exportName] })),
    ),
  )
}

function findExportMetadataFromVariableDeclaration(path: Path) {
  return (declaration: VariableDeclaration) => {
    return pipe(
      declaration,
      getNodeFromVariableDeclaration,
      findNodesIfIdentifier,
      RA.map((node) => ({ path, node })),
    )
  }
}
