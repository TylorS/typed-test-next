import { Uri } from '@typed/fp/Uri'
import { ExportedDeclarations, TypeGuards } from 'ts-morph'

import { ExportMetadata } from './ExportMetadata'
import { isTypedTest } from './isTypedTest'

export function findMetadataFromExportedDeclarations(
  documentUri: Uri,
  declarations: readonly ExportedDeclarations[],
): readonly ExportMetadata[] {
  return declarations
    .flatMap((declaration) => {
      if (!TypeGuards.isVariableDeclaration(declaration) || !isTypedTest(declaration)) {
        return []
      }

      const exportName = declaration.getName()
      const expression = declaration.getChildAtIndex(2)

      if (TypeGuards.isIdentifier(expression)) {
        return expression
          .getImplementations()
          .map((i) => ({ documentUri, exportNames: [exportName], node: i.getNode() }))
      }

      return [
        {
          documentUri,
          exportNames: [exportName],
          node: expression,
        },
      ]
    })
    .filter(({ node }) => isTypedTest(node))
}
