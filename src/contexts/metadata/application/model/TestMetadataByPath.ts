import { TestMetadata } from '@build/shared/domain'
import { State } from '@typed/fp/hooks/exports'
import { Path } from '@typed/fp/Path/exports'
import { createSharedRef, readSharedRef, SharedRef } from '@typed/fp/SharedRef/exports'

export const TEST_METADATA_BY_PATH = '@metadata/sharedRef/TestMetadataByPath'
export type TEST_METADATA_BY_PATH = typeof TEST_METADATA_BY_PATH

export interface TestMetadataByPath
  extends SharedRef<TEST_METADATA_BY_PATH, State<ReadonlyMap<Path, readonly TestMetadata[]>>> {}

export const TestMetadataByPath = createSharedRef<TestMetadataByPath>(TEST_METADATA_BY_PATH)

export const getTestMetadataByPath = readSharedRef(TestMetadataByPath)
