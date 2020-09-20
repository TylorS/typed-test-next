import { IO } from 'fp-ts/IO'

import { Test, TestSuite } from '../model'
import { getTests } from './getTests'
import { only, skip, todo } from './updateTestModifer'

/**
 * Creates a group of tests related to `that`
 * @param that - What you are testing
 * @param tests - The tests for `that`
 */
export const given = <A extends string>(
  that: A,
  tests: readonly Test[] | IO<readonly Test[]>,
): TestSuite<A, 'default'> => ({
  type: 'test-suite',
  config: { label: that, modifier: 'default' },
  tests: getTests(tests),
})

/**
 * Only run this test group
 * @param that - What you are testing
 * @param tests - The tests for `that`
 */
given.only = <A extends string>(
  that: A,
  tests: readonly Test[] | IO<readonly Test[]>,
): TestSuite<A, 'only'> => only(given(that, tests))

/**
 * Skip running this test group
 * @param that - What you are testing
 * @param tests - The tests for `that`
 */
given.skip = <A extends string>(
  that: A,
  tests: readonly Test[] | IO<readonly Test[]>,
): TestSuite<A, 'skip'> => skip(given(that, tests))

/**
 * Add a placeholder for tests that need to be written.
 * @param that - What you are testing
 */
given.todo = <A extends string>(that: A): TestSuite<A, 'todo'> => todo(given(that, []))
