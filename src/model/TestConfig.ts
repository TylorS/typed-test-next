import { Option } from 'fp-ts/Option'

import { TestModifier } from './TestModifier'

export type TestConfig<
  A extends string = string,
  B extends TestModifier = TestModifier,
  C extends number = number
> = {
  readonly label: A
  readonly modifier: B
  readonly timeout: Option<C>
}
