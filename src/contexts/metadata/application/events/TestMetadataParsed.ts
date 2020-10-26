import { TestMetadata } from '@build/shared/domain'
import { createSchema, TypedSchemable } from '@typed/fp/io/exports'

export interface TestMetdataParsed {
  readonly type: 'testMetadata/parsed'
  readonly testMetadata: ReadonlyArray<TestMetadata>
}

export namespace TestMetdataParsed {
  export const schema = createSchema<TestMetdataParsed>(<S>(t: TypedSchemable<S>) =>
    t.type({
      type: t.literal('testMetadata/parsed'),
      testMetadata: t.array(TestMetadata.schema(t)),
    }),
  )
}
