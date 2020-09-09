import { IO } from 'fp-ts/es6/IO'

import { Test } from '../model'

export const getTests = (tests: readonly Test[] | IO<readonly Test[]>): readonly Test[] =>
  typeof tests === 'function' ? tests() : tests
