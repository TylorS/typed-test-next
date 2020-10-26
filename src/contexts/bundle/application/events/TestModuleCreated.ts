import { TestMetadata, TestMetadataId } from '@build/shared/domain'
import { createSchema } from '@typed/fp/io/exports'
import { Path, pathSchema } from '@typed/fp/Path/exports'
import { flow } from 'fp-ts/function'
import { some } from 'fp-ts/Option'

export interface TestModuleCreated {
  readonly type: 'testModule/created'
  readonly path: Path // Must point to a file which can be imported as a ES Module
  readonly testMetadata: ReadonlyArray<TestMetadata['id']> // What module was created from
}

export namespace TestModuleCreated {
  export const schema = createSchema<TestModuleCreated>((t) =>
    t.type({
      type: t.literal('testModule/created'),
      path: pathSchema(t),
      testMetadata: t.array(
        t.newtype<TestMetadataId>(t.uuid, flow(TestMetadataId.wrap, some), 'TestMetadataId'),
      ),
    }),
  )
}
