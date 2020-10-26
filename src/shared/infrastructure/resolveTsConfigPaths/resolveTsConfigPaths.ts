import { TsConfig } from '@build/shared/domain'
import { Path } from '@typed/fp/Path/exports'
import { constant, constFalse, pipe } from 'fp-ts/function'
import { fromNullable, map, none, Option } from 'fp-ts/Option'
import { createMatchPath } from 'tsconfig-paths'

import { getFileExtensions } from '../getFileExtensions'

const DEFAULT_MAIN_FIELDS = ['module', 'jsnext:main', 'main']
const DEFAULT_BROWSER_MAIN_FIELDS = ['module', 'jsnext:main', 'browser', 'main']
const PATH_STAR_REGEX = /\/?\*$/

export type TsConfigPathsResolver = {
  readonly resolvePath: (moduleSpecifier: string) => Option<Path>
  readonly isInPaths: (moduleSpecifier: string) => boolean
}

// Only supports file://
export function createResolveTsConfigPaths({
  tsConfig,
  extensions = getFileExtensions(tsConfig.compilerOptions),
  browser = false,
  mainFields = browser ? DEFAULT_BROWSER_MAIN_FIELDS : DEFAULT_MAIN_FIELDS,
}: CreateResolveTsConfigPathsOptions): TsConfigPathsResolver {
  const {
    compilerOptions: { baseUrl, paths = {} },
  } = tsConfig
  const pathsKeys = Object.keys(paths)
  const pathsKeysWithoutStars = pathsKeys.map((key) => key.replace(PATH_STAR_REGEX, ''))
  const canMatchPath = baseUrl && pathsKeys.length > 0
  const matchPath = canMatchPath ? createMatchPath(baseUrl!, paths, Array.from(mainFields)) : null

  const resolvePath: (moduleSpecifier: string) => Option<Path> = matchPath
    ? (specifier: string) =>
        pipe(matchPath(specifier, undefined, undefined, extensions), fromNullable, map(Path.wrap))
    : constant(none)

  const isInPaths = canMatchPath
    ? (moduleSpecifier: string): boolean =>
        pathsKeysWithoutStars.some((x) => moduleSpecifier.startsWith(x))
    : constFalse

  return {
    resolvePath,
    isInPaths,
  }
}

export type CreateResolveTsConfigPathsOptions = {
  readonly tsConfig: TsConfig
  readonly extensions?: readonly string[]
  readonly mainFields?: readonly string[]
  readonly browser?: boolean
}
