import { Document } from '@documents/domain'
import { Disposable } from '@typed/fp/Disposable/exports'
import { ask, doEffect, EnvOf, execEffect, execPure, Pure } from '@typed/fp/Effect/exports'
import { getState, useCallback, useEffectBy, useState, useStream } from '@typed/fp/hooks/exports'
import { createGuardFromSchema } from '@typed/fp/io/exports'
import { Path, pathJoin } from '@typed/fp/Path/exports'
import { provideSharedRef } from '@typed/fp/SharedRef/exports'
import { identity, pipe } from 'fp-ts/function'
import { ordNumber } from 'fp-ts/Ord'
import { sort } from 'fp-ts/ReadonlyArray'

import { DocumentDeleted, DocumentRenamed, DocumentUpdated } from './events'
import { DependenciesUpdated } from './events/DependenciesUpdated'
import { documentDeleted, documentRenamed, documentUpdated } from './handlers'
import { DocumentsByPath } from './model/DocumentsByPath'
import { listenToAppEvent, sendAppEvent, watchDirectory } from './services'

const dependenciesUpdatedGuard = createGuardFromSchema(DependenciesUpdated.schema)
const documentUpdatedGuard = createGuardFromSchema(DocumentUpdated.schema)
const documentRenamedGuard = createGuardFromSchema(DocumentRenamed.schema)
const documentDeletedGuard = createGuardFromSchema(DocumentDeleted.schema)

const sortLength = pipe(ordNumber, sort)

export type UseDocumentsEnv = EnvOf<typeof useDocuments>

export const useDocuments = doEffect(function* () {
  const documentsByPath = yield* useState(Pure.of(new Map<Path, Document>()))
  const rootDirectories = findRootDirectories(getState(documentsByPath))

  // Track
  yield* listenToAppEvent(documentUpdatedGuard.is, (event) =>
    pipe(documentUpdated(event.path), provideSharedRef(DocumentsByPath, documentsByPath), execPure),
  )

  yield* listenToAppEvent(documentRenamedGuard.is, (event) =>
    pipe(
      documentRenamed(event.previousPath, event.path),
      provideSharedRef(DocumentsByPath, documentsByPath),
      execPure,
    ),
  )

  yield* listenToAppEvent(documentDeletedGuard.is, (event) =>
    pipe(documentDeleted(event.path), provideSharedRef(DocumentsByPath, documentsByPath), execPure),
  )

  yield* useEffectBy(rootDirectories, identity, (path) =>
    doEffect(function* () {
      const stream = yield* watchDirectory(path)
      const env = yield* ask<EnvOf<typeof sendAppEvent>>()

      yield* useStream(stream, (e) => execEffect(env, sendAppEvent(e)))
    }),
  )

  const onDependenciesUpdated = yield* useCallback(
    (f: (event: DependenciesUpdated) => Disposable) =>
      listenToAppEvent(dependenciesUpdatedGuard.is, f),
    [],
  )

  return {
    documentsByPath: getState(documentsByPath),
    onDependenciesUpdated,
  } as const
})

function findRootDirectories(documentsByPath: Map<Path, Document>): ReadonlyArray<Path> {
  const paths = Array.from(documentsByPath.keys())
  const splitPaths = paths.map(Path.unwrap).map((p) => p.split('/'))
  const lengths = sortLength(Array.from(new Set(splitPaths.map((s) => s.length))))
  const pathsByLength = groupPathsByLength(lengths, splitPaths)

  return pathsByLength.get(lengths[0]) ?? []
}

function groupPathsByLength(
  lengths: readonly number[],
  splitPaths: ReadonlyArray<readonly string[]>,
): Map<number, ReadonlyArray<Path>> {
  return new Map(
    lengths.map((l): [number, ReadonlyArray<Path>] => [
      l,
      splitPaths.filter((s) => s.length === l).map((s) => pathJoin([s.join('/')])),
    ]),
  )
}
