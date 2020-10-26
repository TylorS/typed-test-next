import { Test } from '@build/shared/domain/model'
import { IO } from 'fp-ts/IO'

export const getTests = (tests: readonly Test[] | IO<readonly Test[]>): readonly Test[] =>
  typeof tests === 'function' ? tests() : tests
