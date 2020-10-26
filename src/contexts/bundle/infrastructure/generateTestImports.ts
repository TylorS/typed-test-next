import { EXPORT_ASSIGNMENT_EXPORT_NAME } from '@build/shared/constants/exportAssignment'
import { Path } from '@typed/fp/Path/exports'
import { range } from 'fp-ts/ReadonlyArray'

import { createSimpleImport } from './createSimpleImport'
import { createSpecifier } from './createSpecifier'
import { TestsByDocument } from './TestsByDocument'

export function generateTestImports(testsByDocument: TestsByDocument) {
  let id = 0

  const idsByPath = new Map<Path, readonly number[]>()
  const testImports = testsByDocument.map(([path, tests]) => {
    const startId = id
    const importNames = tests
      .filter((test) => test.exportNames[0] !== EXPORT_ASSIGNMENT_EXPORT_NAME)
      .map((test, i) => `${test.exportNames[0]} as test${startId + i}`)

    const endId = startId + (importNames.length > 0 ? importNames.length - 1 : 0)

    id = endId + 1

    idsByPath.set(path, range(startId, endId))

    if (importNames.length === 0) {
      return `import test${startId} = require('${createSpecifier(Path.unwrap(path))}')`
    }

    const specifier = Path.unwrap(path)

    return createSimpleImport(importNames.join(', '), createSpecifier(specifier))
  })
  const byPath = Array.from(idsByPath.entries()).map(
    ([path, ids]) => [path, ids.map((id) => `test${id}`)] as const,
  )

  return [byPath, testImports] as const
}
