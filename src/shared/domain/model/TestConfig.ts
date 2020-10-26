import { createSchema } from '@typed/fp/io/exports'
import { pipe } from 'fp-ts/function'

import { TestModifier } from './TestModifier'

export type TestConfig<
  A extends string = string,
  B extends TestModifier = TestModifier,
  C extends number = number
> = {
  readonly label: A
  readonly modifier: B
  readonly timeout?: C
}

export namespace TestConfig {
  export const schema = createSchema<TestConfig>((t) =>
    pipe(
      t.type({
        label: t.string,
        modifier: t.literal('default', 'only', 'skip', 'todo'),
      }),
      t.intersect(
        t.partial({
          timeout: t.number,
        }),
      ),
    ),
  )
}
