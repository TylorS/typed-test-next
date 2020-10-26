import { Path } from '@typed/fp/Path/exports'
import { SourceFile } from 'ts-morph'

import { resolvePathFromSourceFile } from './resolvePathFromSourceFile'
import { TsConfigPathsResolver } from './resolveTsConfigPaths'

export function findSourceFileDependencies(
  sourceFile: SourceFile,
  pathsResolver: TsConfigPathsResolver,
): readonly Path[] {
  return sourceFile.getImportStringLiterals().map((literal) =>
    resolvePathFromSourceFile({
      moduleSpecifier: literal.getText(),
      filePath: sourceFile.getFilePath(),
      pathsResolver,
    }),
  )
}
