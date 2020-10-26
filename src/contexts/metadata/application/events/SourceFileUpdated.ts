import { createSchema, TypedSchemable } from '@typed/fp/io/exports'
import { HKT } from 'fp-ts/HKT'
import { SourceFile } from 'ts-morph'

export interface SourceFileUpdated {
  readonly type: 'sourceFile/updated'
  readonly sourceFile: SourceFile
}

export namespace SourceFileUpdated {
  export const schema = createSchema<SourceFileUpdated>(<S>(t: TypedSchemable<S>) =>
    t.type({
      type: t.literal('sourceFile/updated'),
      sourceFile: t.unknown as HKT<S, SourceFile>,
    }),
  )
}
