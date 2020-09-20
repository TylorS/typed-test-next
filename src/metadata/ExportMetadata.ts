import { Uri } from '@typed/fp/Uri'
import { Node } from 'ts-morph'

export type ExportMetadata = {
  readonly documentUri: Uri
  readonly exportNames: string[]
  readonly node: Node // Node is Test
}
