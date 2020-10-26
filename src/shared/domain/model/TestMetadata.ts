import { createSchema, TypedSchema } from '@typed/fp/io/exports'
import { getUuidKeyIso, UuidKey } from '@typed/fp/Key'
import { Path } from '@typed/fp/Path'
import { pathSchema } from '@typed/fp/Path/exports'
import { flow, pipe } from 'fp-ts/function'
import { some } from 'fp-ts/Option'

import { Test } from './Test'
import { TestConfig } from './TestConfig'

export interface TestMetadataId extends UuidKey<TestMetadata> {}

export namespace TestMetadataId {
  export const { wrap, unwrap } = getUuidKeyIso<TestMetadata>()
}

export interface TestMetadata extends NodeMetadata {
  readonly path: Path
  readonly exportNames: readonly string[]
}

export namespace TestMetadata {
  export const schema = createSchema<TestMetadata>((t) =>
    pipe(
      t.type({ path: pathSchema(t), exportNames: t.array(t.string) }),
      t.intersect(NodeMetadata.schema(t)),
    ),
  )
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

export namespace NodeMetadata {
  export const schema: TypedSchema<NodeMetadata> = createSchema<NodeMetadata>((t) =>
    pipe(
      t.type({
        id: t.newtype<NodeMetadataId>(t.uuid, flow(NodeMetadataId.wrap, some), 'NodeMetadataId'),
        type: t.literal('test-case', 'test-suite'),
        config: TestConfig.schema(t),
        text: t.string,
        children: t.array(t.lazy('NodeMetadataId', () => schema(t))),
      }),
      t.intersect(NodePosition.schema(t)),
    ),
  )
}

export interface NodePosition {
  readonly position: readonly [number, number]
  readonly startLine: number
  readonly endLine: number
  readonly numberOfLines: number
}

export namespace NodePosition {
  export const schema = createSchema<NodePosition>((t) =>
    t.type({
      position: t.tuple(t.number, t.number),
      startLine: t.number,
      endLine: t.number,
      numberOfLines: t.number,
    }),
  )
}
