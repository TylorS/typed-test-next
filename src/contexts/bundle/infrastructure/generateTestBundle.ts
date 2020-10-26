import { TsConfigPathsResolver, writeDocument, WriteDocumentEnv } from '@build/shared'
import { TestMetadata } from '@build/shared/domain'
import { EnvOf } from '@typed/fp/cjs/Effect/Effect'
import { ask, doEffect, Effect, FailEnv } from '@typed/fp/Effect/exports'
import { orFail } from '@typed/fp/Future/exports'
import { Path } from '@typed/fp/Path/exports'

import { sendAppEvent } from '../application'
import { generateTestBundleContent } from './generateTestBundleContent'

export const BundleFailure = '@typed/test/BundleFailure'
export type BundleFailure = FailEnv<typeof BundleFailure, Error>

export type TestBundleEnv = {
  tsConfigPathsResolver: TsConfigPathsResolver
  preferEsm?: boolean
}

export type GenerateTestBundleEnv = TestBundleEnv &
  WriteDocumentEnv &
  BundleFailure &
  EnvOf<typeof sendAppEvent>

export function generateTestBundle(
  testMetadata: ReadonlyArray<TestMetadata>,
): Effect<GenerateTestBundleEnv, Path> {
  const eff = doEffect(function* () {
    const env = yield* ask<TestBundleEnv>()
    const { tsConfigPathsResolver, preferEsm = false } = env
    const { path, contents } = generateTestBundleContent(
      testMetadata,
      tsConfigPathsResolver,
      preferEsm,
    )

    yield* orFail(BundleFailure, writeDocument(Path.wrap(path), contents))

    yield* sendAppEvent({
      type: 'testModule/created',
      path: Path.wrap(path),
      testMetadata: testMetadata.map((t) => t.id),
    })

    return Path.wrap(path)
  })

  return eff
}
