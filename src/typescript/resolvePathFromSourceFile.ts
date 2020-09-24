import { memoize } from '@typed/fp/lambda'
import { Uri } from '@typed/fp/Uri'
import { eqString, getTupleEq } from 'fp-ts/lib/Eq'
import { identity, pipe } from 'fp-ts/lib/function'
import * as O from 'fp-ts/lib/Option'
import { dirname } from 'path'
import { sync as resolvePath, SyncOpts } from 'resolve'
import { SourceFile } from 'ts-morph'

import { TsConfigPathsResolver } from './resolveTsConfigPaths/exports'

const moduleDirectory = ['node_modules', '@types']
const extensions = ['.ts', '.tsx', '.js', '.jsx', '.json']
const getOptions = memoize(getTupleEq(eqString))(
  (fileName: string): SyncOpts => ({
    basedir: dirname(fileName),
    extensions,
    moduleDirectory,
    packageFilter: preferEsModule,
  }),
)

export type ResolvePathFromSourceFileOptions = {
  readonly moduleSpecifier: string
  readonly sourceFile: SourceFile
  readonly pathsResolver: TsConfigPathsResolver
}

export function resolvePathFromSourceFile({
  moduleSpecifier,
  sourceFile,
  pathsResolver,
}: ResolvePathFromSourceFileOptions): Uri {
  return pipe(
    moduleSpecifier,
    O.fromPredicate(pathsResolver.isInPaths),
    O.chain(pathsResolver.resolvePath),
    O.fold(
      () =>
        Uri.wrap(`file://${resolvePath(moduleSpecifier, getOptions(sourceFile.getFilePath()))}`),
      identity,
    ),
  )
}

export function preferEsModule(pkg: any): any {
  pkg.main = pkg.module || pkg['jsnext:main'] || pkg.main

  return pkg
}
