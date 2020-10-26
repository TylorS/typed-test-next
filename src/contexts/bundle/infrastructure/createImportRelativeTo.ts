import { dirname, relative } from 'path'

import { createSimpleImport } from './createSimpleImport'
import { createSpecifier } from './createSpecifier'

export function createImportRelativeTo(importName: string, toFile: string, fromFile: string) {
  const specifier = relative(dirname(fromFile), toFile)

  return createSimpleImport(importName, createSpecifier(specifier))
}
