import { getUuidKeyIso, UuidKey } from '@typed/fp/Key'
import { Uri } from '@typed/fp/Uri'

import { Test } from './Test'
import { TestConfig } from './TestConfig'

export interface TestMetadataId extends UuidKey<TestMetadata> {}

export namespace TestMetadataId {
  export const { wrap, unwrap } = getUuidKeyIso<TestMetadata>()
}

export interface TestMetadata extends NodeMetadata {
  readonly documentUri: Uri
  readonly exportNames: readonly string[]
}

export interface NodeMetadataId extends UuidKey<NodeMetadata> {}

export namespace NodeMetadataId {
  export const { wrap, unwrap } = getUuidKeyIso<NodeMetadata>()
}

export interface NodeMetadata extends NodePosition {
  readonly id: NodeMetadataId
  readonly type: Test['type']
  readonly config: TestConfig
  readonly text: string
  readonly children: readonly NodeMetadata[]
}

export interface NodePosition {
  readonly position: readonly [number, number]
  readonly startLine: number
  readonly endLine: number
  readonly numberOfLines: number
}
