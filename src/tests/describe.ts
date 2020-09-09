import { IO } from 'fp-ts/es6/IO'
import { none } from 'fp-ts/es6/Option'

import { Test, TestModifier, TestSuite, TestType } from '../model'
import { getTests } from './getTests'
import { only, skip, todo } from './updateTestModifer'

/**
 * Creates a group of tests related to `thing`
 * @param thing - What you are testing
 * @param tests - The tests for `thing`
 */
export const describe = <A extends string>(
  thing: A,
  tests: readonly Test[] | IO<readonly Test[]>,
): TestSuite<A, TestModifier.Default> => ({
  type: TestType.TestSuite,
  config: { label: thing, modifier: TestModifier.Default, timeout: none },
  tests: getTests(tests),
})

/**
 * Only run this test group
 * @param thing - What you are testing
 * @param tests - The tests for `thing`
 */
describe.only = <A extends string>(
  thing: A,
  tests: readonly Test[] | IO<readonly Test[]>,
): TestSuite<A, TestModifier.Only> => only(describe(thing, tests))

/**
 * Skip running this test group
 * @param thing - What you are testing
 * @param tests - The tests for `thing`
 */
describe.skip = <A extends string>(
  thing: A,
  tests: readonly Test[] | IO<readonly Test[]>,
): TestSuite<A, TestModifier.Skip> => skip(describe(thing, tests))

/**
 * Add a placeholder for tests that need to be written.
 * @param thing - What you are testing
 */
describe.todo = <A extends string>(thing: A): TestSuite<A, TestModifier.Todo> =>
  todo(describe(thing, []))
