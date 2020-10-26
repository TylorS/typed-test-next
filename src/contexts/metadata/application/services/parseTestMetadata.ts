import { TestMetadata } from '@build/shared/domain'
import { Pure } from '@typed/fp/Effect'
import { callOp, createOp, Op } from '@typed/fp/Op'
import { SourceFile } from 'ts-morph'

export const PARSE_TEST_METADATA = Symbol()
export type PARSE_TEST_METADATA = typeof PARSE_TEST_METADATA

export interface ParseTestMetadata
  extends Op<PARSE_TEST_METADATA, (sourceFile: SourceFile) => Pure<readonly TestMetadata[]>> {}

export const ParseTestMetadata = createOp<ParseTestMetadata>(PARSE_TEST_METADATA)

export const parseTestMetadata = callOp(ParseTestMetadata)
