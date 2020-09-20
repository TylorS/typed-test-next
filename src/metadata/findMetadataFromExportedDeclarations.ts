import { Uri } from '@typed/fp/Uri'
import { pipe } from 'fp-ts/function'
import { ordString } from 'fp-ts/lib/Ord'
import * as RA from 'fp-ts/ReadonlyArray'
import * as RM from 'fp-ts/ReadonlyMap'
import { ExportedDeclarations, TypeGuards, VariableDeclaration } from 'ts-morph'

import { ExportMetadata } from './ExportMetadata'
import { findNodesIfIdentifier } from './findNodeIfIdentifier'
import { getNodeFromVariableDeclaration } from './getNodeFromVariableDeclaration'
import { isTypedTest } from './isTypedTest'

export function findMetadataFromExportedDeclarations(
  documentUri: Uri,
  exportDeclarationsByExportName: ReadonlyMap<string, ExportedDeclarations[]>,
): readonly ExportMetadata[] {
  return pipe(
    exportDeclarationsByExportName,
    RM.map((declarations) =>
      pipe(
        declarations,
        RA.filter(TypeGuards.isVariableDeclaration),
        RA.filter(isTypedTest),
        RA.chain(findExportMetadataFromVariableDeclaration(documentUri)),
      ),
    ),
    RM.toReadonlyArray(ordString),
    RA.chain(([exportName, metadata]) =>
      metadata.map((m) => ({ ...m, exportNames: [exportName] })),
    ),
  )
}

function findExportMetadataFromVariableDeclaration(documentUri: Uri) {
  return (declaration: VariableDeclaration) => {
    return pipe(
      declaration,
      getNodeFromVariableDeclaration,
      findNodesIfIdentifier,
      RA.map((node) => ({ documentUri, node })),
    )
  }
}
