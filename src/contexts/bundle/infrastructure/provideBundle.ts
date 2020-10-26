import { EnvOf } from '@typed/fp/cjs/Effect/Effect'
import { Effect } from '@typed/fp/Effect/Effect'
import { OpEnvs } from '@typed/fp/Op/exports'
import { provideSharedRef, SharedRefEnv } from '@typed/fp/SharedRef/exports'
import { pipe } from 'fp-ts/function'
import { create } from 'most-subject'

import { GenerateTestBundle, ListenToAppEvent, SendAppEvent } from '../application'
import { provideGenerateTestBundle } from './provideGenerateTestBundle'
import { provideListenToAppEvents } from './provideListenToAppEvents'
import { provideSendAppEvent } from './provideSendAppEvent'
import { ApplicationEvents } from './sharedRefs'

export type ProvidedEnv = OpEnvs<[GenerateTestBundle, ListenToAppEvent, SendAppEvent]> &
  SharedRefEnv<ApplicationEvents>

export type BundleEnv = EnvOf<typeof provideGenerateTestBundle> &
  EnvOf<typeof provideListenToAppEvents> &
  EnvOf<typeof provideSendAppEvent>

export const provideBundle = <E, A>(effect: Effect<E & ProvidedEnv, A>): Effect<E & BundleEnv, A> =>
  pipe(
    effect,
    provideGenerateTestBundle,
    provideListenToAppEvents,
    provideSendAppEvent,
    provideSharedRef(ApplicationEvents, create()),
  )
