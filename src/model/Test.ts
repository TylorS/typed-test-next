import { Effect } from '@typed/fp/Effect'

import { TestConfig } from './TestConfig'
import { TestEnv } from './TestEnv'
import { TestModifier } from './TestModifier'
import { TestResult } from './TestResult'

export type Test<
  A extends string = string,
  B extends TestModifier = TestModifier,
  C extends number = number
> = TestCase<A, B, C> | TestSuite<A, B, C>

export enum TestType {
  TestCase = 'test-case',
  TestSuite = 'test-suite',
}

export interface TestCase<
  A extends string = string,
  B extends TestModifier = TestModifier,
  C extends number = number
> {
  readonly type: TestType.TestCase
  readonly config: TestConfig<A, B, C>
  readonly runTestCase: Effect<TestEnv, TestResult>
}

// Test Group is used because it's a lot faster to statically analyze
// this structure to TestMetadata
export interface TestSuite<
  A extends string = string,
  B extends TestModifier = TestModifier,
  C extends number = number
> {
  readonly type: TestType.TestSuite
  readonly config: TestConfig<A, B, C>
  readonly tests: ReadonlyArray<Test>
}

export type UpdateTestModifier<T extends Test, Modifier extends TestModifier> = T extends TestCase<
  infer A,
  any,
  infer C
>
  ? TestCase<A, Modifier, C>
  : T extends TestSuite<infer A, any, infer C>
  ? TestSuite<A, Modifier, C>
  : never

export type UpdatedTestTimeout<T extends Test, Timeout extends number> = T extends TestCase<
  infer A,
  infer B,
  any
>
  ? TestCase<A, B, Timeout>
  : T extends TestSuite<infer A, infer B, any>
  ? TestSuite<A, B, Timeout>
  : never
