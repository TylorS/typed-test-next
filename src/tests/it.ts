import { pipe } from 'fp-ts/lib/function'

import { TestCase } from '../model'
import { runTestFn } from './runTestFn'
import { TestFn } from './TestFn'
import { catchTestResultChange } from './TestResultChange'
import { only, skip, todo } from './updateTestModifer'

export const it = <A extends string>(does: A, what: TestFn): TestCase<A, 'default'> => ({
  type: 'test-case',
  config: { label: does, modifier: 'default' },
  runTestCase: pipe(what, runTestFn, catchTestResultChange),
})

it.only = <A extends string>(does: A, what: TestFn): TestCase<A, 'only'> => only(it(does, what))

it.skip = <A extends string>(does: A, what: TestFn): TestCase<A, 'skip'> => skip(it(does, what))

it.todo = <A extends string>(does: A): TestCase<A, 'todo'> => todo(it(does, () => void 0))
