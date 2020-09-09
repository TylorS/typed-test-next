import { disposeNone } from '@most/disposable'
import {
  async,
  doEffect,
  Effect,
  execPure,
  fromEnv,
  fromTask,
  map,
  race,
  use,
} from '@typed/fp/Effect'
import { delay } from '@typed/fp/fibers'
import { constVoid, pipe } from 'fp-ts/es6/function'
import { none, some } from 'fp-ts/es6/Option'

import { getTestEnv } from '../common/getTestEnv'
import { FailedTestResult, TestEnv, TestModifier, TestResult, TestResultType } from '../model'
import { parseStackTrace } from './parseStackTrace'
import { TestFn } from './TestFn'
import { TestResultChange } from './TestResultChange'

export const runTestFn = (testFn: TestFn): Effect<TestEnv & TestResultChange, TestResult> => {
  const eff = doEffect(function* () {
    const { modifier, timeout } = yield* getTestEnv

    if (modifier === TestModifier.Skip) {
      return { type: TestResultType.Skip }
    }

    if (modifier === TestModifier.Todo) {
      return { type: TestResultType.Todo }
    }

    const timeoutEff = map(
      (): FailedTestResult => ({
        type: TestResultType.Fail,
        message: `Timeout out after ${timeout}ms`,
        stack: none,
      }),
      delay(timeout),
    )
    const testEffect =
      testFn.length === 0 ? runDeclarativeTestFn(testFn) : runImperativeTestFn(testFn)

    return yield* race(testEffect, timeoutEff)
  })

  return eff
}

const isPromise = (value: unknown): value is Promise<unknown> =>
  !!value && typeof value === 'object' && typeof (value as Promise<unknown>).then === 'function'

const runDeclarativeTestFn = (testFn: TestFn): Effect<TestEnv & TestResultChange, TestResult> => {
  const eff = doEffect(function* () {
    try {
      const returnValue = testFn(constVoid)

      if (isPromise(returnValue)) {
        yield* fromTask(() => returnValue)
      } else if (!!returnValue && Symbol.iterator in returnValue) {
        yield* returnValue
      }

      return { type: TestResultType.Pass }
    } catch (error) {
      const result: FailedTestResult = {
        type: TestResultType.Fail,
        message: error.message,
        stack: some(yield* parseStackTrace(error)),
      }

      return result
    }
  })

  return eff
}

const runImperativeTestFn = (testFn: TestFn): Effect<TestEnv & TestResultChange, TestResult> => {
  const eff = doEffect(function* () {
    try {
      const nullableError: Error | undefined = yield* fromEnv((e: TestEnv) =>
        async<Error | undefined>((done) => {
          const returnValue = testFn(done)

          if (isPromise(returnValue)) {
            const error = new Error(`Unable to return promise and use 'done' callback`)

            Error.captureStackTrace(error, testFn)

            return done(error)
          } else if (!!returnValue && Symbol.iterator in returnValue) {
            return pipe(returnValue, use(e), execPure)
          }

          return disposeNone()
        }),
      )

      if (!nullableError) {
        return { type: TestResultType.Pass }
      }

      const result: FailedTestResult = {
        type: TestResultType.Fail,
        message: nullableError.message,
        stack: some(yield* parseStackTrace(nullableError)),
      }

      return result
    } catch (error) {
      const result: FailedTestResult = {
        type: TestResultType.Fail,
        message: error.message,
        stack: some(yield* parseStackTrace(error)),
      }

      return result
    }
  })

  return eff
}
