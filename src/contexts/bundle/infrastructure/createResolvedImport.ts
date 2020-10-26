import { resolvePathFromSourceFile, TsConfigPathsResolver } from '@build/shared'
import { Path } from '@typed/fp/Path/exports'

import { createImportRelativeTo } from './createImportRelativeTo'

export function createResolvedImport(
  importNames: readonly string[],
  moduleSpecifier: string,
  testFilePath: string,
  pathsResolver: TsConfigPathsResolver,
  preferEsm: boolean,
) {
  const path = resolvePathFromSourceFile({
    moduleSpecifier,
    filePath: __filename,
    pathsResolver,
    preferEsm,
  })

  return createImportRelativeTo(importNames.join(','), Path.unwrap(path), testFilePath)
}
