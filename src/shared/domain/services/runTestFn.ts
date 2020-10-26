import { getTestEnv } from '@build/shared'
import {
  FailedTestResult,
  PassedTestResult,
  SkippedTestResult,
  TestEnv,
  TestResult,
  TodoTestResult,
} from '@build/shared/domain/model'
import { disposeNone } from '@most/disposable'
import {
  doEffect,
  Effect,
  EffectGenerator,
  execPure,
  fromEnv,
  fromTask,
  map,
  race,
  useAll,
} from '@typed/fp/Effect'
import { delay } from '@typed/fp/fibers'
import { async } from '@typed/fp/Resume/exports'
import { constVoid, pipe } from 'fp-ts/function'
import { some } from 'fp-ts/Option'

import { TestResultChange } from '../../../shared/domain/services/TestResultChange'
import { parseStackTrace } from './parseStackTrace'
import { TestFn } from './TestFn'

export const runTestFn = (testFn: TestFn): Effect<TestEnv & TestResultChange, TestResult> => {
  const eff = doEffect(function* () {
    const { modifier, timeout } = yield* getTestEnv

    if (modifier === 'skip') {
      return SkippedTestResult
    }

    if (modifier === 'todo') {
      return TodoTestResult
    }

    const testEffect = isDeclarativeTestFn(testFn)
      ? runDeclarativeTestFn(testFn)
      : runImperativeTestFn(testFn)

    const timeoutEff = pipe(
      delay(timeout),
      map(() => FailedTestResult(`Timeout out after ${timeout}ms`)),
    )

    return yield* race(testEffect, timeoutEff)
  })

  return eff
}

const isDeclarativeTestFn = (testFn: TestFn) => testFn.length === 0

const isPromise = (value: unknown): value is Promise<unknown> =>
  !!value && typeof value === 'object' && typeof (value as Promise<unknown>).then === 'function'

const runDeclarativeTestFn = (testFn: TestFn): Effect<TestEnv & TestResultChange, TestResult> => {
  const eff = doEffect(function* () {
    try {
      const returnValue = testFn(constVoid)

      if (isGenerator(returnValue)) {
        yield* returnValue
      }

      if (isPromise(returnValue)) {
        yield* fromTask(() => returnValue)
      }

      return PassedTestResult
    } catch (error) {
      return FailedTestResult(error.message, some(yield* parseStackTrace(error)))
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

          if (isGenerator(returnValue)) {
            return pipe(returnValue, useAll(e), execPure)
          }

          if (isPromise(returnValue)) {
            const error = new Error(`Unable to return promise and use 'done' callback`)

            Error.captureStackTrace(error, testFn)

            return done(error)
          }

          return disposeNone()
        }),
      )

      if (!nullableError) {
        return PassedTestResult
      }

      const result = FailedTestResult(
        nullableError.message,
        some(yield* parseStackTrace(nullableError)),
      )

      return result
    } catch (error) {
      return FailedTestResult(error.message, some(yield* parseStackTrace(error)))
    }
  })

  return eff
}

function isGenerator(obj: unknown): obj is EffectGenerator<unknown, unknown> {
  return (
    !!obj &&
    typeof obj === 'object' &&
    'function' === typeof (obj as Generator).next &&
    'function' === typeof (obj as Generator).throw
  )
}
