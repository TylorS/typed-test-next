import { Uri } from '@typed/fp/Uri'
import { ExportDeclaration } from 'ts-morph'

import { ExportMetadata } from './ExportMetadata'
import { isTypedTest } from './isTypedTest'

export function findMetadataFromExportDeclarations(
  documentUri: Uri,
  exportDeclarations: readonly ExportDeclaration[],
): readonly ExportMetadata[] {
  return exportDeclarations.flatMap((declaration) => {
    // Do not currently support external modules
    if (declaration.hasModuleSpecifier()) {
      return []
    }

    return declaration.getNamedExports().flatMap((specifier): readonly ExportMetadata[] => {
      const exportName = specifier.getText()
      const declarations = specifier.getLocalTargetDeclarations()

      return declarations.flatMap((declaration) => {
        if (!isTypedTest(declaration)) {
          return []
        }

        return [
          {
            documentUri,
            exportNames: [exportName],
            node: declaration,
          },
        ]
      })
    })
  })
}
