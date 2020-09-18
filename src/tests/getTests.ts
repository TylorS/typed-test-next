import { IO } from 'fp-ts/IO'

import { Test } from '../model'

export const getTests = (tests: readonly Test[] | IO<readonly Test[]>): readonly Test[] =>
  typeof tests === 'function' ? tests() : tests
