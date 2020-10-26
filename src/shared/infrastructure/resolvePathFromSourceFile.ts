import { memoize } from '@typed/fp/lambda'
import { Path } from '@typed/fp/Path/exports'
import { eqString, getTupleEq } from 'fp-ts/Eq'
import { identity, pipe } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import { dirname } from 'path'
import { sync as resolvePath, SyncOpts } from 'resolve'

import { TsConfigPathsResolver } from './resolveTsConfigPaths'

const moduleDirectory = ['node_modules', '@types']
const extensions = ['.ts', '.tsx', '.js', '.jsx', '.json']
const getEsmOptions = memoize(getTupleEq(eqString))(
  (fileName: string): SyncOpts => ({
    basedir: dirname(fileName),
    extensions,
    moduleDirectory,
    packageFilter: preferEsModule,
  }),
)

const getCjsOptions = memoize(getTupleEq(eqString))(
  (fileName: string): SyncOpts => ({
    basedir: dirname(fileName),
    extensions,
    moduleDirectory,
  }),
)

export type ResolvePathFromSourceFileOptions = {
  readonly moduleSpecifier: string
  readonly filePath: string
  readonly pathsResolver: TsConfigPathsResolver
  readonly preferEsm?: boolean
}

export function resolvePathFromSourceFile({
  moduleSpecifier,
  filePath,
  pathsResolver,
  preferEsm = false,
}: ResolvePathFromSourceFileOptions): Path {
  return pipe(
    moduleSpecifier,
    O.fromPredicate(pathsResolver.isInPaths),
    O.chain(pathsResolver.resolvePath),
    O.fold(
      () =>
        Path.wrap(
          resolvePath(
            moduleSpecifier,
            preferEsm ? getEsmOptions(filePath) : getCjsOptions(filePath),
          ),
        ),
      identity,
    ),
  )
}

export function preferEsModule(pkg: any): any {
  pkg.main = pkg.module || pkg['jsnext:main'] || pkg.main

  return pkg
}
