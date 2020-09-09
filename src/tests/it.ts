import { map } from '@typed/fp/Effect'
import { fold } from 'fp-ts/es6/Either'
import { identity } from 'fp-ts/es6/function'
import { none } from 'fp-ts/es6/Option'

import { TestCase, TestModifier, TestType } from '../model'
import { runTestFn } from './runTestFn'
import { TestFn } from './TestFn'
import { catchTestResultChange } from './TestResultChange'
import { only, skip, todo } from './updateTestModifer'

export const it = <A extends string>(does: A, what: TestFn): TestCase<A, TestModifier.Default> => ({
  type: TestType.TestCase,
  config: { label: does, modifier: TestModifier.Default, timeout: none },
  runTestCase: map(fold(identity, identity), catchTestResultChange(runTestFn(what))),
})

it.only = <A extends string>(does: A, what: TestFn): TestCase<A, TestModifier.Only> =>
  only(it(does, what))

it.skip = <A extends string>(does: A, what: TestFn): TestCase<A, TestModifier.Skip> =>
  skip(it(does, what))

it.todo = <A extends string>(does: A): TestCase<A, TestModifier.Todo> =>
  todo(it(does, () => void 0))
