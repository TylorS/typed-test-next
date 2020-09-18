import { IO } from 'fp-ts/IO'
import { none } from 'fp-ts/Option'

import { Test, TestModifier, TestSuite, TestType } from '../model'
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
): TestSuite<A, TestModifier.Default> => ({
  type: TestType.TestSuite,
  config: { label: that, modifier: TestModifier.Default, timeout: none },
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
): TestSuite<A, TestModifier.Only> => only(given(that, tests))

/**
 * Skip running this test group
 * @param that - What you are testing
 * @param tests - The tests for `that`
 */
given.skip = <A extends string>(
  that: A,
  tests: readonly Test[] | IO<readonly Test[]>,
): TestSuite<A, TestModifier.Skip> => skip(given(that, tests))

/**
 * Add a placeholder for tests that need to be written.
 * @param that - What you are testing
 */
given.todo = <A extends string>(that: A): TestSuite<A, TestModifier.Todo> => todo(given(that, []))
