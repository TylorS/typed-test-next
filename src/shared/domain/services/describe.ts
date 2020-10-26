import { Test, TestSuite } from '@build/shared/domain/model'
import { IO } from 'fp-ts/IO'

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
): TestSuite<A, 'default'> => ({
  type: 'test-suite',
  config: { label: thing, modifier: 'default' },
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
): TestSuite<A, 'only'> => only(describe(thing, tests))

/**
 * Skip running this test group
 * @param thing - What you are testing
 * @param tests - The tests for `thing`
 */
describe.skip = <A extends string>(
  thing: A,
  tests: readonly Test[] | IO<readonly Test[]>,
): TestSuite<A, 'skip'> => skip(describe(thing, tests))

/**
 * Add a placeholder for tests that need to be written.
 * @param thing - What you are testing
 */
describe.todo = <A extends string>(thing: A): TestSuite<A, 'todo'> => todo(describe(thing, []))
