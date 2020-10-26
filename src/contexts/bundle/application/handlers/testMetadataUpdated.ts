import { TestMetadata } from '@build/shared'
import { generateTestBundle } from '@bundle/application/services/generateTestBundle'
import { sendAppEvent } from '@bundle/application/services/sendAppEvent'
import { doEffect } from '@typed/fp/Effect/exports'

export const testMetadataUpdated = (testMetadata: readonly TestMetadata[]) =>
  doEffect(function* () {
    yield* sendAppEvent({
      type: 'testModule/created',
      path: yield* generateTestBundle(testMetadata),
      testMetadata: testMetadata.map((t) => t.id),
    })
  })
