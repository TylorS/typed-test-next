import { TestMetadata } from '@build/shared/domain'
import { doEffect } from '@typed/fp/Effect/exports'
import { updateState } from '@typed/fp/hooks/exports'

import { getTestMetadataByPath } from '../model/TestMetadataByPath'

export const testMetadataParsed = (testMetadata: readonly TestMetadata[]) =>
  doEffect(function* () {
    const state = yield* getTestMetadataByPath
    const paths = Array.from(new Set(testMetadata.map((t) => t.path)))
    const updated = paths.map(
      (path) => [path, testMetadata.filter((t) => t.path === path)] as const,
    )

    updateState((m) => new Map([...m, ...updated]), state)
  })
