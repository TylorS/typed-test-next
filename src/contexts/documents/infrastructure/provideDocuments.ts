import {
  DeleteDocument,
  GetDependencies,
  GetDependents,
  GetVersion,
  NextVersion,
  ReadDocument,
  UpdateDependencies,
  UpdateVersion,
  WatchDirectory,
} from '@documents/application/services'
import { Effect, EnvOf } from '@typed/fp/Effect/Effect'
import { OpEnvs } from '@typed/fp/Op/exports'
import { provideSharedRef, SharedRefEnv } from '@typed/fp/SharedRef/exports'
import { pipe } from 'fp-ts/function'
import { create } from 'most-subject'

import { provideDeleteDocument } from './provideDeleteDocument'
import { provideGetDependencies } from './provideGetDependencies'
import { provideGetDependents } from './provideGetDependents'
import { provideGetVersion } from './provideGetVersion'
import { provideNextVersion } from './provideNextVersion'
import { provideReadDocument } from './provideReadDocument'
import { provideUpdateDependencies } from './provideUpdateDependencies'
import { provideUpdateVersion } from './provideUpdateVersion'
import { provideWatchDirectory } from './provideWatchDirectory'
import {
  ApplicationEvents,
  CurrentDocumentContent,
  CurrentDocumentVersion,
  DependencyMap,
  DependentMap,
} from './sharedRefs'

export type ProvidedEnv = OpEnvs<
  [
    DeleteDocument,
    GetDependencies,
    GetDependents,
    GetVersion,
    NextVersion,
    ReadDocument,
    UpdateDependencies,
    UpdateVersion,
    WatchDirectory,
  ]
>

export type DocumentsEnv = EnvOf<typeof provideDeleteDocument> &
  EnvOf<typeof provideGetDependencies> &
  EnvOf<typeof provideGetDependents> &
  EnvOf<typeof provideGetVersion> &
  EnvOf<typeof provideNextVersion> &
  EnvOf<typeof provideReadDocument> &
  EnvOf<typeof provideUpdateDependencies> &
  EnvOf<typeof provideUpdateVersion> &
  EnvOf<typeof provideWatchDirectory> &
  SharedRefEnv<ApplicationEvents> &
  SharedRefEnv<CurrentDocumentContent> &
  SharedRefEnv<CurrentDocumentVersion> &
  SharedRefEnv<DependencyMap> &
  SharedRefEnv<DependentMap>

export const provideDocuments = <E, A>(
  effect: Effect<E & ProvidedEnv, A>,
): Effect<E & DocumentsEnv, A> =>
  pipe(
    effect,
    provideDeleteDocument,
    provideGetDependencies,
    provideGetDependents,
    provideGetVersion,
    provideNextVersion,
    provideReadDocument,
    provideUpdateDependencies,
    provideUpdateVersion,
    provideWatchDirectory,
    provideSharedRef(ApplicationEvents, create()),
    provideSharedRef(CurrentDocumentContent, new Map()),
    provideSharedRef(CurrentDocumentVersion, new Map()),
    provideSharedRef(DependencyMap, new Map()),
    provideSharedRef(DependentMap, new Map()),
  )
