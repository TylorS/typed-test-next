import { Disposable } from '@typed/fp/Disposable/exports'
import { ask, doEffect, EnvOf, execEffect } from '@typed/fp/Effect/exports'
import { useCallback } from '@typed/fp/hooks/exports'
import { createGuardFromSchema } from '@typed/fp/io/exports'
import { pipe } from 'fp-ts/function'

import { TestMetadataUpdated, TestModuleCreated } from './events'
import { testMetadataUpdated } from './handlers'
import { listenToAppEvent } from './services'

const testMetadataUpdatedGuard = createGuardFromSchema(TestMetadataUpdated.schema)
const testModuleCreatedGuard = createGuardFromSchema(TestModuleCreated.schema)

export const useBundle = doEffect(function* () {
  const env = yield* ask<EnvOf<typeof testMetadataUpdated>>()

  yield* listenToAppEvent(testMetadataUpdatedGuard.is, (event) =>
    pipe(event.testMetadata, testMetadataUpdated, execEffect(env)),
  )

  const onBundleCreated = yield* useCallback(
    (f: (event: TestModuleCreated) => Disposable) => listenToAppEvent(testModuleCreatedGuard.is, f),
    [],
  )

  return onBundleCreated
})
