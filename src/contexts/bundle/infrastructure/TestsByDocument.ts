import { TestMetadata } from '@build/shared'
import { Path } from '@typed/fp/Path/exports'

export type TestsByDocument = ReadonlyArray<readonly [Path, ReadonlyArray<TestMetadata>]>
