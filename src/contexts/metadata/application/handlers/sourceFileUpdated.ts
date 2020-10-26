import { parseTestMetadata, sendAppEvent } from '@metadata/application/services'
import { doEffect } from '@typed/fp/Effect/exports'
import { SourceFile } from 'ts-morph'

export const sourceFileUpdated = (sourceFile: SourceFile) =>
  doEffect(function* () {
    const testMetadata = yield* parseTestMetadata(sourceFile)

    yield* sendAppEvent({ type: 'testMetadata/parsed', testMetadata })
  })
