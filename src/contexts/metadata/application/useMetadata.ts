import { TestMetadata } from '@build/shared/domain'
import { ask } from '@typed/fp/cjs/Effect/ask'
import { doEffect, Effect, EnvOf, execEffect } from '@typed/fp/Effect/exports'
import { getState, useState } from '@typed/fp/hooks/exports'
import { createGuardFromSchema } from '@typed/fp/io/exports'
import { Path } from '@typed/fp/Path/exports'
import { SharedRefValue } from '@typed/fp/SharedRef/exports'
import { pipe } from 'fp-ts/function'

import { SourceFileUpdated, TestMetdataParsed } from './events'
import { sourceFileUpdated } from './handlers/sourceFileUpdated'
import { testMetadataParsed } from './handlers/testMetadataParsed'
import { TestMetadataByPath } from './model'
import { listenToAppEvent } from './services/listenToAppEvent'

const sourceFileUpdatedGuard = createGuardFromSchema(SourceFileUpdated.schema)
const testMetadataParsedGuard = createGuardFromSchema(TestMetdataParsed.schema)

export const useMetadata = doEffect(function* () {
  const testMetadataByPath: SharedRefValue<TestMetadataByPath> = yield* useState(
    Effect.fromIO((): ReadonlyMap<Path, readonly TestMetadata[]> => new Map()),
  )

  const env = yield* ask<EnvOf<typeof sourceFileUpdated> & EnvOf<typeof testMetadataParsed>>()

  yield* listenToAppEvent(sourceFileUpdatedGuard.is, (event) =>
    pipe(sourceFileUpdated(event.sourceFile), execEffect(env)),
  )

  yield* listenToAppEvent(testMetadataParsedGuard.is, (event) =>
    pipe(testMetadataParsed(event.testMetadata), execEffect(env)),
  )

  return getState(testMetadataByPath)
})
