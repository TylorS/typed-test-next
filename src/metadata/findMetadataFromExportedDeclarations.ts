import { Uri } from '@typed/fp/Uri'
import { pipe } from 'fp-ts/function'
import * as RA from 'fp-ts/ReadonlyArray'
import { ExportedDeclarations, TypeGuards, VariableDeclaration } from 'ts-morph'

import { ExportMetadata } from './ExportMetadata'
import { findNodesIfIdentifier } from './findNodeIfIdentifier'
import { isTypedTest } from './isTypedTest'

export function findMetadataFromExportedDeclarations(
  documentUri: Uri,
  declarations: readonly ExportedDeclarations[],
): readonly ExportMetadata[] {
  return pipe(
    declarations,
    RA.filter(TypeGuards.isVariableDeclaration),
    RA.filter(isTypedTest),
    RA.chain(findExportMetadataFromVariableDeclaration(documentUri)),
  )
}

function findExportMetadataFromVariableDeclaration(documentUri: Uri) {
  return (declaration: VariableDeclaration) => {
    const exportNames = [declaration.getName()]
    const expression = declaration.getChildAtIndex(2)
    const nodes = findNodesIfIdentifier(expression)

    return nodes.map((node) => ({ documentUri, exportNames, node }))
  }
}
