import { Uri } from '@typed/fp/Uri'
import { SourceFile } from 'ts-morph'

import { resolvePathFromSourceFile } from './resolvePathFromSourceFile'
import { TsConfigPathsResolver } from './resolveTsConfigPaths/exports'

export function findSourceFileDependencies(
  sourceFile: SourceFile,
  pathsResolver: TsConfigPathsResolver,
): readonly Uri[] {
  return sourceFile.getImportStringLiterals().map((literal) =>
    resolvePathFromSourceFile({
      moduleSpecifier: literal.getText(),
      sourceFile,
      pathsResolver,
    }),
  )
}
