import { makeAbsolute } from '@build/common/makeAbsolute'
import { Path } from '@typed/fp/Path'
import { sync } from 'fast-glob'

export function findFilePaths(directory: string, fileGlobs: readonly string[]): readonly Path[] {
  return sync(Array.from(fileGlobs), { cwd: directory, onlyFiles: true }).map((x) =>
    Path.wrap(makeAbsolute(directory, x.toString())),
  )
}
