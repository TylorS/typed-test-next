import { JsonRpc } from '@typed/fp/json-rpc'
import { Uri } from '@typed/fp/Uri'

import { TestConfig } from './TestConfig'

export interface TestMetadata extends NodeMetadata {
  readonly documentUri: Uri
  readonly exportNames: readonly string[]
}

export interface NodeMetadata extends NodePosition {
  readonly id: JsonRpc.Id
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
