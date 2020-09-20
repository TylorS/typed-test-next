import { Uri } from '@typed/fp/Uri'
import { pipe } from 'fp-ts/function'
import * as RA from 'fp-ts/ReadonlyArray'
import { ExportDeclaration, ExportSpecifier } from 'ts-morph'

import { ExportMetadata } from './ExportMetadata'
import { isTypedTest } from './isTypedTest'

export function findMetadataFromExportDeclarations(
  documentUri: Uri,
  exportDeclarations: readonly ExportDeclaration[],
): readonly ExportMetadata[] {
  return pipe(
    exportDeclarations,
    RA.filter(isSupportedExportDeclaration),
    RA.chain(getNamedExports),
    RA.chain(findTestFromExportSpecifier(documentUri)),
  )
}

function isSupportedExportDeclaration(node: ExportDeclaration): boolean {
  // Do no currently support exports from other modules. Is it even worthwhile?
  return !node.hasModuleSpecifier()
}

function getNamedExports(node: ExportDeclaration): ReadonlyArray<ExportSpecifier> {
  return node.getNamedExports()
}

function findTestFromExportSpecifier(documentUri: Uri) {
  return (specifier: ExportSpecifier): ReadonlyArray<ExportMetadata> => {
    const exportNames = [specifier.getText()]
    const declarations = specifier.getLocalTargetDeclarations()

    return pipe(
      declarations,
      RA.filter(isTypedTest),
      RA.map((node) => ({ documentUri, exportNames, node })),
    )
  }
}
