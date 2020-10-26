import { TestMetadata } from '@build/shared/domain'
import { createSchema } from '@typed/fp/io/exports'

export type TestMetadataUpdated = {
  readonly type: 'testMetadata/updated'
  readonly testMetadata: readonly TestMetadata[]
}

export namespace TestMetadataUpdated {
  export const schema = createSchema<TestMetadataUpdated>((t) =>
    t.type({
      type: t.literal('testMetadata/updated'),
      testMetadata: t.array(TestMetadata.schema(t)),
    }),
  )
}
