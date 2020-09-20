import { Effect, map } from '@typed/fp/Effect'
import { UuidEnv } from '@typed/fp/Uuid'

import { TestMetadata } from '../model'
import { ExportMetadata } from './ExportMetadata'
import { findNodeMetadata } from './findNodeMetadata'

export function findTestMetadata({
  documentUri,
  exportNames,
  node,
}: ExportMetadata): Effect<UuidEnv, TestMetadata> {
  return map(
    (nodeMetadata) => ({ ...nodeMetadata, documentUri, exportNames }),
    findNodeMetadata(node),
  )
}
