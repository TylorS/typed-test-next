import { provideOp } from '@typed/fp/Op/exports'

import { GenerateTestBundle } from '../application'
import { generateTestBundle } from './generateTestBundle'

export const provideGenerateTestBundle = provideOp(GenerateTestBundle, generateTestBundle)
