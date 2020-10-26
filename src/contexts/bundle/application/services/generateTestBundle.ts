import { TestMetadata } from '@build/shared'
import { Pure } from '@typed/fp/Effect'
import { callOp, createOp, Op } from '@typed/fp/Op'
import { Path } from '@typed/fp/Path/exports'

export const GENERATE_TEST_BUNDLE = Symbol()
export type GENERATE_TEST_BUNDLE = typeof GENERATE_TEST_BUNDLE

export interface GenerateTestBundle
  extends Op<GENERATE_TEST_BUNDLE, (metadata: readonly TestMetadata[]) => Pure<Path>> {}

export const GenerateTestBundle = createOp<GenerateTestBundle>(GENERATE_TEST_BUNDLE)

export const generateTestBundle = callOp(GenerateTestBundle)
