import { TestMetadata } from '@build/shared'
import { Effect, map } from '@typed/fp/Effect'
import { UuidEnv } from '@typed/fp/Uuid'

import { ExportMetadata } from './ExportMetadata'
import { findNodeMetadata } from './findNodeMetadata'

export function findTestMetadata({
  path,
  exportNames,
  node,
}: ExportMetadata): Effect<UuidEnv, TestMetadata> {
  return map((nodeMetadata) => ({ ...nodeMetadata, path, exportNames }), findNodeMetadata(node))
}
