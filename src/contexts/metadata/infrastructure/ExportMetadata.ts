import { Path } from '@typed/fp/Path/exports'
import { Node } from 'ts-morph'

export type ExportMetadata = {
  readonly path: Path
  readonly exportNames: readonly string[]
  readonly node: Node // Node is Test
}
