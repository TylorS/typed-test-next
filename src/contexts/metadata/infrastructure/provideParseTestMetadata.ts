import { zip } from '@typed/fp/Effect/exports'
import { provideOp } from '@typed/fp/Op/exports'

import { ParseTestMetadata } from '../application'
import { findExportedTests } from './findExportedTests'
import { findTestMetadata } from './findTestMetadata'

export const provideParseTestMetadata = provideOp(ParseTestMetadata, (sourceFile) =>
  zip(findExportedTests(sourceFile).map(findTestMetadata)),
)
